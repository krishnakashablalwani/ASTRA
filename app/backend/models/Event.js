import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rsvps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
