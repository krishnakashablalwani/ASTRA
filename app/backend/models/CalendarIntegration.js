import mongoose from 'mongoose';

const calendarIntegrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  provider: { type: String },
  events: [{ type: Object }],
  createdAt: { type: Date, default: Date.now },
});

const CalendarIntegration = mongoose.model('CalendarIntegration', calendarIntegrationSchema);
export default CalendarIntegration;
