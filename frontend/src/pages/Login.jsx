import React, { useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="row justify-content-center align-items-center" style={{minHeight:'70vh'}}>
      <div className="col-md-5">
        <div className="card shadow-lg p-4 mt-4 border-0" style={{borderRadius:16}}>
          <div className="text-center mb-4">
            <img src={theme === 'dark' ? '/dark.png' : '/light.png'} alt="CampusHive" height="80" className="mb-3" />
            <h2 className="text-warning">Welcome Back!</h2>
            <p className="text-muted">Login to continue to CampusHive</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input className="form-control form-control-lg" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input type="password" className="form-control form-control-lg" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-warning w-100 fw-bold py-2" style={{fontSize:'1.1rem'}}>Login</button>
          </form>
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <div className="text-center mt-3">
            <small className="text-muted">Don't have an account? <a href="/register" className="text-warning">Register</a></small>
          </div>
        </div>
      </div>
    </div>
  );
}
