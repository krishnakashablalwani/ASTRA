import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

export default function Profile() {
  const { theme } = useTheme();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    dob: '',
    bloodGroup: '',
  });
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      let u = null;
      try {
        const res = await api.get('/profile');
        u = res.data || {};
      } catch (err) {
        // If profile route is not available yet (404), fall back to /auth/me for basic fields
        if (err?.response?.status === 404) {
          const me = await api.get('/auth/me');
          u = me.data?.user || {};
        } else {
          throw err;
        }
      }
      setForm({
        name: u.name || '',
        email: u.email || '',
        phone: u.phone || '',
        department: u.department || '',
        dob: u.dob ? new Date(u.dob).toISOString().substring(0,10) : '',
        bloodGroup: u.bloodGroup || ''
      });
      setAvatarUrl(u.avatarUrl || '');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  }

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('phone', form.phone);
      fd.append('department', form.department);
      if (form.dob) fd.append('dob', form.dob);
      if (form.bloodGroup) fd.append('bloodGroup', form.bloodGroup);
      if (avatarFile) fd.append('avatar', avatarFile);
      const res = await api.put('/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const u = res.data;
      setSuccess('Profile updated');
      setAvatarFile(null);
      if (u.avatarUrl) setAvatarUrl(u.avatarUrl);
      // Persist latest user into localStorage so navbar reflects changes
      try { localStorage.setItem('user', JSON.stringify(u)); } catch {}
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1"><i className="bi bi-person-circle me-2"></i>My Profile</h2>
          <p className="text-muted mb-0">Manage your personal information</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
            <div className="card-body text-center">
              <div className="mb-3">
                <img src={avatarUrl || (theme === 'dark' ? '/dark.png' : '/light.png')} alt="avatar" style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--hive-border)' }} />
              </div>
              <div className="d-grid">
                <label className="btn btn-outline-secondary" style={{ borderRadius: 12 }}>
                  <i className="bi bi-upload me-2"></i> Upload Avatar
                  <input type="file" accept="image/*" onChange={onFile} hidden />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card border-0 shadow-sm" style={{ borderRadius: 16 }}>
            <div className="card-body">
              <form onSubmit={onSave}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input name="name" value={form.name} onChange={onChange} className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input value={form.email} className="form-control" disabled />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input name="phone" value={form.phone} onChange={onChange} className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Department</label>
                    <input name="department" value={form.department} onChange={onChange} className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dob" value={form.dob} onChange={onChange} className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Blood Group</label>
                    <input name="bloodGroup" value={form.bloodGroup} onChange={onChange} className="form-control" placeholder="e.g., A+" />
                  </div>
                </div>
                <div className="mt-4 d-flex justify-content-end">
                  <button className="btn btn-primary" style={{ borderRadius: 12 }} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
