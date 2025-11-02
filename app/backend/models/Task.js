import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  priority: { type: String },
  aiPriority: { type: String },
  aiAnalysis: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model('Task', taskSchema);
export default Task;
