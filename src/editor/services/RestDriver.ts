import type { StorageDriver, TemplateDocument, ThemeTokens } from '../types';

export class RestDriver implements StorageDriver {
  private baseUrl: string;
  private getToken: () => string | null;

  constructor(baseUrl?: string, getToken?: () => string | null) {
    this.baseUrl = baseUrl || (import.meta.env.VITE_API_URL as string) || 'http://localhost:4000';
    this.getToken = getToken || (() => localStorage.getItem('authToken'));
  }

  private async request(path: string, options: RequestInit = {}) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers: { ...headers, ...(options.headers as any) } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.status === 204 ? null : res.json();
  }

  async getDraft(templateId: string): Promise<TemplateDocument | null> {
    return this.request(`/api/templates/${templateId}/draft`);
  }

  async saveDraft(templateId: string, template: TemplateDocument): Promise<void> {
    await this.request(`/api/templates/${templateId}/draft`, { method: 'PUT', body: JSON.stringify(template) });
  }

  async getPublished(templateId: string): Promise<TemplateDocument | null> {
    return this.request(`/api/templates/${templateId}/published`);
  }

  async publish(templateId: string, template: TemplateDocument): Promise<void> {
    await this.request(`/api/templates/${templateId}/publish`, { method: 'PUT', body: JSON.stringify(template) });
  }

  async getGlobalSettings(): Promise<ThemeTokens | null> {
    return this.request('/api/settings/global');
  }

  async saveGlobalSettings(settings: ThemeTokens): Promise<void> {
    await this.request('/api/settings/global', { method: 'PUT', body: JSON.stringify(settings) });
  }

  async exportTemplate(templateId: string): Promise<string> {
    const data = await Promise.all([
      this.getDraft(templateId),
      this.getGlobalSettings()
    ]);
    return JSON.stringify({ template: data[0], globalSettings: data[1], exportedAt: new Date().toISOString(), version: '1.0' }, null, 2);
  }

  async importTemplate(data: string) {
    const parsed = JSON.parse(data);
    return parsed.template as TemplateDocument;
  }
}

export default RestDriver;

