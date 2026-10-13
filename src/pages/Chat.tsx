import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useChat } from '../hooks/useChat';

const Chat = () => {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    'Tell me about your AWS experience',
    'What projects have you worked on?',
    'How can we collaborate?',
  ];

  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl lg:text-5xl font-bold tracking-tight mb-4"
            style={{ color: 'rgb(var(--text-primary))', letterSpacing: '-0.03em' }}
          >
            AI Assistant
          </h1>
          <p className="text-lg text-secondary">
            Ask me anything about my projects, skills, or experience.
          </p>
        </div>

        <div className="card overflow-hidden h-[600px] flex flex-col">
          {/* Chat header */}
          <div className="px-6 py-4 flex items-center gap-3 border-b border-divider">
            <div className="icon-box">
              <Bot className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold text-sm" style={{ color: 'rgb(var(--text-primary))' }}>
                Portfolio Assistant
              </h2>
              <p className="text-xs text-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Online · Powered by Amazon Bedrock
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-5" role="log" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-3 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                    style={{
                      background: message.isUser ? 'rgb(var(--accent))' : 'rgb(var(--bg-tertiary))',
                      border: '1px solid rgb(var(--border))',
                      color: message.isUser ? '#fff' : 'rgb(var(--text-secondary))',
                    }}
                  >
                    {message.isUser ? <User className="w-4 h-4" aria-hidden="true" /> : <Bot className="w-4 h-4" aria-hidden="true" />}
                  </div>
                  <div
                    className="px-4 py-3 rounded-xl"
                    style={
                      message.isUser
                        ? { background: 'rgb(var(--accent))', color: '#fff' }
                        : {
                            background: 'rgb(var(--bg-tertiary))',
                            color: 'rgb(var(--text-primary))',
                            border: '1px solid rgb(var(--border))',
                          }
                    }
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start" aria-label="Assistant is typing">
                <div
                  className="px-4 py-3 rounded-xl flex gap-1"
                  style={{ background: 'rgb(var(--bg-tertiary))', border: '1px solid rgb(var(--border))' }}
                >
                  {[0, 0.15, 0.3].map((d) => (
                    <span
                      key={d}
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: 'rgb(var(--text-muted))', animationDelay: `${d}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-divider">
            <div className="flex items-end gap-3">
              <label htmlFor="chat-input" className="sr-only">Message</label>
              <textarea
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about my projects, skills, or experience..."
                maxLength={1000}
                rows={1}
                className="flex-1 px-4 py-3 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                style={{
                  minHeight: '48px',
                  maxHeight: '120px',
                  background: 'rgb(var(--bg-primary))',
                  color: 'rgb(var(--text-primary))',
                  border: '1px solid rgb(var(--border))',
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="btn-primary h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-6 grid md:grid-cols-3 gap-3">
          {suggestions.map((text) => (
            <button key={text} onClick={() => setInput(text)} className="card-interactive p-4 text-left text-sm text-secondary">
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
