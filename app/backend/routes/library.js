import express from 'express';
import { Book, Checkout } from '../models/Library.js';
import User from '../models/User.js';
import CalendarIntegration from '../models/CalendarIntegration.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';
import { sendLibraryCheckoutEmail } from '../services/emailService.js';

const router = express.Router();

// Add a new book (librarians/staff only)
router.post('/books', authenticate, authorizeRoles('staff', 'admin'), async (req, res) => {
  try {
    const { title, isbn, bookCode, quantity } = req.body;
    const qty = quantity || 1;
    const book = new Book({ 
      title, 
      isbn, 
      bookCode, 
      quantity: qty,
      availableQuantity: qty,
      available: qty > 0
    });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all books
router.get('/books', authenticate, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Checkout a book to a student (librarians/staff only)
router.post('/checkout', authenticate, authorizeRoles('staff', 'admin'), async (req, res) => {
  try {
    const { bookCode, studentRollNo, returnDeadline } = req.body;
    
    // Find book
    const book = await Book.findOne({ bookCode });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    if (book.availableQuantity <= 0) return res.status(400).json({ error: 'No copies available for checkout' });
    
    // Find student by roll number
    const student = await User.findOne({ rollNo: studentRollNo, role: 'student' });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    
    // Create checkout record
    const checkout = new Checkout({
      bookCode,
      studentRollNo,
      studentUser: student._id,
      returnDeadline: new Date(returnDeadline)
    });
    await checkout.save();
    
    // Decrease available quantity
    book.availableQuantity -= 1;
    book.available = book.availableQuantity > 0;
    await book.save();
    
    // Create calendar event for return deadline
    const calendarEvent = new CalendarIntegration({
      user: student._id,
      eventTitle: `Return Book: ${book.title}`,
      eventDate: new Date(returnDeadline),
      eventType: 'library',
      description: `Book Code: ${bookCode} - Return deadline`
    });
    await calendarEvent.save();
    
    // Send checkout confirmation email
    try {
      if (student.email) {
        await sendLibraryCheckoutEmail(student.email, student.name, book, checkout);
      }
    } catch (emailErr) {
      console.error('Failed to send library checkout email:', emailErr);
      // Don't fail the request if email fails
    }
    
    res.status(201).json({ checkout, calendarEvent });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all checkouts
router.get('/checkouts', authenticate, async (req, res) => {
  try {
    let checkouts;
    if (req.user.role === 'student') {
      // Students see only their checkouts
      checkouts = await Checkout.find({ studentUser: req.user.id }).populate('studentUser', 'name rollNo');
    } else {
      // Staff/admin see all checkouts
      checkouts = await Checkout.find().populate('studentUser', 'name rollNo');
    }
    res.json(checkouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Return a book (librarians/staff only)
router.put('/return/:checkoutId', authenticate, authorizeRoles('staff', 'admin'), async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.checkoutId);
    if (!checkout) return res.status(404).json({ error: 'Checkout record not found' });
    if (checkout.returned) return res.status(400).json({ error: 'Book already returned' });
    
    // Mark as returned
    checkout.returned = true;
    checkout.returnedDate = new Date();
    await checkout.save();
    
    // Increase available quantity
    const book = await Book.findOne({ bookCode: checkout.bookCode });
    if (book) {
      book.availableQuantity += 1;
      book.available = book.availableQuantity > 0;
      await book.save();
    }
    
    res.json(checkout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a book (librarians/staff only)
router.put('/books/:id', authenticate, authorizeRoles('staff', 'admin'), async (req, res) => {
  try {
    const { title, isbn, bookCode, quantity } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    
    // Calculate the difference in quantity
    const oldQuantity = book.quantity;
    const newQuantity = quantity || oldQuantity;
    const quantityDiff = newQuantity - oldQuantity;
    
    // Update book details
    book.title = title || book.title;
    book.isbn = isbn || book.isbn;
    book.bookCode = bookCode || book.bookCode;
    book.quantity = newQuantity;
    book.availableQuantity = Math.max(0, book.availableQuantity + quantityDiff);
    book.available = book.availableQuantity > 0;
    
    await book.save();
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a book (librarians/staff only)
router.delete('/books/:id', authenticate, authorizeRoles('staff', 'admin'), async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    
    // Check if book has active checkouts
    const activeCheckouts = await Checkout.find({ 
      bookCode: book.bookCode, 
      returned: false 
    });
    
    if (activeCheckouts.length > 0) {
      return res.status(400).json({ 
        error: `Cannot delete book. ${activeCheckouts.length} copy/copies still checked out.` 
      });
    }
    
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
