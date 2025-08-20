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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
