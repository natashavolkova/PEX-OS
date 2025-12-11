// ============================================================================
// PROJECT BATTLE PLAN API - Turso/Drizzle
// ATHENA Architecture | Get battle plan for a project
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { battlePlans } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { ATHENA_USER_ID, generateId, nowISO } from '@/lib/db/helpers';

type Params = Promise<{ id: string }>;

// GET /api/projects/[id]/battle-plan - Get battle plan for a project
export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    const { id: projectId } = await params;

    try {
        const plans = await db.select()
            .from(battlePlans)
            .where(and(
                eq(battlePlans.projectId, projectId),
                eq(battlePlans.userId, ATHENA_USER_ID)
            ))
            .limit(1);

        if (plans.length === 0) {
            return NextResponse.json({
                success: true,
                data: null,
                message: 'No battle plan found for this project',
            });
        }

        console.log(`[API] GET /api/projects/${projectId}/battle-plan: Found`);

        return NextResponse.json({
            success: true,
            data: plans[0],
        });
    } catch (error) {
        console.error('[API] GET /api/projects/:id/battle-plan error:', error);
        return NextResponse.json(
            { success: false, error: 'Database error', details: String(error) },
            { status: 500 }
        );
    }
}

// POST /api/projects/[id]/battle-plan - Create battle plan for a project
export async function POST(
    request: NextRequest,
    { params }: { params: Params }
) {
    const { id: projectId } = await params;

    try {
        const body = await request.json();

        const newPlan = {
            id: generateId(),
            title: body.title || 'Battle Plan',
            content: body.content || '',
            status: body.status || 'draft',
            projectId,
            createdAt: nowISO(),
            updatedAt: nowISO(),
            userId: ATHENA_USER_ID,
        };

        await db.insert(battlePlans).values(newPlan);

        console.log(`[API] POST /api/projects/${projectId}/battle-plan: Created ${newPlan.id}`);

        return NextResponse.json({
            success: true,
            data: newPlan,
            message: 'Battle plan created',
        });
    } catch (error) {
        console.error('[API] POST /api/projects/:id/battle-plan error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create battle plan' },
            { status: 400 }
        );
    }
}
