import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';
import api from '../services/api';

export default function Library() {
  const { theme } = useTheme();
  const location = useLocation();
  const [books, setBooks] = useState([]);
  const [checkouts, setCheckouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showEditBookModal, setShowEditBookModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
  const [newBook, setNewBook] = useState({ title: '', isbn: '', bookCode: '', quantity: 1 });
  const [checkoutData, setCheckoutData] = useState({ bookCode: '', studentRollNo: '', returnDeadline: '' });
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLibrarian = user.role === 'staff' || user.role === 'admin';

  useEffect(() => {
    fetchBooks();
    fetchCheckouts();
    
    // Handle modals opened from dashboard
    if (location.state?.openAddBook) {
      setShowAddBookModal(true);
    }
    if (location.state?.openCheckout) {
      setShowCheckoutModal(true);
    }
  }, [location.state]);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/library/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchCheckouts = async () => {
    try {
      const response = await api.get('/library/checkouts');
      setCheckouts(response.data);
    } catch (error) {
      console.error('Error fetching checkouts:', error);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/library/books', newBook);
      alert('Book added successfully!');
      setShowAddBookModal(false);
      setNewBook({ title: '', isbn: '', bookCode: '', quantity: 1 });
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
      alert(error.response?.data?.error || 'Failed to add book');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {
      await api.post('/library/checkout', checkoutData);
      alert('Book checked out successfully! Return deadline added to student calendar.');
      setShowCheckoutModal(false);
      setCheckoutData({ bookCode: '', studentRollNo: '', returnDeadline: '' });
      fetchBooks();
      fetchCheckouts();
    } catch (error) {
      console.error('Error checking out book:', error);
      alert(error.response?.data?.error || 'Failed to checkout book');
    }
  };

  const handleReturn = async (checkoutId) => {
    try {
      await api.put(`/library/return/${checkoutId}`);
      alert('Book returned successfully!');
      fetchBooks();
      fetchCheckouts();
    } catch (error) {
      console.error('Error returning book:', error);
      alert(error.response?.data?.error || 'Failed to return book');
    }
  };

    const handleEditBook = async (e) => {
      e.preventDefault();
      try {
        await api.put(`/library/books/${editingBook._id}`, editingBook);
        alert('Book updated successfully!');
        setShowEditBookModal(false);
        setEditingBook(null);
        fetchBooks();
      } catch (error) {
        console.error('Error updating book:', error);
        alert(error.response?.data?.error || 'Failed to update book');
      }
    };

    const handleDeleteBook = async (bookId, bookTitle) => {
      if (!window.confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
        return;
      }
      try {
        await api.delete(`/library/books/${bookId}`);
        alert('Book deleted successfully!');
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        alert(error.response?.data?.error || 'Failed to delete book');
      }
    };

    const openEditModal = (book) => {
      setEditingBook({ ...book });
      setShowEditBookModal(true);
    };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.bookCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDaysUntilDue = (deadline) => {
    const due = new Date(deadline);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-book me-2"></i>
            Library Management
          </h2>
          <p className="text-muted mb-0">
            {isLibrarian ? 'Manage books and checkouts' : 'View your borrowed books'}
          </p>
        </div>
        <img 
          src={theme === 'light' ? '/light.png' : '/dark.png'} 
          alt="CampusHive Logo" 
          style={{ height: 50 }}
        />
      </div>

      {/* Librarian Actions */}
      {isLibrarian && (
        <div className="mb-4">
          <button 
            className="btn btn-warning me-2 shadow-sm"
            onClick={() => setShowAddBookModal(true)}
            style={{ borderRadius: 12 }}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Book
          </button>
          <button 
            className="btn btn-primary shadow-sm"
            onClick={() => setShowCheckoutModal(true)}
            style={{ borderRadius: 12 }}
          >
            <i className="bi bi-arrow-right-circle me-2"></i>
            Checkout Book
          </button>
        </div>
      )}

      {/* My Checkouts Section */}
      {checkouts.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-3">
            <i className="bi bi-bookmark-fill text-warning me-2"></i>
            {isLibrarian ? 'All Checkouts' : 'My Borrowed Books'}
          </h4>
          <div className="row">
            {checkouts.map((checkout) => {
              const daysLeft = getDaysUntilDue(checkout.returnDeadline);
              return (
                <div key={checkout._id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card shadow-sm border-0 h-100" style={{ borderRadius: 16 }}>
                    <div className="card-body">
                      <h5 className="card-title">Book Code: {checkout.bookCode}</h5>
                      <p className="card-text text-muted">
                        <i className="bi bi-person me-2"></i>
                        {checkout.studentUser?.name || 'Unknown'} ({checkout.studentRollNo})
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          <i className="bi bi-calendar-check me-2"></i>
                          Checkout: {new Date(checkout.checkoutDate).toLocaleDateString()}
                        </small>
                      </p>
                      {!checkout.returned && (
                        <>
                          <div className={`alert ${daysLeft < 3 ? 'alert-danger' : 'alert-info'} mb-3`}>
                            <small>
                              <i className="bi bi-clock me-1"></i>
                              {daysLeft > 0 ? `${daysLeft} days left` : `Overdue by ${Math.abs(daysLeft)} days`}
                            </small>
                          </div>
                          {isLibrarian && (
                            <button 
                              className="btn btn-success w-100"
                              onClick={() => handleReturn(checkout._id)}
                              style={{ borderRadius: 8 }}
                            >
                              <i className="bi bi-check-circle me-2"></i>
                              Mark Returned
                            </button>
                          )}
                        </>
                      )}
                      {checkout.returned && (
                        <div className="alert alert-success mb-0">
                          <small>
                            <i className="bi bi-check-circle me-1"></i>
                            Returned on {new Date(checkout.returnedDate).toLocaleDateString()}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control form-control-lg shadow-sm"
          placeholder="🔍 Search books by title, ISBN, or book code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ borderRadius: 12 }}
        />
      </div>

      {/* Available Books */}
      <h4 className="mb-3">
        <i className="bi bi-collection text-primary me-2"></i>
        All Books
      </h4>
      <div className="row">
        {filteredBooks.length === 0 ? (
          <div className="col-12">
            <div className="card shadow border-0" style={{ borderRadius: 16 }}>
              <div className="card-body text-center py-5">
                <i className="bi bi-book display-1 text-muted mb-3"></i>
                <h4 className="text-muted">No books found</h4>
                <p className="text-muted">Try adjusting your search or add new books.</p>
              </div>
            </div>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div key={book._id} className="col-md-6 col-lg-3 mb-4">
              <div className="card shadow-sm border-0 h-100" style={{ borderRadius: 16 }}>
                <div className="card-body">
                  <h5 className="card-title">{book.title}</h5>
                  <p className="card-text text-muted mb-2">
                    <i className="bi bi-upc me-2"></i>ISBN: {book.isbn}
                  </p>
                  <p className="card-text mb-3">
                    <small className="text-muted">
                      <i className="bi bi-hash me-1"></i>Code: {book.bookCode}
                    </small>
                  </p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className={`badge ${book.availableQuantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {book.availableQuantity > 0 ? 'Available' : 'All Checked Out'}
                    </span>
                    <small className="text-muted">
                      {book.availableQuantity || 0}/{book.quantity || 0} copies
                    </small>
                  </div>
                    {isLibrarian && (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary flex-fill"
                          onClick={() => openEditModal(book)}
                          style={{ borderRadius: 8 }}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger flex-fill"
                          onClick={() => handleDeleteBook(book._id, book.title)}
                          style={{ borderRadius: 8 }}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Book Modal */}
      {showAddBookModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 16 }}>
              <div className="modal-header border-0">
                <h5 className="modal-title">Add New Book</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddBookModal(false)}></button>
              </div>
              <form onSubmit={handleAddBook}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newBook.title}
                      onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">ISBN</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newBook.isbn}
                      onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Book Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newBook.bookCode}
                      onChange={(e) => setNewBook({ ...newBook, bookCode: e.target.value })}
                      required
                      placeholder="e.g., LIB001"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newBook.quantity}
                      onChange={(e) => setNewBook({ ...newBook, quantity: parseInt(e.target.value) || 1 })}
                      required
                      min="1"
                      placeholder="Number of copies"
                    />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddBookModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Book
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

        {/* Edit Book Modal */}
        {showEditBookModal && editingBook && (
          <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: 16 }}>
                <div className="modal-header border-0">
                  <h5 className="modal-title">
                    <i className="bi bi-pencil me-2"></i>
                    Edit Book
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => {
                      setShowEditBookModal(false);
                      setEditingBook(null);
                    }}
                  ></button>
                </div>
                <form onSubmit={handleEditBook}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingBook.title}
                        onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">ISBN</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingBook.isbn}
                        onChange={(e) => setEditingBook({ ...editingBook, isbn: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Book Code</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingBook.bookCode}
                        onChange={(e) => setEditingBook({ ...editingBook, bookCode: e.target.value })}
                        required
                        placeholder="e.g., LIB001"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Total Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={editingBook.quantity}
                        onChange={(e) => setEditingBook({ ...editingBook, quantity: parseInt(e.target.value) || 1 })}
                        required
                        min="1"
                        placeholder="Number of copies"
                      />
                      <small className="text-muted">
                        Currently {editingBook.availableQuantity} available out of {editingBook.quantity}
                      </small>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => {
                        setShowEditBookModal(false);
                        setEditingBook(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-check-circle me-2"></i>
                      Update Book
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 16 }}>
              <div className="modal-header border-0">
                <h5 className="modal-title">Checkout Book</h5>
                <button type="button" className="btn-close" onClick={() => setShowCheckoutModal(false)}></button>
              </div>
              <form onSubmit={handleCheckout}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Book Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={checkoutData.bookCode}
                      onChange={(e) => setCheckoutData({ ...checkoutData, bookCode: e.target.value })}
                      required
                      placeholder="e.g., LIB001"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Student Roll Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={checkoutData.studentRollNo}
                      onChange={(e) => setCheckoutData({ ...checkoutData, studentRollNo: e.target.value })}
                      required
                      placeholder="e.g., R1001"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Return Deadline</label>
                    <input
                      type="date"
                      className="form-control"
                      value={checkoutData.returnDeadline}
                      onChange={(e) => setCheckoutData({ ...checkoutData, returnDeadline: e.target.value })}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCheckoutModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-arrow-right-circle me-2"></i>
                    Checkout
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
