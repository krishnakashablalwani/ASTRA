import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function Feedback() {
  const { theme } = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    category: 'college',
    subject: '',
    rating: 5,
    comment: '',
    isAnonymous: false,
    facilities: {
      campus: 0,
      classrooms: 0,
      laboratories: 0,
      library: 0,
      canteen: 0,
      hostel: 0,
      sports: 0,
      cleanliness: 0,
      safety: 0,
      wifi: 0
    }
  });

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/feedback');
      setFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedback', newFeedback);
      alert('Feedback submitted successfully!');
      setShowFeedbackModal(false);
      setNewFeedback({ 
        category: 'college', subject: '', rating: 5, comment: '', isAnonymous: false,
        facilities: { campus:0, classrooms:0, laboratories:0, library:0, canteen:0, hostel:0, sports:0, cleanliness:0, safety:0, wifi:0 }
      });
      fetchFeedbacks();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  const getStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <i 
        key={i} 
        className={`bi bi-star${i < rating ? '-fill' : ''} text-warning`}
        style={{ fontSize: '1.2rem' }}
      ></i>
    ));
  };

  const getAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbacks.forEach(f => {
      dist[f.rating] = (dist[f.rating] || 0) + 1;
    });
    return dist;
  };

  const distribution = getRatingDistribution();

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            Feedback & Ratings
          </h2>
          <p className="text-muted mb-0">Share your experience and suggestions</p>
        </div>
        <img 
          src={theme === 'light' ? '/light.png' : '/dark.png'} 
          alt="CampusHive Logo" 
          style={{ height: 50 }}
        />
      </div>

      {/* Submit Feedback Button */}
      <div className="mb-4">
        <button 
          className="btn btn-warning btn-lg shadow-sm"
          onClick={() => setShowFeedbackModal(true)}
          style={{ borderRadius: 12 }}
        >
          Submit Feedback
        </button>
      </div>

      {/* Overview Cards */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-lg border-0 h-100" style={{ borderRadius: 16, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <div className="card-body text-white text-center py-4">
              <h6 className="mb-2 text-uppercase">Average Rating</h6>
              <h1 className="display-3 mb-2">{getAverageRating()}</h1>
              <div>{getStars(Math.round(getAverageRating()))}</div>
              <p className="mb-0 mt-2">Based on {feedbacks.length} reviews</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100" style={{ borderRadius: 16 }}>
            <div className="card-body">
              <h5 className="mb-3">Rating Distribution</h5>
              {[5, 4, 3, 2, 1].map(rating => {
                const count = distribution[rating] || 0;
                const percentage = feedbacks.length > 0 ? (count / feedbacks.length * 100) : 0;
                return (
                  <div key={rating} className="mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ width: 20 }}>{rating}</span>
                      <div className="progress flex-grow-1" style={{ height: 10 }}>
                        <div 
                          className="progress-bar bg-warning" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-muted" style={{ width: 40 }}>{count}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

  {/* Feedback List */}
      <h4 className="mb-3">
        Recent Feedback
      </h4>
      <div className="row">
        {feedbacks.length === 0 ? (
          <div className="col-12">
            <div className="card shadow border-0" style={{ borderRadius: 16 }}>
              <div className="card-body text-center py-5">
                <h4 className="text-muted">No feedback yet</h4>
                <p className="text-muted">Be the first to share your thoughts!</p>
              </div>
            </div>
          </div>
        ) : (
          feedbacks.map((feedback, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm border-0 h-100" style={{ borderRadius: 16 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <span className="badge bg-primary mb-2 text-capitalize">{feedback.category || 'general'}</span>
                      <h6 className="mb-0">{feedback.subject || 'Feedback'}</h6>
                    </div>
                    <div className="text-end">
                      {getStars(feedback.rating)}
                    </div>
                  </div>
                  <p className="card-text mb-3">{feedback.comment}</p>
                  {feedback.facilities && (
                    <div className="mb-3">
                      <div className="small text-muted mb-2">Facilities ratings</div>
                      {Object.entries(feedback.facilities).filter(([_, v]) => typeof v === 'number' && v > 0).map(([k, v]) => (
                        <div key={k} className="d-flex align-items-center mb-1 gap-2">
                          <span className="text-capitalize" style={{ width: 110 }}>{k}</span>
                          <div>{getStars(v)}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {feedback.isAnonymous ? 'Anonymous' : (feedback.submittedBy?.name || 'Anonymous')}
                    </small>
                    <small className="text-muted">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 16 }}>
              <div className="modal-header border-0">
                <h5 className="modal-title">Submit Your Feedback</h5>
                <button type="button" className="btn-close" onClick={() => setShowFeedbackModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={newFeedback.category}
                      onChange={(e) => setNewFeedback({ ...newFeedback, category: e.target.value })}
                    >
                      <option value="college">College & Facilities</option>
                      <option value="academic">Academic</option>
                      <option value="infrastructure">Infrastructure</option>
                      <option value="faculty">Faculty</option>
                      <option value="services">Services</option>
                      <option value="events">Events</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newFeedback.subject}
                      onChange={(e) => setNewFeedback({ ...newFeedback, subject: e.target.value })}
                      required
                      placeholder="Brief title for your feedback"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rating</label>
                    <div className="d-flex gap-2 mb-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          type="button"
                          className={`btn ${newFeedback.rating >= rating ? 'btn-warning' : 'btn-outline-warning'}`}
                          style={{ 
                            fontSize: '1.5rem',
                            padding: '0.5rem 1rem'
                          }}
                          onClick={() => setNewFeedback({ ...newFeedback, rating })}
                        >
                          <i className={`bi bi-star-fill ${newFeedback.rating >= rating ? 'text-dark' : ''}`}></i>
                        </button>
                      ))}
                    </div>
                    <small className="text-muted">Selected: {newFeedback.rating} star{newFeedback.rating > 1 ? 's' : ''}</small>
                  </div>
                  {(newFeedback.category === 'college' || newFeedback.category === 'infrastructure' || newFeedback.category === 'services') && (
                    <div className="mb-3">
                      <label className="form-label">Facilities breakdown (optional)</label>
                      <div className="row g-2">
                        {Object.keys(newFeedback.facilities).map((key) => (
                          <div className="col-12" key={key}>
                            <div className="d-flex align-items-center justify-content-between">
                              <span className="text-capitalize">{key}</span>
                              <div className="d-flex gap-1">
                                {[1,2,3,4,5].map(v => (
                                  <button
                                    key={v}
                                    type="button"
                                    className={`btn btn-sm ${newFeedback.facilities[key] >= v ? 'btn-warning' : 'btn-outline-warning'}`}
                                    onClick={() => setNewFeedback({ ...newFeedback, facilities: { ...newFeedback.facilities, [key]: v } })}
                                  >
                                    <i className={`bi bi-star-fill ${newFeedback.facilities[key] >= v ? 'text-dark' : ''}`}></i>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <small className="text-muted">Leave any not applicable items at 0.</small>
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Comments</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={newFeedback.comment}
                      onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                      required
                      placeholder="Share your detailed feedback..."
                    ></textarea>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="anonymousCheck"
                      checked={newFeedback.isAnonymous}
                      onChange={(e) => setNewFeedback({ ...newFeedback, isAnonymous: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="anonymousCheck">
                      Submit anonymously
                    </label>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowFeedbackModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    Submit Feedback
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
