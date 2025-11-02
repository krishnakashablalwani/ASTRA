
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Club from '../models/Club.js';
// AI suggestions removed

const router = express.Router();

// Add member to club
router.post('/:id/members', authenticate, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    if (!club.members.includes(req.user.id)) {
      club.members.push(req.user.id);
      await club.save();
    }
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove member from club
router.delete('/:id/members/:userId', authenticate, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    club.members = club.members.filter(m => m.toString() !== req.params.userId);
    await club.save();
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add showcase item
router.post('/:id/showcase', authenticate, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    const item = {
      ...req.body,
      uploadedBy: req.user.id,
      uploadedAt: new Date(),
    };
    club.showcase.push(item);
    await club.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Removed `/suggest-tags` endpoint per product decision

// Create a club (any authenticated user)
router.post('/', authenticate, async (req, res) => {
  try {
    const club = new Club({
      ...req.body,
      createdBy: req.user.id
    });
    await club.save();
    res.status(201).json(club);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all clubs
// Get all clubs (public)
router.get('/', async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('createdBy', 'name email')
      .lean();
    // Add memberCount to each club
    const clubsWithCount = clubs.map(club => ({
      ...club,
      memberCount: (club.members || []).length
    }));
    res.json(clubsWithCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single club by ID
// Get club by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('createdBy', 'name email')
      .lean();
    if (!club) return res.status(404).json({ message: 'Club not found' });
    // Add memberCount
    club.memberCount = (club.members || []).length;
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a club (creator only)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    if (club.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the creator can edit this club' });
    }
    const allowed = ['name', 'description', 'tags'];
    for (const key of allowed) {
      if (key in req.body) club[key] = req.body[key];
    }
    await club.save();
    await club.populate('createdBy', 'name');
    res.json(club);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a club (creator only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    if (club.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the creator can delete this club' });
    }
    await club.deleteOne();
    res.json({ message: 'Club deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
