'use client';

// ============================================================================
// PEX-OS PRODUCTIVITY MANAGER - SIDEBAR NAVIGATION
// ATHENA Architecture | Premium Dark Theme | ENTJ Navigation
// ============================================================================

import React from 'react';
import {
  FolderKanban,
  ListTodo,
  BarChart3,
  Youtube,
  FileCode2,
  Swords,
  BookTemplate,
  Bot,
  FileText,
  ChevronLeft,
  ChevronRight,
  Zap,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useProductivityStore } from '@/stores/productivityStore';
import { Tooltip } from '../prompt-manager/TooltipWrapper';

// --- NAVIGATION ITEMS ---

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: number;
  badgeType?: 'count' | 'alert';
}

const navItems: NavItem[] = [
  { id: 'projects', label: 'Projects Hub', icon: FolderKanban },
  { id: 'tasks', label: 'Task Manager', icon: ListTodo },
  { id: 'prompts', label: 'Prompt Manager', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'battle-plan', label: 'Battle Plan', icon: Swords },
  { id: 'youtube', label: 'YouTube Refs', icon: Youtube },
  { id: 'templates', label: 'Templates', icon: BookTemplate },
  { id: 'neovim', label: 'Neovim Config', icon: FileCode2 },
  { id: 'agent', label: 'AI Agent', icon: Bot },
];

// --- SIDEBAR COMPONENT ---

export const Sidebar: React.FC = () => {
  const activeSection = useProductivityStore((s) => s.activeSection);
  const agentStatus = useProductivityStore((s) => s.agentStatus);
  const tasks = useProductivityStore((s) => s.tasks);
  const insights = useProductivityStore((s) => s.insights);
  const { setActiveSection } = useProductivityStore((s) => s.actions);
  const [collapsed, setCollapsed] = React.useState(false);

  // Calculate badges
  const urgentTasks = tasks.filter(
    (t) => t.priority === 'critical' && t.status !== 'completed'
  ).length;
  const unreadInsights = insights.filter((i) => !i.dismissedAt).length;

  const getBadge = (id: string): { count?: number; type?: 'count' | 'alert' } => {
    switch (id) {
      case 'tasks':
        return urgentTasks > 0 ? { count: urgentTasks, type: 'alert' } : {};
      case 'analytics':
        return unreadInsights > 0 ? { count: unreadInsights, type: 'count' } : {};
      case 'agent':
        return agentStatus.connected ? { count: agentStatus.queuedTasks, type: 'count' } : {};
      default:
        return {};
    }
  };

  return (
    <aside
      className={`
        h-full bg-[#1e2330] border-r border-white/5 flex flex-col transition-all duration-300
        ${collapsed ? 'w-16' : 'w-56'}
      `}
    >
      {/* Logo Section */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2979ff] to-[#5b4eff] rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/30">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm tracking-tight">PEX-OS</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const badge = getBadge(item.id);
          const Icon = item.icon;

          const button = (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative
                ${isActive
                  ? 'bg-[#2979ff] text-white shadow-lg shadow-blue-900/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon
                size={18}
                className={`shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}
              />
              
              {!collapsed && (
                <>
                  <span className="text-xs font-medium flex-1 text-left">{item.label}</span>
                  {badge.count !== undefined && badge.count > 0 && (
                    <span
                      className={`
                        text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center
                        ${badge.type === 'alert'
                          ? 'bg-red-500 text-white'
                          : isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#2979ff]/20 text-[#2979ff]'
                        }
                      `}
                    >
                      {badge.count}
                    </span>
                  )}
                </>
              )}

              {/* Collapsed badge */}
              {collapsed && badge.count !== undefined && badge.count > 0 && (
                <span
                  className={`
                    absolute -top-1 -right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center
                    ${badge.type === 'alert' ? 'bg-red-500 text-white' : 'bg-[#2979ff] text-white'}
                  `}
                >
                  {badge.count > 9 ? '9+' : badge.count}
                </span>
              )}
            </button>
          );

          return collapsed ? (
            <Tooltip key={item.id} content={item.label} position="right">
              {button}
            </Tooltip>
          ) : (
            button
          );
        })}
      </nav>

      {/* Agent Status Indicator */}
      <div className="px-2 py-3 border-t border-white/5">
        <div
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-all
            ${agentStatus.connected
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-gray-500/10 border border-white/5'
            }
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              agentStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
            }`}
          />
          {!collapsed && (
            <span
              className={`text-[10px] font-medium ${
                agentStatus.connected ? 'text-green-400' : 'text-gray-500'
              }`}
            >
              {agentStatus.connected ? 'Fara-7B Connected' : 'Agent Offline'}
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-2 py-2 border-t border-white/5 flex items-center gap-1">
        <Tooltip content="Settings" position="top">
          <button className="flex-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center">
            <Settings size={16} />
          </button>
        </Tooltip>
        <Tooltip content="Help" position="top">
          <button className="flex-1 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center justify-center">
            <HelpCircle size={16} />
          </button>
        </Tooltip>
      </div>
    </aside>
  );
};

export default Sidebar;
