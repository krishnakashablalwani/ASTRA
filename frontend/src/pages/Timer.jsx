import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function Timer() {
  const { theme } = useTheme();
  const [seconds, setSeconds] = useState(0);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [startedAt, setStartedAt] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [sessions, setSessions] = useState([]);

  // Load sessions from API
  const loadSessions = useCallback(async () => {
    try {
      const res = await api.get('/timers');
      if (res.data && Array.isArray(res.data)) {
        const formattedSessions = res.data
          .sort((a, b) => new Date(b.endTime || b.createdAt) - new Date(a.endTime || a.createdAt))
          .map(item => {
            const endTime = item.endTime || item.createdAt;
            return {
              duration: Math.max(0, Math.floor(item.duration || 0)),
              endTime: endTime, // Store ISO string
              displayDate: new Date(endTime).toLocaleString()
            };
          });
        setSessions(formattedSessions);
      }
    } catch (err) {
      console.log('Could not load timer sessions');
    }
  }, []);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      // Timer finished - auto save
      const minutesElapsed = Math.floor(initialSeconds / 60);
      if (minutesElapsed > 0) {
        saveSession(minutesElapsed);
      }
      setIsActive(false);
      setIsPaused(false);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, seconds, initialSeconds]);

  const startTimer = (minutes) => {
    const total = minutes * 60;
    setSeconds(total);
    setInitialSeconds(total);
    setStartedAt(new Date());
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setSeconds(0);
    setInitialSeconds(0);
    setStartedAt(null);
  };

  const stopTimer = () => {
    if (isActive && initialSeconds > 0) {
      const elapsed = initialSeconds - seconds;
      const minutesElapsed = Math.floor(elapsed / 60);
      if (minutesElapsed > 0) {
        saveSession(minutesElapsed);
      }
    }
    resetTimer();
  };

  const saveSession = async (minutesElapsed) => {
    if (!minutesElapsed || minutesElapsed <= 0) return;

    const now = new Date();
    const endTime = now.toISOString();
    
    // Create new session object
    const newSession = {
      duration: minutesElapsed,
      endTime: endTime,
      displayDate: now.toLocaleString()
    };

    // Add to sessions immediately for instant UI update
    setSessions(prev => [newSession, ...prev]);

    // Save to backend
    try {
      const response = await api.post('/timers', {
        startTime: startedAt ? startedAt.toISOString() : now.toISOString(),
        endTime: endTime,
        duration: minutesElapsed
      });

      // Reload all sessions from backend to ensure sync
      if (response.data) {
        await loadSessions();
      }
    } catch (err) {
      console.error('Failed to save timer session:', err?.response?.data || err?.message);
    }
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = initialSeconds > 0 ? initialSeconds : customMinutes * 60;
    if (totalTime === 0) return 0;
    const elapsed = Math.max(0, totalTime - seconds);
    return (elapsed / totalTime) * 100;
  };

  // Calculate total study time for today
  const totalStudyTime = sessions.reduce((sum, session) => {
    if (!session.endTime) return sum;
    
    const sessionDate = new Date(session.endTime);
    const today = new Date();
    
    // Check if the session is from today (same year, month, and day)
    const isSameDay = 
      sessionDate.getFullYear() === today.getFullYear() &&
      sessionDate.getMonth() === today.getMonth() &&
      sessionDate.getDate() === today.getDate();
    
    if (isSameDay) {
      return sum + (session.duration || 0);
    }
    return sum;
  }, 0);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            ⌛ Study Timer
          </h2>
          <p className="text-muted mb-0">Track your focused study sessions</p>
        </div>
        <img 
          src={theme === 'light' ? '/light.png' : '/dark.png'} 
          alt="CampusHive Logo" 
          style={{ height: 50 }}
        />
      </div>

      <div className="row">
        {/* Timer Section */}
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 mb-4" style={{ borderRadius: 16 }}>
            <div className="card-body text-center py-5">
              {/* Timer Display */}
              <div className="position-relative mb-4">
                <div 
                  className="mx-auto mb-4" 
                  style={{ 
                    width: 280, 
                    height: 280,
                    borderRadius: '50%',
                    background: `conic-gradient(var(--nectar-primary) ${getProgress()}%, var(--hive-border) 0%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <div 
                    style={{
                      width: 250,
                      height: 250,
                      borderRadius: '50%',
                      backgroundColor: 'var(--hive-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <h1 className="display-1 mb-0" style={{ fontSize: '4rem' }}>
                      {formatTime(seconds)}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Timer Controls */}
              {!isActive ? (
                <div>
                  <h5 className="mb-3">Select Duration</h5>
                  <div className="d-flex gap-2 justify-content-center mb-3 flex-wrap">
                    <button 
                      className="btn btn-outline-warning btn-lg"
                      onClick={() => startTimer(15)}
                      style={{ borderRadius: 12 }}
                    >
                      15 min
                    </button>
                    <button 
                      className="btn btn-outline-warning btn-lg"
                      onClick={() => startTimer(25)}
                      style={{ borderRadius: 12 }}
                    >
                      25 min
                    </button>
                    <button 
                      className="btn btn-outline-warning btn-lg"
                      onClick={() => startTimer(45)}
                      style={{ borderRadius: 12 }}
                    >
                      45 min
                    </button>
                    <button 
                      className="btn btn-outline-warning btn-lg"
                      onClick={() => startTimer(60)}
                      style={{ borderRadius: 12 }}
                    >
                      60 min
                    </button>
                  </div>
                  <div className="d-flex gap-2 justify-content-center align-items-center">
                    <input 
                      type="number"
                      className="form-control"
                      style={{ width: 100 }}
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 1)}
                      min="1"
                      max="180"
                    />
                    <button 
                      className="btn btn-warning btn-lg"
                      onClick={() => startTimer(customMinutes)}
                      style={{ borderRadius: 12 }}
                    >
                      Start Custom
                    </button>
                  </div>
                </div>
              ) : (
                <div className="d-flex gap-2 justify-content-center">
                  <button 
                    className="btn btn-warning btn-lg"
                    onClick={pauseTimer}
                    style={{ borderRadius: 12 }}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button 
                    className="btn btn-success btn-lg"
                    onClick={stopTimer}
                    style={{ borderRadius: 12 }}
                  >
                    Stop & Save
                  </button>
                  <button 
                    className="btn btn-danger btn-lg"
                    onClick={resetTimer}
                    style={{ borderRadius: 12 }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats & History */}
        <div className="col-lg-4">
          {/* Total Study Time */}
          <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: 16, background: 'linear-gradient(135deg, var(--nectar-primary) 0%, var(--nectar-secondary) 100%)' }}>
            <div className="card-body text-white text-center py-4">
              <h6 className="mb-2 text-uppercase">Total Study Time Today</h6>
              <h2 className="display-4 mb-0">{totalStudyTime} min</h2>
            </div>
          </div>

          {/* Session History */}
          <div className="card shadow-sm border-0" style={{ borderRadius: 16 }}>
            <div className="card-body">
              <h5 className="mb-3">
                Recent Sessions
              </h5>
              {sessions.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">No sessions yet</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {sessions.slice(0, 10).map((session, index) => (
                    <div key={index} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{session.duration} min</strong>
                        </div>
                        <small className="text-muted">{session.displayDate}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro Tips */}
      <div className="alert alert-info mt-4" role="alert">
        <h5 className="alert-heading">
          💡 Pomodoro Technique Tip
        </h5>
        <p className="mb-0">
          Study for 25 minutes with full focus, then take a 5-minute break. After 4 sessions, take a longer 15-30 minute break. 
          This helps maintain concentration and prevents burnout!
        </p>
      </div>
    </div>
  );
}
