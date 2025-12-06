'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - ANALYTICS DASHBOARD
// ATHENA Architecture | Premium Dark Theme | ENTJ Productivity Metrics
// Clean layout with real data only - NO mock/fake data
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Zap,
  AlertTriangle,
  Activity,
  Brain,
  Sun,
  X,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { QuickActions } from './QuickActions';

// --- TYPES ---
interface StatsData {
  totalPrompts: number;
  activeProjects: number;
  totalFocusHours: number;
  completedTasks: number;
  youtubeVideos: number;
  neovimConfigs: number;
}

// --- METRIC CARD COMPONENT ---
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color,
  subtitle,
}) => (
  <div className="bg-[#1e2330] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all group">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      {change !== undefined && (
        <div
          className={`text-xs flex items-center gap-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
        >
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-1 group-hover:text-[#2979ff] transition-colors">
      {value}
    </div>
    <div className="text-xs text-gray-400">{title}</div>
    {subtitle && <div className="text-[10px] text-gray-500 mt-1">{subtitle}</div>}
  </div>
);

// --- EMPTY STATE HEATMAP ---
const EmptyHeatmap: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-[#1e2330] border border-white/5 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity size={20} className="text-[#2979ff]" />
          Weekly Activity Heatmap
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-[#1e2330] border border-white/10 rounded-sm" />
            <div className="w-4 h-4 bg-[#2979ff]/20 rounded-sm" />
            <div className="w-4 h-4 bg-[#2979ff]/40 rounded-sm" />
            <div className="w-4 h-4 bg-[#2979ff]/60 rounded-sm" />
            <div className="w-4 h-4 bg-[#2979ff] rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Hours header */}
          <div className="flex mb-2">
            <div className="w-14 shrink-0" />
            {hours.filter((h) => h % 2 === 0).map((hour) => (
              <div
                key={hour}
                className="flex-1 text-xs text-gray-500 text-center"
                style={{ minWidth: '28px' }}
              >
                {hour}:00
              </div>
            ))}
          </div>

          {/* Grid */}
          {days.map((day) => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-14 text-sm text-gray-400 shrink-0 font-medium">{day}</div>
              <div className="flex-1 flex gap-1">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="flex-1 h-8 bg-[#1e2330] border border-white/5 rounded hover:border-[#2979ff]/30 transition-all cursor-pointer"
                    style={{ minWidth: '28px' }}
                    title={`${day} ${hour}:00 - No activity`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty state message with action */}
      <div className="mt-6 text-center py-6 border-t border-white/5">
        <Lightbulb className="w-10 h-10 text-athena-gold/40 mx-auto mb-3" />
        <p className="text-base text-gray-400 mb-1">No activity data yet</p>
        <p className="text-sm text-gray-500 mb-4">Complete tasks to see your productivity patterns</p>
        <a
          href="/pex-os/tasks"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2979ff]/10 text-[#2979ff] hover:bg-[#2979ff]/20 border border-[#2979ff]/20 hover:border-[#2979ff]/40 transition-all text-sm font-medium"
        >
          <Target size={18} />
          Go to Tasks
        </a>
      </div>
    </div>
  );
};

// --- PEAK HOURS CHART (EMPTY STATE) ---
const PeakHoursChart: React.FC = () => {
  const peakHours = [
    { hour: '6 AM', value: 0 },
    { hour: '9 AM', value: 0 },
    { hour: '12 PM', value: 0 },
    { hour: '3 PM', value: 0 },
    { hour: '6 PM', value: 0 },
    { hour: '9 PM', value: 0 },
  ];

  return (
    <div className="bg-[#1e2330] border border-white/5 rounded-xl p-4">
      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
        <Sun size={16} className="text-yellow-400" />
        Peak Productivity Hours
      </h3>

      <div className="space-y-2">
        {peakHours.map(({ hour, value }) => (
          <div key={hour} className="flex items-center gap-3">
            <div className="w-12 text-xs text-gray-400">{hour}</div>
            <div className="flex-1 h-4 bg-[#0f111a] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500/30 to-yellow-500/60 rounded-full transition-all"
                style={{ width: `${value}%` }}
              />
            </div>
            <div className="w-8 text-xs text-gray-500 text-right">{value}%</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center py-3 border-t border-white/5">
        <p className="text-xs text-gray-500">Complete tasks to discover your peak hours</p>
      </div>
    </div>
  );
};

// --- INSIGHT CARD ---
interface InsightCardProps {
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  onDismiss?: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({
  type,
  title,
  description,
  priority,
  onDismiss,
}) => {
  const priorityColors = {
    low: 'border-[#2979ff]/30 bg-[#2979ff]/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
    high: 'border-red-500/30 bg-red-500/5',
  };

  const iconMap: Record<string, React.ReactNode> = {
    peak_time: <Sun size={14} className="text-yellow-400" />,
    warning: <AlertTriangle size={14} className="text-red-400" />,
    achievement: <Zap size={14} className="text-green-400" />,
    tip: <Lightbulb size={14} className="text-[#2979ff]" />,
  };

  return (
    <div className={`border rounded-lg p-3 ${priorityColors[priority]} relative group`}>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={12} className="text-gray-500 hover:text-white" />
        </button>
      )}
      <div className="flex items-start gap-2">
        <div className="mt-0.5">{iconMap[type] || iconMap.tip}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-medium text-white mb-1">{title}</div>
          <div className="text-[10px] text-gray-400 leading-relaxed">{description}</div>
        </div>
        <ChevronRight size={12} className="text-gray-500 mt-0.5 shrink-0" />
      </div>
    </div>
  );
};

// --- MAIN ANALYTICS DASHBOARD ---
export const AnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsData>({
    totalPrompts: 0,
    activeProjects: 0,
    totalFocusHours: 0,
    completedTasks: 0,
    youtubeVideos: 0,
    neovimConfigs: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch real stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics/stats');
        const data = await res.json();
        if (data.success && data.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Check if system has any data
  const hasData = stats.totalPrompts > 0 || stats.activeProjects > 0 || stats.completedTasks > 0;

  // Heatmap configuration
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Peak hours data (empty state)
  const peakHours = [
    { hour: '6 AM', value: 0 },
    { hour: '9 AM', value: 0 },
    { hour: '12 PM', value: 0 },
    { hour: '3 PM', value: 0 },
    { hour: '6 PM', value: 0 },
    { hour: '9 PM', value: 0 },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 bg-[#0f111a] custom-scrollbar">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <MetricCard
          title="Tasks Completed"
          value={loading ? '...' : (stats.completedTasks ?? 0)}
          icon={<Target size={16} className="text-white" />}
          color="bg-green-500/20"
          subtitle={hasData ? undefined : "No tasks yet"}
        />
        <MetricCard
          title="Average ROI"
          value={loading ? '...' : '0'}
          icon={<TrendingUp size={16} className="text-white" />}
          color="bg-[#2979ff]/20"
          subtitle="Complete tasks to track"
        />
        <MetricCard
          title="Focus Hours"
          value={loading ? '...' : `${stats.totalFocusHours ?? 0}h`}
          icon={<Clock size={16} className="text-white" />}
          color="bg-purple-500/20"
          subtitle={hasData ? undefined : "Start a focus session"}
        />
        <MetricCard
          title="High ROI Done"
          value={loading ? '...' : 0}
          icon={<Zap size={16} className="text-white" />}
          color="bg-yellow-500/20"
          subtitle="ROI ≥ 2.0"
        />
        <MetricCard
          title="Active Projects"
          value={loading ? '...' : (stats.activeProjects ?? 0)}
          icon={<BarChart3 size={16} className="text-white" />}
          color="bg-orange-500/20"
          subtitle={hasData ? undefined : "Create a project"}
        />
        <MetricCard
          title="Blocked Tasks"
          value={loading ? '...' : 0}
          icon={<AlertTriangle size={16} className="text-white" />}
          color="bg-gray-500/20"
          subtitle="All clear!"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <QuickActions />
      </div>

      {/* Unified Analytics Container - Heatmap + Peak Hours + Insights */}
      <div className="bg-[#1e2330] border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Activity size={20} className="text-[#2979ff]" />
            Weekly Activity Heatmap
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-[#1e2330] border border-white/10 rounded-sm" />
              <div className="w-4 h-4 bg-[#2979ff]/20 rounded-sm" />
              <div className="w-4 h-4 bg-[#2979ff]/40 rounded-sm" />
              <div className="w-4 h-4 bg-[#2979ff]/60 rounded-sm" />
              <div className="w-4 h-4 bg-[#2979ff] rounded-sm" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Main Grid: Heatmap (left) + Sidebar (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Hours header */}
              <div className="flex mb-2">
                <div className="w-14 shrink-0" />
                {hours.filter((h) => h % 2 === 0).map((hour) => (
                  <div
                    key={hour}
                    className="flex-1 text-xs text-gray-500 text-center"
                    style={{ minWidth: '24px' }}
                  >
                    {hour}:00
                  </div>
                ))}
              </div>

              {/* Grid */}
              {days.map((day) => (
                <div key={day} className="flex items-center mb-1">
                  <div className="w-14 text-sm text-gray-400 shrink-0 font-medium">{day}</div>
                  <div className="flex-1 flex gap-0.5">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="flex-1 h-6 bg-[#1e2330] border border-white/5 rounded hover:border-[#2979ff]/30 transition-all cursor-pointer"
                        style={{ minWidth: '24px' }}
                        title={`${day} ${hour}:00 - No activity`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Peak Hours + Insights */}
          <div className="flex flex-col gap-4 border-l border-white/5 pl-6">
            {/* Peak Productivity Hours */}
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Sun size={16} className="text-yellow-400" />
                Peak Productivity Hours
              </h4>
              <div className="space-y-2">
                {peakHours.map(({ hour, value }) => (
                  <div key={hour} className="flex items-center gap-2">
                    <div className="w-10 text-xs text-gray-400">{hour}</div>
                    <div className="flex-1 h-3 bg-[#0f111a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500/30 to-yellow-500/60 rounded-full transition-all"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <div className="w-8 text-xs text-gray-500 text-right">{value}%</div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-center">Complete tasks to discover your peak hours</p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/5" />

            {/* Productivity Insights */}
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Brain size={16} className="text-purple-400" />
                Productivity Insights
              </h4>
              <div className="space-y-2">
                <InsightCard
                  type="tip"
                  title="Welcome to Athena"
                  description="Start creating prompts and completing tasks to generate personalized productivity insights."
                  priority="low"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
