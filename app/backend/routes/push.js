import express from 'express';
import webpush from 'web-push';
import { authenticate } from '../middleware/auth.js';
import PushSubscription from '../models/PushSubscription.js';
import NotificationLog from '../models/NotificationLog.js';
import User from '../models/User.js';
import { sendTaskCreatedEmail } from '../services/emailService.js';

const router = express.Router();

// Configure VAPID from env
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails('mailto:admin@campushive.local', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

router.get('/public-key', (req, res) => {
  if (!VAPID_PUBLIC_KEY) return res.status(500).json({ error: 'Push not configured' });
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

router.post('/subscribe', authenticate, async (req, res) => {
  try {
    const sub = req.body;
    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }
    // Upsert by endpoint
    const saved = await PushSubscription.findOneAndUpdate(
      { endpoint: sub.endpoint },
      { user: req.user._id, endpoint: sub.endpoint, keys: sub.keys },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ ok: true, id: saved._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/unsubscribe', authenticate, async (req, res) => {
  try {
    const { endpoint } = req.body || {};
    if (!endpoint) return res.status(400).json({ error: 'endpoint required' });
    await PushSubscription.deleteOne({ endpoint, user: req.user._id });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function sendToUser(userId, payload) {
  const subs = await PushSubscription.find({ user: userId });
  const results = [];
  for (const s of subs) {
    try {
      const res = await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, JSON.stringify(payload));
      results.push({ endpoint: s.endpoint, status: res.statusCode });
    } catch (err) {
      // 410 Gone: remove invalid subscription
      if (err.statusCode === 410 || err.statusCode === 404) {
        await PushSubscription.deleteOne({ _id: s._id });
      }
    }
  }
  return results;
}

router.post('/test', authenticate, async (req, res) => {
  try {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return res.status(500).json({ error: 'Push not configured' });
    const payload = {
      title: 'CampusHive',
      body: 'Test notification',
      icon: '/light.png',
      url: '/'
    };
    const results = await sendToUser(req.user._id, payload);
    res.json({ ok: true, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test email endpoint
router.post('/test-email', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.email) {
      return res.status(400).json({ error: 'User email not found' });
    }
    
    // Send a test email using the task created template as example
    const testTask = {
      title: 'Test Task - Email Notification',
      description: 'This is a test email from CampusHive to verify email notifications are working correctly.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      priority: 'medium'
    };
    
    await sendTaskCreatedEmail(user.email, user.name, testTask);
    res.json({ ok: true, message: `Test email sent to ${user.email}` });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Export helpers for scheduler
export { sendToUser, NotificationLog };
export default router;
