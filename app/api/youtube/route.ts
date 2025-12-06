// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - YOUTUBE API
// ATHENA Architecture | Video Reference Management
// Uses Prisma YouTubeVideo model
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/db/users';

// GET /api/youtube - List all YouTube references
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // Optimized query - only needed fields
    const videos = await prisma.youTubeVideo.findMany({
      where: {
        userId,
        ...(search && {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { channelName: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(status && { watchStatus: status }),
      },
      select: {
        id: true,
        videoId: true,
        title: true,
        channelName: true,
        thumbnailUrl: true,
        watchStatus: true,
        notes: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit for performance
    });

    return NextResponse.json({
      data: videos,
      total: videos.length,
      success: true,
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
    const userId = await getCurrentUserId();
    const body = await request.json();

    const videoId = extractVideoId(body.url);

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Check if video already exists
    const existing = await prisma.youTubeVideo.findUnique({
      where: { videoId },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Video already added' },
        { status: 409 }
      );
    }

    const newVideo = await prisma.youTubeVideo.create({
      data: {
        userId,
        videoId,
        title: body.title || 'Untitled Video',
        channelName: body.channelName || null,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        watchStatus: 'unwatched',
        notes: body.notes || null,
        insights: body.insights || [],
      },
    });

    return NextResponse.json({
      data: newVideo,
      success: true,
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
    const userId = await getCurrentUserId();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, message: 'Video ID required' },
        { status: 400 }
      );
    }

    const updated = await prisma.youTubeVideo.update({
      where: { id: body.id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.watchStatus && { watchStatus: body.watchStatus }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.insights && { insights: body.insights }),
      },
    });

    return NextResponse.json({
      data: updated,
      success: true,
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

    await prisma.youTubeVideo.delete({
      where: { id },
    });

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
