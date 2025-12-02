// ============================================================================
// PEX-OS API - YOUTUBE INSIGHTS ROUTE
// ATHENA Architecture | Mock Implementation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import type { YouTubeInsight } from '@/types';
import { generateId } from '@/lib/utils';

interface GenerateInsightsRequest {
  videoId: string;
  referenceId: string;
  transcript?: string;
  focusAreas?: string[];
}

// POST /api/youtube/insights - Generate insights from video
export async function POST(request: NextRequest) {
  const body: GenerateInsightsRequest = await request.json();
  console.log('[API] POST /api/youtube/insights', body);

  const { videoId, referenceId, transcript, focusAreas = [] } = body;

  if (!videoId || !referenceId) {
    return NextResponse.json(
      { success: false, error: 'videoId and referenceId are required' },
      { status: 400 }
    );
  }

  // TODO: Replace with real AI analysis
  // This mock simulates AI-powered insight extraction

  const mockInsights: YouTubeInsight[] = [
    {
      id: generateId(),
      referenceId,
      timestamp: '03:45',
      content: 'Key architectural pattern: Separate concerns with dedicated stores for each domain',
      category: 'key_point',
      createdAt: Date.now(),
    },
    {
      id: generateId(),
      referenceId,
      timestamp: '08:20',
      content: 'Action: Implement error boundaries at component tree roots',
      category: 'action_item',
      createdAt: Date.now(),
    },
    {
      id: generateId(),
      referenceId,
      timestamp: '12:15',
      content: '"The best code is no code. The second best is code that\'s easy to delete."',
      category: 'quote',
      createdAt: Date.now(),
    },
    {
      id: generateId(),
      referenceId,
      timestamp: '15:30',
      content: 'Resource: React Query documentation for server state management',
      category: 'resource',
      createdAt: Date.now(),
    },
    {
      id: generateId(),
      referenceId,
      timestamp: '22:45',
      content: 'Idea: Create a custom hook for optimistic updates pattern',
      category: 'idea',
      createdAt: Date.now(),
    },
  ];

  // Filter based on focus areas if provided
  let filteredInsights = mockInsights;
  if (focusAreas.length > 0) {
    filteredInsights = mockInsights.filter(
      i => focusAreas.includes(i.category) || focusAreas.length === 0
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      videoId,
      referenceId,
      insights: filteredInsights,
      summary: 'This video covers best practices for React state management, error handling, and architectural patterns.',
      keyTopics: ['State Management', 'Error Handling', 'Architecture', 'Testing'],
      actionItemsCount: filteredInsights.filter(i => i.category === 'action_item').length,
    },
    message: `Generated ${filteredInsights.length} insights`,
  });
}

// GET /api/youtube/insights?referenceId=xxx - Get existing insights
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const referenceId = searchParams.get('referenceId');

  console.log('[API] GET /api/youtube/insights', { referenceId });

  if (!referenceId) {
    return NextResponse.json(
      { success: false, error: 'referenceId query parameter is required' },
      { status: 400 }
    );
  }

  // TODO: Replace with real database query
  // Return mock insights for demo

  return NextResponse.json({
    success: true,
    data: {
      referenceId,
      insights: [],
      message: 'No insights found. Use POST to generate new insights.',
    },
  });
}
