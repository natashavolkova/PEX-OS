import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ATHENA User ID (hardcoded as per project standard)
const ATHENA_USER_ID = 'athena-supreme-user-001';
const ATHENA_EMAIL = 'athena@pex-os.dev';

// PATCH /api/user/preferences - Update user preferences (with upsert)
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

        // Upsert user preferences in database (create if not exists)
        const updatedUser = await prisma.user.upsert({
            where: { id: ATHENA_USER_ID },
            create: {
                id: ATHENA_USER_ID,
                email: ATHENA_EMAIL,
                name: 'Athena Commander',
                gridDensity: gridDensity || 'standard',
            },
            update: {
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

// GET /api/user/preferences - Get user preferences (auto-create user if not exists)
export async function GET() {
    try {
        // Upsert to ensure user always exists
        const user = await prisma.user.upsert({
            where: { id: ATHENA_USER_ID },
            create: {
                id: ATHENA_USER_ID,
                email: ATHENA_EMAIL,
                name: 'Athena Commander',
                gridDensity: 'standard',
            },
            update: {},
            select: {
                gridDensity: true,
            },
        });

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
