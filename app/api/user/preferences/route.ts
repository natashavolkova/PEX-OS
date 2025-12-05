import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ATHENA User ID (hardcoded as per project standard)
const ATHENA_USER_ID = 'athena-supreme-user-001';

// PATCH /api/user/preferences - Update user preferences
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { gridDensity } = body;

        // Validate gridDensity value
        if (gridDensity && !['standard', 'high'].includes(gridDensity)) {
            return NextResponse.json(
                { error: 'Invalid gridDensity value. Must be "standard" or "high".' },
                { status: 400 }
            );
        }

        // Update user preferences in database
        const updatedUser = await prisma.user.update({
            where: { id: ATHENA_USER_ID },
            data: {
                ...(gridDensity && { gridDensity }),
            },
            select: {
                id: true,
                gridDensity: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        console.error('[API] Error updating user preferences:', error);
        return NextResponse.json(
            { error: 'Failed to update preferences' },
            { status: 500 }
        );
    }
}

// GET /api/user/preferences - Get user preferences
export async function GET() {
    try {
        const user = await prisma.user.findUnique({
            where: { id: ATHENA_USER_ID },
            select: {
                gridDensity: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                gridDensity: user.gridDensity || 'standard',
            },
        });
    } catch (error) {
        console.error('[API] Error fetching user preferences:', error);
        return NextResponse.json(
            { error: 'Failed to fetch preferences' },
            { status: 500 }
        );
    }
}
