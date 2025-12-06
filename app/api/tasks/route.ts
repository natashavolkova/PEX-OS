// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - TASKS API
// ATHENA Architecture | Turso/Drizzle (SQLite) - Optimized for Serverless
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateId, nowISO, parseJsonField, stringifyJsonField, ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME } from '@/lib/db/helpers';

// GET /api/tasks - List all tasks (optimized with pagination)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);

  try {
    // Get tasks for Athena user
    const allTasks = await db.select({
      id: tasks.id,
      title: tasks.title,
      status: tasks.status,
      priority: tasks.priority,
      dueDate: tasks.dueDate,
      tags: tasks.tags,
      createdAt: tasks.createdAt,
    })
      .from(tasks)
      .where(eq(tasks.userId, ATHENA_USER_ID))
      .orderBy(desc(tasks.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    // Parse tags from JSON TEXT
    const parsedTasks = allTasks.map(task => ({
      ...task,
      tags: parseJsonField<string[]>(task.tags, []),
    }));

    return NextResponse.json({
      success: true,
      data: parsedTasks,
      page,
      limit,
    });
  } catch (error) {
    console.error('[API] GET /api/tasks error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    // Ensure Athena user exists
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

    const newTask = {
      id: generateId(),
      title: body.title,
      status: body.status || 'todo',
      priority: body.priority || 'medium',
      dueDate: body.dueDate || null,
      tags: stringifyJsonField(body.tags || []),
      createdAt: nowISO(),
      updatedAt: nowISO(),
      userId: ATHENA_USER_ID,
    };

    await db.insert(tasks).values(newTask);

    return NextResponse.json({
      success: true,
      data: {
        ...newTask,
        tags: body.tags || [],
      },
      message: 'Task created successfully',
    });
  } catch (error) {
    console.error('[API] POST /api/tasks error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 400 }
    );
  }
}
