// Core Types for Theme Editor
export type Locale = 'en' | 'ar';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';
export type SidebarTab = 'sections' | 'properties' | 'templates' | 'pages';

// Theme Tokens
export interface ThemeTokens {
  colors: Record<string, string>;   // e.g. { primary: "#...", background: "#..." }
  typography: {
    bodyFont?: string;
    headingFont?: string;
    arabicFont?: string;   // e.g. 'Cairo'
  };
  spacingScale?: number[]; // e.g. [0,4,8,12,16,...]
  radius?: string;         // e.g. '12px'
  darkMode?: boolean;
  rtl?: boolean;           // flips layout & text-direction
}

// Field Types for Schema-driven Settings
export interface FieldBase {
  id: string;
  label: string;
  type:
    | 'text' | 'richtext' | 'select' | 'number' | 'range'
    | 'color' | 'image' | 'url' | 'toggle' | 'list' | 'repeater';
  default?: any;
  required?: boolean;
  description?: string;
  options?: { label: string; value: string | number }[];
  min?: number; 
  max?: number; 
  step?: number;
  placeholder?: string;
  validation?: {
    pattern?: string;
    message?: string;
  };
}

// Localized Content Support
export interface LocalizedContent {
  en: string;
  ar: string;
}

// Block Schema & Instance
export interface BlockSchema {
  type: string;                 // e.g. 'feature_item'
  label: string;
  settings: FieldBase[];
}

export interface BlockInstance {
  id: string;
  type: string; // matches BlockSchema.type
  settings: Record<string, any>;
}

// Section Schema & Instance  
export interface SectionSchema {
  type: string;                 // e.g. 'hero', 'rich-text', 'cards'
  label: string;
  settings: FieldBase[];
  blocks?: BlockSchema[];
  maxBlocks?: number;
  presets?: { name: string; settings?: Record<string, any> }[];
}

export interface SectionInstance {
  id: string;
  type: string; // matches SectionSchema.type
  settings: Record<string, any>;
  blocks?: BlockInstance[];
}

// Template Document
export interface TemplateDocument {
  id: string;                    // 'home', 'product', ...
  sections: SectionInstance[];
  themeTokens: ThemeTokens;
  locale: Locale;                // 'en' or 'ar'
  version: number;               // increment on save
  updatedAt: string;             // ISO
}

// Editor State
export interface EditorState {
  selectedTemplate: string | null;
  selectedSection: string | null;
  selectedBlock: string | null;
  selectedElement: HTMLElement | null;
  deviceType: DeviceType;
  isDarkMode: boolean;
  isRTL: boolean;
  locale: Locale;
  historyIndex: number;
  history: TemplateDocument[];
  isDirty: boolean;
  lastSaved?: string;
  currentTemplate: TemplateDocument | null;

  // Sidebar state
  isSidebarOpen: boolean;
  activeTab: SidebarTab | null;
}

// Storage Service Interface
export interface StorageDriver {
  getDraft(templateId: string): Promise<TemplateDocument | null>;
  saveDraft(templateId: string, template: TemplateDocument): Promise<void>;
  getPublished(templateId: string): Promise<TemplateDocument | null>;
  publish(templateId: string, template: TemplateDocument): Promise<void>;
  getGlobalSettings(): Promise<ThemeTokens | null>;
  saveGlobalSettings(settings: ThemeTokens): Promise<void>;
  exportTemplate(templateId: string): Promise<string>;
  importTemplate(data: string): Promise<TemplateDocument>;
}

// Template Types
export interface TemplateInfo {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  route?: string;
}

// Validation Result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Undo/Redo History Entry
export interface HistoryEntry {
  template: TemplateDocument;
  action: string;
  timestamp: number;
}

// Device Preset
export interface DevicePreset {
  type: DeviceType;
  name: string;
  width: number;
  height?: number;
  icon: string;
}

// Theme Engine Context
export interface ThemeEngineContext {
  tokens: ThemeTokens;
  locale: Locale;
  deviceType: DeviceType;
  renderMode: 'preview' | 'edit';
}
