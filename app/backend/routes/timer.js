import express from 'express';
import Timer from '../models/Timer.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create Timer
router.post('/', authenticate, async (req, res) => {
  try {
    const timer = new Timer({ ...req.body, user: req.user.id });
    await timer.save();
    res.status(201).json(timer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Timers for user
router.get('/', authenticate, async (req, res) => {
  try {
    const timers = await Timer.find({ user: req.user.id });
    res.json(timers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Timer by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const timer = await Timer.findOne({ _id: req.params.id, user: req.user.id });
    if (!timer) return res.status(404).json({ error: 'Not found' });
    res.json(timer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Timer
router.put('/:id', authenticate, async (req, res) => {
  try {
    const timer = await Timer.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!timer) return res.status(404).json({ error: 'Not found' });
    res.json(timer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Timer
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const timer = await Timer.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!timer) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
