// ============================================================================
// PROJECT BY ID API - Turso/Drizzle
// ATHENA Architecture | Get single project with task count
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, tasks } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { ATHENA_USER_ID, nowISO } from '@/lib/db/helpers';

type Params = Promise<{ id: string }>;

// GET /api/projects/[id] - Get project with task stats
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;

  try {
    // Get project
    const projectResult = await db.select()
      .from(projects)
      .where(and(
        eq(projects.id, id),
        eq(projects.userId, ATHENA_USER_ID)
      ))
      .limit(1);

    if (projectResult.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = projectResult[0];

    // Get task counts for this project
    const projectTasks = await db.select({
      id: tasks.id,
      status: tasks.status,
    })
      .from(tasks)
      .where(and(
        eq(tasks.projectId, id),
        eq(tasks.userId, ATHENA_USER_ID)
      ));

    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
    const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    console.log(`[API] GET /api/projects/${id}: ${totalTasks} tasks, ${completedTasks} completed`);

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        taskCount: totalTasks,
        completedTaskCount: completedTasks,
        calculatedProgress,
      },
    });
  } catch (error) {
    console.error('[API] GET /api/projects/:id error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error', details: String(error) },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    await db.update(projects)
      .set({
        ...body,
        updatedAt: nowISO(),
      })
      .where(and(
        eq(projects.id, id),
        eq(projects.userId, ATHENA_USER_ID)
      ));

    console.log(`[API] PATCH /api/projects/${id}: Updated`);

    return NextResponse.json({
      success: true,
      message: 'Project updated',
    });
  } catch (error) {
    console.error('[API] PATCH /api/projects/:id error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 400 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { id } = await params;

  try {
    // Note: You may want to also delete or unlink associated tasks/battle_plans
    await db.delete(projects)
      .where(and(
        eq(projects.id, id),
        eq(projects.userId, ATHENA_USER_ID)
      ));

    console.log(`[API] DELETE /api/projects/${id}: Deleted`);

    return NextResponse.json({
      success: true,
      message: 'Project deleted',
    });
  } catch (error) {
    console.error('[API] DELETE /api/projects/:id error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
