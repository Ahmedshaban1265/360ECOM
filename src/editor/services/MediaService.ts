import { storage } from '@/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

export interface UploadResult {
  url: string;
  path: string;
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
        resolve({ url, path: fullPath });
      });
    } catch (e) {
      reject(e);
    }
  });
}


