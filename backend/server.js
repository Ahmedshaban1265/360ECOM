import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mongoose from 'mongoose';

import authRoutes from './src/routes/auth.js';
import templateRoutes from './src/routes/templates.js';
import globalRoutes from './src/routes/global.js';
import editsRoutes from './src/routes/edits.js';
import mediaRoutes from './src/routes/media.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Static serving of uploaded media
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(uploadDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/global', globalRoutes);
app.use('/api/edits', editsRoutes);
app.use('/api/media', mediaRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 4000;

async function start() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not set. Create backend/.env based on .env.example');
    }
    await mongoose.connect(uri);
    console.log('MongoDB connected');
    app.listen(port, () => console.log(`API running on :${port}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();