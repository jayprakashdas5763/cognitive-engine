'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';
import { useStore } from '@/store';

export const Header: React.FC = () => {
  const { sidebarOpen, toggleSidebar, cognitiveOpen, toggleCognitive } =
    useStore();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-space/80 backdrop-blur-md border-b border-white/10 z-40 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🧠</span>
          </div>
          <h1 className="text-lg font-semibold hidden sm:block">
            Cognitive Engine
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleCognitive}
          className="px-3 py-2 text-sm rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle cognitive panel"
        >
          {cognitiveOpen ? '← Hide' : '→ Show'} Thinking
        </button>
      </div>
    </header>
  );
};
