// ============================================================================
// AthenaPeX API - ANALYTICS HEATMAP ROUTE
// ATHENA Architecture | Mock Implementation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { generateWeeklyHeatmap } from '@/lib/mock-data';

// GET /api/analytics/heatmap - Get productivity heatmap data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const weeks = parseInt(searchParams.get('weeks') || '1');
  const startDate = searchParams.get('startDate');

  console.log('[API] GET /api/analytics/heatmap', { weeks, startDate });

  // TODO: Replace with real database query
  // This mock generates heatmap data

  const heatmapData = generateWeeklyHeatmap();

  // Calculate statistics
  const allHours = heatmapData.days.flatMap(d => d.hours);
  const peakHours = allHours
    .filter(h => h.level === 'high')
    .map(h => h.hour);
  const uniquePeakHours = [...new Set(peakHours)].sort((a, b) => a - b);

  const deadZones = allHours
    .filter(h => h.level === 'none' || h.level === 'low')
    .map(h => h.hour);
  const uniqueDeadZones = [...new Set(deadZones)].sort((a, b) => a - b);

  // Calculate day-by-day totals
  const dailyTotals = heatmapData.days.map(day => ({
    date: day.date,
    dayOfWeek: day.dayOfWeek,
    dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.dayOfWeek],
    totalValue: day.hours.reduce((sum, h) => sum + h.value, 0),
    productiveHours: day.hours.filter(h => h.level === 'high' || h.level === 'medium').length,
  }));

  return NextResponse.json({
    success: true,
    data: {
      heatmap: heatmapData,
      statistics: {
        totalFocusHours: heatmapData.totalFocusHours,
        avgDailyProductivity: heatmapData.avgProductivity,
        peakHours: uniquePeakHours.slice(0, 5),
        deadZones: uniqueDeadZones.slice(0, 5),
        mostProductiveDay: dailyTotals.reduce((max, d) => 
          d.totalValue > max.totalValue ? d : max
        ),
        leastProductiveDay: dailyTotals.reduce((min, d) => 
          d.totalValue < min.totalValue ? d : min
        ),
      },
      dailyTotals,
      recommendations: [
        {
          type: 'peak_time',
          message: `Your peak hours are ${uniquePeakHours.slice(0, 2).join('-')}. Schedule high-impact work here.`,
          priority: 'high',
        },
        {
          type: 'dead_zone',
          message: 'Avoid scheduling important tasks after 6 PM based on your patterns.',
          priority: 'medium',
        },
        {
          type: 'consistency',
          message: 'Tuesday and Wednesday show highest productivity. Consider protecting these days.',
          priority: 'low',
        },
      ],
    },
  });
}

// POST /api/analytics/heatmap - Log activity for heatmap
export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log('[API] POST /api/analytics/heatmap', body);

  const { hour, activityType, duration, tasksCompleted = 0 } = body;

  if (hour === undefined || !activityType) {
    return NextResponse.json(
      { success: false, error: 'hour and activityType are required' },
      { status: 400 }
    );
  }

  // TODO: Replace with real activity logging
  // This mock acknowledges the activity

  return NextResponse.json({
    success: true,
    data: {
      logged: true,
      hour,
      activityType,
      duration,
      tasksCompleted,
      timestamp: Date.now(),
    },
    message: 'Activity logged for heatmap',
  });
}
