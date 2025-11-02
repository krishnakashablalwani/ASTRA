import mongoose from 'mongoose';

const timerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  startTime: { type: Date },
  endTime: { type: Date },
  duration: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const Timer = mongoose.model('Timer', timerSchema);
export default Timer;
