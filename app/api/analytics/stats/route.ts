// ============================================================================
// ATHENAPEX - ANALYTICS STATS API
// Dashboard overview metrics
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getOverviewStats } from '@/lib/db/analytics';

// GET /api/analytics/stats - Get overview stats for dashboard
export async function GET(request: NextRequest) {
    try {
        // TODO: Get userId from auth session
        // For now, use a demo user ID
        const userId = 'demo-user';

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
