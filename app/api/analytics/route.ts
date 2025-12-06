// ============================================================================
// ATHENAPEX - ANALYTICS API
// ATHENA Architecture | Turso/Drizzle (SQLite) - Optimized for Serverless
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, projects, analyticsEvents, users } from '@/lib/db/schema';
import { eq, count, sql, and, gte } from 'drizzle-orm';
import { ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME, nowISO, generateId } from '@/lib/db/helpers';

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'overview';

  try {
    switch (type) {
      case 'heatmap':
        return await getHeatmapData();
      case 'dashboard':
        return await getDashboardStats();
      default:
        return await getOverviewData();
    }
  } catch (error) {
    console.error('[API] GET /api/analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}

// POST /api/analytics - Track event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Ensure user exists
    const existingUser = await db.select().from(users).where(eq(users.id, ATHENA_USER_ID)).limit(1);
    if (existingUser.length === 0) {
      await db.insert(users).values({
        id: ATHENA_USER_ID,
        email: ATHENA_EMAIL,
        name: ATHENA_NAME,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      });
    }

    const event = {
      id: generateId(),
      type: body.type || 'custom',
      metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      duration: body.duration || null,
      createdAt: nowISO(),
      userId: ATHENA_USER_ID,
    };

    await db.insert(analyticsEvents).values(event);

    return NextResponse.json({
      success: true,
      message: 'Event tracked',
    });
  } catch (error) {
    console.error('[API] POST /api/analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to track event' },
      { status: 400 }
    );
  }
}

// Helper functions
async function getOverviewData() {
  // Return mock overview for now - can be enhanced later
  return NextResponse.json({
    success: true,
    data: {
      totalFocusTime: 0,
      completedTasks: 0,
      activeProjects: 0,
      streak: 0,
    },
  });
}

async function getHeatmapData() {
  // Initial empty heatmap
  const heatmapData: number[][] = Array(7).fill(null).map(() => Array(24).fill(0));

  return NextResponse.json({
    success: true,
    data: {
      heatmap: heatmapData,
      peakHours: [9, 10, 11, 14, 15, 16],
    },
  });
}

async function getDashboardStats() {
  try {
    // Get task counts
    const taskResults = await db.select().from(tasks).where(eq(tasks.userId, ATHENA_USER_ID));
    const totalTasks = taskResults.length;
    const completedTasks = taskResults.filter(t => t.status === 'completed').length;

    // Get project counts
    const projectResults = await db.select().from(projects).where(eq(projects.userId, ATHENA_USER_ID));
    const activeProjects = projectResults.filter(p => p.status === 'active').length;
    const completedProjects = projectResults.filter(p => p.status === 'completed').length;

    return NextResponse.json({
      success: true,
      data: {
        tasks: {
          completed: completedTasks,
          total: totalTasks,
        },
        focusTime: {
          total: 0,
          average: 0,
        },
        projects: {
          active: activeProjects,
          completed: completedProjects,
        },
        breakdown: {
          todo: taskResults.filter(t => t.status === 'todo').length,
          'in-progress': taskResults.filter(t => t.status === 'in-progress').length,
          done: completedTasks,
        },
      },
    });
  } catch {
    return NextResponse.json({
      success: true,
      data: {
        tasks: { completed: 0, total: 0 },
        focusTime: { total: 0, average: 0 },
        projects: { active: 0, completed: 0 },
        breakdown: { todo: 0, 'in-progress': 0, done: 0 },
      },
    });
  }
}
