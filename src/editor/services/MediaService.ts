import { storage } from '@/firebase';
import { getDownloadURL, ref, uploadBytesResumable, listAll, deleteObject } from 'firebase/storage';

export interface UploadResult {
	url: string;
	path: string;
}

const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function listMediaFromBackend(): Promise<{ url: string; path: string }[]> {
	const res = await fetch(`${API_BASE}/media`)
	if (!res.ok) throw new Error('Failed to list media')
	const data = await res.json()
	return data.items as { url: string; path: string }[]
}

export async function uploadMediaBackend(file: File, folder: string): Promise<UploadResult> {
	const form = new FormData()
	form.append('file', file)
	form.append('folder', folder)
	const res = await fetch(`${API_BASE}/media`, { method: 'POST', body: form })
	if (!res.ok) throw new Error('Upload failed')
	return res.json()
}

export async function deleteMediaBackend(pathStr: string): Promise<void> {
	const res = await fetch(`${API_BASE}/media/${encodeURIComponent(pathStr)}`, { method: 'DELETE' })
	if (!res.ok) throw new Error('Delete failed')
}

export function uploadMedia(file: File, folder: string, onProgress?: (pct: number) => void): Promise<UploadResult> {
	if (API_BASE) {
		return uploadMediaBackend(file, folder)
	}
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

export async function listMedia(prefix: string): Promise<{ url: string; path: string }[]> {
	if (API_BASE) {
		return listMediaFromBackend()
	}
	const folderRef = ref(storage, prefix);
	const res = await listAll(folderRef);
	return Promise.all(res.items.map(async (itemRef) => ({ url: await getDownloadURL(itemRef), path: itemRef.fullPath })))
}

export async function deleteMedia(pathStr: string): Promise<void> {
	if (API_BASE) {
		return deleteMediaBackend(pathStr)
	}
	await deleteObject(ref(storage, pathStr))
}


