import { db } from '@/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export interface ElementEdit {
  id?: string;           // legacy element id (e.g., pageId-tag-index)
  path?: string;         // preferred: CSS path to element
  elementType: string;   // h1, p, img, a, etc.
  property: string;      // textContent, innerHTML, src, alt, href, style.xxx, attr.*
  value: string;         // new value
  timestamp: number;     // ms
}

export interface PageEditsDoc {
  pageId: string;
  edits: ElementEdit[];
  lastModified: number;
  version: number;
}

// For element-level overrides we store them alongside the published doc, but
// we also accept a standalone document with only { edits } if no template exists.
const PUBLISHED_COLLECTION = 'theme_published_v1';
const DRAFTS_COLLECTION = 'theme_drafts_v1';

export function subscribeToLiveEdits(pageId: string, apply: (edit: ElementEdit) => void) {
  const ref = doc(db, PUBLISHED_COLLECTION, pageId);
  return onSnapshot(ref, (snap) => {
    const data = snap.data() as any;
    if (!data) return;
    if (Array.isArray(data.edits)) {
      (data.edits as ElementEdit[]).forEach(apply);
    }
  }, (err) => {
    console.warn('subscribeToLiveEdits error', err);
  });
}

export async function publishElementEdits(pageId: string, edits: ElementEdit[]) {
  const ref = doc(db, PUBLISHED_COLLECTION, pageId);

  // Sanitize edits: remove undefined fields, coerce types, and drop empty entries
  const sanitizedEdits = (Array.isArray(edits) ? edits : []).map((e) => {
    const out: any = {};
    if (e.id !== undefined) out.id = String(e.id);
    if (e.path !== undefined && e.path !== '') out.path = String(e.path);
    if (e.elementType !== undefined) out.elementType = String(e.elementType);
    if (e.property !== undefined) out.property = String(e.property);
    if (e.value !== undefined) out.value = String(e.value);
    // timestamp: default to now if missing/invalid
    out.timestamp = typeof e.timestamp === 'number' && !Number.isNaN(e.timestamp)
      ? e.timestamp
      : Date.now();
    return out;
  }).filter((e) => e.elementType && e.property && (e.path || e.id));

  const docData: Record<string, any> = {
    edits: sanitizedEdits,
    lastModified: Date.now(),
    version: 1
  };

  await setDoc(ref, docData, { merge: true });
}

export async function saveDraftElementEdits(pageId: string, edits: ElementEdit[]) {
  const ref = doc(db, DRAFTS_COLLECTION, pageId);
  const docData: any = {
    edits,
    lastModified: Date.now(),
    version: 1
  };
  await setDoc(ref, docData, { merge: true });
}


