// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - PROMPTS API
// ATHENA Architecture | REST API Endpoints with Versioning
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { DataService } from '@/lib/api/prompts';

// GET /api/prompts - List all folders and prompts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get('folderId') || undefined;
    const search = searchParams.get('search') || undefined;
    const tags = searchParams.get('tags') ? searchParams.get('tags')?.split(',') : undefined;
    const type = searchParams.get('type') || undefined; // 'folder', 'prompt', or undefined for all

    const data = await DataService.fetchData();

    // If type specified, filter by type
    let filteredData = data;

    if (type === 'prompt') {
      filteredData = data.filter((item): item is any => item.type === 'prompt');
    } else if (type === 'folder') {
      filteredData = data.filter((item): item is any => item.type === 'folder');
    }
    // Otherwise return all data (folders + prompts)

    // Apply additional filters only to prompts
    if (folderId) {
      filteredData = filteredData.filter(p => p.type !== 'prompt' || p.folderId === folderId);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter((p: any) =>
        p.name?.toLowerCase().includes(searchLower) ||
        (p.content && p.content.toLowerCase().includes(searchLower))
      );
    }

    if (tags && tags.length > 0) {
      filteredData = filteredData.filter(p =>
        p.type !== 'prompt' || (p.tags && p.tags.some((tag: string) => tags.includes(tag)))
      );
    }

    return NextResponse.json({
      data: filteredData,
      total: filteredData.length,
      success: true
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}

// POST /api/prompts - Create new prompt
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }

    const newPrompt = await DataService.createPrompt(body);

    return NextResponse.json({
      data: newPrompt,
      success: true,
      message: 'Prompt created successfully',
    });
  } catch (error) {
    console.error('Create prompt error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}
