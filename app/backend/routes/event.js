
import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { llamaChat } from '../ai/llama.js';
import axios from 'axios';
import { sendEventRegistrationEmail } from '../services/emailService.js';

const router = express.Router();

// Event chatbot: answer event-related queries, optionally return Google Maps link
router.post('/chat', authenticate, async (req, res) => {
  const { question, eventId } = req.body;
  if (!question) return res.status(400).json({ message: 'Question required' });
  try {
    let event = null;
    if (eventId) {
      event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: 'Event not found' });
    }
    let context = event ? `Event: ${event.title}\nDate: ${event.date}\nLocation: ${event.location || ''}\nDescription: ${event.description || ''}` : '';
    const prompt = [
      { role: 'system', content: 'You are an assistant that answers event-related queries for a campus app. If the user asks for location, provide a Google Maps link if possible.' },
      { role: 'user', content: `${context}\nQuestion: ${question}` }
    ];
    const aiRes = await llamaChat(prompt, { max_tokens: 100 });
    let answer = aiRes.choices?.[0]?.message?.content || '';
    // If user asks for location and event has a location, add Google Maps link
    if (/location|where|map/i.test(question) && event?.location) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;
      answer += `\nGoogle Maps: ${mapsUrl}`;
    }
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create event (any authenticated user)
router.post('/', authenticate, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (req.user && req.user.id) {
      payload.createdBy = req.user.id;
    }
    const event = new Event(payload);
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all events (public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get event by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update event
router.put('/:id', authenticate, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete event
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// RSVP to event
router.post('/:id/rsvp', authenticate, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('club');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    
    // Check if already RSVPed
    if (event.rsvps.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already RSVPed to this event' });
    }
    
    // Add to RSVPs
    event.rsvps.push(req.user.id);
    await event.save();
    
    // Send confirmation email
    try {
      const user = await User.findById(req.user.id);
      if (user && user.email) {
        await sendEventRegistrationEmail(user.email, user.name, event);
      }
    } catch (emailErr) {
      console.error('Failed to send event registration email:', emailErr);
      // Don't fail the request if email fails
    }
    
    res.json({ message: 'RSVP successful', event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
