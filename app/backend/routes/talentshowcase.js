import express from 'express';
import { authenticate } from '../middleware/auth.js';
import TalentShowcase from '../models/TalentShowcase.js';

const router = express.Router();

// Create talent showcase entry
router.post('/', authenticate, async (req, res) => {
  try {
    const entry = new TalentShowcase(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all talent showcase entries
router.get('/', authenticate, async (req, res) => {
  try {
    const entries = await TalentShowcase.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get entry by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const entry = await TalentShowcase.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update entry
router.put('/:id', authenticate, async (req, res) => {
  try {
    const entry = await TalentShowcase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete entry
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const entry = await TalentShowcase.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
