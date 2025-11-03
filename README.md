# 🐝 CampusHive

**Buzzing with campus activity**

A comprehensive digital campus management platform for events, clubs, academics, and student engagement.

---

## 🚀 Features

- **📅 Event Management** - Create, browse, and RSVP to campus events
- **🎓 Academic Tools** - Timetables, tasks, attendance tracking
- **📚 Library System** - Book browsing and checkout management
- **🤖 AI Chatbot** - Event queries with Google Maps integration
- **⏱️ Study Timer** - Pomodoro-style focus sessions
- **📸 StudySnap** - Share study moments with the community
- **🔔 Notifications** - Real-time push notifications
- **🌓 Dark/Light Mode** - Customizable theme

---

## 📁 Project Structure

```
ASTRA/
├── app/backend/          # Express.js backend
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Email & push notifications
│   └── ai/              # AI chatbot integration
├── frontend/            # React frontend
│   ├── src/pages/      # Page components
│   └── src/components/ # Reusable components
```

---

## 🛠️ Setup

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

**Quick Start:**

```bash
# Backend
cd app/backend
npm install
# Add .env file with MONGODB_URI, JWT_SECRET, GROQ_API_KEY
npm start

# Frontend
cd frontend
npm install
npm run dev
```

---

## 🔧 Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (Email)
- web-push (Notifications)
- Groq AI (Llama 3.3)

**Frontend:**
- React 18.2
- React Router 6.14
- Vite 5.1
- Bootstrap 5.3
- Axios

---

## 📚 Key Features

### Event Management
- Browse and create campus events
- RSVP functionality
- AI-powered event chatbot with Google Maps
- Email confirmations

### Academic Tools
- **Tasks** - Assignment tracking with AI improvement
- **Timer** - Pomodoro study sessions with history
- **Timetables** - Upload and view schedules
- **Subject Proficiency** - Find study partners

### Library System
- Book catalog browsing
- Checkout/return management
- Due date tracking
- Email reminders

### Social Features
- **StudySnap** - Share study photos
- **Talent Showcase** - Student achievements
- **Clubs** - Join and create organizations
- **Lost & Found** - Community item recovery

### Admin Features
- User management
- Platform analytics
- Announcements
- Activity logs

---

## 🔑 Environment Variables

Create `app/backend/.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/campushive

# Authentication
JWT_SECRET=your_secret_key

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# AI
GROQ_API_KEY=gsk_your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# Push Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create event
- `POST /api/events/:id/rsvp` - RSVP to event
- `POST /api/events/chat` - Event chatbot

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/improve` - AI improve description

### Library
- `GET /api/library/books` - Get all books
- `POST /api/library/checkout/:bookId` - Checkout book
- `POST /api/library/return/:bookId` - Return book

### Timer
- `GET /api/timers` - Get sessions
- `POST /api/timers` - Save session

### Clubs
- `GET /api/club` - Get all clubs
- `POST /api/club` - Create club
- `POST /api/club/:id/join` - Join club

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id` - Update user (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

---

## 👥 User Roles

- **Student** - Access all features, create tasks, join clubs
- **Teacher** - All student features + manage classes
- **Staff** - Library management
- **Admin** - Full platform control
- **Club** - Manage club events and members

---

## 🚀 Deployment

### Render.com

1. Push to GitHub
2. Create new Web Service for backend
3. Create new Static Site for frontend
4. Add environment variables
5. Deploy!

See `render.yaml` for configuration.

### MongoDB Atlas

1. Create free cluster at mongodb.com
2. Create database user
3. Whitelist IP (0.0.0.0/0)
4. Copy connection string to MONGODB_URI

---

## 📝 Scripts

### Backend
```bash
npm start          # Production server
npm run dev        # Development (nodemon)
node add-admin.js  # Create admin user
```

### Frontend
```bash
npm run dev        # Dev server (Vite)
npm run build      # Production build
npm run preview    # Preview build
```

---

## 🎨 Design

- **Primary Color**: Nectar Yellow (#FFC107)
- **Themes**: Light & Dark mode
- **Framework**: Bootstrap 5.3
- **Typography**: System fonts
- **Mobile First**: Fully responsive

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB connection
- Verify .env file exists
- Ensure port 3000 is free

**Frontend can't connect?**
- Verify backend is running
- Check API URL in `src/services/api.js`
- Check CORS configuration

**Email not sending?**
- Use Gmail app password (not regular password)
- Enable 2FA on Gmail account

**AI not working?**
- Verify GROQ_API_KEY is correct
- Check API quota at console.groq.com

---

## 👥 Team

**ASTRA Development Team**

- **Krishna Kashab Lalwani** - Team Leader
- **Kaveti Sanjana** - Team Member
- **Mooli Tanvi Reddy** - Team Member

---

## 📞 Support

- Email: astra.campushive@gmail.com
- GitHub Issues: [github.com/krishnakashablalwani/ASTRA](https://github.com/krishnakashablalwani/ASTRA)

---

## 🙏 Acknowledgments

- Groq for AI API
- MongoDB for database
- Render for hosting
- Bootstrap for UI framework

---

## 📄 License

Educational project - Free to use and modify

---

**Built with ❤️ by ASTRA Team**