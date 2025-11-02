import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function StudySnap() {
  const { theme } = useTheme();
  const [snaps, setSnaps] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    photo: null,
    photoPreview: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [editing, setEditing] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchSnaps();
  }, []);

  const fetchSnaps = async () => {
    try {
      const response = await api.get('/studysnap');
      setSnaps(response.data);
    } catch (error) {
      console.error('Error fetching snaps:', error);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadData({
        ...uploadData,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (isUploading) return;
    if (!uploadData.photo) return;

    const signature = `${uploadData.photo.name}|${uploadData.photo.size}|${uploadData.photo.lastModified}`;
    const key = 'studysnap_upload_signatures';
    const seen = JSON.parse(localStorage.getItem(key) || '[]').slice(-50);
    if (seen.includes(signature)) {
      alert('This looks like the same file you just uploaded. Duplicate prevented.');
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('photo', uploadData.photo);

    try {
      setIsUploading(true);
      await api.post('/studysnap', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Study snap uploaded successfully!');
      setShowUploadModal(false);
      setUploadData({ title: '', description: '', photo: null, photoPreview: null });
      localStorage.setItem(key, JSON.stringify([...seen, signature]));
      fetchSnaps();
    } catch (error) {
      console.error('Error uploading snap:', error);
      alert('Failed to upload snap');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLike = async (snapId) => {
    try {
      await api.post(`/studysnap/${snapId}/like`);
      fetchSnaps();
    } catch (error) {
      console.error('Error liking snap:', error);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-camera me-2"></i>
            StudySnap
          </h2>
          <p className="text-muted mb-0">Share what you're studying right now</p>
        </div>
        <img 
          src={theme === 'light' ? '/light.png' : '/dark.png'} 
          alt="CampusHive Logo" 
          style={{ height: 50 }}
        />
      </div>

      <div className="mb-4">
        <button 
          className="btn btn-warning btn-lg shadow-sm"
          onClick={() => setShowUploadModal(true)}
          style={{ borderRadius: 12 }}
        >
          <i className="bi bi-camera-fill me-2"></i>
          Upload Study Snap
        </button>
      </div>

      <div className="row">
        {snaps.length === 0 ? (
          <div className="col-12">
            <div className="card shadow border-0" style={{ borderRadius: 16 }}>
              <div className="card-body text-center py-5">
                <i className="bi bi-images display-1 text-muted mb-3"></i>
                <h4 className="text-muted">No study snaps yet</h4>
                <p className="text-muted">Share what you're studying and inspire others!</p>
              </div>
            </div>
          </div>
        ) : (
          snaps.map((snap, index) => {
            const snapUserId = snap.user?._id || snap.user;
            const isOwner = snapUserId === currentUser?._id || snapUserId === currentUser?.id;
            
            return (
              <div key={snap._id || index} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: 16, overflow: 'hidden' }}>
                  {snap.imageUrl && (
                    <img 
                      src={snap.imageUrl.startsWith('http') ? snap.imageUrl : `${window.location.origin}${snap.imageUrl}`}
                      className="card-img-top" 
                      alt={snap.caption}
                      style={{ height: 250, objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{snap.caption}</h5>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleLike(snap._id)}
                        style={{ borderRadius: 20 }}
                      >
                        <i className={`bi ${snap.likes?.length > 0 ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>
                        {snap.likes?.length || 0}
                      </button>
                    </div>
                    {snap.description && <p className="card-text mb-2">{snap.description}</p>}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        <i className="bi bi-person-circle me-1"></i>
                        {snap.user?.name || 'Anonymous'}
                      </small>
                      <small className="text-muted">
                        {new Date(snap.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    
                    {isOwner && (
                      <div className="d-flex gap-2 mt-2">
                        <button
                          className="btn btn-sm btn-outline-primary flex-grow-1"
                          onClick={() => setEditing({
                            _id: snap._id,
                            title: snap.caption || '',
                            description: snap.description || '',
                          })}
                          style={{ borderRadius: 20 }}
                        >
                          <i className="bi bi-pencil-square me-1"></i>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger flex-grow-1"
                          onClick={async () => {
                            if (!window.confirm('Delete this snap?')) return;
                            try { 
                              await api.delete(`/studysnap/${snap._id}`); 
                              fetchSnaps(); 
                              alert('Snap deleted successfully!');
                            } catch (err) { 
                              console.error(err); 
                              alert('Failed to delete snap');
                            }
                          }}
                          style={{ borderRadius: 20 }}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showUploadModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 16 }}>
              <div className="modal-header border-0">
                <h5 className="modal-title">Upload Study Snap</h5>
                <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
              </div>
              <form onSubmit={handleUpload}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      required
                      placeholder="What are you studying?"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                      placeholder="Add some context..."
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      required
                    />
                  </div>
                  {uploadData.photoPreview && (
                    <div className="mb-3">
                      <img 
                        src={uploadData.photoPreview} 
                        alt="Preview" 
                        className="img-fluid rounded"
                        style={{ maxHeight: 300 }}
                      />
                    </div>
                  )}
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning" disabled={isUploading}>
                    <i className="bi bi-camera-fill me-2"></i>
                    {isUploading ? 'Uploading…' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 16 }}>
              <div className="modal-header border-0">
                <h5 className="modal-title">Edit Study Snap</h5>
                <button type="button" className="btn-close" onClick={() => setEditing(null)}></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const fd = new FormData();
                  fd.append('title', editing.title);
                  fd.append('description', editing.description);
                  const fileInput = e.currentTarget.querySelector('input[type="file"]');
                  if (fileInput && fileInput.files && fileInput.files[0]) {
                    fd.append('photo', fileInput.files[0]);
                  }
                  await api.put(`/studysnap/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                  setEditing(null);
                  fetchSnaps();
                  alert('Snap updated successfully!');
                } catch (err) {
                  console.error('Error updating snap:', err);
                  alert('Failed to update snap');
                }
              }}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={editing.description}
                      onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Replace Photo (optional)</label>
                    <input type="file" className="form-control" accept="image/*" />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-check2 me-2"></i>
                    Save Changes
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
