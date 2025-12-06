// ============================================================================
// PROMPTS EXPORT API - Turso/Drizzle
// ATHENA Architecture | Temporarily simplified for migration
// ============================================================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { folders, prompts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ATHENA_USER_ID, parseJsonField } from '@/lib/db/helpers';

// GET /api/prompts/export - Export prompts as JSON
export async function GET() {
    try {
        const allFolders = await db.select().from(folders).where(eq(folders.userId, ATHENA_USER_ID));
        const allPrompts = await db.select().from(prompts).where(eq(prompts.userId, ATHENA_USER_ID));

        // Convert prompts tags from JSON string to array
        const parsedPrompts = allPrompts.map(p => ({
            ...p,
            tags: parseJsonField<string[]>(p.tags, []),
        }));

        // Build tree structure
        const buildTree = (parentId: string | null): any[] => {
            const childFolders = allFolders.filter(f => f.parentId === parentId);
            const childPrompts = parsedPrompts.filter(p => p.folderId === parentId);

            return [
                ...childFolders.map(f => ({
                    id: f.id,
                    name: f.name,
                    type: 'folder',
                    emoji: f.emoji,
                    children: buildTree(f.id),
                })),
                ...childPrompts.map(p => ({
                    id: p.id,
                    name: p.title,
                    type: 'prompt',
                    emoji: p.emoji,
                    content: p.content,
                    category: p.category,
                    tags: p.tags,
                })),
            ];
        };

        const data = buildTree(null);

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('[API] GET /api/prompts/export error:', error);
        return NextResponse.json(
            { success: false, error: 'Export failed' },
            { status: 500 }
        );
    }
}
