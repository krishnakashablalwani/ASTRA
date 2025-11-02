import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? ' active' : '';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // Normalize role and avoid defaulting to student
  const userRole = (user.role || '').toLowerCase();
  
  // Role-based feature access
  const canAccessStudentFeatures = ['student', 'admin'].includes(userRole);
  const canAccessTeacherFeatures = ['teacher', 'admin'].includes(userRole);
  const canAccessLibrarian = userRole === 'staff' || userRole === 'admin';
  const isAdmin = userRole === 'admin';
  
  return (
    <div className="sidebar border-end h-100 p-3" style={{ minWidth: 240, maxHeight: '100vh', overflowY: 'auto', background: 'var(--hive-surface)', borderColor: 'var(--hive-border)', color: 'var(--hive-text)' }}>
      <h4 className="mb-4" style={{ color: 'var(--nectar-primary)' }}>
        <i className="bi bi-grid-fill me-2"></i>
        Menu
      </h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/')}`} to="/">
            <i className="bi bi-house-door me-2"></i>Overview
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/calendar')}`} to="/calendar">
            <i className="bi bi-calendar3 me-2"></i>Calendar
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/attendance')}`} to="/attendance">
            <i className="bi bi-clipboard-check me-2"></i>Attendance
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/clubs')}`} to="/clubs">
            <i className="bi bi-people me-2"></i>My Clubs
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/notifications')}`} to="/notifications">
            <i className="bi bi-bell me-2"></i>Notifications
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/spaces')}`} to="/spaces">
            <i className="bi bi-chat-square-dots me-2"></i>Spaces
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/leave')}`} to="/leave">
            <i className="bi bi-file-earmark-text me-2"></i>Leave
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/timetables')}`} to="/timetables">
            <i className="bi bi-calendar-week me-2"></i>Timetables
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/tasks')}`} to="/tasks">
            <i className="bi bi-list-task me-2"></i>Tasks
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/showcase')}`} to="/showcase">
            <i className="bi bi-trophy me-2"></i>Showcase
          </Link>
        </li>
          {canAccessStudentFeatures && (
            <li className="nav-item mb-2">
              <Link className={`nav-link${isActive('/proficiency')}`} to="/proficiency">
                <i className="bi bi-mortarboard me-2"></i>Proficiency
              </Link>
            </li>
          )}
          {(canAccessStudentFeatures || canAccessLibrarian) && (
            <li className="nav-item mb-2">
              <Link className={`nav-link${isActive('/library')}`} to="/library">
                <i className="bi bi-book me-2"></i>Library
              </Link>
            </li>
          )}
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/pyq')}`} to="/pyq">
            <i className="bi bi-file-earmark-pdf me-2"></i>PYQ Papers
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/fees')}`} to="/fees">
            <i className="bi bi-currency-dollar me-2"></i>Fee Tracker
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/lost-found')}`} to="/lost-found">
            <i className="bi bi-search me-2"></i>Lost & Found
          </Link>
        </li>
          {canAccessStudentFeatures && (
            <li className="nav-item mb-2">
              <Link className={`nav-link${isActive('/studysnap')}`} to="/studysnap">
                <i className="bi bi-camera me-2"></i>StudySnap
              </Link>
            </li>
          )}
          {canAccessStudentFeatures && (
            <li className="nav-item mb-2">
              <Link className={`nav-link${isActive('/timer')}`} to="/timer">
                <i className="bi bi-stopwatch me-2"></i>Timer
              </Link>
            </li>
          )}
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/feedback')}`} to="/feedback">
            <i className="bi bi-chat-square-text me-2"></i>Feedback
          </Link>
        </li>
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/chatbot')}`} to="/chatbot">
            <i className="bi bi-robot me-2"></i>Event Bot
          </Link>
        </li>
      </ul>

      <hr style={{borderColor: 'var(--hive-border)', opacity: 0.3}} />

      {/* Admin & Info Section */}
      <ul className="nav flex-column">
          {isAdmin && (
            <li className="nav-item mb-2">
              <Link className={`nav-link${isActive('/admin')}`} to="/admin">
                <i className="bi bi-shield-check me-2"></i>Admin Panel
              </Link>
            </li>
          )}
        <li className="nav-item mb-2">
          <Link className={`nav-link${isActive('/about')}`} to="/about">
            <i className="bi bi-info-circle me-2"></i>About
          </Link>
        </li>
      </ul>
    </div>
  );
}
