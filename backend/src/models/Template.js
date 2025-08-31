import mongoose from 'mongoose';

const sectionInstanceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
    blocks: [
      new mongoose.Schema(
        {
          id: { type: String, required: true },
          type: { type: String, required: true },
          settings: { type: mongoose.Schema.Types.Mixed, default: {} },
        },
        { _id: false }
      ),
    ],
  },
  { _id: false }
);

const templateSchema = new mongoose.Schema(
  {
    templateId: { type: String, required: true, index: true },
    kind: { type: String, enum: ['draft', 'published'], required: true, index: true },
    sections: [sectionInstanceSchema],
    themeTokens: { type: mongoose.Schema.Types.Mixed, default: {} },
    locale: { type: String, default: 'en' },
    version: { type: Number, default: 0 },
    updatedAtISO: { type: String },
    edits: {
      type: [
        new mongoose.Schema(
          {
            id: String,
            elementType: String,
            property: String,
            value: String,
            timestamp: Number,
          },
          { _id: false }
        ),
      ],
      default: [],
    },
  },
  { timestamps: true }
);

templateSchema.index({ templateId: 1, kind: 1 }, { unique: true });

export default mongoose.model('Template', templateSchema);