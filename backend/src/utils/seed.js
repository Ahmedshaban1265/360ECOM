import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const existing = await User.findOne({ email });
    if (!existing) {
      const passwordHash = await bcrypt.hash(password, 10);
      await User.create({ email, passwordHash, role: 'admin' });
      console.log(`Created admin user ${email} / ${password}`);
    } else {
      console.log('Admin user already exists');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();