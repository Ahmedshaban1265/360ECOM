const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface UploadResult {
  url: string;
  path: string;
}

export async function uploadMedia(file: File, _folder: string, _onProgress?: (pct: number) => void): Promise<UploadResult> {
  const token = localStorage.getItem('authToken');
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_URL}/api/media/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined as any,
    body: form
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return { url: data.url, path: data.name };
}


