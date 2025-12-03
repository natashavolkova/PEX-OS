// ============================================================================
// PEX-OS PRODUCTIVITY MANAGER - PROJECTS API
// ATHENA Architecture | REST API Endpoints
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { ProjectService } from '@/lib/api/projects';

// GET /api/projects - List all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const projects = await ProjectService.fetchProjects();

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
      success: true
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, message: 'Project name is required' },
        { status: 400 }
      );
    }

    const newProject = await ProjectService.createProject(body);

    return NextResponse.json({
      data: newProject,
      success: true,
      message: 'Project created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create project' },
      { status: 500 }
    );
  }
}
