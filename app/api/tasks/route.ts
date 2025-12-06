// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - TASKS API
// ATHENA Architecture | Neon DB with Prisma (Optimized Queries)
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Athena admin user ID
const ATHENA_USER_ID = 'athena-supreme-user-001';

// GET /api/tasks - List all tasks (optimized with pagination and filters)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Max 50 for performance

  try {
    // Build where clause
    const where: Record<string, unknown> = {
      userId: ATHENA_USER_ID,
    };
    if (status) where.status = status;
    if (priority) where.priority = priority;

    // Optimized query - only needed fields, with pagination
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          tags: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: tasks,
      total,
      page,
      limit,
      hasMore: page * limit < total,
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

    // Ensure user exists (upsert)
    await prisma.user.upsert({
      where: { id: ATHENA_USER_ID },
      update: {},
      create: {
        id: ATHENA_USER_ID,
        email: 'athena@pex-os.ai',
        name: 'Athena',
      },
    });

    const task = await prisma.task.create({
      data: {
        title: body.title,
        status: body.status || 'todo',
        priority: body.priority || 'medium',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        tags: body.tags || [],
        userId: ATHENA_USER_ID,
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        tags: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: task,
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
