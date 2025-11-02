import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import StudySnap from '../models/StudySnap.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = 'uploads/studysnaps/';
    try {
      fs.mkdirSync(dest, { recursive: true });
    } catch (e) {
      // ignore if exists or race condition
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Create StudySnap with photo upload
// Only students and admins can create snaps
router.post('/', authenticate, authorizeRoles('student', 'admin'), upload.single('photo'), async (req, res) => {
  try {
    const caption = req.body.title || req.body.caption;
    let fileHash = null;
    if (req.file) {
      // Compute sha256 hash of the uploaded image
      const fileBuffer = fs.readFileSync(req.file.path);
      fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    }

    // If we have a file hash, prevent duplicate uploads by same user
    if (fileHash) {
      const duplicate = await StudySnap.findOne({ user: req.user.id, fileHash });
      if (duplicate) {
        // Cleanup newly uploaded duplicate file to avoid orphan files
        try { fs.unlinkSync(req.file.path); } catch (e) {}
        return res.status(200).json(duplicate);
      }
    }

    const snapData = {
      user: req.user.id,
      caption,
      imageUrl: req.file ? `/uploads/studysnaps/${req.file.filename}` : null,
      fileHash: fileHash || undefined,
    };
    
    if (req.body.description) {
      snapData.description = req.body.description;
    }
    
    const snap = new StudySnap(snapData);
    await snap.save();
    res.status(201).json(snap);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all StudySnaps (for feed)
// Only students and admins can view the feed
router.get('/', authenticate, authorizeRoles('student', 'admin'), async (req, res) => {
  try {
    const snaps = await StudySnap.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(snaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get StudySnap by ID
// Restrict access to students/admins and own resource
router.get('/:id', authenticate, authorizeRoles('student', 'admin'), async (req, res) => {
  try {
    const snap = await StudySnap.findOne({ _id: req.params.id, user: req.user.id });
    if (!snap) return res.status(404).json({ error: 'Not found' });
    res.json(snap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update StudySnap
// Restrict updates to students/admins and own resource
router.put('/:id', authenticate, authorizeRoles('student', 'admin'), upload.single('photo'), async (req, res) => {
  try {
    const update = {};
    if (typeof req.body.title === 'string') update.caption = req.body.title;
    if (typeof req.body.caption === 'string') update.caption = req.body.caption;
    if (typeof req.body.description === 'string') update.description = req.body.description;

    // Optional photo replacement
    if (req.file) {
      const fileBuffer = fs.readFileSync(req.file.path);
      const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      // If another snap by this user already has this photo, treat as duplicate and do not replace
      const duplicate = await StudySnap.findOne({ user: req.user.id, fileHash });
      if (duplicate && duplicate._id.toString() !== req.params.id) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
        return res.status(200).json(duplicate);
      }

      update.imageUrl = `/uploads/studysnaps/${req.file.filename}`;
      update.fileHash = fileHash;
    }

    const snap = await StudySnap.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      update,
      { new: true }
    );
    if (!snap) return res.status(404).json({ error: 'Not found' });
    res.json(snap);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete StudySnap
// Restrict deletes to students/admins and own resource
router.delete('/:id', authenticate, authorizeRoles('student', 'admin'), async (req, res) => {
  try {
    const snap = await StudySnap.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!snap) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like/Unlike StudySnap
// Only students and admins can like/unlike
router.post('/:id/like', authenticate, authorizeRoles('student', 'admin'), async (req, res) => {
  try {
    const snap = await StudySnap.findById(req.params.id);
    if (!snap) return res.status(404).json({ error: 'Not found' });
    
    const likeIndex = snap.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      // Unlike
      snap.likes.splice(likeIndex, 1);
    } else {
      // Like
      snap.likes.push(req.user.id);
    }
    
    await snap.save();
    res.json(snap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
