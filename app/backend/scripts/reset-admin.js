import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env
dotenv.config();

// Resolve project root .env if needed
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campushive';

// Simple User schema for this script (avoid cross-import to keep script standalone)
import User from '../models/User.js';

const email = process.argv[2] || 'admin@campushive.local';
const newPassword = process.argv[3] || 'password123';

async function run() {
  console.log(`Connecting to ${MONGODB_URI} ...`);
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User not found with email: ${email}`);
      process.exitCode = 1;
      return;
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    console.log(`✅ Password reset for ${email}. You can now login with the new password.`);
  } catch (err) {
    console.error('Error resetting password:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
