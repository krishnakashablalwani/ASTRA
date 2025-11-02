import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Timetable from '../models/Timetable.js';
// Note: AI generation removed. Timetables are now manual-only.

const router = express.Router();

// Parse AI timetable text into structured format
const parseTimetableText = (text) => {
  const schedule = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Split text into lines and process
  const lines = text.split('\n').filter(line => line.trim());
  
  let currentDay = null;
  
  for (const line of lines) {
    // Check if line contains a day
    const dayMatch = days.find(day => line.includes(day));
    
    if (dayMatch) {
      currentDay = dayMatch;
      
      // Extract time and subject from patterns like "Monday: 8:00 AM - 10:00 AM (Data Structures)"
      const timePattern = /(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*-\s*(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s*(?:\(([^)]+)\)|([A-Za-z\s]+))/g;
      let match;
      
      while ((match = timePattern.exec(line)) !== null) {
        schedule.push({
          day: currentDay,
          startTime: match[1].trim(),
          endTime: match[2].trim(),
          subject: (match[3] || match[4] || '').trim()
        });
      }
    }
  }
  
  return schedule;
};

// Removed the AI generation endpoint. All timetables must be created manually by users.

// Parse existing timetable text
router.post('/parse', authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Text is required' });
    }
    
    const parsedSchedule = parseTimetableText(text);
    res.json({ parsedSchedule, success: parsedSchedule.length > 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create timetable
router.post('/', authenticate, async (req, res) => {
  try {
    const timetableData = {
      ...req.body,
      user: req.user._id
    };
    
    // If raw text is provided, parse it
    if (req.body.rawText && !req.body.parsedSchedule) {
      timetableData.parsedSchedule = parseTimetableText(req.body.rawText);
    }
    
    const timetable = new Timetable(timetableData);
    await timetable.save();
    res.status(201).json(timetable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all timetables
router.get('/', authenticate, async (req, res) => {
  try {
    const timetables = await Timetable.find();
    res.json(timetables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get timetable by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);
    if (!timetable) return res.status(404).json({ message: 'Timetable not found' });
    res.json(timetable);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update timetable
router.put('/:id', authenticate, async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!timetable) return res.status(404).json({ message: 'Timetable not found' });
    res.json(timetable);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete timetable
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id);
    if (!timetable) return res.status(404).json({ message: 'Timetable not found' });
    res.json({ message: 'Timetable deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

