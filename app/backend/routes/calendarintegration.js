import express from 'express';
import CalendarIntegration from '../models/CalendarIntegration.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create Calendar Integration
router.post('/', authenticate, async (req, res) => {
  try {
    const calendar = new CalendarIntegration({ ...req.body, user: req.user.id });
    await calendar.save();
    res.status(201).json(calendar);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Calendar Integrations for user
router.get('/', authenticate, async (req, res) => {
  try {
    const calendars = await CalendarIntegration.find({ user: req.user.id });
    res.json(calendars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Calendar Integration by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const calendar = await CalendarIntegration.findOne({ _id: req.params.id, user: req.user.id });
    if (!calendar) return res.status(404).json({ error: 'Not found' });
    res.json(calendar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Calendar Integration
router.put('/:id', authenticate, async (req, res) => {
  try {
    const calendar = await CalendarIntegration.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!calendar) return res.status(404).json({ error: 'Not found' });
    res.json(calendar);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Calendar Integration
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const calendar = await CalendarIntegration.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!calendar) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
