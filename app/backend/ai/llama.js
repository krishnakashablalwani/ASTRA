import dotenv from 'dotenv';
import axios from 'axios';

// Ensure environment variables are loaded even when this module is imported before index.js runs dotenv.config()
dotenv.config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'; // Fast and efficient model
const GROQ_API_KEY = process.env.GROQ_API_KEY; // Set this in your .env file

export async function llamaChat(messages, options = {}) {
  // messages: [{role: 'user'|'assistant'|'system', content: string}]
  try {
    const res = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1024,
        ...options
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.error?.message || err.response?.data?.error || err.message;
    const e = new Error(message);
    if (status) e.status = status;
    throw e;
  }
}
