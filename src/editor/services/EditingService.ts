/**
 * Service for managing live website edits stored in localStorage
 * Similar to how Shopify theme editor saves customizations
 */

export interface ElementEdit {
  // Backward compat: id retained for older edits
  id?: string;
  // New: CSS path from editor root to element
  path?: string;
  elementType: string;
  property: string;
  value: string;
  originalValue: string;
  timestamp: number;
}

export interface PageEdits {
  pageId: string;
  edits: ElementEdit[];
  lastModified: number;
}

export interface WebsiteEdits {
  pages: Record<string, PageEdits>;
  globalEdits: ElementEdit[];
  version: number; // 1 = id-based, 2 = path-based
}

class EditingService {
  private static readonly STORAGE_KEY = 'website_edits_v2';
  
  /**
   * Get all website edits from localStorage
   */
  getWebsiteEdits(): WebsiteEdits {
    try {
      const stored = localStorage.getItem(EditingService.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load website edits:', error);
    }
    
    return {
      pages: {},
      globalEdits: [],
      version: 2
    };
  }

  /**
   * Save website edits to localStorage
   */
  saveWebsiteEdits(edits: WebsiteEdits): void {
    try {
      localStorage.setItem(EditingService.STORAGE_KEY, JSON.stringify(edits));
    } catch (error) {
      console.error('Failed to save website edits:', error);
    }
  }

  /**
   * Get edits for a specific page
   */
  getPageEdits(pageId: string): PageEdits | null {
    const websiteEdits = this.getWebsiteEdits();
    return websiteEdits.pages[pageId] || null;
  }

  /**
   * Save an edit for a specific element
   */
  saveElementEdit(
    pageId: string,
    elementPath: string,
    elementType: string,
    property: string,
    value: string,
    originalValue: string,
    elementIdFallback?: string
  ): void {
    const websiteEdits = this.getWebsiteEdits();
    
    const edit: ElementEdit = {
      id: elementIdFallback,
      path: elementPath,
      elementType,
      property,
      value,
      originalValue,
      timestamp: Date.now()
    };

    // Initialize page edits if they don't exist
    if (!websiteEdits.pages[pageId]) {
      websiteEdits.pages[pageId] = {
        pageId,
        edits: [],
        lastModified: Date.now()
      };
    }

    const pageEdits = websiteEdits.pages[pageId];
    
    // Remove existing edit for same element and property
    pageEdits.edits = pageEdits.edits.filter(e => {
      const sameProperty = e.property === property;
      const samePath = e.path && edit.path ? e.path === edit.path : false;
      const sameId = e.id && edit.id ? e.id === edit.id : false;
      return !(sameProperty && (samePath || sameId));
    });
    
    // Add new edit
    pageEdits.edits.push(edit);
    pageEdits.lastModified = Date.now();

    this.saveWebsiteEdits(websiteEdits);
  }

  /**
   * Apply saved edits to an element
   */
  applyElementEdits(element: HTMLElement, elementId: string, pageId: string): void {
    // Backward-compat helper: keep API but delegate to generic applier
    const pageEdits = this.getPageEdits(pageId);
    if (!pageEdits) return;
    const elementEdits = pageEdits.edits.filter(edit => edit.id === elementId);
    elementEdits.forEach(edit => this.applySingleEditToElement(element, edit));
  }

  /** Apply all saved edits for page to the given root container using path or id fallback */
  applyAllEditsToRoot(root: HTMLElement, pageId: string): void {
    const pageEdits = this.getPageEdits(pageId);
    if (!pageEdits) return;

    pageEdits.edits.forEach(edit => {
      let element: HTMLElement | null = null;
      if (edit.path) {
        try {
          element = root.querySelector(edit.path) as HTMLElement | null;
        } catch {
          element = null;
        }
      }
      if (!element && edit.id) {
        element = root.querySelector(`[data-editor-id="${edit.id}"]`) as HTMLElement | null;
      }
      if (element) {
        this.applySingleEditToElement(element, edit);
      }
    });
  }

  private applySingleEditToElement(element: HTMLElement, edit: ElementEdit): void {
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
          // Attributes
          if (edit.property.startsWith('attr.')) {
            const attrName = edit.property.replace('attr.', '');
            if (attrName === 'className') {
              (element as HTMLElement).className = edit.value;
            } else if (attrName === 'id') {
              (element as HTMLElement).id = edit.value;
            } else {
              element.setAttribute(attrName, edit.value);
            }
            return;
          }
          // CSS properties
          if (edit.property.startsWith('style.')) {
            const cssProperty = edit.property.replace('style.', '');
            (element.style as any)[cssProperty] = edit.value;
            return;
          }
      }
    } catch (error) {
      console.error('Failed to apply edit:', edit, error);
    }
  }

  /**
   * Remove an edit
   */
  removeElementEdit(pageId: string, elementId: string, property: string): void {
    const websiteEdits = this.getWebsiteEdits();
    const pageEdits = websiteEdits.pages[pageId];
    
    if (pageEdits) {
      pageEdits.edits = pageEdits.edits.filter(
        edit => !(edit.id === elementId && edit.property === property)
      );
      pageEdits.lastModified = Date.now();
      this.saveWebsiteEdits(websiteEdits);
    }
  }

  /**
   * Clear all edits for a specific element (by path if available, falling back to id)
   */
  clearElementEdits(pageId: string, elementPath?: string, elementIdFallback?: string): void {
    const websiteEdits = this.getWebsiteEdits();
    const pageEdits = websiteEdits.pages[pageId];
    if (!pageEdits) return;

    pageEdits.edits = pageEdits.edits.filter(edit => {
      const matchesPath = elementPath && edit.path === elementPath;
      const matchesId = elementIdFallback && edit.id === elementIdFallback;
      return !(matchesPath || matchesId);
    });
    pageEdits.lastModified = Date.now();
    this.saveWebsiteEdits(websiteEdits);
  }

  /**
   * Clear all edits for a page
   */
  clearPageEdits(pageId: string): void {
    const websiteEdits = this.getWebsiteEdits();
    delete websiteEdits.pages[pageId];
    this.saveWebsiteEdits(websiteEdits);
  }

  /**
   * Clear all website edits
   */
  clearAllEdits(): void {
    localStorage.removeItem(EditingService.STORAGE_KEY);
  }

  /**
   * Export edits as JSON
   */
  exportEdits(): string {
    const websiteEdits = this.getWebsiteEdits();
    return JSON.stringify(websiteEdits, null, 2);
  }

  /**
   * Import edits from JSON
   */
  importEdits(jsonData: string): void {
    try {
      const edits = JSON.parse(jsonData);
      this.saveWebsiteEdits(edits);
    } catch (error) {
      console.error('Failed to import edits:', error);
      throw new Error('Invalid JSON format');
    }
  }

  /**
   * Get editing statistics
   */
  getEditingStats(): {
    totalPages: number;
    totalEdits: number;
    lastModified: number;
  } {
    const websiteEdits = this.getWebsiteEdits();
    const pages = Object.values(websiteEdits.pages);
    
    return {
      totalPages: pages.length,
      totalEdits: pages.reduce((total, page) => total + page.edits.length, 0) + websiteEdits.globalEdits.length,
      lastModified: Math.max(
        ...pages.map(page => page.lastModified),
        0
      )
    };
  }
}

// Singleton instance
export const editingService = new EditingService();
