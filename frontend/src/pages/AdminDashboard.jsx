import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [snaps, setSnaps] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes, snapsRes, clubsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/events'),
        api.get('/studysnap'),
        api.get('/club')
      ]);
      
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
      setSnaps(snapsRes.data);
      setClubs(clubsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getUserActivity = (userId) => {
    const userEvents = events.filter(e => e.attendees?.includes(userId));
    const userSnaps = snaps.filter(s => s.user?._id === userId || s.user === userId);
    const userClubs = clubs.filter(c => c.members?.includes(userId));
    
    return {
      events: userEvents,
      snaps: userSnaps,
      clubs: userClubs
    };
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'danger';
      case 'teacher': return 'primary';
      case 'staff': return 'info';
      case 'club': return 'warning';
      default: return 'secondary';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return 'bi-shield-check';
      case 'teacher': return 'bi-mortarboard';
      case 'staff': return 'bi-person-badge';
      case 'club': return 'bi-people';
      default: return 'bi-person';
    }
  };

  const stats = [
    { label: 'Total Users', value: users.length, icon: 'bi-people', color: 'primary' },
    { label: 'Students', value: users.filter(u => u.role === 'student').length, icon: 'bi-person', color: 'success' },
    { label: 'Teachers', value: users.filter(u => u.role === 'teacher').length, icon: 'bi-mortarboard', color: 'info' },
    { label: 'Staff', value: users.filter(u => u.role === 'staff').length, icon: 'bi-person-badge', color: 'warning' },
    { label: 'Total Events', value: events.length, icon: 'bi-calendar-event', color: 'danger' },
    { label: 'Study Snaps', value: snaps.length, icon: 'bi-camera', color: 'purple' },
    { label: 'Active Clubs', value: clubs.length, icon: 'bi-people', color: 'success' },
  ];

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-shield-check text-danger me-2"></i>
            Admin Dashboard
          </h2>
          <p className="text-muted mb-0">Comprehensive overview of CampusHive activities</p>
        </div>
        <img 
          src={theme === 'light' ? '/light.png' : '/dark.png'} 
          alt="CampusHive Logo" 
          style={{ height: 50 }}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        {stats.map((stat, idx) => (
          <div className="col-md-6 col-lg-3" key={idx}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 small">{stat.label}</p>
                    <h3 className={`mb-0 text-${stat.color}`}>{stat.value}</h3>
                  </div>
                  <div className={`bg-${stat.color} bg-opacity-10 p-3 rounded`}>
                    <i className={`bi ${stat.icon} fs-3 text-${stat.color}`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-grid me-2"></i>Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="bi bi-people me-2"></i>All Users
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <i className="bi bi-activity me-2"></i>User Activity
          </button>
        </li>
      </ul>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="row g-4">
          {/* Recent Events */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">
                  <i className="bi bi-calendar-event text-primary me-2"></i>
                  Recent Events
                </h5>
              </div>
              <div className="card-body" style={{maxHeight: 400, overflowY: 'auto'}}>
                {events.slice(0, 10).map(event => (
                  <div key={event._id} className="border-bottom pb-2 mb-2">
                    <div className="fw-bold">{event.title}</div>
                    <small className="text-muted">
                      {new Date(event.date).toLocaleDateString()} • {event.attendees?.length || 0} attendees
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Snaps */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent">
                <h5 className="mb-0">
                  <i className="bi bi-camera text-warning me-2"></i>
                  Recent Study Snaps
                </h5>
              </div>
              <div className="card-body" style={{maxHeight: 400, overflowY: 'auto'}}>
                {snaps.slice(0, 10).map(snap => (
                  <div key={snap._id} className="border-bottom pb-2 mb-2">
                    <div className="fw-bold">{snap.caption}</div>
                    <small className="text-muted">
                      by {snap.user?.name || 'Unknown'} • {snap.likes?.length || 0} likes
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>ID</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>
                        <i className={`bi ${getRoleIcon(user.role)} me-2`}></i>
                        {user.name}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge bg-${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{user.department || 'N/A'}</td>
                      <td className="small text-muted">
                        {user.rollNo || user.teacherId || user.staffId || 'N/A'}
                      </td>
                      <td className="small text-muted">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setSelectedUser(user);
                            setActiveTab('activity');
                          }}
                        >
                          View Activity
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* User Activity Tab */}
      {activeTab === 'activity' && (
        <div>
          {/* User Selector */}
          <div className="mb-4">
            <label className="form-label fw-bold">Select User</label>
            <select 
              className="form-select" 
              value={selectedUser?._id || ''}
              onChange={(e) => setSelectedUser(users.find(u => u._id === e.target.value))}
            >
              <option value="">-- Select a user --</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email}) - {user.role}
                </option>
              ))}
            </select>
          </div>

          {selectedUser && (
            <>
              {/* User Info Card */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h4>
                        <i className={`bi ${getRoleIcon(selectedUser.role)} me-2`}></i>
                        {selectedUser.name}
                      </h4>
                      <p className="text-muted mb-2">{selectedUser.email}</p>
                      <span className={`badge bg-${getRoleColor(selectedUser.role)} me-2`}>
                        {selectedUser.role}
                      </span>
                      {selectedUser.department && (
                        <span className="badge bg-secondary">{selectedUser.department}</span>
                      )}
                    </div>
                    <div className="col-md-6">
                      <div className="row">
                        {selectedUser.rollNo && (
                          <div className="col-6 mb-2">
                            <small className="text-muted">Roll Number</small>
                            <div className="fw-bold">{selectedUser.rollNo}</div>
                          </div>
                        )}
                        {selectedUser.teacherId && (
                          <div className="col-6 mb-2">
                            <small className="text-muted">Teacher ID</small>
                            <div className="fw-bold">{selectedUser.teacherId}</div>
                          </div>
                        )}
                        {selectedUser.staffId && (
                          <div className="col-6 mb-2">
                            <small className="text-muted">Staff ID</small>
                            <div className="fw-bold">{selectedUser.staffId}</div>
                          </div>
                        )}
                        <div className="col-6 mb-2">
                          <small className="text-muted">Joined</small>
                          <div className="fw-bold">
                            {new Date(selectedUser.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Activity Details */}
              <div className="row g-4">
                {/* Events */}
                <div className="col-md-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-transparent">
                      <h6 className="mb-0">
                        <i className="bi bi-calendar-event text-primary me-2"></i>
                        Events ({getUserActivity(selectedUser._id).events.length})
                      </h6>
                    </div>
                    <div className="card-body" style={{maxHeight: 300, overflowY: 'auto'}}>
                      {getUserActivity(selectedUser._id).events.map(event => (
                        <div key={event._id} className="border-bottom pb-2 mb-2">
                          <div className="small fw-bold">{event.title}</div>
                          <small className="text-muted">
                            {new Date(event.date).toLocaleDateString()}
                          </small>
                        </div>
                      ))}
                      {getUserActivity(selectedUser._id).events.length === 0 && (
                        <p className="text-muted small">No events yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Study Snaps */}
                <div className="col-md-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-transparent">
                      <h6 className="mb-0">
                        <i className="bi bi-camera text-warning me-2"></i>
                        Study Snaps ({getUserActivity(selectedUser._id).snaps.length})
                      </h6>
                    </div>
                    <div className="card-body" style={{maxHeight: 300, overflowY: 'auto'}}>
                      {getUserActivity(selectedUser._id).snaps.map(snap => (
                        <div key={snap._id} className="border-bottom pb-2 mb-2">
                          <div className="small fw-bold">{snap.caption}</div>
                          <small className="text-muted">
                            {snap.likes?.length || 0} likes
                          </small>
                        </div>
                      ))}
                      {getUserActivity(selectedUser._id).snaps.length === 0 && (
                        <p className="text-muted small">No snaps yet</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Clubs */}
                <div className="col-md-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-transparent">
                      <h6 className="mb-0">
                        <i className="bi bi-people text-success me-2"></i>
                        Clubs ({getUserActivity(selectedUser._id).clubs.length})
                      </h6>
                    </div>
                    <div className="card-body" style={{maxHeight: 300, overflowY: 'auto'}}>
                      {getUserActivity(selectedUser._id).clubs.map(club => (
                        <div key={club._id} className="border-bottom pb-2 mb-2">
                          <div className="small fw-bold">{club.name}</div>
                          <small className="text-muted">
                            {club.members?.length || 0} members
                          </small>
                        </div>
                      ))}
                      {getUserActivity(selectedUser._id).clubs.length === 0 && (
                        <p className="text-muted small">No clubs yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
