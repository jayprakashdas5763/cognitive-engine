'use client';

import React, { useState } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  Plus,
} from 'lucide-react';
import { useStore } from '@/store';
import { motion } from 'framer-motion';

export const ChatArea: React.FC = () => {
  const { messages, addMessage, sidebarOpen, cognitiveOpen, setCognitive } =
    useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    });

    setInput('');
    setLoading(true);

    // Simulate cognitive process
    setCognitive({
      goal: input,
      progress: 20,
      thinking: 'Analyzing request...',
    });

    // Simulate assistant response
    setTimeout(() => {
      setCognitive({
        progress: 100,
        thinking: 'Ready.',
      });

      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'I understand your request. Let me break this down into actionable steps and execute them systematically.\n\n1. **Analysis**: Understanding the goal\n2. **Planning**: Creating task steps\n3. **Execution**: Running each task\n4. **Synthesis**: Combining results',
        timestamp: new Date(),
      });

      setLoading(false);
    }, 1500);
  };

  const mainStyle = {
    marginLeft: sidebarOpen ? '320px' : '0',
    marginRight: cognitiveOpen ? '384px' : '0',
  };

  return (
    <main
      className="fixed top-16 bottom-0 left-0 right-0 transition-all duration-300 flex flex-col"
      style={mainStyle}
    >
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">🧠</span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Welcome to Cognitive Engine</h2>
                <p className="text-white/50 mt-2">
                  Enter your goal to start autonomous execution
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                <p className="text-sm text-white/80">{msg.content}</p>
              </div>
            </motion.div>
          ))
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-lg">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 p-6 bg-space/50 backdrop-blur-xl">
        <div className="flex gap-3">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
          </button>

          <div className="flex-1 flex gap-2 items-center bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus-within:border-white/20 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Enter your goal..."
              className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
            />

            <button className="p-1 hover:bg-white/5 rounded transition-colors">
              <Paperclip className="w-4 h-4 text-white/50" />
            </button>

            <button className="p-1 hover:bg-white/5 rounded transition-colors">
              <Mic className="w-4 h-4 text-white/50" />
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 rounded-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
};
