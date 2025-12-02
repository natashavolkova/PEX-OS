'use client';

// ============================================================================
// PEX-OS PRODUCTIVITY MANAGER - TOP BAR
// ATHENA Architecture | Premium Dark Theme | Global Actions
// ============================================================================

import React, { useState } from 'react';
import {
  Search,
  Bell,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { useProductivityStore } from '@/stores/productivityStore';
import { usePromptManagerStore } from '@/stores/promptManager';
import { Tooltip } from '../prompt-manager/TooltipWrapper';

// --- FOCUS TIMER COMPONENT ---

const FocusTimer: React.FC = () => {
  const currentFocusWindow = useProductivityStore((s) => s.currentFocusWindow);
  const { startFocusWindow, endFocusWindow } = useProductivityStore((s) => s.actions);
  const [elapsed, setElapsed] = useState(0);

  React.useEffect(() => {
    if (!currentFocusWindow) {
      setElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - currentFocusWindow.startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentFocusWindow]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isActive = currentFocusWindow !== null;

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all
        ${isActive
          ? 'bg-[#2979ff]/10 border-[#2979ff]/30 text-[#2979ff]'
          : 'bg-[#0f111a] border-white/10 text-gray-400'
        }
      `}
    >
      <Timer size={14} className={isActive ? 'text-[#2979ff]' : 'text-gray-500'} />
      <span className="text-xs font-mono font-medium min-w-[48px]">
        {formatTime(elapsed)}
      </span>
      
      {!isActive ? (
        <Tooltip content="Start Focus Session" position="bottom">
          <button
            onClick={() => startFocusWindow('deep_work')}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Play size={12} className="text-green-400" />
          </button>
        </Tooltip>
      ) : (
        <Tooltip content="End Focus Session" position="bottom">
          <button
            onClick={() => endFocusWindow()}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <Pause size={12} className="text-yellow-400" />
          </button>
        </Tooltip>
      )}
    </div>
  );
};

// --- QUICK STATS COMPONENT ---

const QuickStats: React.FC = () => {
  const tasks = useProductivityStore((s) => s.tasks);
  const { getHighROITasks, getTodayMetrics } = useProductivityStore((s) => s.actions);

  const todayMetrics = getTodayMetrics();
  const highROICount = getHighROITasks(100).length;
  const completedToday = tasks.filter(
    (t) => t.completedAt && new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;
  const blockedCount = tasks.filter((t) => t.status === 'blocked').length;

  return (
    <div className="hidden lg:flex items-center gap-4">
      <div className="flex items-center gap-1.5 text-xs">
        <Target size={12} className="text-[#2979ff]" />
        <span className="text-gray-400">ROI Tasks:</span>
        <span className="text-white font-medium">{highROICount}</span>
      </div>
      
      <div className="w-px h-4 bg-white/10" />
      
      <div className="flex items-center gap-1.5 text-xs">
        <TrendingUp size={12} className="text-green-400" />
        <span className="text-gray-400">Done:</span>
        <span className="text-white font-medium">{completedToday}</span>
      </div>
      
      {blockedCount > 0 && (
        <>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5 text-xs">
            <AlertTriangle size={12} className="text-red-400" />
            <span className="text-gray-400">Blocked:</span>
            <span className="text-red-400 font-medium">{blockedCount}</span>
          </div>
        </>
      )}
    </div>
  );
};

// --- MAIN TOP BAR COMPONENT ---

export const TopBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const activeSection = useProductivityStore((s) => s.activeSection);
  const notifications = usePromptManagerStore((s) => s.notifications);
  const { setNotificationsOpen } = usePromptManagerStore((s) => s.actions);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const sectionLabels: Record<string, string> = {
    projects: 'Projects Hub',
    tasks: 'Task Manager',
    prompts: 'Prompt Manager',
    analytics: 'Productivity Analytics',
    youtube: 'YouTube References',
    templates: 'Strategic Templates',
    neovim: 'Neovim Configuration',
    'battle-plan': 'ENTJ Battle Plan',
    agent: 'AI Agent Integration',
  };

  return (
    <header className="h-14 bg-[#1e2330] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
      {/* Left: Section Title & Stats */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-[#2979ff]" />
          <h1 className="text-white font-bold text-sm tracking-tight">
            {sectionLabels[activeSection] || 'PEX-OS'}
          </h1>
        </div>
        
        <QuickStats />
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative group">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#2979ff] transition-colors"
          />
          <input
            type="text"
            placeholder="Search everything... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg pl-9 pr-3 text-xs text-gray-300 focus:outline-none focus:border-[#2979ff] transition-all placeholder-gray-600"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
            <span className="text-[10px] font-mono text-gray-600 border border-white/5 px-1 rounded bg-white/5">
              Ctrl
            </span>
            <span className="text-[10px] font-mono text-gray-600 border border-white/5 px-1 rounded bg-white/5">
              K
            </span>
          </div>
        </div>
      </div>

      {/* Right: Focus Timer & Actions */}
      <div className="flex items-center gap-3">
        <FocusTimer />
        
        <div className="w-px h-6 bg-white/10" />
        
        {/* Notifications */}
        <Tooltip content="Notifications" position="bottom">
          <button
            onClick={() => setNotificationsOpen(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1e2330]" />
            )}
          </button>
        </Tooltip>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2979ff] to-[#5b4eff] flex items-center justify-center text-[10px] font-bold text-white border-2 border-white/10">
          NA
        </div>
      </div>
    </header>
  );
};

export default TopBar;
