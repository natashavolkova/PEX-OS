// ============================================================================
// AthenaPeX API - YOUTUBE TRANSCRIPT ROUTE
// ATHENA Architecture | Mock Implementation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

interface TranscriptSegment {
  start: number;
  duration: number;
  text: string;
}

interface TranscriptResponse {
  success: boolean;
  data: {
    videoId: string;
    language: string;
    segments: TranscriptSegment[];
    fullText: string;
    duration: number;
  };
}

// POST /api/youtube/transcript - Get video transcript
export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log('[API] POST /api/youtube/transcript', body);

  const { videoId, language = 'en' } = body;

  if (!videoId) {
    return NextResponse.json(
      { success: false, error: 'videoId is required' },
      { status: 400 }
    );
  }

  // TODO: Replace with real YouTube transcript API
  // This mock simulates transcript extraction

  const mockSegments: TranscriptSegment[] = [
    {
      start: 0,
      duration: 5,
      text: "Welcome to this tutorial on building production-ready applications.",
    },
    {
      start: 5,
      duration: 8,
      text: "Today we'll cover the essential patterns for scalable React development.",
    },
    {
      start: 13,
      duration: 6,
      text: "First, let's talk about state management and why Zustand is a great choice.",
    },
    {
      start: 19,
      duration: 7,
      text: "Zustand provides a minimal API with maximum flexibility.",
    },
    {
      start: 26,
      duration: 6,
      text: "Unlike Redux, you don't need boilerplate code to get started.",
    },
    {
      start: 32,
      duration: 8,
      text: "Let me show you a practical example of implementing a store.",
    },
    {
      start: 40,
      duration: 5,
      text: "Here we define our state interface with TypeScript for type safety.",
    },
    {
      start: 45,
      duration: 7,
      text: "The key principle is to keep your stores focused and small.",
    },
    {
      start: 52,
      duration: 6,
      text: "Split your state by domain - user store, settings store, data store.",
    },
    {
      start: 58,
      duration: 5,
      text: "This makes testing and maintenance much easier over time.",
    },
  ];

  const fullText = mockSegments.map(s => s.text).join(' ');
  const totalDuration = mockSegments.reduce((sum, s) => sum + s.duration, 0);

  const response: TranscriptResponse = {
    success: true,
    data: {
      videoId,
      language,
      segments: mockSegments,
      fullText,
      duration: totalDuration,
    },
  };

  return NextResponse.json(response);
}

// GET /api/youtube/transcript?videoId=xxx - Alternative GET method
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json(
      { success: false, error: 'videoId query parameter is required' },
      { status: 400 }
    );
  }

  // Redirect to POST logic
  const mockRequest = new Request(request.url, {
    method: 'POST',
    body: JSON.stringify({ videoId }),
  });

  return POST(new NextRequest(mockRequest));
}
