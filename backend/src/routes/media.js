import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRoot = path.join(__dirname, '../../', process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadRoot);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname) || '.bin';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  const file = req.file;
  const publicUrl = `/uploads/${file.filename}`;
  res.json({ url: publicUrl, path: publicUrl, name: file.originalname, size: file.size });
});

router.get('/list', requireAuth, (_req, res) => {
  const files = fs.readdirSync(uploadRoot)
    .filter((f) => /\.(png|jpe?g|gif|webp|svg)$/i.test(f))
    .map((f) => ({
      url: `/uploads/${f}`,
      path: `/uploads/${f}`,
      name: f,
    }));
  res.json(files);
});

router.delete('/', requireAuth, (req, res) => {
  const { path: filePath } = req.body || {};
  if (!filePath) return res.status(400).json({ message: 'path required' });
  const full = path.join(__dirname, '../../', filePath.replace(/^\/+/, ''));
  if (fs.existsSync(full)) fs.unlinkSync(full);
  res.json({ success: true });
});

export default router;