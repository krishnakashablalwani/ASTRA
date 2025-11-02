import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priorityHints, setPriorityHints] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    try {
      const res = await api.get('/task');
      setTasks(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }
  useEffect(()=>{ load(); }, []);

  async function create(e) {
    e.preventDefault();
    try {
      await api.post('/task', { 
        title, 
        description: desc,
        dueDate: dueDate || undefined
      });
      setTitle(''); 
      setDesc('');
      setDueDate('');
      await load();
    } catch (err) { setError(err.response?.data?.error || err.message); }
  }

  async function prioritize() {
    setLoading(true);
    try {
      const res = await api.post('/task/ai/prioritize', { tasks });
      setPriorityHints(res.data?.prioritization || JSON.stringify(res.data, null, 2));
    } catch (err) { setError(err.response?.data?.error || err.message); }
    finally { setLoading(false); }
  }

  const getUrgencyBadge = (task) => {
    if (!task.dueDate) return { color: 'secondary', text: 'No Due Date' };
    
    const now = new Date();
    const due = new Date(task.dueDate);
    const daysUntilDue = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return { color: 'danger', text: 'Overdue!' };
    if (daysUntilDue === 0) return { color: 'danger', text: 'Due Today' };
    if (daysUntilDue === 1) return { color: 'warning', text: 'Due Tomorrow' };
    if (daysUntilDue <= 3) return { color: 'warning', text: `${daysUntilDue} days left` };
    if (daysUntilDue <= 7) return { color: 'info', text: `${daysUntilDue} days left` };
    return { color: 'success', text: `${daysUntilDue} days left` };
  };

  return (
    <div className="py-4">
      <h2 className="mb-4 text-warning">Tasks</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Create Task</h5>
            <form onSubmit={create}>
              <input 
                className="form-control mb-2" 
                placeholder="Title" 
                value={title} 
                onChange={e=>setTitle(e.target.value)} 
                required
              />
              <textarea 
                className="form-control mb-2" 
                placeholder="Description" 
                value={desc} 
                onChange={e=>setDesc(e.target.value)} 
              />
              <input 
                type="date" 
                className="form-control mb-2" 
                placeholder="Due Date (Optional)" 
                value={dueDate} 
                onChange={e=>setDueDate(e.target.value)} 
              />
              <small className="text-muted d-block mb-2">Due date is optional - helps with AI prioritization</small>
              <button className="btn btn-warning">Add</button>
            </form>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>My Tasks</h5>
            {tasks.length===0 ? <p className="text-muted">No tasks yet.</p> : (
              <ul className="list-group">
                {tasks.map(t => {
                  const urgency = getUrgencyBadge(t);
                  return (
                    <li key={t._id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1">
                          <div className="fw-bold">{t.title}</div>
                          <div className="small text-muted">{t.description}</div>
                          {t.dueDate && (
                            <div className="small text-muted mt-1">
                              <i className="bi bi-calendar3 me-1"></i>
                              Due: {new Date(t.dueDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        <span className={`badge bg-${urgency.color} ms-2`} style={{whiteSpace: 'nowrap'}}>
                          {urgency.text}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
            <button className="btn btn-info text-dark mt-3" onClick={prioritize} disabled={loading || tasks.length===0}>{loading ? 'Prioritizing...' : 'AI Prioritize'}</button>
            {priorityHints && <pre className="mt-2" style={{whiteSpace:'pre-wrap'}}>{priorityHints}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
}
