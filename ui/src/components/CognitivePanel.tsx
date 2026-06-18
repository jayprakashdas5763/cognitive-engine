'use client';

import React from 'react';
import {
  Brain,
  Target,
  Zap,
  BarChart3,
  Clock,
  Cpu,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '@/store';
import { motion } from 'framer-motion';

export const CognitivePanel: React.FC = () => {
  const { cognitiveOpen, cognitive } = useStore();

  if (!cognitiveOpen) return null;

  return (
    <aside className="fixed right-0 top-16 bottom-0 w-96 bg-surface/50 backdrop-blur-xl border-l border-white/10 flex flex-col overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Goal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <Target className="w-4 h-4 text-blue-400" />
            Goal
          </div>
          <p className="text-sm text-white/60">
            {cognitive.goal || 'Awaiting goal...'}
          </p>
        </motion.div>

        {/* Current Task */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <Zap className="w-4 h-4 text-amber-400" />
            Current Task
          </div>
          <p className="text-sm text-white/60">
            {cognitive.currentTask || 'Planning...'}
          </p>
        </motion.div>

        {/* Active Reasoning */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <Brain className="w-4 h-4 text-purple-400" />
            Reasoning
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-xs text-white/60 font-mono">
            {cognitive.thinking || (
              <span className="text-white/30">Initializing reasoning...</span>
            )}
          </div>
        </motion.div>

        {/* Tool Usage */}
        {cognitive.tools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
              <Cpu className="w-4 h-4 text-green-400" />
              Tools in Use
            </div>
            <div className="flex flex-wrap gap-2">
              {cognitive.tools.map((tool, i) => (
                <div
                  key={i}
                  className="px-3 py-1 bg-white/10 rounded text-xs text-white/60"
                >
                  {tool}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Confidence Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm font-semibold text-white/70">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Confidence
            </div>
            <span className="text-blue-400">{cognitive.confidence}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${cognitive.confidence}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between text-sm font-semibold text-white/70">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Progress
            </div>
            <span className="text-amber-400">{cognitive.progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${cognitive.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Memory Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-3 pt-4"
        >
          {[
            { label: 'Memory', value: '2.3MB' },
            { label: 'Tokens', value: '4,521' },
            { label: 'Latency', value: '143ms' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 rounded-lg p-3 text-center"
            >
              <p className="text-xs text-white/50">{stat.label}</p>
              <p className="text-sm font-semibold text-white/80">
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </aside>
  );
};
