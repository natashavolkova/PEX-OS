// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - ANALYTICS API
// ATHENA Architecture | Productivity Metrics & Insights
// Uses real Prisma data from lib/db/analytics
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/db/users';
import { getHeatmapData, getFocusStats, getVelocityData, getOverviewStats } from '@/lib/db/analytics';
import prisma from '@/lib/prisma';

// GET /api/analytics - Get overall analytics
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'overview';

  try {
    const userId = await getCurrentUserId();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (type) {
      case 'heatmap':
        const heatmapData = await getHeatmapData(userId, weekAgo, now);
        return NextResponse.json({
          data: heatmapData,
          success: true,
        });

      case 'focus':
        const focusStats = await getFocusStats(userId, now);
        // Calculate peak hours from focus blocks
        const weekEvents = await prisma.analyticsEvent.findMany({
          where: {
            userId,
            type: 'focus_end',
            createdAt: { gte: weekAgo },
          },
          select: { createdAt: true, duration: true },
        });

        const hourCounts: Record<number, number> = {};
        weekEvents.forEach((e) => {
          const hour = e.createdAt.getHours();
          hourCounts[hour] = (hourCounts[hour] || 0) + (e.duration || 0);
        });

        const sortedHours = Object.entries(hourCounts)
          .sort(([, a], [, b]) => b - a)
          .map(([h]) => parseInt(h));

        const peakHours = sortedHours.slice(0, 5);
        const allHours = Array.from({ length: 24 }, (_, i) => i);
        const deadZones = allHours.filter((h) => !hourCounts[h] || hourCounts[h] < 10);

        return NextResponse.json({
          data: {
            totalFocusMinutes: focusStats.totalFocusMinutes,
            avgDailyFocus: Math.round(focusStats.totalFocusMinutes / 7),
            peakHours: peakHours.length > 0 ? peakHours : [9, 10, 14, 15],
            deadZones: deadZones.slice(0, 3),
            recommendedBlocks: generateRecommendedBlocks(peakHours),
          },
          success: true,
        });

      case 'impact':
        // Calculate ROI from completed tasks
        const [completedTasks, allTasks] = await Promise.all([
          prisma.task.count({ where: { userId, status: 'completed' } }),
          prisma.task.count({ where: { userId } }),
        ]);

        const completionRate = allTasks > 0 ? completedTasks / allTasks : 0;

        return NextResponse.json({
          data: {
            avgROI: Math.round(completionRate * 2 * 10) / 10,
            highROITasks: completedTasks,
            lowROITasks: Math.max(0, allTasks - completedTasks),
            eliminatedIdeas: 0,
            pivotRecommendations: 0,
            procrastinationPatterns: [],
          },
          success: true,
        });

      case 'battleplan':
        // Battle plan metrics from tasks and projects
        const [activeProjects, completedProjects, tasks] = await Promise.all([
          prisma.project.count({ where: { userId, status: 'active' } }),
          prisma.project.count({ where: { userId, status: 'completed' } }),
          prisma.task.findMany({ where: { userId }, select: { status: true } }),
        ]);

        const completedTaskCount = tasks.filter((t) => t.status === 'completed').length;
        const avgVelocity = tasks.length > 0 ? (completedTaskCount / tasks.length) * 5 : 0;

        return NextResponse.json({
          data: {
            activePlans: activeProjects,
            completedObjectives: completedTaskCount,
            totalObjectives: tasks.length,
            avgVelocity: Math.round(avgVelocity * 10) / 10,
            blockersResolved: 0,
            pivotsExecuted: 0,
          },
          success: true,
        });

      default:
        const stats = await getOverviewStats(userId);
        const velocity = await getVelocityData(userId, 7);
        const weeklyCompleted = velocity.reduce((sum, v) => sum + v.count, 0);

        return NextResponse.json({
          data: {
            tasksCompleted: stats.completedTasks,
            tasksCreated: weeklyCompleted,
            promptsCreated: stats.totalPrompts,
            promptsRefined: 0,
            focusHours: stats.totalFocusHours,
            avgProductivity: stats.totalFocusHours > 0 ? Math.min(10, stats.totalFocusHours / 3) : 0,
            activeProjects: stats.activeProjects,
            blockedTasks: 0,
          },
          success: true,
        });
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// Helper to generate recommended blocks based on peak hours
function generateRecommendedBlocks(peakHours: number[]) {
  if (peakHours.length === 0) {
    return [
      { start: '09:00', end: '11:30', type: 'deep_work' },
      { start: '14:00', end: '16:00', type: 'deep_work' },
    ];
  }

  const blocks = [];
  const sortedPeaks = [...peakHours].sort((a, b) => a - b);

  // Morning block
  const morningPeaks = sortedPeaks.filter((h) => h >= 6 && h <= 12);
  if (morningPeaks.length > 0) {
    const start = Math.min(...morningPeaks);
    blocks.push({
      start: `${start.toString().padStart(2, '0')}:00`,
      end: `${Math.min(start + 2, 12).toString().padStart(2, '0')}:30`,
      type: 'deep_work',
    });
  }

  // Afternoon block
  const afternoonPeaks = sortedPeaks.filter((h) => h >= 13 && h <= 18);
  if (afternoonPeaks.length > 0) {
    const start = Math.min(...afternoonPeaks);
    blocks.push({
      start: `${start.toString().padStart(2, '0')}:00`,
      end: `${Math.min(start + 2, 18).toString().padStart(2, '0')}:00`,
      type: 'deep_work',
    });
  }

  return blocks.length > 0 ? blocks : [
    { start: '09:00', end: '11:30', type: 'deep_work' },
    { start: '14:00', end: '16:00', type: 'deep_work' },
  ];
}
