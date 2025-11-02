import express from 'express';
import SubjectProficiency from '../models/SubjectProficiency.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create Subject Proficiency
router.post('/', authenticate, async (req, res) => {
  try {
    const proficiency = new SubjectProficiency({ ...req.body, user: req.user.id });
    await proficiency.save();
    res.status(201).json(proficiency);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Subject Proficiencies for user
router.get('/', authenticate, async (req, res) => {
  try {
    const proficiencies = await SubjectProficiency.find({ user: req.user.id });
    res.json(proficiencies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Subject Proficiency by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const proficiency = await SubjectProficiency.findOne({ _id: req.params.id, user: req.user.id });
    if (!proficiency) return res.status(404).json({ error: 'Not found' });
    res.json(proficiency);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Subject Proficiency
router.put('/:id', authenticate, async (req, res) => {
  try {
    const proficiency = await SubjectProficiency.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!proficiency) return res.status(404).json({ error: 'Not found' });
    res.json(proficiency);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Subject Proficiency
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const proficiency = await SubjectProficiency.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!proficiency) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
