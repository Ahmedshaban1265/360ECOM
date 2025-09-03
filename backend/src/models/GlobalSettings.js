import mongoose from 'mongoose';

const globalSettingsSchema = new mongoose.Schema({
  docId: { type: String, default: 'global', unique: true },
  tokens: {}
}, { timestamps: true });

export default mongoose.model('GlobalSettings', globalSettingsSchema);

