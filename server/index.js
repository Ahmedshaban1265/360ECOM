import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fse from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

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
		const items = []
		const walk = async (dir, prefix = '') => {
			const entries = await fse.readdir(dir, { withFileTypes: true })
			for (const ent of entries) {
				const rel = path.join(prefix, ent.name)
				const abs = path.join(dir, ent.name)
				if (ent.isDirectory()) {
					await walk(abs, rel)
				} else {
					items.push({ path: rel, url: `/media/${rel}` })
				}
			}
		}
		await walk(mediaRoot)
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
		const p = path.join(templatesRoot, `${id}.json`)
		if (!(await fse.pathExists(p))) return res.status(404).json({ error: 'Not found' })
		const data = await fse.readJson(p)
		res.json(data)
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Failed to get template' })
	}
})

app.put('/api/templates/:id', async (req, res) => {
	try {
		const id = req.params.id
		const p = path.join(templatesRoot, `${id}.json`)
		await fse.writeJson(p, req.body, { spaces: 2 })
		res.json({ ok: true })
	} catch (e) {
		console.error(e)
		res.status(500).json({ error: 'Failed to save template' })
	}
})

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})