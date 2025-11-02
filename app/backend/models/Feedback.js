import mongoose from 'mongoose';

// Sub-document to capture detailed facilities ratings (all optional)
const facilitiesSchema = new mongoose.Schema({
  campus: { type: Number, min: 1, max: 5 },
  classrooms: { type: Number, min: 1, max: 5 },
  laboratories: { type: Number, min: 1, max: 5 },
  library: { type: Number, min: 1, max: 5 },
  canteen: { type: Number, min: 1, max: 5 },
  hostel: { type: Number, min: 1, max: 5 },
  sports: { type: Number, min: 1, max: 5 },
  cleanliness: { type: Number, min: 1, max: 5 },
  safety: { type: Number, min: 1, max: 5 },
  wifi: { type: Number, min: 1, max: 5 },
}, { _id: false });

const feedbackSchema = new mongoose.Schema({
  // Optional linkage to event feedback
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },

  // Who submitted the feedback (if not anonymous)
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Backward compatible legacy field
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // High-level categorization
  category: { type: String, enum: ['academic', 'infrastructure', 'faculty', 'services', 'events', 'other', 'college'], default: 'other' },

  // Short title/subject of feedback
  subject: { type: String, trim: true },

  // Overall rating (1-5)
  rating: { type: Number, min: 1, max: 5 },

  // Optional detailed facilities ratings when feedback is about college/facilities
  facilities: { type: facilitiesSchema },

  // Free-form comments
  comment: { type: String, trim: true },

  // Allow users to post anonymously
  isAnonymous: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
