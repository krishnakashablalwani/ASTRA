import express from 'express';
import { authenticate } from '../middleware/auth.js';
import LostAndFound from '../models/LostAndFound.js';

const router = express.Router();

// Create lost/found item
router.post('/', authenticate, async (req, res) => {
  try {
    const item = new LostAndFound(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all lost/found items
router.get('/', authenticate, async (req, res) => {
  try {
    const items = await LostAndFound.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get item by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const item = await LostAndFound.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update item
router.put('/:id', authenticate, async (req, res) => {
  try {
    const item = await LostAndFound.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete item
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const item = await LostAndFound.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
