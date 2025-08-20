import { editingService } from './EditingService';

export interface EditableElement {
  element: HTMLElement;
  type: 'text' | 'image' | 'link' | 'container' | 'button' | 'input' | 'other';
  id: string;
  pageId: string;
  tagName: string;
  className: string;
  textContent?: string;
  src?: string;
  alt?: string;
  href?: string;
  placeholder?: string;
  value?: string;
  computedStyles: CSSStyleDeclaration;
}

export class ElementDiscoveryService {
  private static instance: ElementDiscoveryService;
  private elementRegistry = new Map<string, EditableElement>();
  private pageId: string = '';

  static getInstance(): ElementDiscoveryService {
    if (!ElementDiscoveryService.instance) {
      ElementDiscoveryService.instance = new ElementDiscoveryService();
    }
    return ElementDiscoveryService.instance;
  }

  setPageId(pageId: string) {
    this.pageId = pageId;
  }

  // Discover all editable elements on the current page
  discoverElements(): EditableElement[] {
    const elements: EditableElement[] = [];
    
    console.log('ElementDiscoveryService: Starting element discovery...');
    
    // Look for elements in the preview canvas, not the main editor document
    const previewCanvas = document.querySelector('.live-website-renderer');
    if (!previewCanvas) {
      console.warn('ElementDiscoveryService: No preview canvas found, looking in main document');
    }
    
    const searchContext = previewCanvas || document;
    console.log('ElementDiscoveryService: Searching in context:', searchContext);
    
    // Get all elements that could be editable
    const selectors = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'a', 'img', 'button', 'input', 'textarea',
      'label', 'li', 'td', 'th', 'caption', 'figcaption', 'blockquote', 'cite', 'em', 'strong', 'small'
    ];

    selectors.forEach(selector => {
      const foundElements = searchContext.querySelectorAll(selector);
      console.log(`ElementDiscoveryService: Found ${foundElements.length} elements with selector '${selector}'`);
      
      foundElements.forEach((element, index) => {
        if (element instanceof HTMLElement) {
          const editableElement = this.createEditableElement(element, index);
          if (editableElement) {
            elements.push(editableElement);
            this.elementRegistry.set(editableElement.id, editableElement);
          }
        }
      });
    });

    console.log(`ElementDiscoveryService: Total editable elements discovered: ${elements.length}`);
    return elements;
  }

  private createEditableElement(element: HTMLElement, index: number): EditableElement | null {
    // Skip elements that are part of the editor UI
    if (this.isEditorElement(element)) {
      return null;
    }

    const tagName = element.tagName.toLowerCase();
    const type = this.getElementType(tagName);
    const id = this.generateElementId(element, index);
    
    // Get computed styles
    const computedStyles = window.getComputedStyle(element);
    
    const editableElement: EditableElement = {
      element,
      type,
      id,
      pageId: this.pageId,
      tagName,
      className: element.className || '',
      textContent: element.textContent?.trim(),
      computedStyles,
      ...this.getElementSpecificData(element, tagName)
    };

    // Attach lightweight editor metadata to the DOM element for downstream editors
    try {
      (element as any)._editorData = {
        id,
        type,
        pageId: this.pageId
      };
    } catch {}

    return editableElement;
  }

  private getElementType(tagName: string): EditableElement['type'] {
    switch (tagName) {
      case 'img':
        return 'image';
      case 'a':
        return 'link';
      case 'button':
      case 'input':
      case 'textarea':
        return tagName as any;
      case 'div':
      case 'section':
      case 'article':
      case 'main':
      case 'aside':
      case 'header':
      case 'footer':
      case 'nav':
        return 'container';
      default:
        return 'text';
    }
  }

  private getElementSpecificData(element: HTMLElement, tagName: string) {
    const data: any = {};

    switch (tagName) {
      case 'img':
        const img = element as HTMLImageElement;
        data.src = img.src;
        data.alt = img.alt;
        break;
      case 'a':
        const link = element as HTMLAnchorElement;
        data.href = link.href;
        break;
      case 'input':
      case 'textarea':
        const input = element as HTMLInputElement | HTMLTextAreaElement;
        data.placeholder = input.placeholder;
        data.value = input.value;
        break;
    }

    return data;
  }

  private generateElementId(element: HTMLElement, index: number): string {
    // Try to use existing ID
    if (element.id) {
      return element.id;
    }

    // Try to use data-edit-id attribute
    if (element.dataset.editId) {
      return element.dataset.editId;
    }

    // Generate a new ID based on tag name and index
    const tagName = element.tagName.toLowerCase();
    const className = element.className ? `.${element.className.split(' ')[0]}` : '';
    return `${tagName}${className}-${index}`;
  }

  private isEditorElement(element: HTMLElement): boolean {
    // Check if element is part of the editor UI
    const editorSelectors = [
      '[data-editor]',
      '.editor-',
      '#editor',
      '[class*="editor"]',
      '[id*="editor"]'
    ];

    return editorSelectors.some(selector => {
      try {
        return element.matches(selector) || element.closest(selector);
      } catch {
        return false;
      }
    });
  }

  // Get element by ID
  getElement(elementId: string): EditableElement | null {
    return this.elementRegistry.get(elementId) || null;
  }

  // Get element by DOM element
  getElementByElement(element: HTMLElement): EditableElement | null {
    // Find the element in our registry by comparing DOM elements
    for (const [id, editableElement] of this.elementRegistry) {
      if (editableElement.element === element) {
        return editableElement;
      }
    }
    return null;
  }

  // Get all elements
  getAllElements(): EditableElement[] {
    return Array.from(this.elementRegistry.values());
  }

  // Update element data
  updateElement(id: string, updates: Partial<EditableElement>): void {
    const element = this.elementRegistry.get(id);
    if (element) {
      Object.assign(element, updates);
      this.elementRegistry.set(id, element);
    }
  }

  // Clear registry
  clearRegistry(): void {
    this.elementRegistry.clear();
  }

  // Make elements clickable for editing
  enableElementEditing(): void {
    const elements = this.getAllElements();
    console.log(`ElementDiscoveryService: Enabling editing for ${elements.length} elements`);
    
    elements.forEach(editableElement => {
      const { element } = editableElement;
      
      // Add click handler
      element.addEventListener('click', (e) => {
        console.log('ElementDiscoveryService: Element clicked:', editableElement);
        e.preventDefault();
        e.stopPropagation();
        this.onElementClick(editableElement);
      });

      // Add visual indicators
      element.style.cursor = 'pointer';
      element.setAttribute('data-editable', 'true');
      
      // Add hover effect
      element.addEventListener('mouseenter', () => {
        element.style.outline = '2px solid #3b82f6';
        element.style.outlineOffset = '2px';
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.outline = '';
        element.style.outlineOffset = '';
      });
    });
  }

  // Disable element editing
  disableElementEditing(): void {
    const elements = this.getAllElements();
    console.log(`ElementDiscoveryService: Disabling editing for ${elements.length} elements`);
    
    elements.forEach(editableElement => {
      const { element } = editableElement;
      
      // Remove event listeners (this is a simplified approach)
      element.style.cursor = '';
      element.removeAttribute('data-editable');
      element.style.outline = '';
      element.style.outlineOffset = '';
    });
  }

  private onElementClick(editableElement: EditableElement): void {
    console.log('ElementDiscoveryService: Dispatching elementEditRequest event for:', editableElement);
    
    // Dispatch custom event for the editor to handle
    const event = new CustomEvent('elementEditRequest', {
      detail: { editableElement },
      bubbles: true
    });
    
    document.dispatchEvent(event);
    console.log('ElementDiscoveryService: elementEditRequest event dispatched');
  }

  // Apply edits to elements
  applyElementEdit(elementId: string, property: string, value: any): void {
    const editableElement = this.getElement(elementId);
    if (!editableElement) return;

    const { element } = editableElement;

    try {
      switch (property) {
        case 'textContent':
          element.textContent = value;
          break;
        case 'src':
          if (element instanceof HTMLImageElement) {
            element.src = value;
          }
          break;
        case 'alt':
          if (element instanceof HTMLImageElement) {
            element.alt = value;
          }
          break;
        case 'href':
          if (element instanceof HTMLAnchorElement) {
            element.href = value;
          }
          break;
        case 'placeholder':
          if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            element.placeholder = value;
          }
          break;
        case 'value':
          if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            element.value = value;
          }
          break;
        default:
          // Handle style properties
          if (property.startsWith('style.')) {
            const styleProperty = property.replace('style.', '');
            (element.style as any)[styleProperty] = value;
          } else {
            // Handle other properties
            (element as any)[property] = value;
          }
      }

      // Save the edit
      editingService.saveElementEdit(
        editableElement.pageId,
        editableElement.id,
        editableElement.type,
        property,
        value,
        ''
      );

    } catch (error) {
      console.error('Failed to apply element edit:', error);
    }
  }

  // Get computed styles for an element
  getElementStyles(elementId: string): CSSStyleDeclaration | null {
    const editableElement = this.getElement(elementId);
    return editableElement ? editableElement.computedStyles : null;
  }

  // Refresh element data (useful after DOM changes)
  refreshElement(elementId: string): void {
    const editableElement = this.getElement(elementId);
    if (!editableElement) return;

    const { element } = editableElement;
    
    // Update computed styles
    editableElement.computedStyles = window.getComputedStyle(element);
    
    // Update element-specific data
    const tagName = element.tagName.toLowerCase();
    Object.assign(editableElement, this.getElementSpecificData(element, tagName));
    
    // Update text content
    editableElement.textContent = element.textContent?.trim();
    
    this.elementRegistry.set(elementId, editableElement);
  }
}

export const elementDiscoveryService = ElementDiscoveryService.getInstance();
