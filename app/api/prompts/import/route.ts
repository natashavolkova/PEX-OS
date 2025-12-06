// ============================================================================
// PROMPTS IMPORT API - Turso/Drizzle
// ATHENA Architecture | Simplified for migration
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { folders, prompts, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME, nowISO, generateId, stringifyJsonField } from '@/lib/db/helpers';

// POST /api/prompts/import - Import prompts from JSON
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { data } = body;

        if (!data || !Array.isArray(data)) {
            return NextResponse.json(
                { success: false, error: 'Invalid import data' },
                { status: 400 }
            );
        }

        // Ensure user exists
        const existingUser = await db.select().from(users).where(eq(users.id, ATHENA_USER_ID)).limit(1);
        if (existingUser.length === 0) {
            await db.insert(users).values({
                id: ATHENA_USER_ID,
                email: ATHENA_EMAIL,
                name: ATHENA_NAME,
                createdAt: nowISO(),
                updatedAt: nowISO(),
            });
        }

        let importedFolders = 0;
        let importedPrompts = 0;

        // Recursive import function
        const importItems = async (items: any[], parentId: string | null) => {
            for (const item of items) {
                if (item.type === 'folder') {
                    const folderId = generateId();
                    await db.insert(folders).values({
                        id: folderId,
                        name: item.name,
                        type: 'folder',
                        emoji: item.emoji || '📁',
                        isSystem: false,
                        parentId,
                        userId: ATHENA_USER_ID,
                        createdAt: nowISO(),
                        updatedAt: nowISO(),
                    });
                    importedFolders++;

                    if (item.children && Array.isArray(item.children)) {
                        await importItems(item.children, folderId);
                    }
                } else if (item.type === 'prompt') {
                    await db.insert(prompts).values({
                        id: generateId(),
                        title: item.name || item.title,
                        content: item.content || '',
                        type: 'prompt',
                        emoji: item.emoji || '📄',
                        category: item.category || null,
                        tags: stringifyJsonField(item.tags || []),
                        version: 1,
                        isFavorite: false,
                        folderId: parentId,
                        userId: ATHENA_USER_ID,
                        createdAt: nowISO(),
                        updatedAt: nowISO(),
                    });
                    importedPrompts++;
                }
            }
        };

        await importItems(data, null);

        return NextResponse.json({
            success: true,
            message: `Imported ${importedFolders} folders and ${importedPrompts} prompts`,
            stats: { folders: importedFolders, prompts: importedPrompts },
        });
    } catch (error) {
        console.error('[API] POST /api/prompts/import error:', error);
        return NextResponse.json(
            { success: false, error: 'Import failed' },
            { status: 500 }
        );
    }
}
