import { StorageDriver, TemplateDocument, ThemeTokens } from '../types';

export class LocalStorageDriver implements StorageDriver {
  private static readonly DRAFT_PREFIX = 'theme_draft_v1:';
  private static readonly PUBLISHED_PREFIX = 'theme_published_v1:';
  private static readonly GLOBAL_SETTINGS_KEY = 'theme_global_v1';
  private static readonly UI_STATE_KEY = 'theme_ui_state_v1';

  async getDraft(templateId: string): Promise<TemplateDocument | null> {
    try {
      const data = localStorage.getItem(`${LocalStorageDriver.DRAFT_PREFIX}${templateId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting draft:', error);
      return null;
    }
  }

  async saveDraft(templateId: string, template: TemplateDocument): Promise<void> {
    try {
      const updatedTemplate = {
        ...template,
        updatedAt: new Date().toISOString(),
        version: template.version + 1
      };
      localStorage.setItem(
        `${LocalStorageDriver.DRAFT_PREFIX}${templateId}`, 
        JSON.stringify(updatedTemplate)
      );
    } catch (error) {
      console.error('Error saving draft:', error);
      throw new Error('Failed to save draft to localStorage');
    }
  }

  async getPublished(templateId: string): Promise<TemplateDocument | null> {
    try {
      const data = localStorage.getItem(`${LocalStorageDriver.PUBLISHED_PREFIX}${templateId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting published template:', error);
      return null;
    }
  }

  async publish(templateId: string, template: TemplateDocument): Promise<void> {
    try {
      const publishedTemplate = {
        ...template,
        updatedAt: new Date().toISOString(),
        version: template.version + 1
      };
      
      // Save to published
      localStorage.setItem(
        `${LocalStorageDriver.PUBLISHED_PREFIX}${templateId}`, 
        JSON.stringify(publishedTemplate)
      );
      
      // Update draft to match published
      localStorage.setItem(
        `${LocalStorageDriver.DRAFT_PREFIX}${templateId}`, 
        JSON.stringify(publishedTemplate)
      );
    } catch (error) {
      console.error('Error publishing template:', error);
      throw new Error('Failed to publish template to localStorage');
    }
  }

  async getGlobalSettings(): Promise<ThemeTokens | null> {
    try {
      const data = localStorage.getItem(LocalStorageDriver.GLOBAL_SETTINGS_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting global settings:', error);
      return null;
    }
  }

  async saveGlobalSettings(settings: ThemeTokens): Promise<void> {
    try {
      localStorage.setItem(LocalStorageDriver.GLOBAL_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving global settings:', error);
      throw new Error('Failed to save global settings to localStorage');
    }
  }

  async exportTemplate(templateId: string): Promise<string> {
    try {
      const draft = await this.getDraft(templateId);
      const globalSettings = await this.getGlobalSettings();
      
      const exportData = {
        template: draft,
        globalSettings,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting template:', error);
      throw new Error('Failed to export template');
    }
  }

  async importTemplate(data: string): Promise<TemplateDocument> {
    try {
      const parsed = JSON.parse(data);
      
      if (!parsed.template) {
        throw new Error('Invalid import data: missing template');
      }
      
      // Validate template structure
      const template = parsed.template as TemplateDocument;
      if (!template.id || !template.sections || !Array.isArray(template.sections)) {
        throw new Error('Invalid template structure');
      }
      
      // Save global settings if provided
      if (parsed.globalSettings) {
        await this.saveGlobalSettings(parsed.globalSettings);
      }
      
      return template;
    } catch (error) {
      console.error('Error importing template:', error);
      throw new Error('Failed to import template: ' + (error as Error).message);
    }
  }

  // Utility methods for managing localStorage
  clearDrafts(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(LocalStorageDriver.DRAFT_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  clearPublished(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(LocalStorageDriver.PUBLISHED_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  getAllTemplateIds(): string[] {
    const keys = Object.keys(localStorage);
    const templateIds = new Set<string>();
    
    keys.forEach(key => {
      if (key.startsWith(LocalStorageDriver.DRAFT_PREFIX)) {
        templateIds.add(key.replace(LocalStorageDriver.DRAFT_PREFIX, ''));
      } else if (key.startsWith(LocalStorageDriver.PUBLISHED_PREFIX)) {
        templateIds.add(key.replace(LocalStorageDriver.PUBLISHED_PREFIX, ''));
      }
    });
    
    return Array.from(templateIds);
  }

  getStorageUsage(): { used: number; available: number } {
    let used = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('theme_')) {
        used += localStorage.getItem(key)?.length || 0;
      }
    });
    
    // Rough estimate of localStorage limit (usually 5-10MB)
    const available = 5 * 1024 * 1024; // 5MB
    
    return { used, available };
  }
}
