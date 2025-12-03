// ============================================================================
// PEX-OS API - TASKS/:ID ROUTE
// ATHENA Architecture | Mock Implementation (Next.js 15 Compatible)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockTasks, getTaskById } from '@/lib/mock-data';

type Params = Promise<{ id: string }>;

// GET /api/tasks/:id - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  console.log('[API] GET /api/tasks/:id', { id });

  // TODO: Replace with real database query
  const task = getTaskById(id);

  if (!task) {
    return NextResponse.json(
      { success: false, error: 'Task not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: task,
  });
}

// PATCH /api/tasks/:id - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const body = await request.json();
  console.log('[API] PATCH /api/tasks/:id', { id, body });

  // TODO: Replace with real database update
  const task = getTaskById(id);

  if (!task) {
    return NextResponse.json(
      { success: false, error: 'Task not found' },
      { status: 404 }
    );
  }

  // Mock update
  const updatedTask = {
    ...task,
    ...body,
    updatedAt: Date.now(),
  };

  return NextResponse.json({
    success: true,
    data: updatedTask,
    message: 'Task updated successfully',
  });
}

// DELETE /api/tasks/:id - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  console.log('[API] DELETE /api/tasks/:id', { id });

  // TODO: Replace with real database delete
  const task = getTaskById(id);

  if (!task) {
    return NextResponse.json(
      { success: false, error: 'Task not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Task deleted successfully',
  });
}
