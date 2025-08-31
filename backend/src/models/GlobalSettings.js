import mongoose from 'mongoose';

const globalSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'global', unique: true },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model('GlobalSettings', globalSettingsSchema);