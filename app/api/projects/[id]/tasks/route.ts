// ============================================================================
// PROJECT TASKS API - Turso/Drizzle
// ATHENA Architecture | Get tasks filtered by project
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { ATHENA_USER_ID } from '@/lib/db/helpers';

type Params = Promise<{ id: string }>;

// GET /api/projects/[id]/tasks - Get all tasks for a project
export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    const { id: projectId } = await params;

    try {
        const projectTasks = await db.select()
            .from(tasks)
            .where(and(
                eq(tasks.projectId, projectId),
                eq(tasks.userId, ATHENA_USER_ID)
            ))
            .orderBy(asc(tasks.status), asc(tasks.createdAt));

        console.log(`[API] GET /api/projects/${projectId}/tasks: ${projectTasks.length} tasks`);

        return NextResponse.json({
            success: true,
            data: projectTasks,
        });
    } catch (error) {
        console.error('[API] GET /api/projects/:id/tasks error:', error);
        return NextResponse.json(
            { success: false, error: 'Database error', details: String(error) },
            { status: 500 }
        );
    }
}
