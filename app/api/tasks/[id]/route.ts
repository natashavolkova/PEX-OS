// ============================================================================
// AthenaPeX API - TASKS/:ID ROUTE
// ATHENA Architecture | Neon DB with Prisma (Optimized Queries)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Athena admin user ID
const ATHENA_USER_ID = 'athena-supreme-user-001';

type Params = Promise<{ id: string }>;

// GET /api/tasks/:id - Get single task (optimized - only needed fields)
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;

  try {
    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    });

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
  } catch (error) {
    console.error('[API] GET /api/tasks/:id error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}

// PATCH /api/tasks/:id - Update task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.status && { status: body.status }),
        ...(body.priority && { priority: body.priority }),
        ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
        ...(body.tags && { tags: body.tags }),
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        tags: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: task,
      message: 'Task updated successfully',
    });
  } catch (error) {
    console.error('[API] PATCH /api/tasks/:id error:', error);
    return NextResponse.json(
      { success: false, error: 'Task not found or update failed' },
      { status: 404 }
    );
  }
}

// DELETE /api/tasks/:id - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;

  try {
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('[API] DELETE /api/tasks/:id error:', error);
    return NextResponse.json(
      { success: false, error: 'Task not found or delete failed' },
      { status: 404 }
    );
  }
}
