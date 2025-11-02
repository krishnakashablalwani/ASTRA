
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Notification from '../models/Notification.js';
import { llamaChat } from '../ai/llama.js';

const router = express.Router();

// AI-powered notification summary for user
router.get('/ai/summary', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id, isRead: false });
    const messages = notifications.map(n => `- ${n.message}`);
    const prompt = [
      { role: 'system', content: 'You are an assistant that summarizes important campus notifications for a student.' },
      { role: 'user', content: `Summarize these notifications for me:\n${messages.join('\n')}` }
    ];
    const aiRes = await llamaChat(prompt, { max_tokens: 100 });
    res.json({ summary: aiRes.choices?.[0]?.message?.content || '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create notification
router.post('/', authenticate, async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all notifications for user
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
