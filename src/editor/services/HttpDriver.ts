import type { StorageDriver, TemplateDocument, ThemeTokens } from '../types'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api'

async function json<T>(res: Response): Promise<T> {
	if (!res.ok) throw new Error(await res.text())
	return res.json() as Promise<T>
}

export class HttpDriver implements StorageDriver {
	async getDraft(templateId: string): Promise<TemplateDocument | null> {
		try {
			return await fetch(`${API_BASE}/templates/${templateId}`).then(r => r.ok ? r.json() : null)
		} catch {
			return null
		}
	}

	async saveDraft(templateId: string, template: TemplateDocument): Promise<void> {
		await fetch(`${API_BASE}/templates/${templateId}`, {
			method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(template)
		}).then(json)
	}

	async getPublished(_templateId: string): Promise<TemplateDocument | null> {
		// For now we use single draft file per template; extend with /published later
		return this.getDraft(_templateId)
	}

	async publish(templateId: string, template: TemplateDocument): Promise<void> {
		// For now, same as saveDraft; extend later with dedicated endpoint
		return this.saveDraft(templateId, template)
	}

	async getGlobalSettings(): Promise<ThemeTokens | null> {
		try {
			return await fetch(`${API_BASE}/templates/__global`).then(r => r.ok ? r.json() : null)
		} catch {
			return null
		}
	}

	async saveGlobalSettings(settings: ThemeTokens): Promise<void> {
		await fetch(`${API_BASE}/templates/__global`, {
			method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings)
		}).then(json)
	}

	async exportTemplate(templateId: string): Promise<string> {
		const tpl = await this.getDraft(templateId)
		return JSON.stringify({ template: tpl, exportedAt: new Date().toISOString(), version: '1.0' }, null, 2)
	}

	async importTemplate(data: string): Promise<TemplateDocument> {
		const parsed = JSON.parse(data)
		return parsed.template as TemplateDocument
	}
}

export default HttpDriver