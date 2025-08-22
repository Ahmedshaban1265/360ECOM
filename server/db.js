import Database from 'better-sqlite3'
import fse from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, 'storage', 'data.sqlite')
await fse.ensureDir(path.dirname(dbPath))

export const db = new Database(dbPath)

db.pragma('journal_mode = WAL')

db.exec(`
CREATE TABLE IF NOT EXISTS media (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	path TEXT UNIQUE NOT NULL,
	mime TEXT,
	size INTEGER,
	uploaded_at INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS templates (
	id TEXT PRIMARY KEY,
	json TEXT NOT NULL,
	updated_at INTEGER DEFAULT (strftime('%s','now'))
);
`)

export const MediaRepo = {
	list() {
		return db.prepare('SELECT id, path FROM media ORDER BY uploaded_at DESC').all()
	},
	upsert(filePath, mime, size) {
		return db.prepare('INSERT INTO media (path, mime, size) VALUES (?, ?, ?) ON CONFLICT(path) DO UPDATE SET mime=excluded.mime, size=excluded.size').run(filePath, mime, size)
	},
	remove(filePath) {
		return db.prepare('DELETE FROM media WHERE path = ?').run(filePath)
	}
}

export const TemplateRepo = {
	get(id) {
		const row = db.prepare('SELECT json FROM templates WHERE id = ?').get(id)
		return row ? JSON.parse(row.json) : null
	},
	save(id, json) {
		const str = JSON.stringify(json)
		db.prepare('INSERT INTO templates (id, json, updated_at) VALUES (?, ?, strftime(\'%s\',\'now\')) ON CONFLICT(id) DO UPDATE SET json=excluded.json, updated_at=strftime(\'%s\',\'now\')').run(id, str)
	}
}