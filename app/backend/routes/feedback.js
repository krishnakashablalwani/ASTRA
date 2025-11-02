import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

// Create feedback
router.post('/', authenticate, async (req, res) => {
  try {
    const { isAnonymous, ...data } = req.body || {};
    // Attach submitter unless user chose to be anonymous
    if (!isAnonymous && req.user?._id) {
      data.submittedBy = req.user._id;
    }
    data.isAnonymous = !!isAnonymous;

    const feedback = new Feedback(data);
    await feedback.save();
    const populated = await Feedback.findById(feedback._id).populate('submittedBy', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all feedbacks
router.get('/', authenticate, async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get feedback by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('submittedBy', 'name email');
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update feedback
router.put('/:id', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json(feedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete feedback
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
