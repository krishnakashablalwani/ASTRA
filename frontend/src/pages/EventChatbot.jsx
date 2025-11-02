import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';

export default function EventChatbot() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I can help you find event information like timings, locations, and more. Just ask me about any campus event!'
    }
  ]);
  const [input, setInput] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const openGoogleMaps = (location) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Create context from events
      const eventsContext = events.map(e => 
        `Event: ${e.title}\nDate: ${new Date(e.date).toLocaleDateString()}\nTime: ${e.time || 'TBD'}\nLocation: ${e.location}\nDescription: ${e.description}`
      ).join('\n\n');

      const prompt = `You are a helpful campus event assistant. Here are the current events:\n\n${eventsContext}\n\nUser question: ${input}\n\nProvide a helpful, concise answer. If the user asks about location, mention they can view it on Google Maps.`;

      const response = await api.post('/ai/chat', { message: prompt });
      const aiResponse = response.data.response || response.data.message;

      // Check if response mentions a location and add map link
      const locationMatch = events.find(e => 
        input.toLowerCase().includes(e.title.toLowerCase()) ||
        aiResponse.toLowerCase().includes(e.title.toLowerCase())
      );

      let assistantContent = aiResponse;
      if (locationMatch && locationMatch.location) {
        assistantContent += `\n\n📍 [View ${locationMatch.location} on Google Maps]`;
      }

      const assistantMessage = { 
        role: 'assistant', 
        content: assistantContent,
        mapLocation: locationMatch?.location 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-robot me-2"></i>
            Event Chatbot
          </h2>
          <p className="text-muted mb-0">Ask me about event timings, locations, and more!</p>
        </div>
        <img 
          src={theme === 'light' ? '/light.png' : '/dark.png'} 
          alt="CampusHive Logo" 
          style={{ height: 50 }}
        />
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0" style={{ borderRadius: 16, height: 'calc(100vh - 250px)' }}>
            {/* Chat Messages */}
            <div className="card-body overflow-auto p-4" style={{ flex: 1 }}>
              {messages.map((msg, index) => (
                <div key={index} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div 
                    className={`p-3 ${msg.role === 'user' ? 'bg-warning text-dark' : 'bg-light'}`}
                    style={{ 
                      maxWidth: '70%', 
                      borderRadius: 16,
                      borderTopLeftRadius: msg.role === 'assistant' ? 0 : 16,
                      borderTopRightRadius: msg.role === 'user' ? 0 : 16
                    }}
                  >
                    <div className="d-flex align-items-start gap-2 mb-1">
                      <i className={`bi bi-${msg.role === 'user' ? 'person-circle' : 'robot'} fs-5`}></i>
                      <strong>{msg.role === 'user' ? 'You' : 'Event Bot'}</strong>
                    </div>
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {msg.content}
                    </p>
                    {msg.mapLocation && (
                      <button 
                        className="btn btn-sm btn-primary mt-2"
                        onClick={() => openGoogleMaps(msg.mapLocation)}
                        style={{ borderRadius: 8 }}
                      >
                        <i className="bi bi-geo-alt-fill me-1"></i>
                        Open in Google Maps
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="d-flex justify-content-start mb-3">
                  <div className="p-3 bg-light" style={{ borderRadius: 16, borderTopLeftRadius: 0 }}>
                    <div className="spinner-border spinner-border-sm text-warning" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="card-footer border-0 p-3" style={{ backgroundColor: 'var(--hive-bg)' }}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Ask about events..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  style={{ borderRadius: '12px 0 0 12px' }}
                />
                <button 
                  className="btn btn-warning btn-lg"
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  style={{ borderRadius: '0 12px 12px 0' }}
                >
                  <i className="bi bi-send-fill"></i>
                </button>
              </div>
              <small className="text-muted mt-2 d-block">
                Try asking: "When is the Tech Fest?", "Where is the Music Concert?", "Show me today's events"
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
