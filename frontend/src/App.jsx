import React, { useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './contexts/ThemeContext';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDashboard = location.pathname === '/';
  const isAuthed = useMemo(() => !!localStorage.getItem('token'), [location.key]);
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  }, [location.key]);

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <div className="min-vh-100" style={{ background: 'var(--nectar-bg)', color: 'var(--nectar-text)' }}>
      <nav className="navbar shadow-sm mb-4" style={{ background: 'var(--hive-surface)', borderBottom: '1px solid var(--hive-border)' }}>
        <div className="container-fluid px-4">
          <Link className="navbar-brand d-flex align-items-center fw-bold text-warning" to="/">
            <img src={theme === 'dark' ? '/dark.png' : '/light.png'} alt="CampusHive" height="40" className="me-2" />
            <span>CampusHive</span>
          </Link>

          <div className="ms-auto d-flex align-items-center gap-2">
            {!isAuthed ? (
              <>
                <Link className="btn btn-sm btn-outline-secondary" to="/login">Login</Link>
                <Link className="btn btn-sm btn-outline-secondary" to="/register">Register</Link>
              </>
            ) : (
              <>
                <button className="btn btn-sm btn-outline-secondary" onClick={logout}>Logout</button>
              </>
            )}
            <button className="btn btn-sm btn-outline-warning" onClick={toggleTheme} title="Toggle theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>
      {isDashboard ? (
        <Outlet />
      ) : (
        <main className="container">
          <Outlet />
        </main>
      )}
    </div>
  );
}
