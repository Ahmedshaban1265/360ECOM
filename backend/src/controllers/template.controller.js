import Template from '../models/Template.js';

export const getDraft = async (req, res) => {
  const { id } = req.params;
  const doc = await Template.findOne({ templateId: id, kind: 'draft' });
  return res.json(doc || null);
};

export const saveDraft = async (req, res) => {
  const { id } = req.params;
  const template = req.body;
  const updated = {
    ...template,
    templateId: id,
    kind: 'draft',
    updatedAtIso: new Date().toISOString(),
    version: (template?.version || 0) + 1
  };
  const doc = await Template.findOneAndUpdate(
    { templateId: id, kind: 'draft' },
    updated,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return res.json(doc);
};

export const getPublished = async (req, res) => {
  const { id } = req.params;
  const doc = await Template.findOne({ templateId: id, kind: 'published' });
  return res.json(doc || null);
};

export const publish = async (req, res) => {
  const { id } = req.params;
  const template = req.body;
  const published = {
    ...template,
    templateId: id,
    kind: 'published',
    updatedAtIso: new Date().toISOString(),
    version: (template?.version || 0) + 1
  };
  const pub = await Template.findOneAndUpdate(
    { templateId: id, kind: 'published' },
    published,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  await Template.findOneAndUpdate(
    { templateId: id, kind: 'draft' },
    published,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return res.json(pub);
};

