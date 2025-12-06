// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - BATTLE PLANS API
// ATHENA Architecture | REST API Endpoints
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production, this would come from database
const mockBattlePlans = [
    {
        id: 'bp-demo-1',
        name: 'Q1 Velocity Sprint',
        description: 'Maximum velocity sprint focusing on core feature delivery',
        type: 'sprint',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        objectives: [
            {
                id: 'obj-1',
                name: 'Complete Analytics Dashboard',
                description: 'Ship full analytics with heatmaps',
                priority: 'critical',
                status: 'in_progress',
                linkedTasks: [],
                impactScore: 9,
            },
        ],
        metrics: {
            objectivesTotal: 1,
            objectivesCompleted: 0,
            progressPercentage: 25,
            velocityScore: 4.2,
        },
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now(),
    },
];

// GET /api/battle-plan - List all battle plans
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const type = searchParams.get('type');

        let filtered = mockBattlePlans;

        if (status) {
            filtered = filtered.filter((p) => p.status === status);
        }

        if (type) {
            filtered = filtered.filter((p) => p.type === type);
        }

        return NextResponse.json({
            data: filtered,
            total: filtered.length,
            success: true,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to fetch battle plans' },
            { status: 500 }
        );
    }
}

// POST /api/battle-plan - Create new battle plan
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.name) {
            return NextResponse.json(
                { success: false, message: 'Battle plan name is required' },
                { status: 400 }
            );
        }

        const newPlan = {
            id: `bp-${Date.now()}`,
            ...body,
            objectives: body.objectives || [],
            metrics: {
                objectivesTotal: body.objectives?.length || 0,
                objectivesCompleted: 0,
                progressPercentage: 0,
                velocityScore: 0,
            },
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        return NextResponse.json({
            data: newPlan,
            success: true,
            message: 'Battle plan created successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to create battle plan' },
            { status: 500 }
        );
    }
}

// PUT /api/battle-plan - Update battle plan
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { success: false, message: 'Battle plan ID is required' },
                { status: 400 }
            );
        }

        const updatedPlan = {
            ...body,
            updatedAt: Date.now(),
        };

        return NextResponse.json({
            data: updatedPlan,
            success: true,
            message: 'Battle plan updated successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to update battle plan' },
            { status: 500 }
        );
    }
}

// DELETE /api/battle-plan - Delete battle plan
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Battle plan ID is required' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Battle plan deleted successfully',
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to delete battle plan' },
            { status: 500 }
        );
    }
}
