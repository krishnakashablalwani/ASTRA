import mongoose from 'mongoose';

const pushSubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

pushSubscriptionSchema.pre('save', function(next){
  this.updatedAt = new Date();
  next();
})

const PushSubscription = mongoose.model('PushSubscription', pushSubscriptionSchema)
export default PushSubscription
