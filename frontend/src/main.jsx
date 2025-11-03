import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { registerSW } from 'virtual:pwa-register'
import { initPush } from './push'
import App from './App'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Calendar from './pages/Calendar'
import Clubs from './pages/Clubs'
import Notifications from './pages/Notifications'
import Timetables from './pages/Timetables'
import Tasks from './pages/Tasks'
import TalentShowcase from './pages/TalentShowcase'
import Library from './pages/Library'
import StudySnap from './pages/StudySnap'
import Timer from './pages/Timer'
import Feedback from './pages/Feedback'
import EventChatbot from './pages/EventChatbot'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import '../public/bootstrap.min.css';
import './styles.css';

// Register service worker for PWA
registerSW({ immediate: true })

// Initialize push notifications when user is authenticated
if (typeof window !== 'undefined') {
  const hasToken = !!localStorage.getItem('token')
  if (hasToken && Notification && Notification.permission !== 'denied') {
    // Delay slightly to ensure SW is ready
    setTimeout(() => {
      initPush()
    }, 1000)
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/clubs" element={<ProtectedRoute><Clubs /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/timetables" element={<ProtectedRoute><Timetables /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
            <Route path="/showcase" element={<ProtectedRoute><TalentShowcase /></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
            <Route path="/studysnap" element={<ProtectedRoute><StudySnap /></ProtectedRoute>} />
            <Route path="/timer" element={<ProtectedRoute><Timer /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
            <Route path="/chatbot" element={<ProtectedRoute><EventChatbot /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
