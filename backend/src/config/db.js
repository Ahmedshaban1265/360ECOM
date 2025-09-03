import mongoose from 'mongoose';

export const connectDb = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'ecom' });
    console.log('Mongo connected');
  } catch (err) {
    console.error('Mongo connection error', err);
    process.exit(1);
  }
};

