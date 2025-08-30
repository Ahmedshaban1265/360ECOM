import { useEffect } from 'react';
import { subscribeToLiveEdits, ElementEdit } from '@/editor/services/EditsFirestoreService';

function applyEditToElement(edit: ElementEdit) {
  // Try exact match by data-editor-id first; otherwise fallback to RSS-like scan of all elements
  let element = document.querySelector(`[data-editor-id="${edit.id}"]`) as HTMLElement | null;
  if (!element) {
    const parts = edit.id.split('-');
    const index = parts.length >= 3 ? Number(parts[2]) : NaN;
    if (!Number.isNaN(index)) {
      const all = Array.from(document.querySelectorAll('*')) as HTMLElement[];
      const candidates = all.filter(el => !['HTML','HEAD','BODY','SCRIPT','STYLE','LINK','META'].includes(el.tagName));
      element = candidates[index] || null;
    }
  }

  if (!element) return;

  try {
    switch (edit.property) {
      case 'textContent':
        element.textContent = edit.value;
        return;
      case 'innerHTML':
        element.innerHTML = edit.value;
        return;
      case 'src':
        if (element instanceof HTMLImageElement) {
          element.src = edit.value;
        }
        return;
      case 'alt':
        if (element instanceof HTMLImageElement) {
          element.alt = edit.value;
        }
        return;
      case 'href':
        if (element instanceof HTMLAnchorElement) {
          element.href = edit.value;
        }
        return;
      default:
        if (edit.property.startsWith('style.')) {
          const cssProperty = edit.property.replace('style.', '');
          (element.style as any)[cssProperty] = edit.value;
          return;
        }
        if (edit.property.startsWith('attr.')) {
          const attrName = edit.property.replace('attr.', '');
          if (edit.value === '') {
            element.removeAttribute(attrName);
          } else {
            element.setAttribute(attrName, edit.value);
          }
        }
    }
  } catch (e) {
    console.warn('Failed to apply live edit', edit, e);
  }
}

export default function useLivePublishedEdits(pageId: string) {
  useEffect(() => {
    if (!pageId) return;
    const unsub = subscribeToLiveEdits(pageId, applyEditToElement);
    return () => unsub();
  }, [pageId]);
}


