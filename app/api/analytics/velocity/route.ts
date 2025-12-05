// ============================================================================
// ATHENAPEX - VELOCITY API
// Task completion velocity over time
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getVelocityData } from '@/lib/db/analytics';
import { getCurrentUserId } from '@/lib/db/users';

// GET /api/analytics/velocity - Get velocity data for chart
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '7', 10);

        const userId = await getCurrentUserId();
        const data = await getVelocityData(userId, days);

        return NextResponse.json({
            data,
            success: true,
        });
    } catch (error) {
        console.error('Velocity data error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch velocity data' },
            { status: 500 }
        );
    }
}

