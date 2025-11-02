import mongoose from 'mongoose';

const notificationLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['task', 'event', 'book', 'test'], required: true },
  refId: { type: String, required: true },
  window: { type: String, default: '24h' },
  sentAt: { type: Date, default: Date.now }
})

notificationLogSchema.index({ user: 1, type: 1, refId: 1, window: 1 }, { unique: true })

const NotificationLog = mongoose.model('NotificationLog', notificationLogSchema)
export default NotificationLog
