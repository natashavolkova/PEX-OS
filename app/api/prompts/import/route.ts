// ============================================================================
// PROMPTS IMPORT API - Turso/Drizzle
// ATHENA Architecture | Legacy Backup Support
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { folders, prompts, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME, nowISO, generateId, stringifyJsonField } from '@/lib/db/helpers';

// --- LEGACY BACKUP FORMAT ---
// {
//   "folders": [
//     { "id": "...", "name": "...", "prompts": [ { "id": "...", "title": "...", "content": "..." } ] }
//   ]
// }

interface LegacyPrompt {
    id: string;
    folderId?: string;
    title: string;
    theme?: string;
    content: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

interface LegacyFolder {
    id: string;
    name: string;
    icon?: string;
    emoji?: string;
    description?: string;
    color?: string;
    order?: number;
    prompts?: LegacyPrompt[];
    createdAt?: string;
    updatedAt?: string;
}

interface LegacyBackup {
    folders: LegacyFolder[];
    settings?: Record<string, unknown>;
}

// POST /api/prompts/import - Import prompts from JSON (supports legacy format)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Try to detect format
        const isLegacyFormat = body.folders && Array.isArray(body.folders);
        const isNewFormat = body.data && Array.isArray(body.data);

        if (!isLegacyFormat && !isNewFormat) {
            return NextResponse.json(
                { success: false, error: 'Invalid import data format' },
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

        if (isLegacyFormat) {
            // --- LEGACY FORMAT IMPORT ---
            const legacyData = body as LegacyBackup;

            // Create the master parent folder "Prompts AI"
            const masterFolderId = generateId();
            await db.insert(folders).values({
                id: masterFolderId,
                name: 'Prompts AI',
                type: 'folder',
                emoji: '🤖',
                isSystem: false,
                parentId: null, // Root level
                userId: ATHENA_USER_ID,
                createdAt: nowISO(),
                updatedAt: nowISO(),
            });
            importedFolders++;

            // Import all legacy folders as children of "Prompts AI"
            for (const legacyFolder of legacyData.folders) {
                const childFolderId = generateId();
                await db.insert(folders).values({
                    id: childFolderId,
                    name: legacyFolder.name,
                    type: 'folder',
                    emoji: legacyFolder.icon || legacyFolder.emoji || '📁',
                    isSystem: false,
                    parentId: masterFolderId, // Child of "Prompts AI"
                    userId: ATHENA_USER_ID,
                    createdAt: legacyFolder.createdAt || nowISO(),
                    updatedAt: legacyFolder.updatedAt || nowISO(),
                });
                importedFolders++;

                // Import prompts inside this folder
                if (legacyFolder.prompts && Array.isArray(legacyFolder.prompts)) {
                    for (const legacyPrompt of legacyFolder.prompts) {
                        await db.insert(prompts).values({
                            id: generateId(),
                            title: legacyPrompt.title || legacyPrompt.theme || 'Untitled',
                            content: legacyPrompt.content || '',
                            type: 'prompt',
                            emoji: '📄',
                            category: legacyPrompt.theme || null,
                            tags: stringifyJsonField(legacyPrompt.tags || []),
                            version: 1,
                            isFavorite: false,
                            folderId: childFolderId, // Inside the child folder
                            userId: ATHENA_USER_ID,
                            createdAt: legacyPrompt.createdAt || nowISO(),
                            updatedAt: legacyPrompt.updatedAt || nowISO(),
                        });
                        importedPrompts++;
                    }
                }
            }

            return NextResponse.json({
                success: true,
                message: `Legacy import: Created "Prompts AI" folder with ${importedFolders - 1} subfolders and ${importedPrompts} prompts`,
                stats: { folders: importedFolders, prompts: importedPrompts },
                masterFolder: 'Prompts AI',
            });
        }

        // --- NEW FORMAT IMPORT ---
        const { data } = body;

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
            { success: false, error: 'Import failed', details: String(error) },
            { status: 500 }
        );
    }
}
