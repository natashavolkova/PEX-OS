// ============================================================================
// PEX-OS API - PROMPTS VERSION ROUTE
// ATHENA Architecture | Mock Implementation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import type { PromptVersion } from '@/types';
import { generateId } from '@/lib/utils';

// Mock version storage (in-memory for demo)
const mockVersions: PromptVersion[] = [
  {
    id: 'v1-p1',
    promptId: 'p1',
    version: 1,
    content: 'Initial ENTJ prompt version...',
    changelog: 'Initial version',
    efficiencyScore: 7,
    qualityScore: 7,
    createdAt: Date.now() - 86400000 * 10,
    createdBy: 'Natasha (ENTJ)',
  },
  {
    id: 'v2-p1',
    promptId: 'p1',
    version: 2,
    content: 'Improved ENTJ prompt with better structure...',
    changelog: 'Added ROI calculation rules',
    efficiencyScore: 8,
    qualityScore: 8,
    createdAt: Date.now() - 86400000 * 5,
    createdBy: 'Natasha (ENTJ)',
  },
];

// GET /api/prompts/version - Get versions for a prompt
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const promptId = searchParams.get('promptId');

  console.log('[API] GET /api/prompts/version', { promptId });

  if (!promptId) {
    return NextResponse.json(
      { success: false, error: 'promptId is required' },
      { status: 400 }
    );
  }

  // TODO: Replace with real database query
  const versions = mockVersions.filter(v => v.promptId === promptId);

  return NextResponse.json({
    success: true,
    data: versions.sort((a, b) => b.version - a.version),
    total: versions.length,
  });
}

// POST /api/prompts/version - Create new version
export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log('[API] POST /api/prompts/version', body);

  const { promptId, content, changelog } = body;

  if (!promptId || !content) {
    return NextResponse.json(
      { success: false, error: 'promptId and content are required' },
      { status: 400 }
    );
  }

  // TODO: Replace with real database insert
  // Get current version count
  const currentVersions = mockVersions.filter(v => v.promptId === promptId);
  const nextVersion = currentVersions.length + 1;

  const newVersion: PromptVersion = {
    id: generateId(),
    promptId,
    version: nextVersion,
    content,
    changelog: changelog || `Version ${nextVersion} update`,
    efficiencyScore: 8,
    qualityScore: 8,
    createdAt: Date.now(),
    createdBy: 'Natasha (ENTJ)',
  };

  // Mock: add to array
  mockVersions.push(newVersion);

  return NextResponse.json({
    success: true,
    data: newVersion,
    message: `Version ${nextVersion} created successfully`,
  });
}

// PATCH /api/prompts/version - Restore specific version
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  console.log('[API] PATCH /api/prompts/version - Restore', body);

  const { promptId, versionId } = body;

  if (!promptId || !versionId) {
    return NextResponse.json(
      { success: false, error: 'promptId and versionId are required' },
      { status: 400 }
    );
  }

  // TODO: Replace with real version restore logic
  const version = mockVersions.find(v => v.id === versionId && v.promptId === promptId);

  if (!version) {
    return NextResponse.json(
      { success: false, error: 'Version not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      restoredVersion: version,
      currentContent: version.content,
    },
    message: `Restored to version ${version.version}`,
  });
}
