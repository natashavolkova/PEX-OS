// ============================================================================
// BACKFILL POSITION COLUMN - TURSO/SQLITE
// Run: npx tsx lib/db/backfill-positions.ts
// Assigns sequential position values to existing folders/prompts based on createdAt
// ============================================================================

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@libsql/client';

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function backfillPositions() {
    console.log('🚀 Backfilling position columns...');

    try {
        // Backfill folders: assign position based on created_at order
        console.log('📁 Backfilling folders...');
        const foldersResult = await client.execute(
            'SELECT id FROM folders ORDER BY created_at ASC'
        );

        for (let i = 0; i < foldersResult.rows.length; i++) {
            const id = foldersResult.rows[i].id;
            await client.execute({
                sql: 'UPDATE folders SET position = ? WHERE id = ?',
                args: [i, id as string]
            });
            console.log(`  ✅ Folder ${id} → position ${i}`);
        }

        // Backfill prompts: assign position based on created_at order
        console.log('📄 Backfilling prompts...');
        const promptsResult = await client.execute(
            'SELECT id FROM prompts ORDER BY created_at ASC'
        );

        for (let i = 0; i < promptsResult.rows.length; i++) {
            const id = promptsResult.rows[i].id;
            await client.execute({
                sql: 'UPDATE prompts SET position = ? WHERE id = ?',
                args: [i, id as string]
            });
            console.log(`  ✅ Prompt ${id} → position ${i}`);
        }

        console.log('🎉 Backfill complete!');
        console.log(`📊 Updated ${foldersResult.rows.length} folders and ${promptsResult.rows.length} prompts`);

    } catch (error) {
        console.error('❌ Backfill failed:', error);
        throw error;
    }
}

backfillPositions();
