import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Notifications() {
  const [list, setList] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    try {
      const res = await api.get('/notifications');
      setList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }
  useEffect(()=>{ load(); }, []);

  async function summarize() {
    setLoading(true);
    setSummary('');
    try {
      const res = await api.get('/notifications/ai/summary');
      setSummary(res.data?.summary || '');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="py-4">
      <h2 className="mb-4 text-warning">Notifications</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        <div className="col-md-7">
          <div className="card p-3 shadow-sm">
            <h5>All Notifications</h5>
            {list.length===0 ? <p className="text-muted">No notifications.</p> : (
              <ul className="list-group">
                {list.map(n => (
                  <li key={n._id} className="list-group-item">
                    <div className="fw-bold">{n.title || n.type || 'Notification'}</div>
                    <div className="small text-muted">{n.message || n.body}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="col-md-5">
          <div className="card p-3 shadow-sm">
            <h5>AI Summary</h5>
            <button className="btn btn-info text-dark mb-2" onClick={summarize} disabled={loading}>{loading ? 'Summarizing...' : 'Summarize Unread'}</button>
            <div style={{whiteSpace:'pre-wrap'}}>{summary}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
