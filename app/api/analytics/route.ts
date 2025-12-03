// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - ANALYTICS API
// ATHENA Architecture | Productivity Metrics & Insights
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// GET /api/analytics - Get overall analytics
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'overview';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  switch (type) {
    case 'heatmap':
      return NextResponse.json({
        data: generateHeatmapData(),
        success: true,
      });
    
    case 'focus':
      return NextResponse.json({
        data: {
          totalFocusMinutes: 1240,
          avgDailyFocus: 177,
          peakHours: [9, 10, 11, 14, 15],
          deadZones: [13, 19, 20],
          recommendedBlocks: [
            { start: '09:00', end: '11:30', type: 'deep_work' },
            { start: '14:00', end: '16:00', type: 'deep_work' },
            { start: '21:00', end: '22:30', type: 'shallow_work' },
          ],
        },
        success: true,
      });
    
    case 'impact':
      return NextResponse.json({
        data: {
          avgROI: 1.8,
          highROITasks: 12,
          lowROITasks: 5,
          eliminatedIdeas: 3,
          pivotRecommendations: 2,
          procrastinationPatterns: [
            { day: 'Monday', hour: 14, severity: 'medium' },
            { day: 'Friday', hour: 16, severity: 'high' },
          ],
        },
        success: true,
      });
    
    case 'battleplan':
      return NextResponse.json({
        data: {
          activePlans: 2,
          completedObjectives: 8,
          totalObjectives: 15,
          avgVelocity: 4.2,
          blockersResolved: 5,
          pivotsExecuted: 1,
        },
        success: true,
      });
    
    default:
      return NextResponse.json({
        data: {
          tasksCompleted: 45,
          tasksCreated: 52,
          promptsCreated: 12,
          promptsRefined: 8,
          focusHours: 21,
          avgProductivity: 7.5,
          activeProjects: 3,
          blockedTasks: 2,
        },
        success: true,
      });
  }
}

// Helper to generate heatmap data
function generateHeatmapData() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return days.map((day, dayIndex) => ({
    day,
    dayIndex,
    hours: hours.map((hour) => {
      let base = 0;
      if (dayIndex >= 1 && dayIndex <= 5) {
        if (hour >= 9 && hour <= 12) base = 0.7;
        else if (hour >= 14 && hour <= 18) base = 0.6;
        else if (hour >= 20 && hour <= 23) base = 0.4;
      } else {
        if (hour >= 10 && hour <= 14) base = 0.3;
      }
      return {
        hour,
        value: Math.max(0, Math.min(1, base + (Math.random() - 0.5) * 0.4)),
      };
    }),
  }));
}
