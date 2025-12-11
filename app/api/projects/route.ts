// ============================================================================
// PROJECTS API - Turso/Drizzle
// ATHENA Architecture | Optimized for Serverless
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateId, nowISO, ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME } from '@/lib/db/helpers';

// GET /api/projects - List projects
export async function GET() {
  try {
    const results = await db.select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      progress: projects.progress,
      roiScore: projects.roiScore,
      members: projects.members,
      dueDate: projects.dueDate,
      createdAt: projects.createdAt,
    })
      .from(projects)
      .where(eq(projects.userId, ATHENA_USER_ID))
      .orderBy(desc(projects.createdAt))
      .limit(50);

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('[API] GET /api/projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

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

    const newProject = {
      id: generateId(),
      name: body.name,
      description: body.description || null,
      status: body.status || 'active',
      progress: body.progress || 0,
      members: body.members || 1,
      dueDate: body.dueDate || null,
      createdAt: nowISO(),
      updatedAt: nowISO(),
      userId: ATHENA_USER_ID,
    };

    await db.insert(projects).values(newProject);

    return NextResponse.json({
      success: true,
      data: newProject,
      message: 'Project created',
    });
  } catch (error) {
    console.error('[API] POST /api/projects error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 400 }
    );
  }
}
