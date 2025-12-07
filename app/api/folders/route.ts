// ============================================================================
// FOLDERS API - Turso/Drizzle
// ATHENA Architecture | Recursive Delete Support
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { folders, prompts } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateId, nowISO, ATHENA_USER_ID } from '@/lib/db/helpers';

// Helper: Get all descendant folder IDs recursively
async function getDescendantFolderIds(parentId: string): Promise<string[]> {
    const children = await db.select({ id: folders.id })
        .from(folders)
        .where(and(
            eq(folders.parentId, parentId),
            eq(folders.userId, ATHENA_USER_ID)
        ));

    const childIds = children.map(c => c.id);
    const grandchildIds: string[] = [];

    for (const childId of childIds) {
        const descendants = await getDescendantFolderIds(childId);
        grandchildIds.push(...descendants);
    }

    return [...childIds, ...grandchildIds];
}

// GET /api/folders - List all folders
export async function GET() {
    try {
        const folderResults = await db.select()
            .from(folders)
            .where(eq(folders.userId, ATHENA_USER_ID));

        return NextResponse.json({
            success: true,
            data: folderResults,
        });
    } catch (error) {
        console.error('[API] GET /api/folders error:', error);
        return NextResponse.json(
            { success: false, error: 'Database error', details: String(error) },
            { status: 500 }
        );
    }
}

// POST /api/folders - Create folder
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.name) {
            return NextResponse.json(
                { success: false, error: 'Name is required' },
                { status: 400 }
            );
        }

        const newFolder = {
            id: generateId(),
            name: body.name,
            type: 'folder',
            emoji: body.emoji || '📁',
            isSystem: body.isSystem || false,
            parentId: body.parentId || null,
            createdAt: nowISO(),
            updatedAt: nowISO(),
            userId: ATHENA_USER_ID,
        };

        await db.insert(folders).values(newFolder);

        console.log(`[API] POST /api/folders: Created folder ${newFolder.id}`);

        return NextResponse.json({
            success: true,
            data: newFolder,
            message: 'Folder created',
        });
    } catch (error) {
        console.error('[API] POST /api/folders error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create folder' },
            { status: 400 }
        );
    }
}

// DELETE /api/folders - Delete folder + all children recursively
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'ID is required' },
                { status: 400 }
            );
        }

        // 1. Get all descendant folder IDs
        const descendantIds = await getDescendantFolderIds(id);
        const allFolderIds = [id, ...descendantIds];

        console.log(`[API] DELETE /api/folders: Deleting folder ${id} with ${descendantIds.length} descendants`);

        // 2. Delete all prompts in these folders
        for (const folderId of allFolderIds) {
            await db.delete(prompts)
                .where(and(
                    eq(prompts.folderId, folderId),
                    eq(prompts.userId, ATHENA_USER_ID)
                ));
        }

        // 3. Delete folders from deepest to root (children first)
        for (const folderId of [...descendantIds].reverse()) {
            await db.delete(folders)
                .where(and(
                    eq(folders.id, folderId),
                    eq(folders.userId, ATHENA_USER_ID)
                ));
        }

        // 4. Delete the target folder itself
        await db.delete(folders)
            .where(and(
                eq(folders.id, id),
                eq(folders.userId, ATHENA_USER_ID)
            ));

        console.log(`[API] DELETE /api/folders: Successfully deleted ${allFolderIds.length} folders`);

        return NextResponse.json({
            success: true,
            message: `Deleted folder and ${descendantIds.length} sub-items`,
        });
    } catch (error) {
        console.error('[API] DELETE /api/folders error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete folder', details: String(error) },
            { status: 500 }
        );
    }
}
