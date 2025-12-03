// ============================================================================
// AthenaPeX API - YOUTUBE ADD ROUTE
// ATHENA Architecture | Mock Implementation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import type { YouTubeReference } from '@/types';
import { generateId, extractYoutubeId, getYoutubeThumbnail } from '@/lib/utils';

interface AddYoutubeRequest {
  url: string;
  tags?: string[];
  linkedProjects?: string[];
  linkedPrompts?: string[];
}

// POST /api/youtube/add - Add YouTube reference
export async function POST(request: NextRequest) {
  const body: AddYoutubeRequest = await request.json();
  console.log('[API] POST /api/youtube/add', body);

  const { url, tags = [], linkedProjects = [], linkedPrompts = [] } = body;

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL is required' },
      { status: 400 }
    );
  }

  // Extract video ID
  const videoId = extractYoutubeId(url);
  if (!videoId) {
    return NextResponse.json(
      { success: false, error: 'Invalid YouTube URL' },
      { status: 400 }
    );
  }

  // TODO: Replace with real YouTube API call to fetch metadata
  // This mock simulates fetching video metadata

  const mockMetadata = {
    title: `Video ${videoId.substring(0, 4)} - Development Tutorial`,
    channelName: 'Tech Channel',
    duration: `${Math.floor(Math.random() * 60) + 10}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    description: 'An educational video about modern development practices.',
  };

  const newReference: YouTubeReference = {
    id: generateId(),
    url,
    videoId,
    title: mockMetadata.title,
    channelName: mockMetadata.channelName,
    thumbnailUrl: getYoutubeThumbnail(videoId),
    duration: mockMetadata.duration,
    description: mockMetadata.description,
    tags,
    insights: [],
    linkedProjects,
    linkedPrompts,
    addedAt: Date.now(),
    updatedAt: Date.now(),
    impactScore: 0,
    outputGenerated: false,
  };

  return NextResponse.json({
    success: true,
    data: newReference,
    message: 'YouTube reference added successfully',
  });
}
