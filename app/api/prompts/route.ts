// ============================================================================
// PROMPTS API - Turso/Drizzle
// ATHENA Architecture | Returns folders AND prompts for tree building
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { prompts, folders, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateId, nowISO, parseJsonField, stringifyJsonField, ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME } from '@/lib/db/helpers';

// GET /api/prompts - List folders AND prompts for tree building
export async function GET() {
  try {
    // Fetch all folders
    const folderResults = await db.select({
      id: folders.id,
      name: folders.name,
      type: folders.type,
      emoji: folders.emoji,
      isSystem: folders.isSystem,
      parentId: folders.parentId,
      createdAt: folders.createdAt,
      updatedAt: folders.updatedAt,
    })
      .from(folders)
      .where(eq(folders.userId, ATHENA_USER_ID));

    // Fetch all prompts
    const promptResults = await db.select({
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
      .orderBy(desc(prompts.createdAt));

    // Format folders for tree building
    const formattedFolders = folderResults.map(f => ({
      ...f,
      type: 'folder' as const,
      emoji: f.emoji || '📁',
      isSystem: f.isSystem || false,
    }));

    // Format prompts for tree building
    const formattedPrompts = promptResults.map(p => ({
      ...p,
      name: p.title, // Add name alias for tree building
      type: 'prompt' as const,
      emoji: p.emoji || '📄',
      tags: parseJsonField<string[]>(p.tags, []),
    }));

    // Combine into single array
    const combined = [...formattedFolders, ...formattedPrompts];

    console.log(`[API] GET /api/prompts: ${formattedFolders.length} folders, ${formattedPrompts.length} prompts`);

    return NextResponse.json({
      success: true,
      data: combined,
    });
  } catch (error) {
    console.error('[API] GET /api/prompts error:', error);
    return NextResponse.json(
      { success: false, error: 'Database error', details: String(error) },
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
