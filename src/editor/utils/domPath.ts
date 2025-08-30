// Utility functions to uniquely identify and resolve DOM elements within the editor root

/**
 * Build a robust CSS selector path from the root element to the target element
 * using tag names and :nth-of-type indexes. The selector is relative to the root.
 */
export function buildCssPathFromRoot(root: Element, target: Element): string {
  if (!root || !target) {
    throw new Error('buildCssPathFromRoot requires both root and target elements');
  }

  if (root === target) {
    return '';
  }

  const segments: string[] = [];
  let current: Element | null = target;

  while (current && current !== root && current.nodeType === Node.ELEMENT_NODE) {
    const tagName = current.tagName.toLowerCase();

    // Prefer an ID if it's unique under root to shorten the path and improve stability
    const id = (current as HTMLElement).id;
    if (id) {
      const matches = root.querySelectorAll(`#${CSS.escape(id)}`);
      if (matches.length === 1) {
        segments.unshift(`#${CSS.escape(id)}`);
        break;
      }
    }

    // Compute :nth-of-type index among same tag siblings (1-based)
    let nth = 1;
    let sibling = current.previousElementSibling;
    while (sibling) {
      if (sibling.tagName.toLowerCase() === tagName) nth++;
      sibling = sibling.previousElementSibling;
    }

    const segment = `${tagName}:nth-of-type(${nth})`;
    segments.unshift(segment);
    current = current.parentElement;
  }

  return segments.join(' > ');
}

/** Resolve an element inside root using a CSS path produced by buildCssPathFromRoot */
export function queryElementByCssPath(root: Element, cssPath: string): HTMLElement | null {
  if (!cssPath) return root as HTMLElement;
  try {
    return root.querySelector(cssPath) as HTMLElement | null;
  } catch {
    return null;
  }
}

/** Find the nearest selectable ancestor for editing starting from the event target */
export function findSelectableElement(target: Element | null, root: Element): HTMLElement | null {
  let current: Element | null = target;
  while (current && current !== root) {
    if (current instanceof HTMLElement) {
      // Skip elements explicitly marked non-editable
      if (current.closest('[data-non-editable="true"]')) {
        return null;
      }
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

