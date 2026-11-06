import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCNCI6J-mX5dFKI0Qd8lkJ9Ci1R6GPQQ1s',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'village-complaint-portal.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'village-complaint-portal',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'village-complaint-portal.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '69915324050',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:69915324050:web:67b48e613c9dc90efe804b',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DCY7JQKF7J',
  databaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || '(default)'
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your-api-key' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'your-project-id'
  );
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app, firebaseConfig.databaseId !== '(default)' ? firebaseConfig.databaseId : undefined);
    storage = getStorage(app);
    
    // Initialize analytics if supported in browser environment
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch((_) => {});
    }
    
    console.info('Firebase initialized successfully for project:', firebaseConfig.projectId);
  } catch (err) {
    console.warn('Firebase initialization warning:', err);
  }
}

export { app, auth, db, storage, analytics, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword, signOut };
