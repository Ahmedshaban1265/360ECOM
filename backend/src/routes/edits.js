import express from 'express';
import Template from '../models/Template.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/:templateId/publish-edits', requireAuth, async (req, res) => {
  const { templateId } = req.params;
  const { edits } = req.body;
  const doc = await Template.findOneAndUpdate(
    { templateId, kind: 'published' },
    { $set: { edits, updatedAtISO: new Date().toISOString() } },
    { new: true, upsert: true }
  );
  res.json({ success: true, edits: doc.edits });
});

router.post('/:templateId/draft-edits', requireAuth, async (req, res) => {
  const { templateId } = req.params;
  const { edits } = req.body;
  const doc = await Template.findOneAndUpdate(
    { templateId, kind: 'draft' },
    { $set: { edits, updatedAtISO: new Date().toISOString() } },
    { new: true, upsert: true }
  );
  res.json({ success: true, edits: doc.edits });
});

router.get('/:templateId/live', async (req, res) => {
  const { templateId } = req.params;
  const doc = await Template.findOne({ templateId, kind: 'published' });
  res.json(doc?.edits || []);
});

export default router;