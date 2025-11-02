import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'staff', 'admin', 'club'], default: 'student' },
  department: { type: String },
  phone: { type: String },
  // Profile additions
  dob: { type: Date },
  bloodGroup: { type: String }, // e.g., 'A+', 'B-', free text for flexibility
  avatarUrl: { type: String },
  
  // Student-specific fields
  rollNo: { type: String, unique: true, sparse: true },
  semester: { type: Number },
  year: { type: Number },
  tags: [{ type: String }],
  clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  proficiencies: [{
    subject: String,
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
  }],
  
  // Teacher-specific fields
  teacherId: { type: String, unique: true, sparse: true },
  subjectsTaught: [{ type: String }],
  designation: { type: String },
  
  // Staff-specific fields
  staffId: { type: String, unique: true, sparse: true },
  staffType: { type: String },
  
  // Common fields
  xp: { type: Number, default: 0 },
  leaderboardRank: { type: Number },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// Pre-save hook to update timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
