import { TemplateDocument, TemplateInfo, ThemeTokens } from '../types';
import { extractPageContent, getRealPagesList } from '../utils/pageExtractor';

export const DEFAULT_THEME_TOKENS: ThemeTokens = {
  colors: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    foreground: '#0f172a',
    muted: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  typography: {
    bodyFont: 'Inter, system-ui, sans-serif',
    headingFont: 'Inter, system-ui, sans-serif',
    arabicFont: 'Cairo, system-ui, sans-serif'
  },
  spacingScale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
  radius: '8px',
  darkMode: false,
  rtl: false
};

// Use real pages list from pageExtractor
export const TEMPLATE_LIST: TemplateInfo[] = getRealPagesList();

// Generate templates from real page content
function generateDefaultTemplates(): Record<string, TemplateDocument> {
  const templates: Record<string, TemplateDocument> = {};
  const realPages = getRealPagesList();

  for (const page of realPages) {
    templates[page.id] = extractPageContent(null, page.id);
  }

  return templates;
}

export const DEFAULT_TEMPLATES: Record<string, TemplateDocument> = generateDefaultTemplates();

// Initialize default templates in localStorage if they don't exist
export async function initializeDefaultTemplates(): Promise<void> {
  const { storageService } = await import('../services/StorageService');

  // Generate fresh templates from real page content
  const templates = generateDefaultTemplates();

  for (const [templateId, template] of Object.entries(templates)) {
    const existingDraft = await storageService.getDraft(templateId);
    const existingPublished = await storageService.getPublished(templateId);

    if (!existingDraft && !existingPublished) {
      await storageService.saveDraft(templateId, template);
      await storageService.publish(templateId, template);
    }
  }

  // Initialize global settings if they don't exist
  const existingGlobal = await storageService.getGlobalSettings();
  if (!existingGlobal) {
    await storageService.saveGlobalSettings(DEFAULT_THEME_TOKENS);
  }
}
