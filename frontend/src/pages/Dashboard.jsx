import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AIChat from '../components/AIChat';
import { initPush } from '../push';

export default function Dashboard() {
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [timetable, setTimetable] = useState([]);
  const [testSending, setTestSending] = useState(false);
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testMsg, setTestMsg] = useState('');
  
  const userRole = (user.role || '').toLowerCase();
  const canAccessStudentFeatures = ['student', 'admin'].includes(userRole);
  const isTeacher = userRole === 'teacher';
  const isLibrarian = userRole === 'staff';
  
  const stats = useMemo(() => ([
    { label: 'Upcoming Events', value: events.length, color: 'primary', icon: '/events.png', link: '/calendar' },
    { label: 'My Clubs', value: '→', color: 'success', icon: '/clubs.png', link: '/clubs' },
    { label: 'Tasks', value: '→', color: 'warning', icon: '/tasks.png', link: '/tasks' },
    { label: 'Library', value: '→', color: 'info', icon: '/library.png', link: '/library' },
  ]), [events.length]);

  useEffect(() => {
    async function load() {
      try {
        
        const userRes = await api.get('/auth/me');
        if (userRes.data?.user) {
          setUser(userRes.data.user);
          localStorage.setItem('user', JSON.stringify(userRes.data.user));
        }
        
        
        const res = await api.get('/events');
        setEvents(res.data);
        
        
        if (userRes.data?.user?.role === 'teacher') {
          try {
            const ttRes = await api.get('/timetables');
            
            const allSlots = ttRes.data.flatMap(tt => tt.parsedSchedule || []);
            setTimetable(allSlots);
          } catch (err) {
            console.error('Error fetching timetable:', err);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
    load();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  async function sendTestNotification() {
    setTestMsg('');
    setTestSending(true);
    try {
      
      await initPush();
      await api.post('/push/test');
      setTestMsg('Test notification sent. Check your device notifications.');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      setTestMsg(`Failed to send test: ${msg}`);
    } finally {
      setTestSending(false);
    }
  }

  async function sendTestEmail() {
    setTestMsg('');
    setTestEmailSending(true);
    try {
      const response = await api.post('/push/test-email');
      setTestMsg(response.data.message || 'Test email sent successfully! Check your inbox.');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      setTestMsg(`Failed to send test email: ${msg}`);
    } finally {
      setTestEmailSending(false);
    }
  }

  return (
    <div className="container-fluid py-2">
      <div className="mb-4">
        <div 
          className="p-4 rounded-5 shadow-lg position-relative overflow-hidden honey-hero"
          style={{ minHeight: 160 }}
        >
          <div className="position-relative text-white">
            <div className="d-flex justify-content-between align-items-center">
              <div className="me-3">
                <h1 className="display-4 fw-bold mb-2">{getGreeting()}, {user?.name || 'Student'}! 👋</h1>
                <p className="lead mb-0">Welcome to CampusHive - Your unified hub for campus life</p>
              </div>
              {/* Profile avatar slightly larger on dashboard */}
              <Link to="/profile" className="text-decoration-none">
                <div
                  className="d-flex align-items-center justify-content-center bg-white bg-opacity-25"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.7)',
                    overflow: 'hidden',
                  }}
                  title="My Profile"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `${window.location.origin}${user.avatarUrl}`}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span className="fw-bold text-white" style={{ userSelect: 'none' }}>
                      {(user?.name || 'U').slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row g-4 mb-5">
        {stats.map((s, idx) => (
          <div className="col-md-6 col-lg-3" key={idx}>
            <Link to={s.link} className="text-decoration-none">
              <div 
                className={`card border-0 shadow-sm h-100 hover-lift`}
                style={{ 
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className={`p-3 bg-${s.color} bg-opacity-10`}
                      style={{ width: 72, height: 72, borderRadius: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <img src={s.icon} alt={s.label} style={{ width: 44, height: 44, borderRadius: '100%' }} />
                    </div>
                  </div>
                  <h6 className="text-muted mb-2">{s.label}</h6>
                  <h2 className={`fw-bold mb-0 text-${s.color}`}>{s.value}</h2>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* AI Chat Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">
            <i className="bi bi-robot text-primary me-2"></i>
            AI Assistant
          </h3>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary" onClick={sendTestNotification} disabled={testSending}>
              {testSending ? 'Sending…' : 'Send test notification'}
            </button>
            <button className="btn btn-outline-primary" onClick={sendTestEmail} disabled={testEmailSending}>
              {testEmailSending ? 'Sending…' : 'Send test email'}
            </button>
          </div>
        </div>
        {testMsg && (
          <div className={`alert ${testMsg.startsWith('Failed') ? 'alert-danger' : 'alert-info'} mb-3`}>
            {testMsg}
          </div>
        )}
        <AIChat />
      </div>

      {error && <div className="alert alert-danger shadow-sm" style={{ borderRadius: 12 }}>{error}</div>}

      {/* Upcoming Events */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">
            <i className="bi bi-calendar-event text-primary me-2"></i>
            Upcoming Events
          </h3>
          <Link to="/calendar" className="btn btn-outline-primary" style={{ borderRadius: 12 }}>
            View All <i className="bi bi-arrow-right ms-1"></i>
          </Link>
        </div>
        {events.length === 0 ? (
          <div className="card shadow-sm border-0" style={{ borderRadius: 16 }}>
            <div className="card-body text-center py-5">
              <i className="bi bi-calendar-x display-1 text-muted mb-3"></i>
              <h4 className="text-muted">No upcoming events</h4>
              <p className="text-muted">Check back later for exciting campus events!</p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {events.slice(0, 6).map(ev => (
              <div className="col-md-6 col-lg-4" key={ev._id}>
                <div 
                  className="card h-100 border-0 shadow-sm"
                  style={{ 
                    borderRadius: 16,
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title text-primary mb-0">{ev.title}</h5>
                      {ev.club && (
                        <span className="badge bg-success">{ev.club.name}</span>
                      )}
                    </div>
                    <div className="mb-2">
                      <i className="bi bi-calendar3 text-muted me-2"></i>
                      <small className="text-muted">
                        {new Date(ev.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </small>
                    </div>
                    {ev.time && (
                      <div className="mb-2">
                        <i className="bi bi-clock text-muted me-2"></i>
                        <small className="text-muted">{ev.time}</small>
                      </div>
                    )}
                    {ev.location && (
                      <div className="mb-3">
                        <i className="bi bi-geo-alt text-muted me-2"></i>
                        <small className="text-muted">{ev.location}</small>
                      </div>
                    )}
                    {ev.description && (
                      <p className="card-text text-muted small mb-0">
                        {ev.description.length > 100 
                          ? ev.description.substring(0, 100) + '...' 
                          : ev.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
  <div className="row g-4 mt-4">
        {canAccessStudentFeatures && (
          <div className="col-md-4">
            <Link to="/studysnap" className="text-decoration-none">
              <div 
                className="card border-0 shadow-sm"
                style={{ 
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div className="card-body p-4 text-white">
                  <i className="bi bi-camera-fill fs-1 mb-3 d-block"></i>
                  <h4 className="mb-2">StudySnap</h4>
                  <p className="mb-0 opacity-75">Share what you're studying</p>
                </div>
              </div>
            </Link>
          </div>
        )}
        {canAccessStudentFeatures && (
          <div className="col-md-4">
            <Link to="/timer" className="text-decoration-none">
              <div 
                className="card border-0 shadow-sm"
                style={{ 
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div className="card-body p-4 text-white">
                  <i className="bi bi-stopwatch-fill fs-1 mb-3 d-block"></i>
                  <h4 className="mb-2">Study Timer</h4>
                  <p className="mb-0 opacity-75">Track your study sessions</p>
                </div>
              </div>
            </Link>
          </div>
        )}
        <div className="col-md-4">
          <Link to="/chatbot" className="text-decoration-none">
            <div 
              className="card border-0 shadow-sm"
              style={{ 
                borderRadius: 16,
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="card-body p-4 text-white">
                <i className="bi bi-robot fs-1 mb-3 d-block"></i>
                <h4 className="mb-2">Event Chatbot</h4>
                <p className="mb-0 opacity-75">Ask about events & locations</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/feedback" className="text-decoration-none">
            <div 
              className="card border-0 shadow-sm"
              style={{ 
                borderRadius: 16,
                background: 'linear-gradient(135deg, #ffd86f 0%, #fc6262 100%)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div className="card-body p-4 text-white">
                <i className="bi bi-chat-square-text fs-1 mb-3 d-block"></i>
                <h4 className="mb-2">Feedback</h4>
                <p className="mb-0 opacity-75">Share about college & facilities</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Teacher Timetable Section */}
      {isTeacher && (
        <div className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-0">
              <i className="bi bi-calendar-week text-primary me-2"></i>
              My Timetable
            </h3>
            <Link to="/timetables" className="btn btn-outline-primary" style={{ borderRadius: 12 }}>
              Manage Timetable <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
          {timetable.length === 0 ? (
            <div className="card shadow-sm border-0" style={{ borderRadius: 16 }}>
              <div className="card-body text-center py-5">
                <i className="bi bi-calendar-week display-1 mb-3" style={{color: 'var(--nectar-text-secondary)'}}></i>
                <h4 style={{color: 'var(--nectar-text-secondary)'}}>No timetable entries yet</h4>
                <p style={{color: 'var(--nectar-text-secondary)'}}>Add your class schedule to get started</p>
                <Link to="/timetables" className="btn btn-primary mt-2">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Schedule
                </Link>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm border-0" style={{ borderRadius: 16 }}>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead style={{background: 'var(--nectar-primary)', color: '#000'}}>
                      <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Subject</th>
                        <th>Room</th>
                        <th>Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.slice(0, 5).map((entry, idx) => (
                        <tr key={idx}>
                          <td>{entry.day || 'N/A'}</td>
                          <td>
                            {entry.startTime && entry.endTime 
                              ? `${entry.startTime} - ${entry.endTime}` 
                              : (entry.time || 'N/A')}
                          </td>
                          <td><strong>{entry.subject || 'N/A'}</strong></td>
                          <td>{entry.room || 'N/A'}</td>
                          <td>{entry.class || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Librarian Quick Actions Section */}
      {isLibrarian && (
        <div className="mt-5">
          <h3 className="mb-4">
            <i className="bi bi-book text-primary me-2"></i>
            Library Quick Actions
          </h3>
          <div className="row g-4">
            <div className="col-md-6">
              <Link to="/library" state={{ openAddBook: true }} className="text-decoration-none">
                <div 
                  className="card border-0 shadow-sm"
                  style={{ 
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div className="card-body p-4 text-white">
                    <i className="bi bi-plus-circle-fill fs-1 mb-3 d-block"></i>
                    <h4 className="mb-2">Add New Book</h4>
                    <p className="mb-0 opacity-75">Add books to library inventory</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-6">
              <Link to="/library" state={{ openCheckout: true }} className="text-decoration-none">
                <div 
                  className="card border-0 shadow-sm"
                  style={{ 
                    borderRadius: 16,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div className="card-body p-4 text-white">
                    <i className="bi bi-arrow-right-circle-fill fs-1 mb-3 d-block"></i>
                    <h4 className="mb-2">Checkout Book</h4>
                    <p className="mb-0 opacity-75">Issue books to students</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
