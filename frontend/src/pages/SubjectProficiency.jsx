import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function SubjectProficiency() {
  const { theme } = useTheme();
  const [proficiencies, setProficiencies] = useState([]);
  const [myProficiencies, setMyProficiencies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newLevel, setNewLevel] = useState('intermediate');

  useEffect(() => {
    fetchProficiencies();
    fetchMyProficiencies();
  }, []);

  const fetchProficiencies = async () => {
    try {
      const response = await api.get('/proficiency');
      setProficiencies(response.data);
    } catch (error) {
      console.error('Error fetching proficiencies:', error);
    }
  };

  const fetchMyProficiencies = async () => {
    try {
      const response = await api.get('/proficiency/my');
      setMyProficiencies(response.data);
    } catch (error) {
      console.error('Error fetching my proficiencies:', error);
    }
  };

  const handleAddProficiency = async (e) => {
    e.preventDefault();
    try {
      await api.post('/proficiency', {
        subject: newSubject,
        level: newLevel
      });
      setNewSubject('');
      setNewLevel('intermediate');
      setShowAddModal(false);
      fetchMyProficiencies();
    } catch (error) {
      console.error('Error adding proficiency:', error);
    }
  };

  const handleConnect = async (proficiencyId) => {
    try {
      await api.post(`/proficiency/${proficiencyId}/connect`);
      alert('Connection request sent! The student will be notified.');
    } catch (error) {
      console.error('Error connecting:', error);
      alert('Failed to send connection request');
    }
  };

  const getLevelBadge = (level) => {
    const badges = {
      beginner: 'bg-info',
      intermediate: 'bg-primary',
      advanced: 'bg-success',
      expert: 'bg-warning'
    };
    return badges[level] || 'bg-secondary';
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            Subject Proficiency
          </h2>
          <p className="text-muted mb-0">Find study partners or share your expertise</p>
        </div>
        <img 
          src={theme === 'light' ? '/light.png' : '/dark.png'} 
          alt="CampusHive Logo" 
          style={{ height: 50 }}
        />
      </div>

      {/* Add Proficiency Button */}
      <div className="mb-4">
        <button 
          className="btn btn-warning btn-lg shadow-sm"
          onClick={() => setShowAddModal(true)}
          style={{ borderRadius: 12 }}
        >
          Add Your Proficiency
        </button>
      </div>

      {/* My Proficiencies */}
      {myProficiencies.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-3">
            My Proficiencies
          </h4>
          <div className="row">
            {myProficiencies.map((prof, index) => (
              <div key={index} className="col-md-6 col-lg-3 mb-3">
                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: 16 }}>
                  <div className="card-body">
                    <h5 className="card-title">{prof.subject}</h5>
                    <span className={`badge ${getLevelBadge(prof.level)}`}>
                      {prof.level.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Find Study Partners */}
      <h4 className="mb-3">
        Find Study Partners
      </h4>
      <div className="row">
        {proficiencies.length === 0 ? (
          <div className="col-12">
            <div className="card shadow border-0" style={{ borderRadius: 16 }}>
              <div className="card-body text-center py-5">
                <h4 className="text-muted">No proficiencies found</h4>
                <p className="text-muted">Be the first to add your subject expertise!</p>
              </div>
            </div>
          </div>
        ) : (
          proficiencies.map((prof, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm border-0 h-100" style={{ borderRadius: 16 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title mb-2">{prof.subject}</h5>
                      <span className={`badge ${getLevelBadge(prof.level)} mb-2`}>
                        {prof.level.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <p className="card-text mb-3">
                    {prof.studentName || 'Anonymous Student'}
                  </p>
                  <p className="card-text text-muted small">
                    {prof.department || 'General'}
                  </p>
                  <button 
                    className="btn btn-outline-primary w-100 mt-2"
                    onClick={() => handleConnect(prof._id)}
                    style={{ borderRadius: 8 }}
                  >
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Proficiency Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 16 }}>
              <div className="modal-header border-0">
                <h5 className="modal-title">Add Your Proficiency</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddProficiency}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      required
                      placeholder="e.g., Data Structures, Physics, English"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Proficiency Level</label>
                    <select
                      className="form-select"
                      value={newLevel}
                      onChange={(e) => setNewLevel(e.target.value)}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Add Proficiency
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
