// ============================================================================
// AthenaPeX API - TASKS/:ID ROUTE
// ATHENA Architecture | Turso/Drizzle (SQLite) - Optimized for Serverless
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { nowISO, parseJsonField, stringifyJsonField } from '@/lib/db/helpers';

type Params = Promise<{ id: string }>;

// GET /api/tasks/:id - Get single task
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;

  try {
    const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    const task = result[0];
    return NextResponse.json({
      success: true,
      data: {
        ...task,
        tags: parseJsonField<string[]>(task.tags, []),
      },
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
    const updateData: Record<string, unknown> = {
      updatedAt: nowISO(),
    };

    if (body.title) updateData.title = body.title;
    if (body.status) updateData.status = body.status;
    if (body.priority) updateData.priority = body.priority;
    if (body.dueDate) updateData.dueDate = body.dueDate;
    if (body.tags) updateData.tags = stringifyJsonField(body.tags);

    await db.update(tasks).set(updateData).where(eq(tasks.id, id));

    const result = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result[0],
        tags: parseJsonField<string[]>(result[0].tags, []),
      },
      message: 'Task updated successfully',
    });
  } catch (error) {
    console.error('[API] PATCH /api/tasks/:id error:', error);
    return NextResponse.json(
      { success: false, error: 'Update failed' },
      { status: 500 }
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
    await db.delete(tasks).where(eq(tasks.id, id));

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('[API] DELETE /api/tasks/:id error:', error);
    return NextResponse.json(
      { success: false, error: 'Delete failed' },
      { status: 500 }
    );
  }
}
