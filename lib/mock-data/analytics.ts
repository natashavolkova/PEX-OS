// ============================================================================
// PEX-OS - MOCK DATA: ANALYTICS
// ATHENA Architecture | Sample Data for Development
// ============================================================================

import type { 
  DailyMetrics, 
  FocusWindow, 
  ProductivityInsight,
  WeeklyHeatmapData,
  HourlyActivity 
} from '@/types';

// Generate hourly activity for a day
const generateHourlyActivity = (baseScore: number = 5): HourlyActivity[] => {
  const hours: HourlyActivity[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    // Simulate peak hours around 9-11am and 2-4pm
    let multiplier = 1;
    if (hour >= 9 && hour <= 11) multiplier = 1.5;
    if (hour >= 14 && hour <= 16) multiplier = 1.3;
    if (hour === 12 || hour === 13) multiplier = 0.5; // Lunch
    if (hour >= 18) multiplier = 0.7; // Evening wind-down

    const value = Math.round((Math.random() * baseScore * multiplier) * 10) / 10;
    let level: HourlyActivity['activityLevel'] = 'none';
    if (value > 6) level = 'high';
    else if (value > 3) level = 'medium';
    else if (value > 0) level = 'low';

    hours.push({
      hour,
      tasksCompleted: Math.floor(Math.random() * 3),
      focusMinutes: Math.floor(Math.random() * 50) + 10,
      activityLevel: level,
    });
  }
  return hours;
};

// Generate daily metrics for the past week
export const generateDailyMetrics = (days: number = 7): DailyMetrics[] => {
  const metrics: DailyMetrics[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    
    const hourlyActivity = generateHourlyActivity(5 + Math.random() * 3);
    const focusMinutes = hourlyActivity.reduce((sum, h) => sum + h.focusMinutes, 0);
    const tasksCompleted = hourlyActivity.reduce((sum, h) => sum + h.tasksCompleted, 0);
    
    // Find peak hours (top 3)
    const sortedHours = [...hourlyActivity].sort((a, b) => 
      b.focusMinutes - a.focusMinutes
    );
    const peakHours = sortedHours.slice(0, 3).map(h => h.hour);
    
    // Find dead zones (bottom 3 non-zero)
    const deadZones = sortedHours
      .filter(h => h.activityLevel !== 'none')
      .slice(-3)
      .map(h => h.hour);

    metrics.push({
      date: dateKey,
      focusMinutes,
      tasksCompleted,
      tasksCreated: Math.floor(Math.random() * 5) + 1,
      promptsCreated: Math.floor(Math.random() * 3),
      promptsRefined: Math.floor(Math.random() * 2),
      productivityScore: Math.round((focusMinutes / 480 * 10) * 10) / 10,
      peakHours,
      deadZones,
      hourlyActivity,
    });
  }
  return metrics;
};

export const mockDailyMetrics: DailyMetrics[] = generateDailyMetrics(14);

// Generate weekly heatmap data
export const generateWeeklyHeatmap = (): WeeklyHeatmapData => {
  const days: WeeklyHeatmapData['days'] = [];
  
  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    const date = new Date();
    date.setDate(date.getDate() - (6 - dayOfWeek));
    
    const hours: WeeklyHeatmapData['days'][0]['hours'] = [];
    for (let hour = 6; hour <= 22; hour++) {
      // Weekend has lower activity
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseValue = isWeekend ? 2 : 5;
      
      // Peak hours
      let multiplier = 1;
      if (!isWeekend) {
        if (hour >= 9 && hour <= 11) multiplier = 1.8;
        if (hour >= 14 && hour <= 16) multiplier = 1.5;
        if (hour === 12 || hour === 13) multiplier = 0.3;
      }
      
      const value = Math.round(Math.random() * baseValue * multiplier);
      let level: 'high' | 'medium' | 'low' | 'none' = 'none';
      if (value >= 7) level = 'high';
      else if (value >= 4) level = 'medium';
      else if (value >= 1) level = 'low';
      
      hours.push({ hour, value, level });
    }
    
    days.push({
      dayOfWeek,
      date: date.toISOString().split('T')[0],
      hours,
    });
  }
  
  const totalFocusHours = days.reduce(
    (sum, day) => sum + day.hours.reduce((hSum, h) => hSum + h.value, 0) / 10,
    0
  );
  
  return {
    week: `Week ${Math.ceil(new Date().getDate() / 7)}`,
    days,
    totalFocusHours: Math.round(totalFocusHours * 10) / 10,
    avgProductivity: Math.round(totalFocusHours / 7 * 10) / 10,
  };
};

export const mockWeeklyHeatmap: WeeklyHeatmapData = generateWeeklyHeatmap();

// Mock focus windows
export const mockFocusWindows: FocusWindow[] = [
  {
    id: 'fw-001',
    startTime: Date.now() - 3600000 * 3,
    endTime: Date.now() - 3600000 * 2,
    duration: 50,
    type: 'deep_work',
    tasksCompleted: ['task-005'],
    productivityScore: 9,
    notes: 'Great focus session, completed Monaco integration',
  },
  {
    id: 'fw-002',
    startTime: Date.now() - 86400000 - 3600000 * 5,
    endTime: Date.now() - 86400000 - 3600000 * 4,
    duration: 45,
    type: 'deep_work',
    tasksCompleted: [],
    productivityScore: 7,
    notes: 'Good progress on analytics',
  },
  {
    id: 'fw-003',
    startTime: Date.now() - 86400000 - 3600000 * 2,
    endTime: Date.now() - 86400000 - 3600000 * 1.5,
    duration: 25,
    type: 'shallow_work',
    tasksCompleted: [],
    productivityScore: 5,
    notes: 'Email and Slack catch-up',
  },
  {
    id: 'fw-004',
    startTime: Date.now() - 86400000 * 2 - 3600000 * 4,
    endTime: Date.now() - 86400000 * 2 - 3600000 * 3,
    duration: 50,
    type: 'deep_work',
    tasksCompleted: ['task-001'],
    productivityScore: 8,
    notes: 'Analytics dashboard wireframes',
  },
];

// Mock productivity insights
export const mockInsights: ProductivityInsight[] = [
  {
    id: 'insight-001',
    type: 'peak_time',
    title: 'Peak Productivity Detected',
    description: 'Your most productive hours are 9-11 AM. Consider scheduling high-impact tasks during this window.',
    actionable: true,
    suggestedAction: 'Block 9-11 AM for deep work on critical tasks',
    priority: 'high',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'insight-002',
    type: 'dead_zone',
    title: 'Dead Zone Alert',
    description: 'Productivity drops significantly after 6 PM. Avoid scheduling important work during this time.',
    actionable: true,
    suggestedAction: 'Limit post-6PM work to low-priority tasks',
    priority: 'medium',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'insight-003',
    type: 'pattern',
    title: 'Consistent Morning Performance',
    description: 'You have maintained high morning productivity for 5 consecutive days. Keep this momentum!',
    actionable: false,
    priority: 'low',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'insight-004',
    type: 'warning',
    title: 'Blocked Task Stalling',
    description: 'Task "Implement Real-time Notifications" has been blocked for 48+ hours. Consider a pivot.',
    actionable: true,
    suggestedAction: 'Review blockers and consider alternative approaches',
    priority: 'high',
    createdAt: Date.now() - 3600000 * 12,
  },
  {
    id: 'insight-005',
    type: 'recommendation',
    title: 'High-ROI Task Available',
    description: 'Task "Build Battle Plan Generator" (ROI: 3.0) is ready to start. This could be your next quick win.',
    actionable: true,
    suggestedAction: 'Start Battle Plan Generator task',
    priority: 'high',
    createdAt: Date.now() - 3600000 * 6,
  },
  {
    id: 'insight-006',
    type: 'procrastination',
    title: 'Low Activity Detected',
    description: 'Activity dropped significantly between 2-3 PM today. Consider a short break then restart.',
    actionable: true,
    suggestedAction: 'Take a 10-min break, then start a focus session',
    priority: 'medium',
    createdAt: Date.now() - 3600000 * 2,
  },
];

export const getRecentInsights = (limit: number = 5): ProductivityInsight[] => {
  return mockInsights
    .filter(i => !i.dismissedAt)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
};

export const getActionableInsights = (): ProductivityInsight[] => {
  return mockInsights.filter(i => i.actionable && !i.dismissedAt);
};

export default {
  dailyMetrics: mockDailyMetrics,
  weeklyHeatmap: mockWeeklyHeatmap,
  focusWindows: mockFocusWindows,
  insights: mockInsights,
};
