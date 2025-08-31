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

async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadViaFunction(file: File, folder: string): Promise<UploadResult> {
  const fileExt = file.name.split('.').pop() || 'bin';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const base64 = await readFileAsBase64(file);
  const res = await fetch('/.netlify/functions/upload-media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, fileData: base64, folder, originalName: file.name, contentType: file.type || undefined })
  });
  if (!res.ok) {
    throw new Error(`Upload function failed: ${res.status}`);
  }
  const data = await res.json();
  return { url: data.url, path: data.path, name: data.name, uploadedAt: data.uploadedAt };
}

export function uploadMedia(file: File, folder: string, onProgress?: (pct: number) => void): Promise<UploadResult> {
  return new Promise(async (resolve, reject) => {
    const preferFunction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';
    if (preferFunction) {
      try {
        const result = await uploadViaFunction(file, folder);
        resolve(result);
        return;
      } catch (e) {
        console.warn('Upload via function failed, falling back to direct storage upload', e);
      }
    }

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
          console.warn('Failed to save media reference', e);
        }
        resolve({ url, path: fullPath, name: fileName, uploadedAt: Date.now() });
      });
    } catch (e) {
      reject(e);
    }
  });
}


