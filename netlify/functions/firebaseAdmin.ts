import admin from 'firebase-admin';

let initialized = false;

export function getAdminApp() {
  if (!initialized) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT env var is required');
    }
    const serviceAccount = JSON.parse(serviceAccountJson);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || serviceAccount.project_id + '.appspot.com'
    });
    initialized = true;
  }
  return admin.app();
}

export const adminDb = () => getAdminApp().firestore();
export const adminBucket = () => getAdminApp().storage().bucket();

