import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

export default function Timetables() {
  const { theme } = useTheme();
  const [list, setList] = useState([]);
  const [parsedSchedule, setParsedSchedule] = useState([]);
  const [error, setError] = useState(null);
  const [savingTimetable, setSavingTimetable] = useState(false);
  const [newSlot, setNewSlot] = useState({ day: 'Monday', startTime: '', endTime: '', subject: '', room: '', class: '' });
  const [editingId, setEditingId] = useState(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  async function load() {
    try {
      const res = await api.get('/timetables');
      setList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }
  
  useEffect(()=>{ load(); }, []);

  async function saveTimetable() {
    if (!parsedSchedule.length) {
      setError('No timetable to save');
      return;
    }
    
    setSavingTimetable(true);
    try {
      if (editingId) {
        await api.put(`/timetables/${editingId}` , { parsedSchedule, aiGenerated: false });
      } else {
        await api.post('/timetables', { parsedSchedule, aiGenerated: false });
      }
      setError(null);
      load();
      alert(editingId ? 'Timetable updated successfully!' : 'Timetable saved successfully!');
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSavingTimetable(false);
    }
  }

  function addSlot(e) {
    e?.preventDefault?.();
    setError(null);
    if (!newSlot.subject || !newSlot.startTime || !newSlot.endTime) {
      setError('Please fill day, start time, end time, and subject.');
      return;
    }
    setParsedSchedule(prev => [...prev, { ...newSlot }]);
    setNewSlot({ day: newSlot.day || 'Monday', startTime: '', endTime: '', subject: '', room: '', class: '' });
  }

  function removeSlot(index) {
    setParsedSchedule(prev => prev.filter((_, i) => i !== index));
  }

  function loadForEdit(t) {
    setParsedSchedule(Array.isArray(t?.parsedSchedule) ? t.parsedSchedule : []);
    setEditingId(t?._id || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteTimetable(id) {
    if (!id) return;
    if (!confirm('Delete this timetable? This cannot be undone.')) return;
    try {
      await api.delete(`/timetables/${id}`);
      if (editingId === id) {
        setEditingId(null);
        setParsedSchedule([]);
      }
      await load();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  // Group schedule by day for display, keeping original indices
  const groupByDay = () => {
    const grouped = {};
    daysOfWeek.forEach(day => grouped[day] = []);
    parsedSchedule.forEach((slot, index) => {
      if (grouped[slot.day]) {
        grouped[slot.day].push({ slot, index });
      }
    });
    return grouped;
  };

  const scheduleByDay = groupByDay();

  return (
    <div className="py-4">
      <h2 className="mb-4 text-warning">📅 Timetable</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {editingId && (
        <div className="alert alert-info d-flex justify-content-between align-items-center">
          <span>Editing saved timetable</span>
          <button className="btn btn-sm btn-outline-secondary" onClick={()=>{ setEditingId(null); setParsedSchedule([]); }}>New Timetable</button>
        </div>
      )}
      
      <div className="row g-4">
        {/* Manual editor */}
        <div className="col-lg-5">
          <div className="card p-4 shadow-sm h-100 border-0">
            <h5 className="mb-3">
              <i className="bi bi-pencil-square me-2"></i>Manual Timetable Editor
            </h5>
            <div className="row g-2 align-items-end">
              <div className="col-6">
                <label className="form-label">Day</label>
                <select className="form-select" value={newSlot.day} onChange={e=>setNewSlot(s=>({...s, day:e.target.value}))}>
                  {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Subject</label>
                <input className="form-control" value={newSlot.subject} onChange={e=>setNewSlot(s=>({...s, subject:e.target.value}))} placeholder="e.g., Data Structures" />
              </div>
              <div className="col-6">
                <label className="form-label">Start Time</label>
                <input type="time" className="form-control" value={newSlot.startTime} onChange={e=>setNewSlot(s=>({...s, startTime:e.target.value}))} />
              </div>
              <div className="col-6">
                <label className="form-label">End Time</label>
                <input type="time" className="form-control" value={newSlot.endTime} onChange={e=>setNewSlot(s=>({...s, endTime:e.target.value}))} />
              </div>
              <div className="col-6">
                <label className="form-label">Room</label>
                <input className="form-control" value={newSlot.room} onChange={e=>setNewSlot(s=>({...s, room:e.target.value}))} placeholder="e.g., C-201" />
              </div>
              <div className="col-6">
                <label className="form-label">Class</label>
                <input className="form-control" value={newSlot.class} onChange={e=>setNewSlot(s=>({...s, class:e.target.value}))} placeholder="e.g., CS-3A" />
              </div>
              <div className="col-12 d-flex justify-content-end">
                <button className="btn btn-primary" onClick={addSlot}><i className="bi bi-plus-circle me-2"></i>Add Slot</button>
              </div>
            </div>

            {parsedSchedule.length > 0 && (
              <div className="mt-3">
                <button 
                  className="btn btn-success"
                  onClick={saveTimetable}
                  disabled={savingTimetable}
                >
                  {savingTimetable ? 'Saving...' : (editingId ? '💾 Update Timetable' : '💾 Save Timetable')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Timetable Display */}
        <div className="col-lg-7">
          {parsedSchedule.length > 0 ? (
            <div className="card p-4 shadow-sm border-0">
              <h5 className="mb-4">
                <i className="bi bi-calendar-week me-2"></i>Your Weekly Timetable
              </h5>
              
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead style={{background: 'var(--nectar-primary)', color: '#000'}}>
                    <tr>
                      <th style={{width: '120px'}}>Day</th>
                      <th style={{width: '150px'}}>Time</th>
                      <th>Subject/Activity</th>
                      <th style={{width: '80px'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {daysOfWeek.map(day => {
                      const daySlots = scheduleByDay[day];
                      if (daySlots.length === 0) return null;
                      
                      return daySlots.map(({ slot, index: absoluteIndex }, idx) => {
                        return (
                        <tr key={`${day}-${idx}`}>
                          {idx === 0 && (
                            <td rowSpan={daySlots.length} className="fw-bold align-middle" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
                              {day}
                            </td>
                          )}
                          <td style={{color: 'var(--nectar-text-secondary)'}}>
                            <small>{slot.startTime} - {slot.endTime}</small>
                          </td>
                          <td>
                            <strong>{slot.subject}</strong>
                            {slot.room && <div className="small" style={{color: 'var(--nectar-text-secondary)'}}>Room: {slot.room}</div>}
                            {slot.class && <div className="small" style={{color: 'var(--nectar-text-secondary)'}}>Class: {slot.class}</div>}
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-danger" onClick={()=>removeSlot(absoluteIndex)} title="Remove">
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card p-5 shadow-sm text-center border-0">
              <div style={{color: 'var(--nectar-text-secondary)'}} className="mb-3">
                <i className="bi bi-calendar2-x" style={{fontSize: '3rem'}}></i>
              </div>
              <h5 style={{color: 'var(--nectar-text-secondary)'}}>No Timetable Entries</h5>
              <p style={{color: 'var(--nectar-text-secondary)'}}>Use the Manual Timetable Editor to add your classes.</p>
            </div>
          )}
        </div>
      </div>

      {/* Saved Timetables */}
      {list.length > 0 && (
        <div className="row mt-4">
          <div className="col-12">
            <div className="card p-4 shadow-sm border-0">
              <h5 className="mb-3">
                <i className="bi bi-bookmark-star me-2"></i>Saved Timetables
              </h5>
              <div className="row g-3">
                {list.map(t => (
                  <div key={t._id} className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body d-flex flex-column">
                        <h6>
                          {t.aiGenerated ? '🤖 AI Generated' : '📄 Manual'} Timetable
                        </h6>
                        <p className="small" style={{color: 'var(--nectar-text-secondary)'}}>
                          Created: {new Date(t.uploadedAt).toLocaleDateString()}
                        </p>
                        {t.parsedSchedule && t.parsedSchedule.length > 0 && (
                          <p className="small">
                            <span className="badge bg-info">{t.parsedSchedule.length} time slots</span>
                          </p>
                        )}
                        <div className="mt-auto d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={()=>loadForEdit(t)}>
                            <i className="bi bi-pencil-square me-1"></i>Edit
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={()=>deleteTimetable(t._id)}>
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
