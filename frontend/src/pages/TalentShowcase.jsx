import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function TalentShowcase() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

  async function load() {
    try {
      const res = await api.get('/talentshowcase');
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  }
  useEffect(()=>{ load(); }, []);

  async function add(e) {
    e.preventDefault();
    try {
      await api.post('/talentshowcase', { title, link: url });
      setTitle(''); setUrl('');
      await load();
    } catch (err) { setError(err.response?.data?.error || err.message); }
  }

  return (
    <div className="py-4">
      <h2 className="mb-4 text-warning">Talent Showcase</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        <div className="col-md-5">
          <div className="card p-3 shadow-sm">
            <h5>Add Item</h5>
            <form onSubmit={add}>
              <input className="form-control mb-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
              <input className="form-control mb-2" placeholder="Link (YouTube/Drive/GitHub)" value={url} onChange={e=>setUrl(e.target.value)} />
              <button className="btn btn-warning">Add</button>
            </form>
          </div>
        </div>
        <div className="col-md-7">
          <div className="card p-3 shadow-sm">
            <h5>Showcase</h5>
            {items.length===0 ? <p className="text-muted">No items yet.</p> : (
              <ul className="list-group">
                {items.map(i => (
                  <li key={i._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{i.title}</div>
                      <a href={i.link} target="_blank" rel="noreferrer">{i.link}</a>
                    </div>
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
