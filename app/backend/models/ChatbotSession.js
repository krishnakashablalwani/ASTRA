import mongoose from 'mongoose';

const chatbotSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [
    {
      sender: { type: String, enum: ['user', 'bot'] },
      text: { type: String },
      timestamp: { type: Date, default: Date.now },
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

const ChatbotSession = mongoose.model('ChatbotSession', chatbotSessionSchema);
export default ChatbotSession;
