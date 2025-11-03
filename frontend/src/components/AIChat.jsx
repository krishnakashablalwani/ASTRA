import React, { useState } from 'react';
import api from '../services/api';

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful campus assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setRateLimited(false);
    try {
      const res = await api.post('/ai/chat', { messages: newMessages });
      const aiMsg = res.data.choices?.[0]?.message?.content || 'No response.';
      setMessages([...newMessages, { role: 'assistant', content: aiMsg }]);
    } catch (err) {
      console.error('AI Chat Error:', err);
      let errorMsg = 'An error occurred while processing your request.';
      
      if (err.response) {
        const status = err.response.status;
        errorMsg = err.response.data?.error || err.response.data?.message || errorMsg;
        
        // Set rate limit flag for 429 errors
        if (status === 429) {
          setRateLimited(true);
        }
      } else if (err.request) {
        errorMsg = 'No response from server. Please check your connection.';
      } else {
        errorMsg = err.message || errorMsg;
      }
      
      setMessages([...newMessages, { role: 'assistant', content: '❌ Error: ' + errorMsg }]);
    }
    setLoading(false);
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title text-primary">AI Campus Chat</h5>
        {rateLimited && (
          <div className="alert alert-warning alert-dismissible fade show mb-3" role="alert">
            <strong>Rate limit reached!</strong> Please wait a moment before sending more messages.
            <button type="button" className="btn-close" onClick={() => setRateLimited(false)} aria-label="Close"></button>
          </div>
        )}
        <div style={{ 
          maxHeight: 250, 
          overflowY: 'auto', 
          background: 'var(--hive-bg)', 
          padding: 8, 
          borderRadius: 6, 
          marginBottom: 12,
          border: '1px solid var(--hive-border)'
        }}>
          {messages.slice(1).map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'text-end' : 'text-start'}>
              <span className={msg.role === 'user' ? 'badge bg-warning text-dark' : 'badge bg-info text-dark'}>
                {msg.role === 'user' ? 'You' : 'AI'}
              </span>
              <span className="ms-2">{msg.content}</span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="d-flex">
          <input className="form-control me-2" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything..." disabled={loading} />
          <button className="btn btn-primary" type="submit" disabled={loading || !input.trim()}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
