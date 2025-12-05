// ============================================================================
// ATHENAPEX - ANALYTICS STATS API
// Dashboard overview metrics
// ============================================================================

import { NextResponse } from 'next/server';
import { getOverviewStats } from '@/lib/db/analytics';
import { getCurrentUserId } from '@/lib/db/users';

// GET /api/analytics/stats - Get overview stats for dashboard
export async function GET() {
    try {
        const userId = await getCurrentUserId();
        const stats = await getOverviewStats(userId);

        return NextResponse.json({
            data: stats,
            success: true,
        });
    } catch (error) {
        console.error('Analytics stats error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch analytics stats' },
            { status: 500 }
        );
    }
}

