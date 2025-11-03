import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function Calendar() {
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week, day

  // Add Event modal state
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const hasToken = (typeof window !== 'undefined') && !!localStorage.getItem('token');

  useEffect(() => {
    fetchEvents();
    fetchExams();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams');
      setExams(response.data);
    } catch (error) {
      // Exams endpoint may not exist, silently fail
      console.log('Exams feature not available');
      setExams([]);
    }
  };

  const addToGoogleCalendar = (item, type) => {
    const title = encodeURIComponent(item.title);
    const description = encodeURIComponent(item.description || '');
    const location = encodeURIComponent(item.location || '');
    const date = new Date(item.date);
    const dateStr = date.toISOString().replace(/-|:|\.\d+/g, '');
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&details=${description}&location=${location}`;
    window.open(url, '_blank');
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toDateString();
    const dayEvents = events.filter(e => new Date(e.date).toDateString() === dateStr);
    const dayExams = exams.filter(e => new Date(e.date).toDateString() === dateStr);
    return [...dayEvents.map(e => ({ ...e, type: 'event' })), ...dayExams.map(e => ({ ...e, type: 'exam' }))];
  };

  const monthDays = getDaysInMonth(selectedDate);
  const monthName = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            Academic Calendar
          </h2>
          <p className="mb-0" style={{color: 'var(--nectar-text-secondary)'}}>Events, exams, and important dates</p>
        </div>
        <img 
          src={theme === 'light' ? '/light.png' : '/dark.png'} 
          alt="CampusHive Logo" 
          style={{ height: 50 }}
        />
      </div>

      {/* Calendar Controls */}
      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: 16 }}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-outline-warning" onClick={prevMonth}>
              Previous
            </button>
            <h4 className="mb-0">{monthName}</h4>
            <button className="btn btn-outline-warning" onClick={nextMonth}>
              Next
            </button>
          </div>
          <div className="d-flex justify-content-end mt-3">
            {hasToken ? (
              <button className="btn btn-warning" onClick={() => setShowAdd(true)}>
                Add Event
              </button>
            ) : (
              <small className="text-muted">Login to add events</small>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card shadow-lg border-0" style={{ borderRadius: 16 }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <thead style={{background: 'var(--nectar-primary)', color: '#000'}}>
                <tr>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <th key={day} className="text-center p-3">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(monthDays.length / 7) }).map((_, weekIndex) => (
                  <tr key={weekIndex}>
                    {monthDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day, dayIndex) => {
                      const dayEvents = day ? getEventsForDate(day) : [];
                      const isToday = day && day.toDateString() === new Date().toDateString();
                      return (
                        <td 
                          key={dayIndex} 
                          className={`p-2 ${isToday ? 'bg-warning bg-opacity-10' : ''}`}
                          style={{ 
                            height: 120, 
                            verticalAlign: 'top', 
                            cursor: 'pointer',
                            backgroundColor: !day ? 'rgba(128, 128, 128, 0.1)' : undefined
                          }}
                        >
                          {day && (
                            <>
                              <div className={`fw-bold mb-2 ${isToday ? 'text-warning' : ''}`}>
                                {day.getDate()}
                              </div>
                              {dayEvents.map((item, idx) => (
                                <div 
                                  key={idx} 
                                  className={`badge ${item.type === 'exam' ? 'bg-danger' : 'bg-primary'} text-truncate mb-1 d-block text-start`}
                                  style={{ fontSize: '0.7rem' }}
                                  title={item.title}
                                >
                                  {item.title}
                                </div>
                              ))}
                            </>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0" style={{ borderRadius: 16 }}>
            <div className="card-body">
              <h5 className="mb-3">
                Upcoming Events
              </h5>
              {events.length === 0 ? (
                <p className="text-center py-3" style={{color: 'var(--nectar-text-secondary)'}}>No upcoming events</p>
              ) : (
                <div className="list-group list-group-flush">
                  {events.slice(0, 5).map((event, index) => (
                    <div key={index} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{event.title}</h6>
                          <small style={{color: 'var(--nectar-text-secondary)'}}>
                            {new Date(event.date).toLocaleDateString()}
                            {event.time && (
                              <span className="ms-2">
                                {event.time}
                              </span>
                            )}
                          </small>
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                          onClick={() => addToGoogleCalendar(event, 'event')}
                          title="Add to Google Calendar"
                        >
                          <span>Add to Calendar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0" style={{ borderRadius: 16 }}>
            <div className="card-body">
              <h5 className="mb-3">
                Upcoming Exams
              </h5>
              {exams.length === 0 ? (
                <p className="text-center py-3" style={{color: 'var(--nectar-text-secondary)'}}>No upcoming exams</p>
              ) : (
                <div className="list-group list-group-flush">
                  {exams.slice(0, 5).map((exam, index) => (
                    <div key={index} className="list-group-item px-0">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{exam.title}</h6>
                          <small style={{color: 'var(--nectar-text-secondary)'}}>
                            {new Date(exam.date).toLocaleDateString()}
                            {exam.time && (
                              <span className="ms-2">
                                {exam.time}
                              </span>
                            )}
                          </small>
                        </div>
                        <button 
                          className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                          onClick={() => addToGoogleCalendar(exam, 'exam')}
                          title="Add to Google Calendar"
                        >
                          <span>Add to Calendar</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="alert alert-info mt-4" role="alert">
        <div className="d-flex gap-4">
          <div>
            <span className="badge bg-primary me-2">Blue</span>
            Events
          </div>
          <div>
            <span className="badge bg-danger me-2">Red</span>
            Exams
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAdd && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Event</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAdd(false)} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  {saveError && <div className="alert alert-danger">{saveError}</div>}
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event title" />
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Date</label>
                      <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Time (optional)</label>
                      <input type="time" className="form-control" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                    </div>
                  </div>
                  <div className="mb-3 mt-3">
                    <label className="form-label">Location (optional)</label>
                    <input type="text" className="form-control" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g., Main Auditorium" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description (optional)</label>
                    <textarea className="form-control" rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief details"></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAdd(false)} disabled={saving}>Cancel</button>
                  <button type="button" className="btn btn-primary" onClick={async () => {
                    setSaveError('');
                    if (!form.title.trim()) { setSaveError('Title is required'); return; }
                    if (!form.date) { setSaveError('Date is required'); return; }
                    setSaving(true);
                    try {
                      const date = form.time ? new Date(`${form.date}T${form.time}`) : new Date(form.date);
                      const payload = {
                        title: form.title.trim(),
                        date: date.toISOString(),
                        location: form.location?.trim() || undefined,
                        description: form.description?.trim() || undefined,
                      };
                      await api.post('/events', payload);
                      setShowAdd(false);
                      setForm({ title: '', date: '', time: '', location: '', description: '' });
                      await fetchEvents();
                    } catch (e) {
                      const msg = e.response?.data?.message || e.message;
                      setSaveError(msg);
                    } finally {
                      setSaving(false);
                    }
                  }} disabled={saving}>
                    {saving ? 'Saving…' : 'Create Event'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
