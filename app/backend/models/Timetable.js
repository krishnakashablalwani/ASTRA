import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileUrl: { type: String }, // URL to uploaded timetable file (image/pdf)
  timetableData: { type: Object },
  aiGenerated: { type: Boolean, default: false },
  aiStructure: { type: Object }, // AI-generated timetable structure
  parsedSchedule: [{ // Structured schedule data
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: String,
    endTime: String,
    subject: String,
    room: String,
    class: String
  }],
  uploadedAt: { type: Date, default: Date.now },
});

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;
