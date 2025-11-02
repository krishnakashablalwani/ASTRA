# 🚀 CampusHive - Quick Start Guide

## Prerequisites
- Node.js (v18+)
- MongoDB (running on localhost:27017)
- Modern web browser

## Installation & Setup

### 1. Backend Setup
```bash
cd app/backend
npm install
```

### 2. Environment Configuration
Create `.env` file in `app/backend/`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/campushive
JWT_SECRET=your_jwt_secret
LLAMA_API_KEY=4809d130-bd87-4484-9620-2359df365f8a
```

### 3. Start Backend
```bash
cd app/backend
node index.js
```

Backend will run on: `http://localhost:3000`

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run build
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Default Login Credentials

### Admin Account
- **Email**: `admin@campushive.local`
- **Password**: `admin123`

### Test User
- **Email**: `krishnakashab@gmail.com`
- **Password**: `test`

## Features Overview

### 🎨 Core Features
- ✅ Dark/Light Mode Toggle
- ✅ Responsive Design
- ✅ AI-Powered Assistance
- ✅ Professional UI/UX

### 📚 Academic Features
1. **Attendance Tracker** - Monitor attendance with smart skip calculator
2. **Timetables** - Manage your class schedule
3. **Tasks** - AI-powered task prioritization
4. **PYQ Papers** - Access previous year question papers
5. **Library** - Issue and return books
6. **Subject Proficiency** - Find study partners

### 🎯 Campus Life
7. **Events** - Browse upcoming campus events
8. **Clubs** - Join and manage clubs
9. **Talent Showcase** - Share your creative work
10. **Lost & Found** - Community help center
11. **StudySnap** - Share study sessions
12. **Feedback** - Rate campus services

### 🤖 AI-Powered Tools
13. **Event Chatbot** - Ask about events, get Google Maps links
14. **AI Chat Assistant** - General campus queries
15. **Smart Notifications** - Prioritized updates
16. **Task Analysis** - AI-driven task prioritization

### 📅 Organization
17. **Google Calendar Integration** - Export events to Google Calendar
18. **Study Timer** - Pomodoro technique timer
19. **Fee Tracker** - Monitor fee payments
20. **Leave Management** - Apply for leave

### 💬 Communication
21. **Collaborative Spaces** - Share classwork
22. **Notifications** - Stay updated
23. **Real-time Updates** - Live notifications

## Navigation Guide

### Main Menu
- **Overview** - Dashboard with quick stats
- **Calendar** - Academic calendar with events
- **Attendance** - Track your attendance
- **Clubs** - Manage club memberships
- **Notifications** - View all notifications
- **Spaces** - Collaborative workspaces
- **Leave** - Apply for leave
- **Timetables** - View/upload timetables
- **Tasks** - Manage tasks with AI
- **Showcase** - Talent showcase
- **Proficiency** - Find study partners
- **Library** - Browse books
- **PYQ** - Question papers
- **Fees** - Fee tracking
- **Lost & Found** - Community help
- **StudySnap** - Study photos
- **Timer** - Study timer
- **Feedback** - Submit feedback
- **Event Bot** - AI chatbot

## Theme Toggle

Click the 🌙 (moon) or ☀️ (sun) icon in the navbar to switch between dark and light modes.

## Tips for Best Experience

1. **First Login**: Use the default credentials to explore the app
2. **Add Data**: Create events, clubs, and tasks to see the full functionality
3. **Try AI Features**: Use the Event Chatbot and AI Assistant
4. **Explore All Pages**: Check out all 20+ feature pages
5. **Test Responsiveness**: Try the app on different screen sizes

## Troubleshooting

### Backend Not Starting
- Check if MongoDB is running: `mongod --version`
- Verify port 3000 is available
- Check `.env` file configuration

### Frontend Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

### Login Issues
- Ensure backend is running on port 3000
- Check browser console for errors
- Verify MongoDB connection

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event (admin)

### Clubs
- `GET /api/clubs` - Get all clubs
- `POST /api/clubs` - Create club

### AI
- `POST /api/ai/chat` - Chat with AI assistant

### More endpoints available in backend routes...

## Development

### Frontend Development Server
```bash
cd frontend
npm run dev
```
Access at: `http://localhost:5173`

### Backend Development
```bash
cd app/backend
npm run dev  # if nodemon is configured
# or
node index.js
```

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` and are automatically served by the backend.

### Environment Variables for Production
Update `.env` with production values:
- Change `JWT_SECRET` to a strong random string
- Update `MONGODB_URI` to production database
- Set `NODE_ENV=production`

## Support

For issues or questions:
1. Check the implementation summary: `IMPLEMENTATION_SUMMARY.md`
2. Review the to-do list: `to-do.txt`
3. Check backend logs: `app/backend/backend.log`

## Credits

Built with:
- React + Vite
- Express.js + MongoDB
- Bootstrap 5
- SambaNova Llama AI
- ❤️ and lots of coffee

---

**Enjoy using CampusHive! 🐝**
