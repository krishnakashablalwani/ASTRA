import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isbn: { type: String, required: true },
  bookCode: { type: String, required: true, unique: true },
  quantity: { type: Number, default: 1, min: 1 },
  availableQuantity: { type: Number, default: 1, min: 0 },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const checkoutSchema = new mongoose.Schema({
  bookCode: { type: String, required: true },
  studentRollNo: { type: String, required: true },
  studentUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkoutDate: { type: Date, default: Date.now },
  returnDeadline: { type: Date, required: true },
  returnedDate: { type: Date },
  returned: { type: Boolean, default: false }
});

const Book = mongoose.model('Book', bookSchema);
const Checkout = mongoose.model('Checkout', checkoutSchema);

export { Book, Checkout };
export default Book;
