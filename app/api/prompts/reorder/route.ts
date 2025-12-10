// ============================================================================
// PROMPTS REORDER API - Turso/Drizzle
// ATHENA Architecture | Persist drag-and-drop order
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { prompts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { ATHENA_USER_ID, nowISO } from '@/lib/db/helpers';

// POST /api/prompts/reorder - Update prompt positions
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderedIds, folderId } = body;

        if (!orderedIds || !Array.isArray(orderedIds)) {
            return NextResponse.json(
                { success: false, error: 'orderedIds array is required' },
                { status: 400 }
            );
        }

        console.log(`[API] POST /api/prompts/reorder: Updating ${orderedIds.length} prompts, folderId=${folderId}`);

        // Update position for each prompt in order
        for (let i = 0; i < orderedIds.length; i++) {
            await db.update(prompts)
                .set({
                    position: i,
                    updatedAt: nowISO()
                })
                .where(and(
                    eq(prompts.id, orderedIds[i]),
                    eq(prompts.userId, ATHENA_USER_ID)
                ));
        }

        console.log(`[API] POST /api/prompts/reorder: Successfully updated positions`);

        return NextResponse.json({
            success: true,
            message: `Updated ${orderedIds.length} prompt positions`,
        });
    } catch (error) {
        console.error('[API] POST /api/prompts/reorder error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update prompt order', details: String(error) },
            { status: 500 }
        );
    }
}
