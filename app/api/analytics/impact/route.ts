// ============================================================================
// PEX-OS API - ANALYTICS IMPACT ROUTE
// ATHENA Architecture | Mock Implementation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockTasks, mockProjects } from '@/lib/mock-data';
import { calculateROI, evaluateENTJ } from '@/lib/utils';

// GET /api/analytics/impact - Get impact analysis
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'week';
  const projectId = searchParams.get('projectId');

  console.log('[API] GET /api/analytics/impact', { period, projectId });

  // TODO: Replace with real database queries
  let tasks = [...mockTasks];
  let projects = [...mockProjects];

  if (projectId) {
    tasks = tasks.filter(t => t.projectId === projectId);
    projects = projects.filter(p => p.id === projectId);
  }

  // Calculate impact metrics
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const blockedTasks = tasks.filter(t => t.status === 'blocked');

  const totalImpact = completedTasks.reduce((sum, t) => sum + t.impactScore, 0);
  const totalEffort = completedTasks.reduce((sum, t) => sum + t.effortScore, 0);
  const avgROI = completedTasks.length > 0 
    ? completedTasks.reduce((sum, t) => sum + t.roiScore, 0) / completedTasks.length 
    : 0;

  // Categorize tasks by ROI
  const roiBreakdown = {
    quickWins: tasks.filter(t => t.roiScore >= 2.0 && t.status !== 'completed'),
    strategic: tasks.filter(t => t.roiScore >= 1.0 && t.roiScore < 2.0 && t.status !== 'completed'),
    fillIns: tasks.filter(t => t.roiScore >= 0.5 && t.roiScore < 1.0 && t.status !== 'completed'),
    timeWasters: tasks.filter(t => t.roiScore < 0.5 && t.status !== 'completed'),
  };

  // Project-level impact
  const projectImpact = projects.map(p => {
    const projectTasks = tasks.filter(t => t.projectId === p.id);
    const completed = projectTasks.filter(t => t.status === 'completed').length;
    const total = projectTasks.length;
    const avgImpact = projectTasks.length > 0
      ? projectTasks.reduce((sum, t) => sum + t.impactScore, 0) / projectTasks.length
      : 0;

    return {
      projectId: p.id,
      projectName: p.name,
      emoji: p.emoji,
      completedTasks: completed,
      totalTasks: total,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      avgImpact,
      projectROI: p.roiScore,
    };
  });

  // ENTJ evaluation summary
  const evaluations = tasks
    .filter(t => t.status !== 'completed')
    .map(t => ({
      taskId: t.id,
      taskName: t.name,
      ...evaluateENTJ(t.impactScore, t.effortScore),
    }));

  const recommendations = evaluations
    .filter(e => e.recommendation === 'execute')
    .slice(0, 5);

  const eliminationCandidates = evaluations
    .filter(e => e.recommendation === 'eliminate');

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        blockedTasks: blockedTasks.length,
        totalImpactDelivered: totalImpact,
        totalEffortSpent: totalEffort,
        avgROI: Math.round(avgROI * 100) / 100,
      },
      roiBreakdown: {
        quickWins: {
          count: roiBreakdown.quickWins.length,
          tasks: roiBreakdown.quickWins.map(t => ({ id: t.id, name: t.name, roi: t.roiScore })),
        },
        strategic: {
          count: roiBreakdown.strategic.length,
          tasks: roiBreakdown.strategic.map(t => ({ id: t.id, name: t.name, roi: t.roiScore })),
        },
        fillIns: {
          count: roiBreakdown.fillIns.length,
          tasks: roiBreakdown.fillIns.map(t => ({ id: t.id, name: t.name, roi: t.roiScore })),
        },
        timeWasters: {
          count: roiBreakdown.timeWasters.length,
          tasks: roiBreakdown.timeWasters.map(t => ({ id: t.id, name: t.name, roi: t.roiScore })),
        },
      },
      projectImpact,
      entjRecommendations: {
        executeNow: recommendations,
        eliminate: eliminationCandidates,
      },
      insights: [
        {
          type: 'impact',
          message: `You've delivered ${totalImpact} impact points this ${period}.`,
          trend: totalImpact > 50 ? 'positive' : 'neutral',
        },
        {
          type: 'efficiency',
          message: `Average ROI: ${avgROI.toFixed(1)}. ${avgROI >= 2 ? 'Excellent efficiency!' : 'Consider focusing on higher-ROI tasks.'}`,
          trend: avgROI >= 2 ? 'positive' : avgROI >= 1.5 ? 'neutral' : 'negative',
        },
        {
          type: 'warning',
          message: blockedTasks.length > 0 
            ? `${blockedTasks.length} tasks are blocked. Review blockers to unlock progress.`
            : 'No blocked tasks. Great work keeping things moving!',
          trend: blockedTasks.length > 0 ? 'negative' : 'positive',
        },
      ],
    },
  });
}

// POST /api/analytics/impact - Log impact event
export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log('[API] POST /api/analytics/impact', body);

  const { taskId, impactType, impactValue, notes } = body;

  // TODO: Replace with real impact logging

  return NextResponse.json({
    success: true,
    data: {
      logged: true,
      taskId,
      impactType,
      impactValue,
      timestamp: Date.now(),
    },
    message: 'Impact event logged',
  });
}
