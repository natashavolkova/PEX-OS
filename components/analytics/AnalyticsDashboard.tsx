'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - ANALYTICS DASHBOARD
// ATHENA Architecture | Premium Dark Theme | ENTJ Productivity Metrics
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Zap,
  AlertTriangle,
  Calendar,
  Activity,
  Brain,
  Coffee,
  Flame,
  Moon,
  Sun,
  X,
  ChevronRight,
} from 'lucide-react';
import { useProductivityStore } from '@/stores/productivityStore';

// --- HEATMAP COMPONENT ---

const WeeklyHeatmap: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate mock heatmap data for visualization
  const generateHeatmapData = () => {
    return days.map((day, dayIndex) => ({
      day,
      hours: hours.map((hour) => {
        // Simulate realistic work patterns
        let base = 0;
        if (dayIndex >= 1 && dayIndex <= 5) { // Weekdays
          if (hour >= 9 && hour <= 12) base = 0.7; // Morning peak
          else if (hour >= 14 && hour <= 18) base = 0.6; // Afternoon
          else if (hour >= 20 && hour <= 23) base = 0.4; // Evening work
        } else { // Weekends
          if (hour >= 10 && hour <= 14) base = 0.3;
        }
        return {
          hour,
          value: Math.max(0, Math.min(1, base + (Math.random() - 0.5) * 0.4)),
        };
      }),
    }));
  };

  const heatmapData = useMemo(() => generateHeatmapData(), []);

  const getColor = (value: number) => {
    if (value === 0) return 'bg-[#1e2330]';
    if (value < 0.25) return 'bg-[#2979ff]/20';
    if (value < 0.5) return 'bg-[#2979ff]/40';
    if (value < 0.75) return 'bg-[#2979ff]/60';
    return 'bg-[#2979ff]';
  };

  return (
    <div className="bg-[#1e2330] border border-white/5 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Activity size={16} className="text-[#2979ff]" />
          Weekly Activity Heatmap
        </h3>
        <div className="flex items-center gap-2 text-[10px] text-gray-400">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 bg-[#1e2330] border border-white/10 rounded-sm" />
            <div className="w-3 h-3 bg-[#2979ff]/20 rounded-sm" />
            <div className="w-3 h-3 bg-[#2979ff]/40 rounded-sm" />
            <div className="w-3 h-3 bg-[#2979ff]/60 rounded-sm" />
            <div className="w-3 h-3 bg-[#2979ff] rounded-sm" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hours header */}
          <div className="flex mb-1">
            <div className="w-10 shrink-0" />
            {hours.filter((h) => h % 3 === 0).map((hour) => (
              <div
                key={hour}
                className="flex-1 text-[9px] text-gray-500 text-center"
                style={{ minWidth: '12px' }}
              >
                {hour}h
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {heatmapData.map((row) => (
            <div key={row.day} className="flex items-center gap-0.5 mb-0.5">
              <div className="w-10 text-[10px] text-gray-400 shrink-0">{row.day}</div>
              <div className="flex gap-0.5 flex-1">
                {row.hours.map((cell) => (
                  <div
                    key={cell.hour}
                    className={`h-3 flex-1 rounded-sm ${getColor(cell.value)} hover:ring-1 hover:ring-white/30 transition-all cursor-pointer`}
                    title={`${row.day} ${cell.hour}:00 - Activity: ${Math.round(cell.value * 100)}%`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
  <div className="bg-[#1e2330] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
      {change !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            change >= 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-xs text-gray-400">{title}</div>
    {subtitle && <div className="text-[10px] text-gray-500 mt-1">{subtitle}</div>}
  </div>
);

// --- INSIGHT CARD COMPONENT ---

interface InsightCardProps {
  type: string;
  title: string;
  description: string;
  actionable: boolean;
  suggestedAction?: string;
  priority: 'high' | 'medium' | 'low';
  onDismiss: () => void;
}

const InsightCard: React.FC<InsightCardProps> = ({
  type,
  title,
  description,
  actionable,
  suggestedAction,
  priority,
  onDismiss,
}) => {
  const typeIcons = {
    peak_time: <Sun size={14} className="text-yellow-400" />,
    dead_zone: <Moon size={14} className="text-gray-400" />,
    pattern: <Activity size={14} className="text-[#2979ff]" />,
    recommendation: <Brain size={14} className="text-purple-400" />,
    warning: <AlertTriangle size={14} className="text-red-400" />,
    procrastination: <Coffee size={14} className="text-orange-400" />,
  };

  const priorityColors = {
    high: 'border-red-500/30 bg-red-500/5',
    medium: 'border-yellow-500/30 bg-yellow-500/5',
    low: 'border-gray-500/30 bg-gray-500/5',
  };

  return (
    <div className={`border rounded-lg p-3 ${priorityColors[priority]} relative group`}>
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
      >
        <X size={12} />
      </button>
      
      <div className="flex items-start gap-2">
        <div className="shrink-0 mt-0.5">
          {typeIcons[type as keyof typeof typeIcons] || typeIcons.pattern}
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-white mb-1">{title}</h4>
          <p className="text-[10px] text-gray-400 mb-2">{description}</p>
          {actionable && suggestedAction && (
            <button className="text-[10px] text-[#2979ff] hover:text-[#2264d1] flex items-center gap-1 font-medium">
              {suggestedAction}
              <ChevronRight size={10} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- FOCUS WINDOWS CHART ---

const FocusWindowsChart: React.FC = () => {
  const focusWindows = useProductivityStore((s) => s.focusWindows);
  
  // Group by day and calculate totals
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const dayWindows = focusWindows.filter((w) => {
        const windowDate = new Date(w.startTime).toISOString().split('T')[0];
        return windowDate === dateKey;
      });
      const totalMinutes = dayWindows.reduce((sum, w) => sum + w.duration, 0);
      days.push({
        date: dateKey,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: totalMinutes,
        windows: dayWindows.length,
      });
    }
    return days;
  }, [focusWindows]);

  const maxMinutes = Math.max(...last7Days.map((d) => d.minutes), 240);

  return (
    <div className="bg-[#1e2330] border border-white/5 rounded-xl p-4">
      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
        <Clock size={16} className="text-green-400" />
        Focus Time (Last 7 Days)
      </h3>

      <div className="flex items-end gap-2 h-32">
        {last7Days.map((day) => {
          const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-24">
                <span className="text-[9px] text-gray-400 mb-1">
                  {day.minutes > 0 ? `${Math.round(day.minutes / 60)}h` : '0'}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-green-500/50 to-green-400 rounded-t transition-all"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500">{day.dayName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- PEAK HOURS VISUALIZATION ---

const PeakHoursChart: React.FC = () => {
  // Mock data for peak hours
  const peakHours = [
    { hour: 9, productivity: 85 },
    { hour: 10, productivity: 92 },
    { hour: 11, productivity: 88 },
    { hour: 14, productivity: 75 },
    { hour: 15, productivity: 80 },
    { hour: 16, productivity: 70 },
    { hour: 21, productivity: 65 },
    { hour: 22, productivity: 60 },
  ];

  const maxProductivity = 100;

  return (
    <div className="bg-[#1e2330] border border-white/5 rounded-xl p-4">
      <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
        <Flame size={16} className="text-orange-400" />
        Peak Productivity Hours
      </h3>

      <div className="space-y-2">
        {peakHours.map((item) => (
          <div key={item.hour} className="flex items-center gap-3">
            <span className="text-[10px] text-gray-400 w-10">
              {item.hour}:00
            </span>
            <div className="flex-1 h-4 bg-[#0f111a] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  item.productivity >= 80
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : item.productivity >= 60
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                      : 'bg-gradient-to-r from-red-500 to-red-400'
                }`}
                style={{ width: `${(item.productivity / maxProductivity) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-white w-10 text-right">
              {item.productivity}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
        <p className="text-[10px] text-green-400">
          💡 <strong>Optimal Focus:</strong> Schedule deep work between 9-11 AM for peak performance.
        </p>
      </div>
    </div>
  );
};

// --- MAIN ANALYTICS DASHBOARD ---

export const AnalyticsDashboard: React.FC = () => {
  const tasks = useProductivityStore((s) => s.tasks);
  const projects = useProductivityStore((s) => s.projects);
  const focusWindows = useProductivityStore((s) => s.focusWindows);
  const insights = useProductivityStore((s) => s.insights);
  const { dismissInsight, generateInsight } = useProductivityStore((s) => s.actions);

  // Calculate metrics
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const avgROI = tasks.length > 0
    ? (tasks.reduce((sum, t) => sum + t.roiScore, 0) / tasks.length).toFixed(1)
    : '0';
  
  const totalFocusMinutes = focusWindows.reduce((sum, w) => sum + w.duration, 0);
  const totalFocusHours = Math.round(totalFocusMinutes / 60);
  
  const blockedTasks = tasks.filter((t) => t.status === 'blocked').length;
  
  const highROICompleted = tasks.filter(
    (t) => t.status === 'completed' && t.roiScore >= 2
  ).length;

  // Mock insights for demo
  const mockInsights = [
    {
      id: '1',
      type: 'peak_time',
      title: 'Morning Peak Detected',
      description: 'Your productivity peaks between 9-11 AM. Consider scheduling complex tasks during this window.',
      actionable: true,
      suggestedAction: 'Schedule focus block',
      priority: 'medium' as const,
    },
    {
      id: '2',
      type: 'procrastination',
      title: 'Afternoon Dip Detected',
      description: '3-4 PM shows lower activity. This might be a good time for breaks or low-priority tasks.',
      actionable: true,
      suggestedAction: 'Add break reminder',
      priority: 'low' as const,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Blocked Tasks Alert',
      description: `You have ${blockedTasks} blocked task(s). Resolve blockers to maintain velocity.`,
      actionable: true,
      suggestedAction: 'Review blockers',
      priority: 'high' as const,
    },
  ].filter((i) => i.id === '3' ? blockedTasks > 0 : true);

  return (
    <div className="h-full overflow-y-auto p-6 bg-[#0f111a] custom-scrollbar">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <MetricCard
          title="Tasks Completed"
          value={completedTasks}
          change={12}
          icon={<Target size={16} className="text-white" />}
          color="bg-green-500/20"
          subtitle={`${completionRate}% completion rate`}
        />
        <MetricCard
          title="Average ROI"
          value={avgROI}
          change={8}
          icon={<TrendingUp size={16} className="text-white" />}
          color="bg-[#2979ff]/20"
          subtitle="Higher is better"
        />
        <MetricCard
          title="Focus Hours"
          value={`${totalFocusHours}h`}
          change={-5}
          icon={<Clock size={16} className="text-white" />}
          color="bg-purple-500/20"
          subtitle="This week"
        />
        <MetricCard
          title="High ROI Done"
          value={highROICompleted}
          change={15}
          icon={<Zap size={16} className="text-white" />}
          color="bg-yellow-500/20"
          subtitle="ROI ≥ 2.0"
        />
        <MetricCard
          title="Active Projects"
          value={projects.filter((p) => p.status === 'active').length}
          icon={<BarChart3 size={16} className="text-white" />}
          color="bg-orange-500/20"
        />
        <MetricCard
          title="Blocked Tasks"
          value={blockedTasks}
          icon={<AlertTriangle size={16} className="text-white" />}
          color={blockedTasks > 0 ? "bg-red-500/20" : "bg-gray-500/20"}
          subtitle={blockedTasks > 0 ? "Needs attention" : "All clear!"}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Heatmap */}
        <div className="lg:col-span-2 space-y-6">
          <WeeklyHeatmap />
          
          <div className="grid grid-cols-2 gap-6">
            <FocusWindowsChart />
            <PeakHoursChart />
          </div>
        </div>

        {/* Right Column - Insights */}
        <div className="space-y-6">
          <div className="bg-[#1e2330] border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Brain size={16} className="text-purple-400" />
              Productivity Insights
            </h3>

            <div className="space-y-3">
              {mockInsights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  type={insight.type}
                  title={insight.title}
                  description={insight.description}
                  actionable={insight.actionable}
                  suggestedAction={insight.suggestedAction}
                  priority={insight.priority}
                  onDismiss={() => {}}
                />
              ))}
            </div>
          </div>

          {/* ENTJ Tips */}
          <div className="bg-gradient-to-br from-[#2979ff]/10 to-[#5b4eff]/10 border border-[#2979ff]/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Zap size={16} className="text-[#2979ff]" />
              ENTJ Productivity Rules
            </h3>
            
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Maximum productivity over comfort</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Aggressive velocity over perfection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Real impact over work quantity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Ruthless elimination of weak ideas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>ROI optimization always</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1e2330] border border-white/5 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
            
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-xs text-left text-gray-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                <Calendar size={14} className="text-[#2979ff]" />
                Schedule Focus Block
              </button>
              <button className="w-full px-3 py-2 text-xs text-left text-gray-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                <Target size={14} className="text-green-400" />
                Review High ROI Tasks
              </button>
              <button className="w-full px-3 py-2 text-xs text-left text-gray-300 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" />
                Clear Blocked Tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
