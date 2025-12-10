// ============================================================================
// DRIZZLE SCHEMA - TURSO/SQLITE COMPATIBLE
// ATHENA Architecture | Converted from Prisma PostgreSQL
// ============================================================================
// CONVERSIONS MADE:
// - String[] → TEXT (JSON serialized)
// - Json → TEXT (JSON serialized)
// - DateTime → TEXT (ISO8601 format)
// - cuid() → TEXT with nanoid generation
// ============================================================================

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// --- USERS ---
export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name'),
    gridDensity: text('grid_density').default('standard'),
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
    updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// --- PROJECTS ---
export const projects = sqliteTable('projects', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    status: text('status').default('active'),
    progress: integer('progress').default(0),
    members: integer('members').default(1),
    dueDate: text('due_date'),
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
    updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
    userId: text('user_id').notNull().references(() => users.id),
});

// --- TASKS ---
export const tasks = sqliteTable('tasks', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    status: text('status').default('todo'),
    priority: text('priority').default('medium'),
    dueDate: text('due_date'),
    tags: text('tags').default('[]'), // JSON array as TEXT
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
    updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
    userId: text('user_id').notNull().references(() => users.id),
});

// --- FOLDERS ---
export const folders = sqliteTable('folders', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type').default('folder'),
    emoji: text('emoji'),
    isSystem: integer('is_system', { mode: 'boolean' }).default(false),
    position: integer('position').default(0), // Order index for drag-and-drop
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
    updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
    parentId: text('parent_id'),
    userId: text('user_id').notNull().references(() => users.id),
});

// --- PROMPTS ---
export const prompts = sqliteTable('prompts', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    type: text('type').default('prompt'),
    emoji: text('emoji'),
    category: text('category'),
    tags: text('tags').default('[]'), // JSON array as TEXT
    version: integer('version').default(1),
    isFavorite: integer('is_favorite', { mode: 'boolean' }).default(false),
    position: integer('position').default(0), // Order index for drag-and-drop
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
    updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
    folderId: text('folder_id').references(() => folders.id),
    userId: text('user_id').notNull().references(() => users.id),
});

// --- ANALYTICS EVENTS ---
export const analyticsEvents = sqliteTable('analytics_events', {
    id: text('id').primaryKey(),
    type: text('type').notNull(),
    metadata: text('metadata'), // JSON as TEXT
    duration: integer('duration'),
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
    userId: text('user_id').notNull().references(() => users.id),
});

// --- YOUTUBE VIDEOS ---
export const youtubeVideos = sqliteTable('youtube_videos', {
    id: text('id').primaryKey(),
    videoId: text('video_id').notNull().unique(),
    title: text('title').notNull(),
    channelName: text('channel_name'),
    thumbnailUrl: text('thumbnail_url'),
    watchStatus: text('watch_status').default('unwatched'),
    notes: text('notes'),
    insights: text('insights'), // JSON as TEXT
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
    updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
    userId: text('user_id').notNull().references(() => users.id),
});

// --- NEOVIM CONFIGS ---
export const neovimConfigs = sqliteTable('neovim_configs', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    base: text('base').notNull(),
    lspConfigs: text('lsp_configs').default('[]'), // JSON array as TEXT
    plugins: text('plugins').default('[]'), // JSON array as TEXT
    content: text('content').notNull(),
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
    updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
    userId: text('user_id').notNull().references(() => users.id),
});

// --- NOTIFICATIONS ---
export const notifications = sqliteTable('notifications', {
    id: text('id').primaryKey(),
    type: text('type').notNull(),
    title: text('title').notNull(),
    message: text('message').notNull(),
    priority: text('priority').default('normal'),
    isRead: integer('is_read', { mode: 'boolean' }).default(false),
    actionUrl: text('action_url'),
    metadata: text('metadata'), // JSON as TEXT
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
    userId: text('user_id').notNull().references(() => users.id),
});

// --- TEMPLATES ---
export const templates = sqliteTable('templates', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    category: text('category').default('general'),
    content: text('content').notNull(), // JSON as TEXT
    emoji: text('emoji'),
    tags: text('tags').default('[]'), // JSON array as TEXT
    isPublic: integer('is_public', { mode: 'boolean' }).default(false),
    usageCount: integer('usage_count').default(0),
    createdAt: text('created_at').default('CURRENT_TIMESTAMP'),
    updatedAt: text('updated_at').default('CURRENT_TIMESTAMP'),
    userId: text('user_id').notNull().references(() => users.id),
});

// --- RELATIONS ---
export const usersRelations = relations(users, ({ many }) => ({
    projects: many(projects),
    tasks: many(tasks),
    folders: many(folders),
    prompts: many(prompts),
    analyticsEvents: many(analyticsEvents),
    youtubeVideos: many(youtubeVideos),
    neovimConfigs: many(neovimConfigs),
    notifications: many(notifications),
    templates: many(templates),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
    user: one(users, { fields: [projects.userId], references: [users.id] }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
    user: one(users, { fields: [tasks.userId], references: [users.id] }),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
    user: one(users, { fields: [folders.userId], references: [users.id] }),
    parent: one(folders, { fields: [folders.parentId], references: [folders.id] }),
    children: many(folders),
    prompts: many(prompts),
}));

export const promptsRelations = relations(prompts, ({ one }) => ({
    user: one(users, { fields: [prompts.userId], references: [users.id] }),
    folder: one(folders, { fields: [prompts.folderId], references: [folders.id] }),
}));

export const youtubeVideosRelations = relations(youtubeVideos, ({ one }) => ({
    user: one(users, { fields: [youtubeVideos.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
    user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const templatesRelations = relations(templates, ({ one }) => ({
    user: one(users, { fields: [templates.userId], references: [users.id] }),
}));
