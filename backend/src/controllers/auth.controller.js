import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ sub: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token, user: { email: user.email, role: user.role } });
};

export const seedAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Not allowed in production' });
  if (!email || !password) return res.status(400).json({ message: 'email/password required' });
  const exists = await User.findOne({ email });
  if (exists) return res.json({ message: 'User exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ email, passwordHash });
  res.json({ message: 'Admin created' });
};

