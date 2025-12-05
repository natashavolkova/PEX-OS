// ============================================================================
// ATHENAPEX - EXPORT PROMPTS API
// Export all prompts and folders to a backup format
// ============================================================================

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/db/users';

// GET /api/prompts/export - Export all prompts and folders
export async function GET() {
    try {
        const userId = await getCurrentUserId();

        // Get all folders with their prompts
        const folders = await prisma.folder.findMany({
            where: { userId },
            include: {
                prompts: true,
                children: {
                    include: {
                        prompts: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Transform to backup format
        const backupFolders = folders.map(folder => ({
            id: folder.id,
            name: folder.name,
            icon: folder.emoji || '📁',
            emoji: folder.emoji,
            type: folder.type,
            parentId: folder.parentId,
            createdAt: folder.createdAt.toISOString(),
            updatedAt: folder.updatedAt.toISOString(),
            prompts: folder.prompts.map(prompt => ({
                id: prompt.id,
                folderId: prompt.folderId,
                title: prompt.title,
                content: prompt.content,
                theme: prompt.category,
                tags: prompt.tags,
                createdAt: prompt.createdAt.toISOString(),
                updatedAt: prompt.updatedAt.toISOString(),
            })),
            children: folder.children?.map(child => ({
                id: child.id,
                name: child.name,
                icon: child.emoji || '📁',
                prompts: child.prompts.map(prompt => ({
                    id: prompt.id,
                    folderId: prompt.folderId,
                    title: prompt.title,
                    content: prompt.content,
                    theme: prompt.category,
                    tags: prompt.tags,
                    createdAt: prompt.createdAt.toISOString(),
                    updatedAt: prompt.updatedAt.toISOString(),
                }))
            })) || []
        }));

        const backup = {
            folders: backupFolders,
            exportedAt: new Date().toISOString(),
            settings: {
                theme: 'dark',
                autoSave: true,
            }
        };

        return NextResponse.json({
            success: true,
            data: backup
        });

    } catch (error) {
        console.error('Export prompts error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to export prompts' },
            { status: 500 }
        );
    }
}
