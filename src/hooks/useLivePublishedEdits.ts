import { useEffect } from 'react';
import { subscribeToLiveEdits, ElementEdit } from '@/editor/services/EditsFirestoreService';

// Inject stable data-editor-id attributes on live pages so edits can be matched reliably
function injectEditorIds() {
  const selectors = [
    'h1','h2','h3','h4','h5','h6','p','span','div','a','img','button','input','textarea',
    'label','li','td','th','caption','figcaption','blockquote','cite','em','strong','small'
  ];

  selectors.forEach((selector) => {
    const nodeList = document.querySelectorAll(selector);
    nodeList.forEach((el, index) => {
      const element = el as HTMLElement;
      // Respect existing id or data-edit-id
      let id = element.id || element.dataset.editId || '';
      if (!id) {
        const tag = element.tagName.toLowerCase();
        const firstClass = (element.className || '').toString().split(' ').filter(Boolean)[0];
        const classPart = firstClass ? `.${firstClass}` : '';
        id = `${tag}${classPart}-${index}`;
      }
      element.setAttribute('data-editor-id', id);
    });
  });
}

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
    // Ensure elements have stable identifiers on the live site
    try {
      injectEditorIds();
    } catch {}
    const unsub = subscribeToLiveEdits(pageId, applyEditToElement);
    return () => unsub();
  }, [pageId]);
}


