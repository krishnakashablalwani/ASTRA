import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Leave() {
  const [list, setList] = useState([]);
  const [reason, setReason] = useState('');
  const [improved, setImproved] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    try {
      const res = await api.get('/leaves');
      setList(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }
  useEffect(()=>{ load(); }, []);

  async function create(e) {
    e.preventDefault();
    try {
      await api.post('/leaves', { reason });
      setReason(''); setImproved('');
      await load();
    } catch(err) { setError(err.response?.data?.error || err.message); }
  }

  async function improve() {
    setLoading(true);
    try {
      const res = await api.post('/leaves/ai/improve-reason', { reasonText: reason });
      setImproved(res.data?.improved || '');
    } catch(err) { setError(err.response?.data?.error || err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="py-4">
      <h2 className="mb-4 text-warning">Leave Requests</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Submit Leave</h5>
            <textarea className="form-control mb-2" placeholder="Reason" value={reason} onChange={e=>setReason(e.target.value)} />
            <div className="d-flex gap-2">
              <button className="btn btn-info text-dark" onClick={improve} disabled={loading || !reason.trim()}>{loading? 'Improving...' : 'AI Improve'}</button>
              <button className="btn btn-warning" onClick={create} disabled={!reason.trim()}>Submit</button>
            </div>
          </div>
          {improved && (
            <div className="card p-3 shadow-sm mt-3">
              <h6>Improved Reason</h6>
              <div style={{whiteSpace:'pre-wrap'}}>{improved}</div>
              <button className="btn btn-sm btn-outline-secondary mt-2" onClick={()=>setReason(improved)}>Use Improved</button>
            </div>
          )}
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>My Requests</h5>
            {list.length===0 ? <p className="text-muted">No requests.</p> : (
              <ul className="list-group">
                {list.map(l => (
                  <li key={l._id} className="list-group-item d-flex justify-content-between">
                    <span>{l.reason}</span>
                    <span className={`badge ${l.status==='approved'?'bg-success':l.status==='rejected'?'bg-danger':'bg-secondary'}`}>{l.status || 'pending'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
