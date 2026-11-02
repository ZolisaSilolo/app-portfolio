import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageScenery } from '../components/PageScenery';
import { Send, Bot, User, RotateCcw, Sparkles } from 'lucide-react';
import { useChat } from '../hooks/useChat';

const Chat = () => {
  const { messages, isLoading, sendMessage, resetChat } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    if (isLoading) return;
    sendMessage(text);
  };

  const suggestions = [
    'Tell me about your AWS experience',
    'What projects have you worked on?',
    'What are your MLOps capabilities?',
    'How can we collaborate on architecture?',
  ];

  return (
    <div className="py-6 sm:py-12 lg:py-16 relative isolate overflow-hidden min-h-[calc(100vh-4rem)] flex flex-col justify-center">
      <Helmet>
        <title>AI Buddy | Lundi Zolisa Silolo</title>
        <meta
          name="description"
          content="Chat with AI Buddy, powered by Amazon Bedrock to discover Zolisa's AWS architecture and MLOps experience."
        />
        <link rel="canonical" href="https://zolisasilolo.co.za/chat" />
      </Helmet>

      {/* Themed page-length background photos */}
      <PageScenery top={{ src: '/chat-earth-night.jpg', tone: 'night', position: 'center 30%' }} />

      {/* Ambient Cyan Beam */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
        <div className="ambient-light-beam !w-[500px] !h-[260px] opacity-70" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col">
        {/* Compact Header for all viewports */}
        <div className="mb-4 sm:mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 mb-2">
            <span className="badge px-3 py-1 text-[11px] font-medium tracking-wide">
              <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
              Bedrock Conversational Agent
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-1.5 sm:mb-2">
            AI Buddy
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
            Inquire about my AWS cloud architecture, machine learning pipelines, or consulting availability.
          </p>
        </div>

        {/* Responsive Glassmorphic Chat Container */}
        <div className="bento-card flex flex-col flex-1 h-[calc(100dvh-15.5rem)] min-h-[460px] sm:h-[600px] lg:h-[660px] shadow-2xl">
          {/* Chat Header Bar */}
          <div className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between border-b border-divider bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                    AI Buddy
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20 hidden xs:inline-block">
                    Claude / Bedrock
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                  Ready to answer technical queries
                </p>
              </div>
            </div>

            <button
              onClick={resetChat}
              className="btn-ghost p-1.5 sm:p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs font-medium">Clear</span>
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto space-y-4 scroll-smooth" role="log" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
              >
                <div className={`flex items-start gap-2.5 max-w-[92%] sm:max-w-[82%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                      message.isUser
                        ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-sm'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-divider'
                    }`}
                  >
                    {message.isUser ? <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </div>

                  <div
                    className={`px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      message.isUser
                        ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-tr-xs shadow-md shadow-cyan-500/10'
                        : 'bg-white dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-100 rounded-tl-xs border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    <p
                      className={`text-[10px] mt-1 font-mono text-right ${
                        message.isUser ? 'text-cyan-100/80' : 'text-zinc-400 dark:text-zinc-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start" aria-label="AI Buddy is generating a response">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-cyan-500 flex items-center justify-center shrink-0 border border-divider">
                    <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-tl-xs bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-[11px] font-mono text-zinc-400 ml-1.5">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Interactive Suggestion Chips */}
          <div className="px-3.5 sm:px-6 pt-2 pb-1 border-t border-divider/60 bg-zinc-50/40 dark:bg-zinc-950/40 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1.5">
              <span className="text-[10px] font-mono uppercase text-muted shrink-0 hidden sm:inline-block mr-1">
                Suggested:
              </span>
              {suggestions.map((text) => (
                <button
                  key={text}
                  onClick={() => handleSuggestionClick(text)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-lg text-[11px] sm:text-xs whitespace-nowrap bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/5 transition-all shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Input Form */}
          <div className="p-3 sm:p-4 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md shrink-0">
            <div className="flex items-end gap-2 sm:gap-3">
              <label htmlFor="chat-input" className="sr-only">Message AI Buddy</label>
              <textarea
                ref={textareaRef}
                id="chat-input"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask about AWS architecture, MLOps, projects..."
                maxLength={1000}
                rows={1}
                className="flex-1 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl resize-none text-xs sm:text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-cyan-500/30 transition-all leading-normal"
                style={{
                  minHeight: '44px',
                  maxHeight: '120px',
                }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="btn-primary !p-0 w-11 h-11 shrink-0 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden sm:flex items-center justify-between mt-2 px-1 text-[11px] text-muted font-mono">
              <span>Shift + Enter for new line</span>
              <span>Amazon Bedrock Foundation Model</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
