import mongoose from 'mongoose';

const blockInstanceSchema = new mongoose.Schema({
  id: String,
  type: String,
  settings: {}
}, { _id: false });

const sectionInstanceSchema = new mongoose.Schema({
  id: String,
  type: String,
  settings: {},
  blocks: [blockInstanceSchema]
}, { _id: false });

const templateSchema = new mongoose.Schema({
  templateId: { type: String, index: true },
  kind: { type: String, enum: ['draft', 'published'], index: true },
  sections: [sectionInstanceSchema],
  themeTokens: {},
  locale: { type: String, default: 'en' },
  version: { type: Number, default: 1 },
  updatedAtIso: { type: String }
}, { timestamps: true });

templateSchema.index({ templateId: 1, kind: 1 }, { unique: true });

export default mongoose.model('Template', templateSchema);

