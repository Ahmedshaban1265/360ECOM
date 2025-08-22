import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fse from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { MediaRepo, TemplateRepo } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

const storageRoot = path.join(__dirname, 'storage')
const mediaRoot = path.join(storageRoot, 'media')
const templatesRoot = path.join(storageRoot, 'templates')

await fse.ensureDir(mediaRoot)
await fse.ensureDir(templatesRoot)

// Media endpoints
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } })

app.get('/api/media', async (req, res) => {
	try {
		const rows = MediaRepo.list()
		const items = rows.map(r => ({ path: r.path, url: `/media/${r.path}` }))
		res.json({ items })
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Failed to list media' })
	}
})

app.post('/api/media', upload.single('file'), async (req, res) => {
	try {
		if (!req.file) return res.status(400).json({ error: 'No file' })
		const folder = (req.body.folder || '').replace(/\.\.+/g, '')
		const name = req.body.name || `${Date.now()}-${Math.random().toString(36).slice(2)}-${req.file.originalname}`
		const destDir = path.join(mediaRoot, folder)
		await fse.ensureDir(destDir)
		const dest = path.join(destDir, name)
		await fse.writeFile(dest, req.file.buffer)
		const rel = path.relative(mediaRoot, dest)
		MediaRepo.upsert(rel, req.file.mimetype, req.file.size)
		res.json({ path: rel, url: `/media/${rel}` })
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Upload failed' })
	}
})

app.delete('/api/media/*', async (req, res) => {
	try {
		const rel = req.params[0]
		const abs = path.join(mediaRoot, rel)
		await fse.remove(abs)
		MediaRepo.remove(rel)
		res.json({ ok: true })
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Delete failed' })
	}
})

// Serve media statically
app.use('/media', express.static(mediaRoot))

// Template draft/publish endpoints
app.get('/api/templates/:id', async (req, res) => {
	try {
		const id = req.params.id
		const data = TemplateRepo.get(id)
		if (!data) return res.status(404).json({ error: 'Not found' })
		res.json(data)
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Failed to get template' })
	}
})

app.put('/api/templates/:id', async (req, res) => {
	try {
		const id = req.params.id
		TemplateRepo.save(id, req.body)
		res.json({ ok: true })
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Failed to save template' })
	}
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})