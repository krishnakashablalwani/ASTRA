import express from 'express';
import { authenticate } from '../middleware/auth.js';
import ChatbotSession from '../models/ChatbotSession.js';

const router = express.Router();

// Create chatbot session
router.post('/', authenticate, async (req, res) => {
  try {
    const session = new ChatbotSession(req.body);
    await session.save();
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all chatbot sessions for user
router.get('/', authenticate, async (req, res) => {
  try {
    const sessions = await ChatbotSession.find({ user: req.user._id });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get chatbot session by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const session = await ChatbotSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update chatbot session
router.put('/:id', authenticate, async (req, res) => {
  try {
    const session = await ChatbotSession.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete chatbot session
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const session = await ChatbotSession.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
