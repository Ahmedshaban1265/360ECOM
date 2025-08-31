import express from 'express';
import GlobalSettings from '../models/GlobalSettings.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  const doc = await GlobalSettings.findOne({ key: 'global' });
  res.json(doc?.settings || null);
});

router.post('/', requireAuth, async (req, res) => {
  const settings = req.body;
  const doc = await GlobalSettings.findOneAndUpdate(
    { key: 'global' },
    { key: 'global', settings },
    { upsert: true, new: true }
  );
  res.json(doc.settings);
});

export default router;