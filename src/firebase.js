import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
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

console.log('Firebase config:', firebaseConfig);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
console.log('Firebase app initialized:', app);

// Analytics is optional and not supported in all environments
try {
  getAnalytics(app);
  console.log('Analytics initialized');
} catch (e) {
  // ignore in non-browser or unsupported envs
}

export const auth = getAuth(app);
console.log('Auth initialized:', auth);

export const db = getFirestore(app);
console.log('Firestore initialized:', db);

export const storage = getStorage(app);
console.log('Storage initialized:', storage);
console.log('Storage bucket:', storage.app.options.storageBucket);
