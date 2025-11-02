import mongoose from 'mongoose';

const lostAndFoundSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['lost', 'found'], required: true },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  location: { type: String },
});

const LostAndFound = mongoose.model('LostAndFound', lostAndFoundSchema);
export default LostAndFound;
