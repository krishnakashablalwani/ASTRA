import express from 'express';
import Conversation from '../models/Conversation.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create Conversation
router.post('/', authenticate, async (req, res) => {
  try {
    const conversation = new Conversation({ ...req.body });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Conversations for user
router.get('/', authenticate, async (req, res) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Conversation by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, participants: req.user.id });
    if (!conversation) return res.status(404).json({ error: 'Not found' });
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Conversation (add message)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, participants: req.user.id },
      { $push: { messages: req.body.message } },
      { new: true }
    );
    if (!conversation) return res.status(404).json({ error: 'Not found' });
    res.json(conversation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Conversation
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({ _id: req.params.id, participants: req.user.id });
    if (!conversation) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
