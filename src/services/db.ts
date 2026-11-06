import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  runTransaction
} from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './firebase';
import { Village, Complaint, ComplaintStatus, ProblemType } from '../types';
import { SEED_VILLAGES, SEED_COMPLAINTS } from '../data/seedData';

const LOCAL_STORAGE_KEY_COMPLAINTS = 'vpc_complaints_v1';
const LOCAL_STORAGE_KEY_VILLAGES = 'vpc_villages_v1';
const LOCAL_STORAGE_KEY_COUNTERS = 'vpc_counters_v1';

// Initialize mock storage if not already present
function initLocalStorage() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_VILLAGES)) {
    localStorage.setItem(LOCAL_STORAGE_KEY_VILLAGES, JSON.stringify(SEED_VILLAGES));
  }
  if (!localStorage.getItem(LOCAL_STORAGE_KEY_COMPLAINTS)) {
    localStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(SEED_COMPLAINTS));
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
        current.location?.verified &&
        other.location?.verified &&
        current.location.lat &&
        other.location.lat &&
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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const MAX_WIDTH = 1280;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target?.result as string);
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Sequential Complaint ID generator
// Format: VILLAGECODE-YYYYMMDD-NNNN (e.g., GRP-20261106-0001)
export async function generateComplaintId(villageCode: string): Promise<{ complaintId: string; sequence: number }> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateKey = `${year}${month}${day}`;
  const counterDocId = `${villageCode}_${dateKey}`;

  if (isFirebaseConfigured() && db) {
    try {
      const counterRef = doc(db, 'counters', counterDocId);
      let nextSeq = 1;

      await runTransaction(db, async (transaction) => {
        const counterDoc = await transaction.get(counterRef);
        if (counterDoc.exists()) {
          const currentSeq = counterDoc.data().lastSequence || 0;
          nextSeq = currentSeq + 1;
          transaction.update(counterRef, { lastSequence: nextSeq });
        } else {
          nextSeq = 1;
          transaction.set(counterRef, {
            date: dateKey,
            villageCode,
            lastSequence: nextSeq
          });
        }
      });

      const formattedSeq = String(nextSeq).padStart(4, '0');
      return {
        complaintId: `${villageCode}-${dateKey}-${formattedSeq}`,
        sequence: nextSeq
      };
    } catch (err) {
      console.warn('Firebase counter transaction failed, falling back to local counter:', err);
    }
  }

  // Local fallback
  const rawCounters = localStorage.getItem(LOCAL_STORAGE_KEY_COUNTERS) || '{}';
  const counters = JSON.parse(rawCounters);
  const currentSeq = counters[counterDocId] || 0;
  const nextSeq = currentSeq + 1;
  counters[counterDocId] = nextSeq;
  localStorage.setItem(LOCAL_STORAGE_KEY_COUNTERS, JSON.stringify(counters));

  const formattedSeq = String(nextSeq).padStart(4, '0');
  return {
    complaintId: `${villageCode}-${dateKey}-${formattedSeq}`,
    sequence: nextSeq
  };
}

// API: Get Villages
export async function fetchVillages(): Promise<Village[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const snapshot = await getDocs(collection(db, 'villages'));
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Village));
      }
    } catch (err) {
      console.warn('Failed to fetch villages from Firestore, using local cache:', err);
    }
  }

  initLocalStorage();
  const local = localStorage.getItem(LOCAL_STORAGE_KEY_VILLAGES);
  return local ? JSON.parse(local) : SEED_VILLAGES;
}

// API: Get Complaints (filtered by village and optional residentUid)
export async function fetchComplaints(params?: {
  villageId?: string;
  residentUid?: string;
}): Promise<Complaint[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const complaintsCol = collection(db, 'complaints');
      let q = query(complaintsCol);

      if (params?.villageId) {
        q = query(complaintsCol, where('villageId', '==', params.villageId));
      } else if (params?.residentUid) {
        q = query(complaintsCol, where('residentUid', '==', params.residentUid));
      }

      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (list.length > 0) return list;
    } catch (err) {
      console.warn('Failed to fetch complaints from Firestore, using local store:', err);
    }
  }

  initLocalStorage();
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY_COMPLAINTS);
  let complaints: Complaint[] = raw ? JSON.parse(raw) : SEED_COMPLAINTS;

  if (params?.villageId) {
    complaints = complaints.filter(c => c.villageId === params.villageId);
  }
  if (params?.residentUid) {
    complaints = complaints.filter(c => c.residentUid === params.residentUid);
  }

  complaints.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return complaints;
}

// API: Track Complaint by ID and Mobile
export async function trackComplaintById(
  complaintId: string,
  mobile?: string
): Promise<Complaint | null> {
  const cleanId = complaintId.trim().toUpperCase();
  const cleanMobile = mobile ? mobile.trim().replace(/\D/g, '').slice(-10) : '';

  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, 'complaints'),
        where('complaintId', '==', cleanId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const item = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Complaint;
        if (!cleanMobile || item.residentMobile.slice(-10) === cleanMobile) {
          return item;
        }
      }
    } catch (err) {
      console.warn('Firestore tracking lookup failed, falling back to local:', err);
    }
  }

  initLocalStorage();
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY_COMPLAINTS);
  const list: Complaint[] = raw ? JSON.parse(raw) : SEED_COMPLAINTS;
  const found = list.find(c => c.complaintId.toUpperCase() === cleanId);

  if (found) {
    if (!cleanMobile || found.residentMobile.slice(-10) === cleanMobile) {
      return found;
    }
  }
  return null;
}

// API: Create Complaint
export async function submitComplaint(
  data: Omit<Complaint, 'id' | 'complaintId' | 'createdAt' | 'updatedAt' | 'status' | 'statusHistory' | 'remarks'>
): Promise<Complaint> {
  const { complaintId } = await generateComplaintId(data.villageCode);
  const now = new Date().toISOString();

  let finalPhotoUrl = data.photoUrl;

  // If Firebase Storage is configured and photo is base64 data URL, upload to Storage
  if (isFirebaseConfigured() && storage && data.photoUrl?.startsWith('data:image')) {
    try {
      const storagePath = `complaints/${data.villageId}/${complaintId}.jpg`;
      const storageRef = ref(storage, storagePath);
      await uploadString(storageRef, data.photoUrl, 'data_url');
      finalPhotoUrl = await getDownloadURL(storageRef);
    } catch (storageErr) {
      console.warn('Firebase storage upload failed, keeping inline compressed image:', storageErr);
    }
  }

  const newComplaint: Complaint = {
    ...data,
    id: `cmp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    complaintId,
    photoUrl: finalPhotoUrl,
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

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(collection(db, 'complaints'), newComplaint.id);
      await setDoc(docRef, newComplaint);
      return newComplaint;
    } catch (dbErr) {
      console.warn('Firestore write failed, persisting to local storage:', dbErr);
    }
  }

  initLocalStorage();
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY_COMPLAINTS);
  const list: Complaint[] = raw ? JSON.parse(raw) : SEED_COMPLAINTS;
  list.unshift(newComplaint);
  localStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(list));

  window.dispatchEvent(new CustomEvent('vpc_complaints_updated'));
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

  if (isFirebaseConfigured() && db) {
    try {
      // Find document by id or complaintId
      let targetDocRef = doc(db, 'complaints', complaintId);
      const directDoc = await getDoc(targetDocRef);
      if (!directDoc.exists()) {
        const q = query(collection(db, 'complaints'), where('complaintId', '==', complaintId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          targetDocRef = snap.docs[0].ref;
        }
      }

      const snap = await getDoc(targetDocRef);
      if (snap.exists()) {
        const currentData = snap.data() as Complaint;
        const updatedHistory = [...(currentData.statusHistory || []), newHistoryItem];
        await updateDoc(targetDocRef, {
          status: newStatus,
          remarks: newHistoryItem.remark,
          statusHistory: updatedHistory,
          updatedAt: now
        });
        return {
          ...currentData,
          status: newStatus,
          remarks: newHistoryItem.remark,
          statusHistory: updatedHistory,
          updatedAt: now
        };
      }
    } catch (err) {
      console.warn('Firestore status update failed, falling back to local:', err);
    }
  }

  // Local storage update
  initLocalStorage();
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY_COMPLAINTS);
  const list: Complaint[] = raw ? JSON.parse(raw) : SEED_COMPLAINTS;
  const index = list.findIndex(c => c.id === complaintId || c.complaintId === complaintId);

  if (index !== -1) {
    const updated: Complaint = {
      ...list[index],
      status: newStatus,
      remarks: newHistoryItem.remark,
      statusHistory: [...(list[index].statusHistory || []), newHistoryItem],
      updatedAt: now
    };
    list[index] = updated;
    localStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('vpc_complaints_updated'));
    return updated;
  }

  return null;
}

// Reset Demo Data helper for testing
export function resetDemoData() {
  localStorage.setItem(LOCAL_STORAGE_KEY_VILLAGES, JSON.stringify(SEED_VILLAGES));
  localStorage.setItem(LOCAL_STORAGE_KEY_COMPLAINTS, JSON.stringify(SEED_COMPLAINTS));
  localStorage.removeItem(LOCAL_STORAGE_KEY_COUNTERS);
  window.dispatchEvent(new CustomEvent('vpc_complaints_updated'));
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
