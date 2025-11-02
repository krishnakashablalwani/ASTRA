import mongoose from 'mongoose';

const subjectProficiencySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: { type: String, required: true },
  proficiencyLevel: { type: String },
  availableToHelp: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const SubjectProficiency = mongoose.model('SubjectProficiency', subjectProficiencySchema);
export default SubjectProficiency;
