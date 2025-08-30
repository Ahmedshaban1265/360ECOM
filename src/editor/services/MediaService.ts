import { storage, db } from '@/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

export interface UploadResult {
  url: string;
  path: string;
  name?: string;
  uploadedAt?: number;
}

export interface MediaRecord {
  id: string;
  url: string;
  path: string;
  name: string;
  originalName?: string;
  size?: number;
  folder?: string;
  uploadedAt: number;
}

const MEDIA_COLLECTION = 'media_library_v1';

export async function saveMediaReference(record: Omit<MediaRecord, 'id'> & { id?: string }): Promise<void> {
  const id = record.id || record.path.replace(/\//g, '__');
  const refDoc = doc(db, MEDIA_COLLECTION, id);
  await setDoc(refDoc, {
    url: record.url,
    path: record.path,
    name: record.name,
    originalName: record.originalName || record.name,
    size: record.size || null,
    folder: record.folder || null,
    uploadedAt: record.uploadedAt
  }, { merge: true });
}

export function uploadMedia(file: File, folder: string, onProgress?: (pct: number) => void): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    try {
      const fileExt = file.name.split('.').pop() || 'bin';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const fullPath = `${folder}/${fileName}`;
      const fileRef = ref(storage, fullPath);
      const task = uploadBytesResumable(fileRef, file);

      task.on('state_changed', (snapshot) => {
        if (onProgress) {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress(pct);
        }
      }, (err) => reject(err), async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        // Persist media reference in Firestore for reuse elsewhere
        try {
          await saveMediaReference({
            url,
            path: fullPath,
            name: fileName,
            originalName: file.name,
            size: file.size,
            folder,
            uploadedAt: Date.now()
          });
        } catch (e) {
          // Non-fatal: log and continue
          console.warn('Failed to save media reference', e);
        }
        resolve({ url, path: fullPath, name: fileName, uploadedAt: Date.now() });
      });
    } catch (e) {
      reject(e);
    }
  });
}


