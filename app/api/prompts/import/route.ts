// ============================================================================
// ATHENAPEX - IMPORT PROMPTS API
// Import prompts from a backup file, reorganizing folders under a parent
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/db/users';

interface BackupPrompt {
    id: string;
    folderId: string;
    title: string;
    content: string;
    theme?: string;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

interface BackupFolder {
    id: string;
    name: string;
    icon?: string;
    emoji?: string;
    description?: string;
    color?: string;
    order?: number;
    createdAt: string;
    updatedAt: string;
    prompts: BackupPrompt[];
}

interface BackupData {
    folders: BackupFolder[];
    settings?: Record<string, unknown>;
}

// POST /api/prompts/import - Import prompts from backup
export async function POST(request: NextRequest) {
    try {
        const userId = await getCurrentUserId();
        const body = await request.json();

        const { data, parentFolderName = 'Prompts AI' } = body as {
            data: BackupData;
            parentFolderName?: string;
        };

        if (!data || !data.folders) {
            return NextResponse.json(
                { success: false, message: 'Invalid backup data format' },
                { status: 400 }
            );
        }

        // 1. Create or find parent folder "Prompts AI"
        let parentFolder = await prisma.folder.findFirst({
            where: { userId, name: parentFolderName, parentId: null }
        });

        if (!parentFolder) {
            parentFolder = await prisma.folder.create({
                data: {
                    name: parentFolderName,
                    emoji: '🤖',
                    type: 'folder',
                    userId,
                }
            });
        }

        // 2. Import each folder as a subfolder of the parent
        const importedFolders: { oldId: string; newId: string }[] = [];
        let totalPrompts = 0;

        for (const backupFolder of data.folders) {
            // Check if folder already exists under parent
            let folder = await prisma.folder.findFirst({
                where: {
                    userId,
                    name: backupFolder.name,
                    parentId: parentFolder.id
                }
            });

            if (!folder) {
                // Create new folder under parent
                folder = await prisma.folder.create({
                    data: {
                        name: backupFolder.name,
                        emoji: backupFolder.icon || backupFolder.emoji || '📁',
                        type: 'folder',
                        parentId: parentFolder.id,
                        userId,
                    }
                });
            }

            importedFolders.push({ oldId: backupFolder.id, newId: folder.id });

            // 3. Import prompts into this folder
            for (const backupPrompt of backupFolder.prompts) {
                // Check if prompt already exists (by title and folderId)
                const existingPrompt = await prisma.prompt.findFirst({
                    where: {
                        userId,
                        title: backupPrompt.title,
                        folderId: folder.id
                    }
                });

                if (!existingPrompt) {
                    await prisma.prompt.create({
                        data: {
                            title: backupPrompt.title,
                            content: backupPrompt.content,
                            type: 'prompt',
                            category: backupPrompt.theme || undefined,
                            tags: backupPrompt.tags || [],
                            folderId: folder.id,
                            userId,
                        }
                    });
                    totalPrompts++;
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Imported ${importedFolders.length} folders and ${totalPrompts} prompts under "${parentFolderName}"`,
            data: {
                parentFolderId: parentFolder.id,
                parentFolderName: parentFolder.name,
                foldersImported: importedFolders.length,
                promptsImported: totalPrompts,
            }
        });

    } catch (error) {
        console.error('Import prompts error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to import prompts' },
            { status: 500 }
        );
    }
}
