import express from 'express';
import Template from '../models/Template.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

function toTemplateDoc(doc) {
  return {
    id: doc.templateId,
    sections: doc.sections,
    themeTokens: doc.themeTokens,
    locale: doc.locale,
    version: doc.version,
    updatedAt: doc.updatedAtISO || new Date(doc.updatedAt).toISOString(),
    edits: doc.edits || [],
  };
}

router.get('/:templateId/draft', requireAuth, async (req, res) => {
  const { templateId } = req.params;
  const doc = await Template.findOne({ templateId, kind: 'draft' });
  if (!doc) return res.json(null);
  res.json(toTemplateDoc(doc));
});

router.post('/:templateId/draft', requireAuth, async (req, res) => {
  const { templateId } = req.params;
  const incoming = req.body;
  const updatedAt = new Date().toISOString();
  const doc = await Template.findOneAndUpdate(
    { templateId, kind: 'draft' },
    {
      templateId,
      kind: 'draft',
      sections: incoming.sections,
      themeTokens: incoming.themeTokens,
      locale: incoming.locale || 'en',
      version: (incoming.version ?? 0) + 1,
      updatedAtISO: updatedAt,
    },
    { upsert: true, new: true }
  );
  res.json(toTemplateDoc(doc));
});

router.get('/:templateId/published', async (req, res) => {
  const { templateId } = req.params;
  const doc = await Template.findOne({ templateId, kind: 'published' });
  if (!doc) return res.json(null);
  res.json(toTemplateDoc(doc));
});

router.post('/:templateId/publish', requireAuth, async (req, res) => {
  const { templateId } = req.params;
  const incoming = req.body;
  const updatedAt = new Date().toISOString();
  const pub = await Template.findOneAndUpdate(
    { templateId, kind: 'published' },
    {
      templateId,
      kind: 'published',
      sections: incoming.sections,
      themeTokens: incoming.themeTokens,
      locale: incoming.locale || 'en',
      version: (incoming.version ?? 0) + 1,
      updatedAtISO: updatedAt,
    },
    { upsert: true, new: true }
  );
  // Keep draft in sync
  await Template.findOneAndUpdate(
    { templateId, kind: 'draft' },
    {
      templateId,
      kind: 'draft',
      sections: incoming.sections,
      themeTokens: incoming.themeTokens,
      locale: incoming.locale || 'en',
      version: (incoming.version ?? 0) + 1,
      updatedAtISO: updatedAt,
    },
    { upsert: true, new: true }
  );
  res.json(toTemplateDoc(pub));
});

export default router;