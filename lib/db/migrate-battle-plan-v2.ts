// ============================================================================
// BATTLE PLAN 2.0 MIGRATION - TURSO/SQLITE
// Run: npx tsx lib/db/migrate-battle-plan-v2.ts
// Adds contentMarkdown and diagramData columns for hybrid editor
// ============================================================================

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@libsql/client';

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

const migrations = [
    // Add content_markdown column
    `ALTER TABLE battle_plans ADD COLUMN content_markdown TEXT`,

    // Add diagram_data column for tldraw canvas state
    `ALTER TABLE battle_plans ADD COLUMN diagram_data TEXT`,

    // Migrate existing content to content_markdown
    `UPDATE battle_plans SET content_markdown = content WHERE content_markdown IS NULL AND content IS NOT NULL`,
];

async function runMigrations() {
    console.log('🚀 Running Battle Plan 2.0 migrations...');

    for (const sql of migrations) {
        try {
            await client.execute(sql);
            console.log(`✅ Executed: ${sql.substring(0, 60)}...`);
        } catch (error: unknown) {
            const err = error as Error;
            if (err.message?.includes('duplicate column') ||
                err.message?.includes('already exists')) {
                console.log(`⏭️ Skipped (already exists): ${sql.substring(0, 60)}...`);
            } else {
                console.error(`❌ Failed: ${sql.substring(0, 60)}...`);
                console.error(err.message);
            }
        }
    }

    console.log('🎉 Battle Plan 2.0 migrations complete!');
}

runMigrations();
