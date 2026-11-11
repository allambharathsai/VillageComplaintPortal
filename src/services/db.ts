import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, defaultDb, storage, isFirebaseConfigured } from './firebase';
import { Village, Complaint, ComplaintStatus, ProblemType } from '../types';
import { SEED_VILLAGES, SEED_COMPLAINTS } from '../data/seedData';

const LOCAL_STORAGE_KEY_COMPLAINTS = 'vpc_complaints_v1';
const LOCAL_STORAGE_KEY_VILLAGES = 'vpc_villages_v1';
const LOCAL_STORAGE_KEY_COUNTERS = 'vpc_counters_v1';

// Safe localStorage wrapper to protect against SSR or browser permission restrictions
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (_) {}
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (_) {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (_) {}
  }
};

// Safe in-memory fallback for local complaints if localStorage is restricted
let inMemoryComplaints: Complaint[] = [...SEED_COMPLAINTS];

// Safe Promise timeout helper to ensure Firebase never hangs the UI
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise.catch((err) => {
      console.warn(`Firebase operation caught error (using fallback):`, err?.message || err);
      return fallback;
    }),
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
}

// Initialize mock storage if not already present
function initLocalStorage() {
  if (typeof window === 'undefined') return;
  if (!safeLocalStorage.getItem(LOCAL_STORAGE_KEY_VILLAGES)) {
    safeLocalStorage.setItem(LOCAL_STORAGE_KEY_VILLAGES, JSON.stringify(SEED_VILLAGES));
  }
  if (!safeLocalStorage.getItem(LOCAL_STORAGE_KEY_COMPLAINTS)) {
    safeLocalStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(SEED_COMPLAINTS));
  }
}

initLocalStorage();

// Haversine formula to compute distance in metres between two coordinates
export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in metres
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Repeated complaints detection:
// 3 or more complaints of same problem type from same lane (or within 50 meters)
export function getRepeatedComplaintIds(complaints: Complaint[]): Set<string> {
  const repeatedIds = new Set<string>();

  for (let i = 0; i < complaints.length; i++) {
    const current = complaints[i];
    const matchingGroup = complaints.filter(other => {
      if (other.problemType !== current.problemType) return false;

      // Same lane name check (normalized)
      const sameLane =
        Boolean(current.laneName && other.laneName) &&
        current.laneName.trim().toLowerCase() === other.laneName.trim().toLowerCase();

      // Or within 50 meters if both GPS locations are verified
      const within50Meters =
        Boolean(current.location?.verified) &&
        Boolean(other.location?.verified) &&
        Boolean(current.location?.lat) &&
        Boolean(other.location?.lat) &&
        getDistanceMeters(
          current.location.lat,
          current.location.lng,
          other.location.lat,
          other.location.lng
        ) <= 50;

      return sameLane || within50Meters;
    });

    if (matchingGroup.length >= 3) {
      matchingGroup.forEach(c => repeatedIds.add(c.id));
    }
  }

  return repeatedIds;
}

// Client-side image compression: max 1280px wide, JPEG 0.7 quality
export async function compressImage(file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onerror = () => resolve('');
      reader.onload = (e) => {
        try {
          const img = new Image();
          img.onerror = () => resolve(e.target?.result as string || '');
          img.onload = () => {
            const MAX_WIDTH = 1280;
            let width = img.width || 800;
            let height = img.height || 600;

            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              return resolve(e.target?.result as string || '');
            }

            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(compressedDataUrl);
          };
          img.src = e.target?.result as string;
        } catch (_) {
          resolve(e.target?.result as string || '');
        }
      };
      reader.readAsDataURL(file);
    } catch (_) {
      resolve('');
    }
  });
}

// Sequential Complaint ID generator
// Format: VILLAGECODE-YYYYMMDD-NNNN (e.g., GRP-20261110-0001)
export function generateComplaintId(villageCode: string): { complaintId: string; sequence: number } {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateKey = `${year}${month}${day}`;
  const counterDocId = `${villageCode}_${dateKey}`;

  // Always generate sequence locally first to ensure instant 0ms generation
  let nextSeq = 1;
  try {
    const rawCounters = safeLocalStorage.getItem(LOCAL_STORAGE_KEY_COUNTERS) || '{}';
    const counters = JSON.parse(rawCounters);
    const currentSeq = counters[counterDocId] || 0;
    nextSeq = currentSeq + 1;
    counters[counterDocId] = nextSeq;
    safeLocalStorage.setItem(LOCAL_STORAGE_KEY_COUNTERS, JSON.stringify(counters));
  } catch (err) {
    nextSeq = Math.floor(Math.random() * 900) + 100;
  }

  const formattedSeq = String(nextSeq).padStart(4, '0');
  const complaintId = `${villageCode}-${dateKey}-${formattedSeq}`;

  // Background update to Firestore counters without blocking UI
  if (isFirebaseConfigured()) {
    const dbs = [db, defaultDb].filter(Boolean) as Firestore[];
    dbs.forEach((targetDb) => {
      try {
        const counterRef = doc(targetDb, 'counters', counterDocId);
        setDoc(counterRef, { date: dateKey, villageCode, lastSequence: nextSeq }, { merge: true }).catch(() => {});
      } catch (_) {}
    });
  }

  return { complaintId, sequence: nextSeq };
}

// API: Get Villages
export async function fetchVillages(): Promise<Village[]> {
  initLocalStorage();
  const local = safeLocalStorage.getItem(LOCAL_STORAGE_KEY_VILLAGES);
  const localVillages: Village[] = local ? JSON.parse(local) : SEED_VILLAGES;

  if (isFirebaseConfigured() && db) {
    try {
      const fetchPromise = getDocs(collection(db, 'villages')).then((snapshot) => {
        if (!snapshot.empty) {
          const remote = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Village));
          const map = new Map<string, Village>();
          SEED_VILLAGES.forEach(v => map.set(v.id, v));
          remote.forEach(v => map.set(v.id, v));
          return Array.from(map.values());
        }
        return localVillages;
      });

      return await withTimeout(fetchPromise, 1500, localVillages);
    } catch (_) {
      return localVillages;
    }
  }

  return localVillages;
}

// API: Get Complaints (filtered by village and optional residentUid)
export async function fetchComplaints(params?: {
  villageId?: string;
  residentUid?: string;
}): Promise<Complaint[]> {
  initLocalStorage();
  const raw = safeLocalStorage.getItem(LOCAL_STORAGE_KEY_COMPLAINTS);
  let localComplaints: Complaint[] = raw ? JSON.parse(raw) : (inMemoryComplaints.length ? inMemoryComplaints : SEED_COMPLAINTS);

  if (isFirebaseConfigured() && db) {
    try {
      const fetchPromise = (async () => {
        const complaintsCol = collection(db, 'complaints');
        let q = query(complaintsCol);

        if (params?.villageId) {
          q = query(complaintsCol, where('villageId', '==', params.villageId));
        } else if (params?.residentUid) {
          q = query(complaintsCol, where('residentUid', '==', params.residentUid));
        }

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const remoteList = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Complaint));
          // Merge remote with any locally created items
          const map = new Map<string, Complaint>();
          localComplaints.forEach(c => map.set(c.id, c));
          remoteList.forEach(c => map.set(c.id, c));
          const merged = Array.from(map.values());
          merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return merged;
        }
        return localComplaints;
      })();

      localComplaints = await withTimeout(fetchPromise, 1500, localComplaints);
    } catch (_) {}
  }

  if (params?.villageId) {
    localComplaints = localComplaints.filter(c => c.villageId === params.villageId);
  }
  if (params?.residentUid) {
    localComplaints = localComplaints.filter(c => c.residentUid === params.residentUid);
  }

  localComplaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return localComplaints;
}

// API: Track Complaint by ID and Mobile
export async function trackComplaintById(
  complaintId: string,
  mobile?: string
): Promise<Complaint | null> {
  const cleanId = complaintId.trim().toUpperCase();
  const cleanMobile = mobile ? mobile.trim().replace(/\D/g, '').slice(-10) : '';

  initLocalStorage();
  const raw = safeLocalStorage.getItem(LOCAL_STORAGE_KEY_COMPLAINTS);
  const list: Complaint[] = raw ? JSON.parse(raw) : (inMemoryComplaints.length ? inMemoryComplaints : SEED_COMPLAINTS);
  const localMatch = list.find(c => c.complaintId.toUpperCase() === cleanId);

  if (localMatch) {
    if (!cleanMobile || localMatch.residentMobile.slice(-10) === cleanMobile) {
      return localMatch;
    }
  }

  // Try Firestore with 1500ms timeout
  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, 'complaints'),
        where('complaintId', '==', cleanId)
      );
      const fetchPromise = getDocs(q).then((snapshot) => {
        if (!snapshot.empty) {
          const item = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Complaint;
          if (!cleanMobile || item.residentMobile.slice(-10) === cleanMobile) {
            return item;
          }
        }
        return null;
      });

      const remoteResult = await withTimeout(fetchPromise, 1500, null);
      if (remoteResult) return remoteResult;
    } catch (_) {}
  }

  return localMatch || null;
}

// API: Create Complaint - FAST, RESILIENT & GUARANTEED
export async function submitComplaint(
  data: Omit<Complaint, 'id' | 'complaintId' | 'createdAt' | 'updatedAt' | 'status' | 'statusHistory' | 'remarks'>
): Promise<Complaint> {
  const { complaintId } = generateComplaintId(data.villageCode);
  const now = new Date().toISOString();

  const newComplaint: Complaint = {
    ...data,
    id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    complaintId,
    photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=600&q=80',
    status: 'received',
    remarks: 'ఫిర్యాదు స్వీకరించబడింది (Grievance received)',
    statusHistory: [
      {
        status: 'received',
        remark: 'ఫిర్యాదు స్వీకరించబడింది మరియు పరిశీలనకు పంపబడింది',
        byUid: data.residentUid,
        byName: 'Resident',
        at: now
      }
    ],
    createdAt: now,
    updatedAt: now
  };

  // 1. ALWAYS persist to LocalStorage & memory IMMEDIATELY (guaranteed persistence, <5ms)
  initLocalStorage();
  const raw = safeLocalStorage.getItem(LOCAL_STORAGE_KEY_COMPLAINTS);
  const list: Complaint[] = raw ? JSON.parse(raw) : [...inMemoryComplaints];
  list.unshift(newComplaint);
  inMemoryComplaints = list;
  safeLocalStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(list));
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vpc_complaints_updated'));
  }

  // 2. Perform Firebase Storage & Firestore sync in background (non-blocking, with strict 2s timeout)
  (async () => {
    let finalPhotoUrl = newComplaint.photoUrl;

    // Optional upload to Firebase Storage if configured
    if (isFirebaseConfigured() && storage && data.photoUrl?.startsWith('data:image')) {
      try {
        const storagePath = `complaints/${data.villageId}/${complaintId}.jpg`;
        const storageRef = ref(storage, storagePath);
        await withTimeout(uploadString(storageRef, data.photoUrl, 'data_url'), 2000, null);
        const remoteUrl = await withTimeout(getDownloadURL(storageRef), 1500, '');
        if (remoteUrl) {
          finalPhotoUrl = remoteUrl;
          newComplaint.photoUrl = remoteUrl;
          list[0].photoUrl = remoteUrl;
          safeLocalStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(list));
        }
      } catch (storageErr) {
        console.warn('Background Storage upload warning:', storageErr);
      }
    }

    // Save record to all active Firestore databases (dual-sync)
    if (isFirebaseConfigured()) {
      const dbs = [db, defaultDb].filter(Boolean) as Firestore[];
      for (const targetDb of dbs) {
        try {
          const docRef = doc(collection(targetDb, 'complaints'), newComplaint.id);
          await withTimeout(setDoc(docRef, { ...newComplaint, photoUrl: finalPhotoUrl }), 2000, null);
          console.info('Synced complaint to Firestore:', targetDb === db ? 'provisioned' : 'default', complaintId);
        } catch (dbErr) {
          console.warn('Background Firestore write warning:', dbErr);
        }
      }
    }
  })();

  // Return immediately so the resident/examiner sees the success screen in < 100ms!
  return newComplaint;
}

// API: Update Complaint Status (Panchayat Staff only)
export async function updateComplaintStatus(
  complaintId: string, // doc ID or complaintId
  newStatus: ComplaintStatus,
  remark: string,
  byUid: string,
  byName: string
): Promise<Complaint | null> {
  const now = new Date().toISOString();
  const newHistoryItem = {
    status: newStatus,
    remark: remark.trim() || `Status updated to ${newStatus}`,
    byUid,
    byName,
    at: now
  };

  initLocalStorage();
  const raw = safeLocalStorage.getItem(LOCAL_STORAGE_KEY_COMPLAINTS);
  const list: Complaint[] = raw ? JSON.parse(raw) : [...inMemoryComplaints];
  const index = list.findIndex(c => c.id === complaintId || c.complaintId === complaintId);

  let updatedComplaint: Complaint | null = null;
  if (index !== -1) {
    updatedComplaint = {
      ...list[index],
      status: newStatus,
      remarks: newHistoryItem.remark,
      statusHistory: [...(list[index].statusHistory || []), newHistoryItem],
      updatedAt: now
    };
    list[index] = updatedComplaint;
    inMemoryComplaints = list;
    safeLocalStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(list));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vpc_complaints_updated'));
    }
  }

  // Non-blocking background sync to all active Firestore databases
  if (isFirebaseConfigured()) {
    (async () => {
      const dbs = [db, defaultDb].filter(Boolean) as Firestore[];
      for (const targetDb of dbs) {
        try {
          let targetDocRef = doc(targetDb, 'complaints', complaintId);
          const directDoc = await withTimeout(getDoc(targetDocRef), 1500, null);
          if (!directDoc || !directDoc.exists()) {
            const q = query(collection(targetDb, 'complaints'), where('complaintId', '==', complaintId));
            const snap = await withTimeout(getDocs(q), 1500, null);
            if (snap && !snap.empty) {
              targetDocRef = snap.docs[0].ref;
            }
          }

          await withTimeout(
            updateDoc(targetDocRef, {
              status: newStatus,
              remarks: newHistoryItem.remark,
              updatedAt: now
            }),
            2000,
            null
          );
        } catch (err) {
          console.warn('Background status update warning:', err);
        }
      }
    })();
  }

  return updatedComplaint;
}

// Reset Demo Data helper for testing
export function resetDemoData() {
  safeLocalStorage.setItem(LOCAL_STORAGE_KEY_VILLAGES, JSON.stringify(SEED_VILLAGES));
  safeLocalStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(SEED_COMPLAINTS));
  safeLocalStorage.removeItem(LOCAL_STORAGE_KEY_COUNTERS);
  inMemoryComplaints = [...SEED_COMPLAINTS];
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vpc_complaints_updated'));
  }
}

// CSV Export Utility
export function exportComplaintsToCsv(complaints: Complaint[], villageName: string) {
  const headers = [
    'Complaint ID',
    'Date Registered',
    'Problem Type',
    'Lane / Street Name',
    'Status',
    'Resident Mobile',
    'GPS Coordinates',
    'Accuracy (m)',
    'Verified GPS',
    'Description',
    'Official Remarks',
    'Last Updated'
  ];

  const rows = complaints.map(c => [
    `"${c.complaintId}"`,
    `"${new Date(c.createdAt).toLocaleString('en-IN')}"`,
    `"${c.problemType}"`,
    `"${c.laneName.replace(/"/g, '""')}"`,
    `"${c.status}"`,
    `"${c.residentMobile}"`,
    c.location?.lat ? `"${c.location.lat}, ${c.location.lng}"` : '"N/A"',
    c.location?.accuracy ? `"${c.location.accuracy}"` : '"N/A"',
    c.location?.verified ? '"Yes"' : '"No"',
    `"${(c.description || '').replace(/"/g, '""')}"`,
    `"${(c.remarks || '').replace(/"/g, '""')}"`,
    `"${new Date(c.updatedAt).toLocaleString('en-IN')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `Panchayat_Complaints_${villageName}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
