import { StorageDriver, TemplateDocument, ThemeTokens } from '../types';
import { LocalStorageDriver } from './LocalStorageDriver';
import { FirestoreDriver } from './FirestoreDriver';
import { HttpDriver } from './HttpDriver';

export class StorageService {
  private driver: StorageDriver;

  constructor(driver?: StorageDriver) {
    // Prefer HTTP backend if configured; else LocalStorage for development
    const hasApi = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_API_BASE;
    this.driver = driver || (hasApi ? new HttpDriver() : new LocalStorageDriver());
  }

  // Switch storage driver (e.g., from LocalStorage to HTTP/Firebase)
  setDriver(driver: StorageDriver): void {
    this.driver = driver;
  }

  getDriver(): StorageDriver {
    return this.driver;
  }

  // Template operations
  async getDraft(templateId: string): Promise<TemplateDocument | null> {
    return this.driver.getDraft(templateId);
  }

  async saveDraft(templateId: string, template: TemplateDocument): Promise<void> {
    return this.driver.saveDraft(templateId, template);
  }

  async getPublished(templateId: string): Promise<TemplateDocument | null> {
    return this.driver.getPublished(templateId);
  }

  async publish(templateId: string, template: TemplateDocument): Promise<void> {
    return this.driver.publish(templateId, template);
  }

  // Global settings
  async getGlobalSettings(): Promise<ThemeTokens | null> {
    return this.driver.getGlobalSettings();
  }

  async saveGlobalSettings(settings: ThemeTokens): Promise<void> {
    return this.driver.saveGlobalSettings(settings);
  }

  // Import/Export
  async exportTemplate(templateId: string): Promise<string> {
    return this.driver.exportTemplate(templateId);
  }

  async importTemplate(data: string): Promise<TemplateDocument> {
    return this.driver.importTemplate(data);
  }

  // Template management helpers
  async resetToPublished(templateId: string): Promise<TemplateDocument | null> {
    const published = await this.getPublished(templateId);
    if (published) {
      await this.saveDraft(templateId, published);
    }
    return published;
  }

  async hasUnsavedChanges(templateId: string): Promise<boolean> {
    const [draft, published] = await Promise.all([
      this.getDraft(templateId),
      this.getPublished(templateId)
    ]);

    if (!draft && !published) return false;
    if (!draft || !published) return true;

    // Compare versions and content
    return (
      draft.version !== published.version ||
      JSON.stringify(draft.sections) !== JSON.stringify(published.sections) ||
      JSON.stringify(draft.themeTokens) !== JSON.stringify(published.themeTokens)
    );
  }

  async getTemplateStatus(templateId: string): Promise<{
    hasDraft: boolean;
    hasPublished: boolean;
    hasUnsavedChanges: boolean;
    lastDraftUpdate?: string;
    lastPublishedUpdate?: string;
  }> {
    const [draft, published] = await Promise.all([
      this.getDraft(templateId),
      this.getPublished(templateId)
    ]);

    const hasUnsavedChanges = await this.hasUnsavedChanges(templateId);

    return {
      hasDraft: !!draft,
      hasPublished: !!published,
      hasUnsavedChanges,
      lastDraftUpdate: draft?.updatedAt,
      lastPublishedUpdate: published?.updatedAt
    };
  }
}

// Singleton instance
export const storageService = new StorageService();
