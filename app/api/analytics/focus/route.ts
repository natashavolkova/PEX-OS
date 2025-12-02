// ============================================================================
// PEX-OS API - ANALYTICS FOCUS ROUTE
// ATHENA Architecture | Mock Implementation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import type { FocusWindow } from '@/types';
import { generateId } from '@/lib/utils';
import { mockFocusWindows } from '@/lib/mock-data';

// GET /api/analytics/focus - Get focus sessions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const type = searchParams.get('type');

  console.log('[API] GET /api/analytics/focus', { limit, type });

  // TODO: Replace with real database query
  let sessions = [...mockFocusWindows];

  if (type) {
    sessions = sessions.filter(s => s.type === type);
  }

  sessions = sessions.slice(0, limit);

  // Calculate statistics
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const avgDuration = sessions.length > 0 ? totalMinutes / sessions.length : 0;
  const avgProductivity = sessions.length > 0 
    ? sessions.reduce((sum, s) => sum + s.productivityScore, 0) / sessions.length 
    : 0;

  const byType = {
    deep_work: sessions.filter(s => s.type === 'deep_work').length,
    shallow_work: sessions.filter(s => s.type === 'shallow_work').length,
    break: sessions.filter(s => s.type === 'break').length,
    meeting: sessions.filter(s => s.type === 'meeting').length,
  };

  return NextResponse.json({
    success: true,
    data: {
      sessions,
      statistics: {
        totalSessions: sessions.length,
        totalMinutes,
        avgDuration: Math.round(avgDuration),
        avgProductivity: Math.round(avgProductivity * 10) / 10,
        byType,
        tasksCompleted: sessions.reduce((sum, s) => sum + s.tasksCompleted.length, 0),
      },
    },
  });
}

// POST /api/analytics/focus - Start focus session
export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log('[API] POST /api/analytics/focus', body);

  const { type = 'deep_work', plannedDuration = 50 } = body;

  // TODO: Replace with real session creation
  const session: FocusWindow = {
    id: generateId(),
    startTime: Date.now(),
    endTime: 0,
    duration: 0,
    type,
    tasksCompleted: [],
    productivityScore: 0,
    notes: '',
  };

  return NextResponse.json({
    success: true,
    data: {
      session,
      plannedDuration,
      startedAt: new Date().toISOString(),
    },
    message: `Focus session started: ${type.replace('_', ' ')}`,
  });
}

// PATCH /api/analytics/focus - End focus session
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  console.log('[API] PATCH /api/analytics/focus', body);

  const { 
    sessionId, 
    tasksCompleted = [], 
    notes = '',
    interrupted = false 
  } = body;

  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: 'sessionId is required' },
      { status: 400 }
    );
  }

  // TODO: Replace with real session update
  const endTime = Date.now();
  
  // Mock: Calculate productivity score based on tasks completed
  const productivityScore = Math.min(10, 5 + tasksCompleted.length * 2 - (interrupted ? 2 : 0));

  const completedSession: Partial<FocusWindow> = {
    id: sessionId,
    endTime,
    tasksCompleted,
    productivityScore,
    notes,
  };

  return NextResponse.json({
    success: true,
    data: {
      session: completedSession,
      endedAt: new Date(endTime).toISOString(),
      wasInterrupted: interrupted,
    },
    message: 'Focus session completed',
  });
}

// DELETE /api/analytics/focus - Cancel focus session
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  console.log('[API] DELETE /api/analytics/focus', { sessionId });

  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: 'sessionId is required' },
      { status: 400 }
    );
  }

  // TODO: Replace with real session deletion

  return NextResponse.json({
    success: true,
    message: 'Focus session cancelled',
  });
}
