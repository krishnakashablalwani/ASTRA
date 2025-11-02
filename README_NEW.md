# 🐝 CampusHive - Complete Campus Management Platform

**A modern, AI-powered campus management system with 20+ features, dark/light mode, and professional UI/UX**

![Built with React](https://img.shields.io/badge/React-18.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![AI Powered](https://img.shields.io/badge/AI-SambaNova%20Llama-purple)

**Buzzing with campus activity** - CampusHive is your centralized digital campus hub for events, announcements, club activities, student tools, and AI-powered assistance—all in one beautifully designed platform.

---

## ✨ What's New - Complete Redesign!

✅ **Dark & Light Mode** with theme toggle
✅ **20+ Feature Pages** - All features from requirements implemented
✅ **Professional UI/UX** - Gradients, animations, modern design
✅ **AI Integration** - Event chatbot, smart notifications
✅ **Google Services** - Calendar integration, Maps API
✅ **Study Tools** - Timer, StudySnap, Attendance tracker
✅ **Academic Features** - Library, PYQ Papers, Proficiency matching
✅ **Campus Life** - Lost & Found, Feedback, Fee Tracker

---

## 🚀 Quick Start

```bash
# Backend
cd app/backend
npm install
node index.js

# Frontend
cd frontend  
npm install
npm run build

# Access at http://localhost:3000
# Login: krishnakashab@gmail.com / test
```

**Full setup guide**: [QUICKSTART.md](QUICKSTART.md)

---

## 📚 Complete Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Installation & setup guide
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - All 26 features implemented
- **[DESIGN_GUIDE.md](DESIGN_GUIDE.md)** - Visual design specifications
- **[to-do.txt](to-do.txt)** - Original requirements (100% complete!)

---

## 🎯 Feature Showcase (23+ Features)

### 🎓 Academic Tools
- **Attendance Tracker** - Smart skip calculator (75% threshold)
- **Timetable Manager** - AI-optimized schedules
- **Task Manager** - AI-powered prioritization
- **PYQ Papers** - Previous year question papers
- **Library System** - Book issue/return tracking
- **Subject Proficiency** - Find study partners
- **Fee Tracker** - Payment monitoring
- **Google Calendar** - Export events/exams

### 🎨 Campus Life
- **Events Hub** - Browse campus events
- **Club Management** - Create & join clubs
- **Talent Showcase** - Share creative work
- **Lost & Found** - Community help
- **StudySnap** - Study session photos
- **Leave Management** - Apply for leave
- **Feedback System** - 5-star ratings

### 🤖 AI-Powered
- **Event Chatbot** - Ask about events, get Google Maps links
- **AI Assistant** - General campus queries
- **Smart Notifications** - AI-prioritized updates
- **Task Analysis** - Importance ranking

### 📱 Collaboration
- **Collaborative Spaces** - Share classwork
- **Notification Center** - Real-time updates
- **Study Timer** - Pomodoro technique

---

## 🎨 Beautiful UI/UX

### Theme Support
- **Light Mode** - Clean, bright interface
- **Dark Mode** - Elegant dark theme
- **One-Click Toggle** - Moon/Sun icon in navbar
- **Persistent** - Theme saved to localStorage
- **Theme-Aware Logos** - Dynamic logo display

### Professional Design
- Modern gradient backgrounds
- Smooth hover animations
- Card-based layouts with shadows
- 16px border radius for modern look
- Bootstrap 5 responsive framework
- Bootstrap Icons throughout

---

## 🛠️ Tech Stack

**Frontend**: React 18.2, React Router 6.14, Vite 5.1, Bootstrap 5, Context API
**Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt
**AI**: SambaNova Llama-4-Maverick-17B-128E-Instruct
**Tools**: Axios, Bootstrap Icons, Google Maps API, Google Calendar API

---

## 📁 Project Structure

```
ASTRA/
├── app/backend/          # Express server, routes, models, AI
├── frontend/
│   ├── src/
│   │   ├── pages/        # 20+ page components
│   │   ├── components/   # Reusable components
│   │   ├── contexts/     # Theme context
│   │   └── services/     # API services
│   └── public/           # Logos, assets
├── QUICKSTART.md         # Setup guide
├── IMPLEMENTATION_SUMMARY.md  # Feature list
└── DESIGN_GUIDE.md       # Visual specs
```

---

## 🎯 Screenshots

### Dashboard (Enhanced)
- Gradient hero banner with personalized greeting
- Animated stat cards
- AI chat assistant
- Event cards with hover effects
- Quick links to popular features

### Attendance Tracker
- Subject-wise attendance
- Net attendance calculation
- Smart "classes you can skip" calculator
- Visual progress bars

### Study Timer
- Pomodoro technique support
- Circular progress visualization
- Session history
- Total study time tracking

### Event Chatbot
- Natural language queries
- Google Maps integration
- Interactive chat UI
- Real-time responses

---

## 🚀 Performance

- **Vite Build**: Ultra-fast development
- **Optimized Bundle**: 294.91 KB → 84.24 KB gzipped
- **Fast API**: Express.js with MongoDB
- **Responsive**: Mobile-first design

---

## 📊 Implementation Status

**✅ 26/26 Features Complete** from to-do.txt
- All core features ✓
- Dark/light mode ✓
- AI integration ✓
- Google services ✓
- Professional UI/UX ✓

---

## 🔐 Default Login

- **Admin**: `admin@campushive.local` / `admin123`
- **Test User**: `krishnakashab@gmail.com` / `test`

---

## 📞 Support

For issues or questions, check:
1. [QUICKSTART.md](QUICKSTART.md)
2. [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
3. Backend logs: `app/backend/backend.log`

---

## 🙏 Credits

- **SambaNova** - Llama AI API
- **Bootstrap** - UI framework
- **React** - Frontend library
- **MongoDB** - Database
- **Google** - Maps & Calendar APIs

---

**Built with ❤️ for modern campus life**

**CampusHive** - Your unified hub for everything campus! 🐝

---

## Deployment

The frontend is built as static files served by the Express backend. MongoDB runs locally or can be configured for a cloud database.

