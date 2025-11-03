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

# AI Configuration (Groq)
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# Email Configuration (Brevo - Free SMTP)
# Sign up at https://www.brevo.com (300 emails/day, no credit card)
BREVO_SMTP_LOGIN=your_brevo_smtp_login
EMAIL_FROM=noreply@campushive.app
BREVO_SMTP_KEY=your_brevo_smtp_key

# Push Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
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
- ✅ AI-Powered Event Chatbot
- ✅ Professional UI/UX
- ✅ Real-time Push Notifications
- ✅ Profile Management

### 📚 Academic Features
1. **Timetables** - Manage your class schedule
2. **Tasks** - AI-powered task improvement suggestions
3. **Timer** - Pomodoro study sessions with history
4. **Leave** - Apply for and manage leave requests
5. **Library** - Book browsing and checkout system
6. **Subject Proficiency** - Find study partners by subject

### 🎯 Campus Life
7. **Events** - Browse and RSVP to campus events
8. **Clubs** - Join and manage student clubs
9. **Talent Showcase** - Share your creative work and achievements
10. **Lost & Found** - Community-driven item recovery
11. **StudySnap** - Share study sessions and moments
12. **Feedback** - Rate campus services and facilities
13. **Calendar** - View all events in calendar format

### 🤖 AI-Powered Tools
14. **Event Chatbot** - Ask about events, get Google Maps links
15. **Task Improvement** - AI suggestions for task descriptions
16. **Smart Notifications** - Prioritized real-time updates

### 📅 Organization
17. **Google Calendar Integration** - Export events to Google Calendar
18. **Study Timer** - Track focused study sessions
19. **Notifications Center** - Centralized notification management

## Navigation Guide

### Main Menu
- **Dashboard** - Overview with quick stats and AI assistant
- **Calendar** - View events in calendar format
- **Clubs** - Browse and join student clubs
- **Notifications** - View all notifications
- **Leave** - Apply for leave requests
- **Timetables** - View/upload class schedules
- **Tasks** - Manage tasks with AI improvement
- **Talent Showcase** - Share achievements
- **Subject Proficiency** - Find study partners
- **Library** - Browse and checkout books
- **Lost & Found** - Community item recovery
- **StudySnap** - Share study photos
- **Timer** - Pomodoro study sessions
- **Feedback** - Rate campus services
- **Event Chatbot** - AI-powered event assistant
- **Profile** - Manage your account
- **About** - Information about CampusHive
- **Admin Dashboard** - Platform management (admin only)

## Theme Toggle

Click the 🌙 (moon) or ☀️ (sun) icon in the navbar to switch between dark and light modes.

## Tips for Best Experience

1. **First Login**: Use the default credentials to explore the app
2. **Add Data**: Create events, clubs, and tasks to see full functionality
3. **Try AI Features**: Use the Event Chatbot for event queries with maps
4. **Enable Notifications**: Allow browser notifications for real-time updates
5. **Explore All Pages**: Check out all 18 feature pages
6. **Test Responsiveness**: Try the app on different screen sizes
7. **Dark Mode**: Toggle between light and dark themes for your preference

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
- `POST /api/ai/chat` - Event chatbot queries
- `POST /api/tasks/improve` - AI task improvement suggestions

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
- React 18.2 + Vite 5.1
- Express.js + MongoDB
- Bootstrap 5.3
- Groq AI (Llama 3.3)
- Brevo Email Service
- ❤️ and lots of coffee

---

**Enjoy using CampusHive! 🐝**
