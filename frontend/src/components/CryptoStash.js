import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import '../styles/CryptoStash.css';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true
});



const CryptoStash = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there! 👋 I'm CryptoStash, your friendly crypto guide. What would you like to know about cryptocurrencies? 🚀"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are CryptoStash, a friendly and helpful crypto expert. Provide simple, easy-to-understand responses about cryptocurrency. Use emojis and casual language to make complex topics approachable. Keep responses concise and engaging. Always maintain a positive, supportive tone while being honest about risks."
          },
          ...messages.slice(1),
          { role: "user", content: userMessage }
        ],
      });

      const botResponse = response.choices[0].message.content;
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops!I'm having a little trouble right now. Could you try asking me again?"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cryptostash-container">
      <div className="cryptostash-header">
        <h3>💬 CryptoStash Chat</h3>
      </div>
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="bot-message loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about crypto..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default CryptoStash;