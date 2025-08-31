import { useEffect } from 'react';
import { ElementEdit } from '@/editor/services/EditsFirestoreService';
import { subscribeToLiveEditsHttp } from '@/editor/services/ApiEditsService';

function applyEditToElement(edit: ElementEdit) {
  // Try exact match by data-editor-id first
  const selector = `[data-editor-id="${edit.id}"]`;
  let element = document.querySelector(selector) as HTMLElement | null;

  if (!element) {
    // Fallback: reproduce the same enumeration logic used by the Editor
    // to map index consistently across the combined selector list
    const parts = edit.id.split('-');
    const index = parts.length >= 3 ? Number(parts[2]) : NaN;
    if (!Number.isNaN(index)) {
      const editableSelectors = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p',
        'img',
        'button',
        '[data-editable]',
        '.editable'
      ];
      const candidates = document.querySelectorAll(editableSelectors.join(', '));
      element = (candidates[index] as HTMLElement) || null;
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
        }
    }
  } catch (e) {
    console.warn('Failed to apply live edit', edit, e);
  }
}

export default function useLivePublishedEdits(pageId: string) {
  useEffect(() => {
    if (!pageId) return;
    const unsub = subscribeToLiveEditsHttp(pageId, applyEditToElement);
    return () => unsub();
  }, [pageId]);
}


