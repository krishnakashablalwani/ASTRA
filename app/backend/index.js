import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Route imports
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import clubRoutes from './routes/club.js';
import eventRoutes from './routes/event.js';
import announcementRoutes from './routes/announcement.js';
import feedbackRoutes from './routes/feedback.js';
import lostAndFoundRoutes from './routes/lostandfound.js';
import notificationRoutes from './routes/notification.js';
import chatbotSessionRoutes from './routes/chatbotsession.js';
import talentShowcaseRoutes from './routes/talentshowcase.js';
import leaveRoutes from './routes/leave.js';
import timetableRoutes from './routes/timetable.js';
import taskRoutes from './routes/task.js';
import conversationRoutes from './routes/conversation.js';
import libraryRoutes from './routes/library.js';
import subjectProficiencyRoutes from './routes/subjectproficiency.js';
import timerRoutes from './routes/timer.js';
import studySnapRoutes from './routes/studysnap.js';
import calendarIntegrationRoutes from './routes/calendarintegration.js';
import aiRoutes from './routes/ai.js';
import profileRoutes from './routes/profile.js';
import pushRoutes, { sendToUser, NotificationLog as PushNotificationLog } from './routes/push.js';
import Task from './models/Task.js';
import Event from './models/Event.js';
import { Checkout } from './models/Library.js';
import { sendTaskDeadlineEmail } from './services/emailService.js';
// Models for optional auto-seed
import User from './models/User.js';
import Club from './models/Club.js';
import Announcement from './models/Announcement.js';

// App setup
const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/club', clubRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/lostandfound', lostAndFoundRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chatbotsessions', chatbotSessionRoutes);
// Disabled unused features
// app.use('/api/collaborativespaces', collaborativeSpaceRoutes);
app.use('/api/talentshowcase', talentShowcaseRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/timetables', timetableRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/conversations', conversationRoutes);
// app.use('/api/fees', feeRoutes);
// app.use('/api/pyqpapers', pyqPaperRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/subjectproficiencies', subjectProficiencyRoutes);
// app.use('/api/attendance', attendanceRoutes);
app.use('/api/timers', timerRoutes);
app.use('/api/studysnap', studySnapRoutes);
app.use('/api/calendarintegrations', calendarIntegrationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/push', pushRoutes);

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend build (single deployable app)
const clientDist = path.resolve(__dirname, '../../frontend/dist');

// Serve favicon and brand assets from repo root
app.get(['/favicon.ico','/favicon.png','/light.png','/dark.png'], (req, res) => {
  const asset = req.path.replace('/', '');
  const assetPath = path.resolve(__dirname, `../../${asset}`);
  res.sendFile(assetPath);
});

// Static assets
app.use(express.static(clientDist));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});

// DB connection & server start
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campushive';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  // Auto-seed minimal data if empty (no users)
  try {
    const users = await User.countDocuments();
    if (users === 0) {
      const passwordHash = await bcrypt.hash('password123', 10);
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@campushive.local',
        password: passwordHash,
        role: 'admin',
        department: 'Administration'
      });
      const club1 = await Club.create({
        name: 'Tech Club',
        description: 'Exploring technology and building cool projects',
        createdBy: admin._id,
        admins: [admin._id],
        tags: ['technology', 'coding']
      });
      const club2 = await Club.create({
        name: 'Art Circle',
        description: 'Painting, sketching, and creativity',
        createdBy: admin._id,
        admins: [admin._id],
        tags: ['art', 'creativity']
      });
      await Event.create([
        { title: 'Welcome Meetup', description: 'Kickoff event', date: new Date(Date.now()+86400000), location: 'Auditorium', createdBy: admin._id, club: club1._id },
        { title: 'Art Exhibition', description: 'Showcase talents', date: new Date(Date.now()+172800000), location: 'Gallery', createdBy: admin._id, club: club2._id }
      ]);
      
      // Create 2 mock exam announcements
      await Announcement.create([
        { 
          title: 'Mid-Term Examinations - December 2025', 
          content: 'Mid-term exams will be held from December 15-20, 2025. Please review the exam schedule posted on the notice board. Students must carry their ID cards and arrive 15 minutes before the exam starts. Good luck!',
          createdBy: admin._id
        },
        { 
          title: 'Final Semester Examinations - January 2026', 
          content: 'Final semester exams are scheduled for January 10-25, 2026. Exam hall allocation and seat numbers will be announced one week prior. Students should check their exam admit cards on the student portal. Prepare well!',
          createdBy: admin._id
        }
      ]);
      
      console.log('Auto-seed complete: default admin, clubs, events, and exam announcements created.');
    }
    
    // Always ensure the special ASTRA admin account exists
    const astraAdminEmail = process.env.ADMIN_EMAIL || 'astra.campushive@gmail.com';
    const existingAstraAdmin = await User.findOne({ email: astraAdminEmail });
    
    if (!existingAstraAdmin) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'AstraCampusHive2025!';
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'ASTRA Admin',
        email: astraAdminEmail,
        password: passwordHash,
        role: 'admin',
        department: 'Administration',
        phone: '',
      });
      console.log(`✅ Special ASTRA admin account created: ${astraAdminEmail}`);
    } else {
      console.log(`✅ ASTRA admin account already exists: ${astraAdminEmail}`);
    }
  } catch (seedErr) {
    console.warn('Auto-seed skipped/failed:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Simple hourly scheduler for reminders (events, tasks, book returns)
  const scheduleReminders = async () => {
    const now = new Date();
    const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Tasks due within 24h
    const dueTasks = await Task.find({ dueDate: { $gte: now, $lte: in24h } }).populate('user').select('user title dueDate description priority');
    for (const t of dueTasks) {
      const key = `${t._id.toString()}-24h`;
      try {
        await PushNotificationLog.create({ user: t.user._id, type: 'task', refId: key, window: '24h' });
        
        // Send push notification
        await sendToUser(t.user._id, {
          title: 'Task due soon',
          body: `${t.title} is due by ${new Date(t.dueDate).toLocaleString()}`,
          url: '/tasks',
          icon: '/light.png'
        });
        
        // Send email notification
        if (t.user && t.user.email) {
          try {
            await sendTaskDeadlineEmail(t.user.email, t.user.name, t);
          } catch (emailErr) {
            console.error('Failed to send task deadline email:', emailErr);
          }
        }
      } catch (_) { /* already notified */ }
    }

    // Events within 24h (notify RSVPs)
    const upcomingEvents = await Event.find({ date: { $gte: now, $lte: in24h } }).select('title date rsvps');
    for (const ev of upcomingEvents) {
      for (const uid of ev.rsvps || []) {
        const key = `${ev._id.toString()}-${uid.toString()}-24h`;
        try {
          await PushNotificationLog.create({ user: uid, type: 'event', refId: key, window: '24h' });
          await sendToUser(uid, {
            title: 'Event reminder',
            body: `${ev.title} starts at ${new Date(ev.date).toLocaleString()}`,
            url: '/calendar',
            icon: '/light.png'
          });
        } catch (_) { /* already notified */ }
      }
    }

    // Book returns within 24h
    const dueReturns = await Checkout.find({ returnDeadline: { $gte: now, $lte: in24h }, returned: false, studentUser: { $ne: null } }).select('studentUser bookCode returnDeadline');
    for (const c of dueReturns) {
      const key = `${c._id.toString()}-24h`;
      try {
        await PushNotificationLog.create({ user: c.studentUser, type: 'book', refId: key, window: '24h' });
        await sendToUser(c.studentUser, {
          title: 'Book return due',
          body: `Book ${c.bookCode} is due by ${new Date(c.returnDeadline).toLocaleString()}`,
          url: '/library',
          icon: '/light.png'
        });
      } catch (_) { /* already notified */ }
    }
  };

  // Run immediately and then hourly
  scheduleReminders();
  setInterval(scheduleReminders, 60 * 60 * 1000);
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
