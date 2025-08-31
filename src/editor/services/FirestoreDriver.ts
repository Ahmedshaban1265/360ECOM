import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { StorageDriver, TemplateDocument, ThemeTokens } from '../types';

/**
 * Firestore-backed implementation of StorageDriver
 * Collections:
 * - theme_drafts_v1/{templateId}
 * - theme_published_v1/{templateId}
 * - theme_global_v1/global
 */
export class FirestoreDriver implements StorageDriver {
  private static readonly DRAFTS = 'theme_drafts_v1';
  private static readonly PUBLISHED = 'theme_published_v1';
  private static readonly GLOBAL = 'theme_global_v1';
  private static readonly GLOBAL_DOC_ID = 'global';

  async getDraft(templateId: string): Promise<TemplateDocument | null> {
    try {
      const ref = doc(db, FirestoreDriver.DRAFTS, templateId);
      const snap = await getDoc(ref);
      return snap.exists() ? (snap.data() as TemplateDocument) : null;
    } catch (error) {
      console.error('FirestoreDriver.getDraft error', error);
      return null;
    }
  }

  async saveDraft(templateId: string, template: TemplateDocument): Promise<void> {
    try {
      const updated: TemplateDocument = {
        ...template,
        updatedAt: new Date().toISOString(),
        version: (template.version ?? 0) + 1
      };
      const ref = doc(db, FirestoreDriver.DRAFTS, templateId);
      await setDoc(ref, updated, { merge: false });
    } catch (error) {
      console.error('FirestoreDriver.saveDraft error', error);
      throw new Error('Failed to save draft to Firestore');
    }
  }

  async getPublished(templateId: string): Promise<TemplateDocument | null> {
    try {
      const ref = doc(db, FirestoreDriver.PUBLISHED, templateId);
      const snap = await getDoc(ref);
      return snap.exists() ? (snap.data() as TemplateDocument) : null;
    } catch (error) {
      console.error('FirestoreDriver.getPublished error', error);
      return null;
    }
  }

  async publish(templateId: string, template: TemplateDocument): Promise<void> {
    try {
      const published: TemplateDocument = {
        ...template,
        updatedAt: new Date().toISOString(),
        version: (template.version ?? 0) + 1
      };

      // Write to published
      const pubRef = doc(db, FirestoreDriver.PUBLISHED, templateId);
      await setDoc(pubRef, published, { merge: true });

      // Keep draft in sync with published
      const draftRef = doc(db, FirestoreDriver.DRAFTS, templateId);
      await setDoc(draftRef, published, { merge: true });
    } catch (error) {
      console.error('FirestoreDriver.publish error', error);
      throw new Error('Failed to publish template to Firestore');
    }
  }

  async getGlobalSettings(): Promise<ThemeTokens | null> {
    try {
      const ref = doc(db, FirestoreDriver.GLOBAL, FirestoreDriver.GLOBAL_DOC_ID);
      const snap = await getDoc(ref);
      return snap.exists() ? (snap.data() as ThemeTokens) : null;
    } catch (error) {
      console.error('FirestoreDriver.getGlobalSettings error', error);
      return null;
    }
  }

  async saveGlobalSettings(settings: ThemeTokens): Promise<void> {
    try {
      const ref = doc(db, FirestoreDriver.GLOBAL, FirestoreDriver.GLOBAL_DOC_ID);
      await setDoc(ref, settings, { merge: true });
    } catch (error) {
      console.error('FirestoreDriver.saveGlobalSettings error', error);
      throw new Error('Failed to save global settings to Firestore');
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
      console.error('FirestoreDriver.exportTemplate error', error);
      throw new Error('Failed to export template from Firestore');
    }
  }

  async importTemplate(data: string): Promise<TemplateDocument> {
    try {
      const parsed = JSON.parse(data);
      if (!parsed.template) {
        throw new Error('Invalid import data: missing template');
      }
      const template = parsed.template as TemplateDocument;
      if (!template.id || !template.sections || !Array.isArray(template.sections)) {
        throw new Error('Invalid template structure');
      }
      if (parsed.globalSettings) {
        await this.saveGlobalSettings(parsed.globalSettings as ThemeTokens);
      }
      return template;
    } catch (error) {
      console.error('FirestoreDriver.importTemplate error', error);
      throw new Error('Failed to import template: ' + (error as Error).message);
    }
  }
}

export default FirestoreDriver;

