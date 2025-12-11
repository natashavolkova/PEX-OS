// ============================================================================
// PROJECTS ARCHITECTURE MIGRATION - TURSO/SQLITE
// Run: npx tsx lib/db/migrate-projects-architecture.ts
// ============================================================================

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@libsql/client';

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

const migrations = [
    // 1. Add roi_score to projects table
    `ALTER TABLE projects ADD COLUMN roi_score INTEGER DEFAULT 0`,

    // 2. Add project_id FK to tasks table
    `ALTER TABLE tasks ADD COLUMN project_id TEXT REFERENCES projects(id)`,

    // 3. Create battle_plans table
    `CREATE TABLE IF NOT EXISTS battle_plans (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        status TEXT DEFAULT 'draft',
        project_id TEXT REFERENCES projects(id),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT NOT NULL REFERENCES users(id)
    )`,

    // 4. Create index for faster project lookups
    `CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id)`,
    `CREATE INDEX IF NOT EXISTS idx_battle_plans_project_id ON battle_plans(project_id)`,
];

async function runMigrations() {
    console.log('🚀 Running Projects Architecture migrations...');

    for (const sql of migrations) {
        try {
            await client.execute(sql);
            console.log(`✅ Executed: ${sql.substring(0, 60)}...`);
        } catch (error: unknown) {
            const err = error as Error;
            // Ignore "duplicate column" or "already exists" errors (idempotent)
            if (err.message?.includes('duplicate column') ||
                err.message?.includes('already exists')) {
                console.log(`⏭️ Skipped (already exists): ${sql.substring(0, 60)}...`);
            } else {
                console.error(`❌ Failed: ${sql.substring(0, 60)}...`);
                console.error(err.message);
            }
        }
    }

    console.log('🎉 Projects Architecture migrations complete!');
}

runMigrations();
