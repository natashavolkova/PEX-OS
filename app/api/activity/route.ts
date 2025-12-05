// ============================================================================
// ATHENAPEX - ACTIVITY API
// Recent user activity feed
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getRecentActivity, createEvent, EventType } from '@/lib/db/analytics';
import { getCurrentUserId } from '@/lib/db/users';

// GET /api/activity - Get recent activity
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10', 10);

        const userId = await getCurrentUserId();
        const activity = await getRecentActivity(userId, limit);

        return NextResponse.json({
            data: activity,
            success: true,
        });
    } catch (error) {
        console.error('Activity fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch activity' },
            { status: 500 }
        );
    }
}

// POST /api/activity - Log a new activity event
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, metadata, duration } = body;

        if (!type) {
            return NextResponse.json(
                { success: false, message: 'Event type is required' },
                { status: 400 }
            );
        }

        const userId = await getCurrentUserId();
        const event = await createEvent(userId, type as EventType, metadata, duration);

        return NextResponse.json({
            data: event,
            success: true,
            message: 'Activity logged successfully',
        });
    } catch (error) {
        console.error('Activity log error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to log activity' },
            { status: 500 }
        );
    }
}

