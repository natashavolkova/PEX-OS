// ============================================================================
// FOLDERS REORDER API - Turso/Drizzle
// ATHENA Architecture | Persist drag-and-drop order
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { folders } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { ATHENA_USER_ID, nowISO } from '@/lib/db/helpers';

// POST /api/folders/reorder - Update folder positions
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderedIds, parentId } = body;

        if (!orderedIds || !Array.isArray(orderedIds)) {
            return NextResponse.json(
                { success: false, error: 'orderedIds array is required' },
                { status: 400 }
            );
        }

        console.log(`[API] POST /api/folders/reorder: Updating ${orderedIds.length} folders, parentId=${parentId}`);

        // Update position for each folder in order
        for (let i = 0; i < orderedIds.length; i++) {
            await db.update(folders)
                .set({
                    position: i,
                    updatedAt: nowISO()
                })
                .where(and(
                    eq(folders.id, orderedIds[i]),
                    eq(folders.userId, ATHENA_USER_ID)
                ));
        }

        console.log(`[API] POST /api/folders/reorder: Successfully updated positions`);

        return NextResponse.json({
            success: true,
            message: `Updated ${orderedIds.length} folder positions`,
        });
    } catch (error) {
        console.error('[API] POST /api/folders/reorder error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update folder order', details: String(error) },
            { status: 500 }
        );
    }
}
