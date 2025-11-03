import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const currentUser = (()=>{
    try { return JSON.parse(localStorage.getItem('user')||'{}'); } catch { return {}; }
  })();

  async function loadClubs() {
    try {
      const res = await api.get('/club');
      setClubs(res.data);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      console.error('Load clubs error:', errorMsg, err.response?.data);
      setError(errorMsg);
    }
  }

  useEffect(() => {
    loadClubs();
  }, []);

  async function createClub(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a club name');
      return;
    }
    try {
      await api.post('/club', { name, description });
      setName(''); 
      setDescription('');
      setError(null);
      await loadClubs();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      console.error('Create club error:', errorMsg, err.response?.data);
      setError(errorMsg);
    }
  }

  async function joinClub(id) {
    try {
      await api.post(`/club/${id}/members`);
      setError(null);
      await loadClubs();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      console.error('Join club error:', errorMsg, err.response?.data);
      setError(errorMsg);
    }
  }

  // AI Suggestion removed per request

  function isCreator(c) {
    const creatorId = c.createdBy?._id || c.createdBy;
    return creatorId && creatorId === currentUser?._id;
  }

  function startEdit(c) {
    setEditingId(c._id);
    setEditName(c.name || '');
    setEditDescription(c.description || '');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  }

  async function saveEdit(id) {
    try {
      await api.put(`/club/${id}`, { name: editName, description: editDescription });
      setError(null);
      cancelEdit();
      await loadClubs();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      console.error('Update club error:', errorMsg, err.response?.data);
      setError(errorMsg);
    }
  }

  async function deleteClub(id) {
    if (!window.confirm('Delete this club? This cannot be undone.')) return;
    try {
      await api.delete(`/club/${id}`);
      setError(null);
      await loadClubs();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      console.error('Delete club error:', errorMsg, err.response?.data);
      setError(errorMsg);
    }
  }

  return (
    <div className="py-4">
      <h2 className="mb-4 text-warning">Clubs</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>Create Club</h5>
            <form onSubmit={createClub}>
              <input className="form-control mb-2" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
              <textarea className="form-control mb-2" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
              <button className="btn btn-warning" type="submit">Create</button>
            </form>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>All Clubs</h5>
            {clubs.length===0 ? <p className="text-muted">No clubs yet.</p> : (
              <ul className="list-group">
                {clubs.map(c=> {
                  const alreadyMember = Array.isArray(c.members) && c.members.some(m=> (m?._id||m) === currentUser?._id);
                  const creatorId = c.createdBy?._id || c.createdBy;
                  const creatorName = c.createdBy?.name || c.createdBy?.email || (creatorId === currentUser?._id ? (currentUser?.name || 'You') : 'Unknown');
                  return (
                    <li className="list-group-item" key={c._id}>
                      {editingId === c._id ? (
                        <div className="d-flex flex-column gap-2">
                          <input className="form-control" value={editName} onChange={e=>setEditName(e.target.value)} />
                          <textarea className="form-control" value={editDescription} onChange={e=>setEditDescription(e.target.value)} />
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-success" onClick={()=>saveEdit(c._id)}>Save</button>
                            <button className="btn btn-sm btn-secondary" onClick={cancelEdit}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold">{c.name}</div>
                            <div className="small text-muted">{c.description}</div>
                            <div className="small" style={{color:'var(--nectar-text-secondary)'}}>
                              Created by: {creatorName}
                              {typeof c.memberCount === 'number' && (
                                <span className="ms-2">
                                  {c.memberCount} {c.memberCount === 1 ? 'member' : 'members'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="d-flex gap-2 align-items-center">
                            <button className="btn btn-sm btn-outline-primary" disabled={alreadyMember} onClick={()=>joinClub(c._id)}>
                              {alreadyMember ? 'Joined' : 'Join'}
                            </button>
                            {isCreator(c) && (
                              <>
                                <button className="btn btn-sm btn-outline-warning" onClick={()=>startEdit(c)}>Edit</button>
                                <button className="btn btn-sm btn-outline-danger" onClick={()=>deleteClub(c._id)}>Delete</button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
