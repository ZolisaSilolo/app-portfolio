import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../contexts/AuthContext';
import PublicAuth from '../components/PublicAuth';

const Chat = () => {
  const { isAuthenticated } = useAuth();
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!isAuthenticated) {
    return (
      <PublicAuth 
        title="AI_BUDDY Access"
        description="Sign in or create an account to chat with AI assistant"
      />
    );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 icon-3d text-blue-600" />
            <h1 className="text-4xl font-bold gradient-text">Portfolio Assistant</h1>
            <Sparkles className="w-6 h-6 icon-3d text-cyan-600" />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Ask me anything about my projects, skills, or experience!
          </p>
        </div>
        
        <div className="modern-card rounded-3xl overflow-hidden h-[600px] flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-200/20 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center glow-effect">
                <Bot className="w-5 h-5 text-white icon-3d" />
              </div>
              <div>
                <h3 className="font-semibold">Portfolio Assistant</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Online • Powered by AI
                </p>
              </div>
              <div className="ml-auto">
                <Zap className="w-5 h-5 icon-3d text-yellow-500" />
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    message.isUser 
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-600 glow-effect' 
                      : 'bg-gradient-to-br from-gray-500 to-gray-600'
                  }`}>
                    {message.isUser ? (
                      <User className="w-4 h-4 text-white icon-3d" />
                    ) : (
                      <Bot className="w-4 h-4 text-white icon-3d" />
                    )}
                  </div>
                  
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.isUser 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                      : 'modern-card'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white icon-3d" />
                  </div>
                  <div className="modern-card px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="p-6 border-t border-gray-200/20 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about my projects, skills, or experience..."
                  className="w-full px-4 py-3 pr-12 modern-card rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="w-4 h-4 icon-3d text-blue-600" />
                </div>
              </div>
              
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 glow-effect"
              >
                <Send className="w-5 h-5 icon-3d" />
              </button>
            </div>
            
            <div className="flex items-center justify-center mt-4 space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span>Powered by AI</span>
              <span>•</span>
              <span>Real-time responses</span>
              <span>•</span>
              <span>Portfolio context aware</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {[
            { text: "Tell me about your AWS experience", icon: "☁️" },
            { text: "What projects have you worked on?", icon: "🚀" },
            { text: "How can we collaborate?", icon: "🤝" }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => setInput(action.text)}
              className="modern-card p-4 rounded-xl text-left hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl floating-animation" style={{ animationDelay: `${index * 0.2}s` }}>
                  {action.icon}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                  {action.text}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
