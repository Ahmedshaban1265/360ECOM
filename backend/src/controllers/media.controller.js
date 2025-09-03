import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(process.cwd(), 'backend', 'uploads');
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

export const upload = multer({ storage });

export const listMedia = async (req, res) => {
  const dir = path.join(process.cwd(), 'backend', 'uploads');
  fs.mkdirSync(dir, { recursive: true });
  const files = fs.readdirSync(dir).map(name => ({ name, url: `/uploads/${name}` }));
  res.json(files);
};

export const deleteMedia = async (req, res) => {
  const dir = path.join(process.cwd(), 'backend', 'uploads');
  const target = path.join(dir, req.params.name);
  if (fs.existsSync(target)) fs.unlinkSync(target);
  res.json({ deleted: true });
};

