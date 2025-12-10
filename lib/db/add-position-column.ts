// ============================================================================
// ADD POSITION COLUMN MIGRATION - TURSO/SQLITE
// Run: npx tsx lib/db/add-position-column.ts
// ============================================================================

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@libsql/client';

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

const migrations = [
    // Add position column to folders table
    `ALTER TABLE folders ADD COLUMN position INTEGER DEFAULT 0`,
    // Add position column to prompts table
    `ALTER TABLE prompts ADD COLUMN position INTEGER DEFAULT 0`,
];

async function runMigrations() {
    console.log('🚀 Running position column migrations...');

    for (const sql of migrations) {
        try {
            await client.execute(sql);
            console.log(`✅ Executed: ${sql.substring(0, 50)}...`);
        } catch (error: unknown) {
            const err = error as Error;
            // Ignore "duplicate column" errors (already migrated)
            if (err.message?.includes('duplicate column')) {
                console.log(`⏭️ Skipped (already exists): ${sql.substring(0, 50)}...`);
            } else {
                console.error(`❌ Failed: ${sql.substring(0, 50)}...`);
                console.error(err.message);
            }
        }
    }

    console.log('🎉 Migrations complete!');
}

runMigrations();
