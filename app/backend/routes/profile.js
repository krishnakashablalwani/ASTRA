import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { authenticate } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/avatars');
fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  }
});

function imageFilter(req, file, cb) {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image uploads are allowed'));
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter: imageFilter, limits: { fileSize: 2 * 1024 * 1024 } });

// Get profile
router.get('/', authenticate, async (req, res) => {
  res.json(req.user);
});

// Update profile (with optional avatar upload)
router.put('/', authenticate, upload.single('avatar'), async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'department', 'dob', 'bloodGroup'];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    if (update.dob) {
      const parsed = new Date(update.dob);
      if (!isNaN(parsed.getTime())) {
        update.dob = parsed;
      } else {
        // Ignore invalid dates instead of throwing
        delete update.dob;
      }
    }

    if (req.file) {
      const relative = `/uploads/avatars/${req.file.filename}`;
      update.avatarUrl = relative;
    }

    const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
