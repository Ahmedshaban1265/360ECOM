import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCF7d1iVPi1rSiHRfFOvY_HmIcykZMojbw",
    authDomain: "ecom-agency-cms.firebaseapp.com",
    projectId: "ecom-agency-cms",
    storageBucket: "ecom-agency-cms.appspot.com",
    messagingSenderId: "369460983734",
    appId: "1:369460983734:web:e58bc01430c33478d5f317",
    measurementId: "G-07DGG8HD8Y"
};

let app;
let analytics;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

  // Initialize analytics only if not in development or testing
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    try {
      analytics = getAnalytics(app);
    } catch (analyticsError) {
      console.warn('Analytics initialization failed:', analyticsError);
    }
  }

  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development (opt-in via env or localStorage)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  let useEmulators = false;
  try {
    useEmulators = (localStorage.getItem('useFirebaseEmulators') === 'true') ||
      (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true');
  } catch (_) {}

  if (useEmulators) {
  try {
    // Only connect if not already connected
    if (!auth._delegate._isConnected) {
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
    if (!db._delegate._databaseId.projectId.includes('demo-')) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    if (!storage._delegate._host.includes('localhost')) {
      connectStorageEmulator(storage, 'localhost', 9199);
    }
    console.log('🔧 Connected to Firebase emulators');
  } catch (emulatorError) {
    console.log('⚠️ Firebase emulators not available:', emulatorError.message);
  }
  } else {
    console.log('ℹ️ Skipping Firebase emulators (set localStorage.useFirebaseEmulators = "true" to enable).');
  }
}

// Log storage configuration for debugging
console.log('Firebase Storage configured for bucket:', storage.app.options.storageBucket);
