import express from 'express';
import { llamaChat } from '../ai/llama.js';

const router = express.Router();

// POST /api/ai/chat
router.post('/chat', async (req, res) => {
  const { messages, options } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array required' });
  }
  try {
    const data = await llamaChat(messages, options);
    res.json(data);
  } catch (err) {
    const status = err.status || 500;
    let msg = err.message;
    
    if (status === 401) {
      msg = 'AI provider unauthorized: set a valid GROQ_API_KEY in backend .env and ensure your key has access.';
    } else if (status === 429) {
      msg = 'AI rate limit exceeded. Please wait a moment and try again. Groq has generous free tier limits.';
    } else if (status === 503) {
      msg = 'AI service temporarily unavailable. Please try again in a few moments.';
    }
    
    console.error(`AI API Error (${status}):`, msg);
    res.status(status).json({ error: msg });
  }
});

export default router;
