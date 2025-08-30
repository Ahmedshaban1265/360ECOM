import { useEffect } from 'react';
import { subscribeToLiveEdits, ElementEdit } from '@/editor/services/EditsFirestoreService';

function applyEditToElement(edit: ElementEdit) {
  let element: HTMLElement | null = null;

  // Preferred: CSS path if provided
  if (edit.path) {
    try {
      element = document.querySelector(edit.path) as HTMLElement | null;
    } catch {
      element = null;
    }
  }

  // Legacy: data-editor-id selector
  if (!element && edit.id) {
    const selector = `[data-editor-id="${edit.id}"]`;
    element = document.querySelector(selector) as HTMLElement | null;
  }

  // Last resort: enumeration heuristic (may be unstable)
  if (!element && edit.id) {
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
        // Attributes support
        if (edit.property.startsWith('attr.')) {
          const attrName = edit.property.replace('attr.', '');
          if (attrName === 'className') {
            (element as HTMLElement).className = edit.value;
          } else if (attrName === 'id') {
            (element as HTMLElement).id = edit.value;
          } else if (edit.value) {
            element.setAttribute(attrName, edit.value);
          } else {
            element.removeAttribute(attrName);
          }
          return;
        }
        // Styles support
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
    const unsub = subscribeToLiveEdits(pageId, applyEditToElement);
    return () => unsub();
  }, [pageId]);
}


