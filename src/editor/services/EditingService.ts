/**
 * Service for managing live website edits stored in localStorage
 * Similar to how Shopify theme editor saves customizations
 */

export interface ElementEdit {
  id: string;
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
  version: number;
}

class EditingService {
  private static readonly STORAGE_KEY = 'website_edits_v1';
  
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
      version: 1
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
    elementId: string,
    elementType: string,
    property: string,
    value: string,
    originalValue: string
  ): void {
    const websiteEdits = this.getWebsiteEdits();
    
    const edit: ElementEdit = {
      id: elementId,
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
    pageEdits.edits = pageEdits.edits.filter(
      e => !(e.id === elementId && e.property === property)
    );
    
    // Add new edit
    pageEdits.edits.push(edit);
    pageEdits.lastModified = Date.now();

    this.saveWebsiteEdits(websiteEdits);
  }

  /**
   * Apply saved edits to an element
   */
  applyElementEdits(element: HTMLElement, elementId: string, pageId: string): void {
    const pageEdits = this.getPageEdits(pageId);
    if (!pageEdits) return;

    const elementEdits = pageEdits.edits.filter(edit => edit.id === elementId);
    
    elementEdits.forEach(edit => {
      try {
        switch (edit.property) {
          case 'textContent':
            element.textContent = edit.value;
            break;
          case 'innerHTML':
            element.innerHTML = edit.value;
            break;
          case 'src':
            if (element instanceof HTMLImageElement) {
              element.src = edit.value;
            }
            break;
          case 'alt':
            if (element instanceof HTMLImageElement) {
              element.alt = edit.value;
            }
            break;
          case 'href':
            if (element instanceof HTMLAnchorElement) {
              element.href = edit.value;
            }
            break;
          default:
            // Handle CSS properties
            if (edit.property.startsWith('style.')) {
              const cssProperty = edit.property.replace('style.', '');
              (element.style as any)[cssProperty] = edit.value;
            }
            break;
        }
      } catch (error) {
        console.error('Failed to apply edit:', edit, error);
      }
    });
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
