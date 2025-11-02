import mongoose from 'mongoose';

const studySnapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  caption: { type: String, required: true },
  description: { type: String },
  // Hash of the uploaded image to prevent duplicates per user
  fileHash: { type: String, index: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

// Ensure a user cannot upload the exact same image twice (based on file hash)
// Use a partial index so older docs without fileHash are unaffected
try {
  studySnapSchema.index(
    { user: 1, fileHash: 1 },
    { unique: true, partialFilterExpression: { fileHash: { $exists: true, $ne: null } } }
  );
} catch (e) {
  // ignore index definition errors in case of hot-reload
}

const StudySnap = mongoose.model('StudySnap', studySnapSchema);
export default StudySnap;
