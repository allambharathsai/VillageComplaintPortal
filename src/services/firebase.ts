import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import appletConfig from '../../firebase-applet-config.json';

const getEnv = (key: string, fallback: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.[key]) {
      return (import.meta as any).env[key];
    }
  } catch (_) {}
  return fallback;
};

export const firebaseConfig = {
  apiKey: appletConfig.apiKey || getEnv('VITE_FIREBASE_API_KEY', 'AIzaSyCNCI6J-mX5dFKI0Qd8lkJ9Ci1R6GPQQ1s'),
  authDomain: appletConfig.authDomain || getEnv('VITE_FIREBASE_AUTH_DOMAIN', 'village-complaint-portal.firebaseapp.com'),
  projectId: appletConfig.projectId || getEnv('VITE_FIREBASE_PROJECT_ID', 'village-complaint-portal'),
  storageBucket: appletConfig.storageBucket || getEnv('VITE_FIREBASE_STORAGE_BUCKET', 'village-complaint-portal.firebasestorage.app'),
  messagingSenderId: appletConfig.messagingSenderId || getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', '69915324050'),
  appId: appletConfig.appId || getEnv('VITE_FIREBASE_APP_ID', '1:69915324050:web:96c5d4cad022e80afe804b'),
  measurementId: appletConfig.measurementId || getEnv('VITE_FIREBASE_MEASUREMENT_ID', ''),
  databaseId: appletConfig.firestoreDatabaseId || getEnv('VITE_FIREBASE_DATABASE_ID', 'ai-studio-villagecomplaint-aeaf8e77-37fd-407b-adac-d46418f88547')
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
let defaultDb: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = firebaseConfig.databaseId && firebaseConfig.databaseId !== '(default)'
      ? getFirestore(app, firebaseConfig.databaseId)
      : getFirestore(app);
    try {
      defaultDb = getFirestore(app);
    } catch (_) {}
    storage = getStorage(app);
    
    // Initialize analytics if supported in browser environment
    if (typeof window !== 'undefined') {
      isSupported().then((supported) => {
        if (supported && app) {
          analytics = getAnalytics(app);
        }
      }).catch((_) => {});
    }
    
    console.info('Firebase initialized successfully for project:', firebaseConfig.projectId, 'with database:', firebaseConfig.databaseId);
  } catch (err) {
    console.warn('Firebase initialization warning:', err);
  }
}

export { app, auth, db, defaultDb, storage, analytics, RecaptchaVerifier, signInWithPhoneNumber, signInWithEmailAndPassword, signOut };

