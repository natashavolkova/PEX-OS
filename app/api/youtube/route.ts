// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - YOUTUBE API
// ATHENA Architecture | Video Reference Management
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// GET /api/youtube - List all YouTube references
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const tags = searchParams.get('tags');

  // In production, fetch from database
  return NextResponse.json({
    data: [],
    total: 0,
    success: true,
  });
}

// POST /api/youtube - Add new YouTube reference
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const videoId = extractVideoId(body.url);
    
    const newRef = {
      id: `yt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      videoId,
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '',
      ...body,
      insights: [],
      addedAt: Date.now(),
      updatedAt: Date.now(),
      outputGenerated: false,
    };

    // In production, save to database

    return NextResponse.json({
      data: newRef,
      success: true,
      message: 'YouTube reference added',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to add YouTube reference' },
      { status: 400 }
    );
  }
}

// Helper to extract video ID
function extractVideoId(url: string): string {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
}
