// ============================================================================
// ATHENAPEX - SEED PROMPTS FROM BACKUP
// Import prompts from backup file into the database
// Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-prompts.ts
// ============================================================================

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

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

async function seedPrompts() {
    console.log('🚀 Starting prompts import...');

    // Find Athena user
    const user = await prisma.user.findFirst({
        where: { email: 'natashavolkova771@gmail.com' }
    });

    if (!user) {
        console.error('❌ User not found! Run the main seed first.');
        return;
    }

    console.log(`✅ Found user: ${user.name} (${user.id})`);

    // Read backup file
    const backupPath = path.join(__dirname, '..', '..', 'Backup_adaptado-EXEMPLO.json');

    if (!fs.existsSync(backupPath)) {
        console.error(`❌ Backup file not found at: ${backupPath}`);
        return;
    }

    const backupContent = fs.readFileSync(backupPath, 'utf-8');
    const backupData: BackupData = JSON.parse(backupContent);

    console.log(`📦 Found ${backupData.folders.length} folders in backup`);

    // 1. Create parent folder "Prompts AI"
    let parentFolder = await prisma.folder.findFirst({
        where: { userId: user.id, name: 'Prompts AI', parentId: null }
    });

    if (!parentFolder) {
        parentFolder = await prisma.folder.create({
            data: {
                name: 'Prompts AI',
                emoji: '🤖',
                type: 'folder',
                userId: user.id,
            }
        });
        console.log('✅ Created parent folder: Prompts AI');
    } else {
        console.log('ℹ️ Parent folder "Prompts AI" already exists');
    }

    let totalFolders = 0;
    let totalPrompts = 0;

    // 2. Import each folder as a subfolder
    for (const backupFolder of backupData.folders) {
        // Check if folder already exists
        let folder = await prisma.folder.findFirst({
            where: {
                userId: user.id,
                name: backupFolder.name,
                parentId: parentFolder.id
            }
        });

        if (!folder) {
            folder = await prisma.folder.create({
                data: {
                    name: backupFolder.name,
                    emoji: backupFolder.icon || backupFolder.emoji || '📁',
                    type: 'folder',
                    parentId: parentFolder.id,
                    userId: user.id,
                }
            });
            totalFolders++;
            console.log(`  📁 Created folder: ${backupFolder.name}`);
        } else {
            console.log(`  ℹ️ Folder "${backupFolder.name}" already exists`);
        }

        // 3. Import prompts into this folder
        for (const backupPrompt of backupFolder.prompts) {
            // Check if prompt already exists
            const existingPrompt = await prisma.prompt.findFirst({
                where: {
                    userId: user.id,
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
                        userId: user.id,
                    }
                });
                totalPrompts++;
                console.log(`    📝 Imported: ${backupPrompt.title.substring(0, 50)}...`);
            }
        }
    }

    console.log('\n✨ Import completed!');
    console.log(`   Folders created: ${totalFolders}`);
    console.log(`   Prompts imported: ${totalPrompts}`);
    console.log(`   Parent folder: Prompts AI (${parentFolder.id})`);
}

seedPrompts()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
