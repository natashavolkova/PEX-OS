// ============================================================================
// PROMPTS API - Turso/Drizzle
// ATHENA Architecture | Optimized for Serverless
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { prompts, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateId, nowISO, parseJsonField, stringifyJsonField, ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME } from '@/lib/db/helpers';

// GET /api/prompts - List prompts
export async function GET() {
  try {
    const results = await db.select({
      id: prompts.id,
      title: prompts.title,
      content: prompts.content,
      type: prompts.type,
      emoji: prompts.emoji,
      category: prompts.category,
      tags: prompts.tags,
      version: prompts.version,
      isFavorite: prompts.isFavorite,
      folderId: prompts.folderId,
      createdAt: prompts.createdAt,
    })
      .from(prompts)
      .where(eq(prompts.userId, ATHENA_USER_ID))
      .orderBy(desc(prompts.createdAt))
      .limit(100);

    const parsed = results.map(p => ({
      ...p,
      tags: parseJsonField<string[]>(p.tags, []),
    }));

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error('[API] GET /api/prompts error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error' },
      { status: 500 }
    );
  }
}

// POST /api/prompts - Create prompt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
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

    const newPrompt = {
      id: generateId(),
      title: body.title,
      content: body.content,
      type: body.type || 'prompt',
      emoji: body.emoji || '📄',
      category: body.category || null,
      tags: stringifyJsonField(body.tags || []),
      version: 1,
      isFavorite: false,
      folderId: body.folderId || null,
      createdAt: nowISO(),
      updatedAt: nowISO(),
      userId: ATHENA_USER_ID,
    };

    await db.insert(prompts).values(newPrompt);

    return NextResponse.json({
      success: true,
      data: {
        ...newPrompt,
        tags: body.tags || [],
      },
      message: 'Prompt created',
    });
  } catch (error) {
    console.error('[API] POST /api/prompts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create prompt' },
      { status: 400 }
    );
  }
}
