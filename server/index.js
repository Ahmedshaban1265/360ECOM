import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fse from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import { MediaRepo, TemplateRepo, UserRepo } from './db.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

const storageRoot = path.join(__dirname, 'storage')
const mediaRoot = path.join(storageRoot, 'media')
const templatesRoot = path.join(storageRoot, 'templates')

await fse.ensureDir(mediaRoot)
await fse.ensureDir(templatesRoot)

// Helper: hash password (bcrypt alternative w/ crypto pbkdf2 for simplicity here)
function hashPassword(pw) {
	const salt = crypto.randomBytes(16).toString('hex')
	const hash = crypto.pbkdf2Sync(pw, salt, 100000, 32, 'sha256').toString('hex')
	return `${salt}:${hash}`
}
function verifyPassword(pw, stored) {
	const [salt, hash] = stored.split(':')
	const check = crypto.pbkdf2Sync(pw, salt, 100000, 32, 'sha256').toString('hex')
	return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'))
}

function setAuthCookie(res, payload) {
	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
	res.cookie('session', token, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7*24*60*60*1000 })
}
function clearAuthCookie(res) {
	res.clearCookie('session')
}
function authMiddleware(req, res, next) {
	const token = req.cookies.session
	if (!token) return res.status(401).json({ error: 'Unauthorized' })
	try {
		const user = jwt.verify(token, JWT_SECRET)
		req.user = user
		next()
	} catch {
		return res.status(401).json({ error: 'Unauthorized' })
	}
}

// Auth routes
app.post('/api/auth/register', async (req, res) => {
	const { username, password } = req.body
	if (!username || !password) return res.status(400).json({ error: 'Missing fields' })
	const existing = UserRepo.findByUsername(username)
	if (existing) return res.status(409).json({ error: 'User exists' })
	const ph = hashPassword(password)
	UserRepo.create(username, ph)
	setAuthCookie(res, { username, role: 'admin' })
	res.json({ ok: true, user: { username } })
})

app.post('/api/auth/login', async (req, res) => {
	const { username, password } = req.body
	const u = UserRepo.findByUsername(username)
	if (!u) return res.status(401).json({ error: 'Invalid credentials' })
	if (!verifyPassword(password, u.password_hash)) return res.status(401).json({ error: 'Invalid credentials' })
	setAuthCookie(res, { username: u.username, role: u.role })
	res.json({ ok: true, user: { username: u.username, role: u.role } })
})

app.post('/api/auth/logout', (req, res) => {
	clearAuthCookie(res)
	res.json({ ok: true })
})

app.get('/api/auth/me', (req, res) => {
	try {
		const token = req.cookies.session
		if (!token) return res.status(200).json({ user: null })
		const user = jwt.verify(token, JWT_SECRET)
		res.json({ user })
	} catch {
		res.json({ user: null })
	}
})

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
app.post('/api/media', authMiddleware, upload.single('file'), async (req, res) => {
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
app.delete('/api/media/*', authMiddleware, async (req, res) => {
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
app.use('/media', express.static(mediaRoot))

// Templates
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
app.put('/api/templates/:id', authMiddleware, async (req, res) => {
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