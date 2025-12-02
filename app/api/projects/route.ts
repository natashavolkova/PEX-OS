// ============================================================================
// PEX-OS PRODUCTIVITY MANAGER - PROJECTS API
// ATHENA Architecture | REST API Endpoints
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Mock database (in production, use Neon/PostgreSQL)
let projects: any[] = [
  {
    id: 'proj-demo-1',
    name: 'PEX-OS Core Development',
    description: 'Main development of the PEX-OS productivity platform',
    emoji: '🚀',
    status: 'active',
    priority: 'critical',
    impactScore: 9,
    roiScore: 8.5,
    owner: 'Natasha (ENTJ)',
    tags: ['core', 'development', 'priority'],
    startDate: '2024-01-01',
    deadline: '2024-03-31',
    createdAt: Date.now() - 86400000 * 30,
    updatedAt: Date.now(),
    tasksCount: 12,
    completedTasksCount: 5,
    linkedPrompts: [],
    linkedYoutubeRefs: [],
  },
];

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  let filtered = projects;
  
  if (status) {
    filtered = projects.filter((p) => p.status === status);
  }

  const total = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data: paginated,
    total,
    page,
    limit,
    hasMore: page * limit < total,
  });
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newProject = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tasksCount: 0,
      completedTasksCount: 0,
      roiScore: body.impactScore / 5 || 1,
    };

    projects.push(newProject);

    return NextResponse.json({
      data: newProject,
      success: true,
      message: 'Project created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create project' },
      { status: 400 }
    );
  }
}
