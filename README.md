# 🐝 CampusHive

**Buzzing with campus activity**

A comprehensive digital campus management platform for events, clubs, academics, and student engagement.

---

## 🚀 Features

- **📅 Event Management** - Create, browse, and RSVP to campus events
- **🎓 Academic Tools** - Timetables, tasks
- **📚 Library System** - Book browsing and checkout management
- **🤖 AI Chatbot** - Event queries with Google Maps integration
- **⏱️ Study Timer** - Pomodoro-style focus sessions with history tracking
- **📸 StudySnap** - Share study moments with the community
- **🏛️ Clubs** - Join and create student organizations
- **� Feedback** - Rate and improve campus services
- **�🔔 Notifications** - Real-time push notifications
- **🌓 Dark/Light Mode** - Customizable theme
- **👤 Profile Management** - Update your information and preferences

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
# Add .env file with:
# - MONGODB_URI (localhost or MongoDB Atlas)
# - JWT_SECRET
# - BREVO_API_KEY (from https://app.brevo.com/settings/keys/api)
# - GROQ_API_KEY
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
- Brevo API (Email Service)
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
- AI-powered event chatbot with Google Maps
- Email confirmations

### Academic Tools
- **Tasks** - Assignment tracking with AI improvement suggestions
- **Timer** - Pomodoro study sessions with session history
- **Timetables** - Upload and view class schedules

### Library System
- Book catalog browsing
- Checkout/return management
- Due date tracking
- Email reminders for returns

### Social Features
- **StudySnap** - Share study photos and moments
- **Clubs** - Join and create student organizations
- **Feedback** - Rate campus services and facilities

### Admin Features
- User management
- Platform analytics
- Announcements
- Activity monitoring

---

## 🔑 Environment Variables

Create `app/backend/.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/campushive
# For production (MongoDB Atlas):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campushive

# Authentication
JWT_SECRET=your_secret_key

# Email (Brevo API - 300 emails/day free)
# Get API key from https://app.brevo.com/settings/keys/api
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=noreply@campushive.app

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

### Render.com (Recommended)

**Backend Setup:**
1. Push code to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repository
4. Settings:
   - **Build Command:** `cd app/backend && npm install`
   - **Start Command:** `cd app/backend && npm start`
   - **Environment:** Node
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campushive
   JWT_SECRET=your_random_secret_key
   BREVO_API_KEY=xkeysib-your-api-key
   EMAIL_FROM=noreply@campushive.app
   GROQ_API_KEY=gsk_your_groq_key
   GROQ_MODEL=llama-3.3-70b-versatile
   VAPID_PUBLIC_KEY=your_vapid_public
   VAPID_PRIVATE_KEY=your_vapid_private
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=secure_password
   ```
6. Click "Create Web Service"

**Frontend Setup:**
1. Render Dashboard → New → Static Site
2. Connect same repository
3. Settings:
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
4. Deploy!

**Important Notes:**
- ⚠️ **MongoDB Atlas Required:** Render doesn't support localhost MongoDB
- ⚠️ **Use API Keys:** Make sure to use Brevo API key (not SMTP)
- ⚠️ **URL-Encode Passwords:** If MongoDB password has special characters (@, #, $), URL-encode them

See `render.yaml` for configuration reference.

### MongoDB Atlas (Required for Render)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free M0 cluster (512MB storage - free forever)
3. **Database Access:**
   - Click "Database Access" → Add New User
   - Username: `campushive`
   - Password: Set secure password (avoid special characters or URL-encode them)
   - Privileges: "Read and write to any database"
4. **Network Access:**
   - Click "Network Access" → Add IP Address
   - Enter: `0.0.0.0/0` (allow from anywhere)
   - Or add Render's IP range for better security
5. **Get Connection String:**
   - Click "Database" → Connect → Connect your application
   - Copy connection string:
     ```
     mongodb+srv://campushive:PASSWORD@cluster0.xxxxx.mongodb.net/campushive
     ```
   - Replace `PASSWORD` with your actual password
   - Add to Render as `MONGODB_URI` environment variable

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

**Site not loading after long inactivity?**
- ⚠️ **Do a hard refresh** to clear cached assets:
  - **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`
  - **Mac:** `Cmd + Shift + R`
- This ensures you get the latest version after server updates or deployments

**Email not sending?**
- Use Gmail app password (not regular password)
- Enable 2FA on Gmail account

**AI not working?**
- Verify GROQ_API_KEY is correct
- Check API quota at console.groq.com

---

## 👥 Team

**ASTRA Development Team**

### Krishna Kashab Lalwani - Team Leader
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/krishnakashablalwani)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/krishna-kashab-lalwani/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/krishnakashablalwani/)

### Kaveti Sanjana - Team Member
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/KavetiSanjana)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sanjana-kaveti-8230a9391/)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/sanjanakaveti_/)

### Mooli Tanvi Reddy - Team Member
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/10VReddy)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)]([http://www.linkedin.com/in/mooli-tanvi-reddy-70616b391](http://www.linkedin.com/in/mooli-tanvi-reddy-70616b391))
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/sparkle_tanvi_reddy/)

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