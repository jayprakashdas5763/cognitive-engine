'use client';

import React from 'react';
import { Plus, MessageSquare, Play, Settings } from 'lucide-react';
import { useStore } from '@/store';

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useStore();

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-80 bg-surface/50 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* New Chat */}
      <div className="p-6 border-b border-white/5">
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-4 py-3 rounded-lg font-medium transition-all group">
          <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
          New Chat
        </button>
      </div>

      {/* Recent Chats */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
            Recent
          </h3>
          <div className="space-y-2">
            {[
              { title: 'Task Planning', time: '2h ago' },
              { title: 'Research Query', time: '1d ago' },
              { title: 'Code Analysis', time: '2d ago' },
            ].map((chat, i) => (
              <button
                key={i}
                className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-white/40">{chat.time}</p>
                  </div>
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Workflows */}
        <div>
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
            Workflows
          </h3>
          <div className="space-y-2">
            {['Research & Summarize', 'Code Review', 'Analysis'].map(
              (workflow, i) => (
                <button
                  key={i}
                  className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    {workflow}
                  </div>
                </button>
              )
            )}
          </div>
        </div>

        {/* Knowledge Bases */}
        <div>
          <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
            Knowledge
          </h3>
          <button className="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white">
            📚 Documentation
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="p-6 border-t border-white/5">
        <button className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-white/5 transition-colors text-sm text-white/70 hover:text-white">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
};
