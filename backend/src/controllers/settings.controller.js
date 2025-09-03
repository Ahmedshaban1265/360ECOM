import GlobalSettings from '../models/GlobalSettings.js';

export const getGlobal = async (req, res) => {
  const doc = await GlobalSettings.findOne({ docId: 'global' });
  return res.json(doc ? doc.tokens : null);
};

export const saveGlobal = async (req, res) => {
  const tokens = req.body;
  const doc = await GlobalSettings.findOneAndUpdate(
    { docId: 'global' },
    { tokens },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return res.json(doc.tokens);
};

