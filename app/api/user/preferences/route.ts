// ============================================================================
// USER PREFERENCES API - TURSO/DRIZZLE
// ATHENA Architecture | Serverless Optimized
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { nowISO, ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME } from '@/lib/db/helpers';

// POST /api/user/preferences - Update preferences
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Ensure user exists (upsert pattern)
        const existingUser = await db.select().from(users).where(eq(users.id, ATHENA_USER_ID)).limit(1);

        if (existingUser.length === 0) {
            await db.insert(users).values({
                id: ATHENA_USER_ID,
                email: ATHENA_EMAIL,
                name: ATHENA_NAME,
                gridDensity: body.gridDensity || 'standard',
                createdAt: nowISO(),
                updatedAt: nowISO(),
            });
        } else {
            const updateData: Record<string, unknown> = {
                updatedAt: nowISO(),
            };
            if (body.gridDensity) updateData.gridDensity = body.gridDensity;
            if (body.name) updateData.name = body.name;

            await db.update(users).set(updateData).where(eq(users.id, ATHENA_USER_ID));
        }

        const result = await db.select().from(users).where(eq(users.id, ATHENA_USER_ID)).limit(1);

        return NextResponse.json({
            success: true,
            data: result[0],
            message: 'Preferences updated',
        });
    } catch (error) {
        console.error('[API] POST /api/user/preferences error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update preferences' },
            { status: 500 }
        );
    }
}

// GET /api/user/preferences - Get preferences
export async function GET() {
    try {
        // Ensure user exists
        const existingUser = await db.select().from(users).where(eq(users.id, ATHENA_USER_ID)).limit(1);

        if (existingUser.length === 0) {
            // Create default user if not exists
            await db.insert(users).values({
                id: ATHENA_USER_ID,
                email: ATHENA_EMAIL,
                name: ATHENA_NAME,
                gridDensity: 'standard',
                createdAt: nowISO(),
                updatedAt: nowISO(),
            });

            const newUser = await db.select().from(users).where(eq(users.id, ATHENA_USER_ID)).limit(1);
            return NextResponse.json({
                success: true,
                data: newUser[0],
            });
        }

        return NextResponse.json({
            success: true,
            data: existingUser[0],
        });
    } catch (error) {
        console.error('[API] GET /api/user/preferences error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to get preferences' },
            { status: 500 }
        );
    }
}
