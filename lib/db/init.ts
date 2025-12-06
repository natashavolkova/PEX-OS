// ============================================================================
// DATABASE INITIALIZATION SCRIPT - TURSO/SQLITE
// ATHENA Architecture | Creates tables if they don't exist
// Run: npx tsx lib/db/init.ts
// ============================================================================

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@libsql/client';

const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  grid_density TEXT DEFAULT 'standard',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  members INTEGER DEFAULT 1,
  due_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT NOT NULL REFERENCES users(id)
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  due_date TEXT,
  tags TEXT DEFAULT '[]',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT NOT NULL REFERENCES users(id)
);

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'folder',
  emoji TEXT,
  is_system INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  parent_id TEXT,
  user_id TEXT NOT NULL REFERENCES users(id)
);

-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'prompt',
  emoji TEXT,
  category TEXT,
  tags TEXT DEFAULT '[]',
  version INTEGER DEFAULT 1,
  is_favorite INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  folder_id TEXT REFERENCES folders(id),
  user_id TEXT NOT NULL REFERENCES users(id)
);

-- Analytics Events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  metadata TEXT,
  duration INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT NOT NULL REFERENCES users(id)
);

-- YouTube Videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
  id TEXT PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  channel_name TEXT,
  thumbnail_url TEXT,
  watch_status TEXT DEFAULT 'unwatched',
  notes TEXT,
  insights TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT NOT NULL REFERENCES users(id)
);

-- Neovim Configs table
CREATE TABLE IF NOT EXISTS neovim_configs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  base TEXT NOT NULL,
  lsp_configs TEXT DEFAULT '[]',
  plugins TEXT DEFAULT '[]',
  content TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT NOT NULL REFERENCES users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  is_read INTEGER DEFAULT 0,
  action_url TEXT,
  metadata TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT NOT NULL REFERENCES users(id)
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  content TEXT NOT NULL,
  emoji TEXT,
  tags TEXT DEFAULT '[]',
  is_public INTEGER DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  user_id TEXT NOT NULL REFERENCES users(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_youtube_user_id ON youtube_videos(user_id);

-- Insert Athena admin user if not exists
INSERT OR IGNORE INTO users (id, email, name, grid_density, created_at, updated_at)
VALUES ('athena-supreme-user-001', 'athena@pex-os.ai', 'Athena', 'standard', datetime('now'), datetime('now'));
`;

async function initDatabase() {
    console.log('🚀 Initializing Turso database...');

    try {
        // Split schema into individual statements
        const statements = schema
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            await client.execute(statement);
        }

        console.log('✅ Database initialized successfully!');
        console.log('📊 Tables created: users, projects, tasks, folders, prompts, analytics_events, youtube_videos, neovim_configs, notifications, templates');
        console.log('👤 Athena admin user created');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
}

initDatabase();
