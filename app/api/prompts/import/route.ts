// ============================================================================
// PROMPTS IMPORT API - Turso/Drizzle
// ATHENA Architecture | Legacy Backup Support | 10MB Body Limit
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { folders, prompts, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME, nowISO, generateId, stringifyJsonField } from '@/lib/db/helpers';

// --- ROUTE CONFIG: Increase body size limit to 10MB ---
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

// Also export route segment config for App Router
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

// --- LEGACY BACKUP FORMAT ---
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
    console.log('[IMPORT API] Starting import request...');

    try {
        // Parse body with size validation
        let body: any;
        try {
            const text = await request.text();
            console.log('[IMPORT API] Body size:', text.length, 'bytes');

            if (text.length > 10 * 1024 * 1024) {
                return NextResponse.json(
                    { success: false, error: 'Payload too large. Maximum 10MB allowed.' },
                    { status: 413 }
                );
            }

            body = JSON.parse(text);
        } catch (parseError) {
            console.error('[IMPORT API] JSON parse error:', parseError);
            return NextResponse.json(
                { success: false, error: 'Invalid JSON format', details: String(parseError) },
                { status: 400 }
            );
        }

        // Detect format
        const isLegacyFormat = body.folders && Array.isArray(body.folders);
        const isNewFormat = body.data && Array.isArray(body.data);

        console.log('[IMPORT API] Format detected:', isLegacyFormat ? 'LEGACY' : isNewFormat ? 'NEW' : 'UNKNOWN');

        if (!isLegacyFormat && !isNewFormat) {
            return NextResponse.json(
                { success: false, error: 'Invalid import data format. Expected { folders: [...] } or { data: [...] }' },
                { status: 400 }
            );
        }

        // Ensure user exists
        console.log('[IMPORT API] Checking user exists...');
        const existingUser = await db.select().from(users).where(eq(users.id, ATHENA_USER_ID)).limit(1);
        if (existingUser.length === 0) {
            console.log('[IMPORT API] Creating user...');
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
            console.log('[IMPORT API] Legacy format - folders count:', legacyData.folders.length);

            // Create the master parent folder "Prompts AI"
            const masterFolderId = generateId();
            await db.insert(folders).values({
                id: masterFolderId,
                name: 'Prompts AI',
                type: 'folder',
                emoji: '🤖',
                isSystem: false,
                parentId: null,
                userId: ATHENA_USER_ID,
                createdAt: nowISO(),
                updatedAt: nowISO(),
            });
            importedFolders++;
            console.log('[IMPORT API] Created master folder "Prompts AI"');

            // Import all legacy folders as children
            for (const legacyFolder of legacyData.folders) {
                const childFolderId = generateId();
                await db.insert(folders).values({
                    id: childFolderId,
                    name: legacyFolder.name,
                    type: 'folder',
                    emoji: legacyFolder.icon || legacyFolder.emoji || '📁',
                    isSystem: false,
                    parentId: masterFolderId,
                    userId: ATHENA_USER_ID,
                    createdAt: legacyFolder.createdAt || nowISO(),
                    updatedAt: legacyFolder.updatedAt || nowISO(),
                });
                importedFolders++;

                // Import prompts
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
                            folderId: childFolderId,
                            userId: ATHENA_USER_ID,
                            createdAt: legacyPrompt.createdAt || nowISO(),
                            updatedAt: legacyPrompt.updatedAt || nowISO(),
                        });
                        importedPrompts++;
                    }
                }
                console.log(`[IMPORT API] Imported folder "${legacyFolder.name}" with ${legacyFolder.prompts?.length || 0} prompts`);
            }

            console.log('[IMPORT API] Legacy import complete:', { importedFolders, importedPrompts });
            return NextResponse.json({
                success: true,
                message: `Legacy import: Created "Prompts AI" folder with ${importedFolders - 1} subfolders and ${importedPrompts} prompts`,
                stats: { folders: importedFolders, prompts: importedPrompts },
                masterFolder: 'Prompts AI',
            });
        }

        // --- NEW FORMAT IMPORT ---
        const { data } = body;
        console.log('[IMPORT API] New format - items count:', data.length);

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

        console.log('[IMPORT API] New format import complete:', { importedFolders, importedPrompts });
        return NextResponse.json({
            success: true,
            message: `Imported ${importedFolders} folders and ${importedPrompts} prompts`,
            stats: { folders: importedFolders, prompts: importedPrompts },
        });
    } catch (error) {
        console.error('[IMPORT API] Critical error:', error);
        return NextResponse.json(
            { success: false, error: 'Import failed', details: String(error) },
            { status: 500 }
        );
    }
}
