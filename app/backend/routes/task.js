import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { llamaChat } from '../ai/llama.js';
import { sendTaskCreatedEmail } from '../services/emailService.js';

const router = express.Router();

// AI-powered task prioritization
router.post('/ai/prioritize', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    const messages = tasks.map(t => `- ${t.title}: ${t.description || ''} (Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'})`);
    const prompt = [
      { role: 'system', content: 'You are an assistant that analyzes and prioritizes student tasks based on urgency and importance.' },
      { role: 'user', content: `Prioritize these tasks for me:\n${messages.join('\n')}` }
    ];
    const aiRes = await llamaChat(prompt, { max_tokens: 120 });
    res.json({ prioritization: aiRes.choices?.[0]?.message?.content || '' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Task
router.post('/', authenticate, async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user.id });
    await task.save();
    
    // Send email notification
    try {
      const user = await User.findById(req.user.id);
      if (user && user.email) {
        await sendTaskCreatedEmail(user.email, user.name, task);
      }
    } catch (emailErr) {
      console.error('Failed to send task creation email:', emailErr);
      // Don't fail the request if email fails
    }
    
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all Tasks for user
router.get('/', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Task by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
