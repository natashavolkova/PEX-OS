// ============================================================================
// ATHENAPEX - YOUTUBE API
// ATHENA Architecture | Turso/Drizzle (SQLite) - Optimized for Serverless
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { youtubeVideos, users } from '@/lib/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';
import { generateId, nowISO, parseJsonField, stringifyJsonField, ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME } from '@/lib/db/helpers';

// GET /api/youtube - List all YouTube references
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    let results = await db.select({
      id: youtubeVideos.id,
      videoId: youtubeVideos.videoId,
      title: youtubeVideos.title,
      channelName: youtubeVideos.channelName,
      thumbnailUrl: youtubeVideos.thumbnailUrl,
      watchStatus: youtubeVideos.watchStatus,
      notes: youtubeVideos.notes,
      createdAt: youtubeVideos.createdAt,
    })
      .from(youtubeVideos)
      .where(eq(youtubeVideos.userId, ATHENA_USER_ID))
      .orderBy(desc(youtubeVideos.createdAt))
      .limit(50);

    // Filter in-memory for search (SQLite LIKE is case-sensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(v =>
        v.title.toLowerCase().includes(searchLower) ||
        (v.channelName?.toLowerCase().includes(searchLower))
      );
    }

    if (status) {
      results = results.filter(v => v.watchStatus === status);
    }

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
    });
  } catch (error) {
    console.error('YouTube GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch YouTube videos' },
      { status: 500 }
    );
  }
}

// POST /api/youtube - Add new YouTube reference
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const videoId = extractVideoId(body.url);

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Check if video already exists
    const existing = await db.select().from(youtubeVideos).where(eq(youtubeVideos.videoId, videoId)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Video already added' },
        { status: 409 }
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

    const newVideo = {
      id: generateId(),
      videoId,
      title: body.title || 'Untitled Video',
      channelName: body.channelName || null,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      watchStatus: 'unwatched',
      notes: body.notes || null,
      insights: stringifyJsonField(body.insights || []),
      createdAt: nowISO(),
      updatedAt: nowISO(),
      userId: ATHENA_USER_ID,
    };

    await db.insert(youtubeVideos).values(newVideo);

    return NextResponse.json({
      success: true,
      data: newVideo,
      message: 'YouTube reference added',
    });
  } catch (error) {
    console.error('YouTube POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add YouTube reference' },
      { status: 400 }
    );
  }
}

// PUT /api/youtube - Update YouTube reference
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'Video ID required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: nowISO(),
    };
    if (body.title) updateData.title = body.title;
    if (body.watchStatus) updateData.watchStatus = body.watchStatus;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.insights) updateData.insights = stringifyJsonField(body.insights);

    await db.update(youtubeVideos).set(updateData).where(eq(youtubeVideos.id, body.id));

    const result = await db.select().from(youtubeVideos).where(eq(youtubeVideos.id, body.id)).limit(1);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Video updated',
    });
  } catch (error) {
    console.error('YouTube PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update video' },
      { status: 500 }
    );
  }
}

// DELETE /api/youtube - Delete YouTube reference
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Video ID required' },
        { status: 400 }
      );
    }

    await db.delete(youtubeVideos).where(eq(youtubeVideos.id, id));

    return NextResponse.json({
      success: true,
      message: 'Video deleted',
    });
  } catch (error) {
    console.error('YouTube DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete video' },
      { status: 500 }
    );
  }
}

// Helper to extract video ID
function extractVideoId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
}
