import mongoose from 'mongoose';

const talentShowcaseSchema = new mongoose.Schema({
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['music', 'literature', 'other'] },
  title: { type: String },
  contentUrl: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const TalentShowcase = mongoose.model('TalentShowcase', talentShowcaseSchema);
export default TalentShowcase;
