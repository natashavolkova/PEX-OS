// ============================================================================
// ANALYTICS STATS API - Turso/Drizzle
// ATHENA Architecture | Stats Endpoint for Profile Page
// ============================================================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, projects, prompts, folders } from '@/lib/db/schema';
import { eq, count } from 'drizzle-orm';
import { ATHENA_USER_ID } from '@/lib/db/helpers';

// GET /api/analytics/stats - Get user stats for profile
export async function GET() {
    try {
        // Count prompts
        const promptsResult = await db.select({ count: count() }).from(prompts).where(eq(prompts.userId, ATHENA_USER_ID));
        const totalPrompts = promptsResult[0]?.count || 0;

        // Count folders
        const foldersResult = await db.select({ count: count() }).from(folders).where(eq(folders.userId, ATHENA_USER_ID));
        const totalFolders = foldersResult[0]?.count || 0;

        // Count projects
        const projectsResult = await db.select({ count: count() }).from(projects).where(eq(projects.userId, ATHENA_USER_ID));
        const activeProjects = projectsResult[0]?.count || 0;

        // Count tasks
        const tasksResult = await db.select({ count: count() }).from(tasks).where(eq(tasks.userId, ATHENA_USER_ID));
        const totalTasks = tasksResult[0]?.count || 0;

        return NextResponse.json({
            success: true,
            data: {
                totalPrompts,
                totalFolders,
                activeProjects,
                totalTasks,
                // Calculated values
                daysUsing: Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)),
                currentStreak: 0,
            },
        });
    } catch (error) {
        console.error('[API] GET /api/analytics/stats error:', error);
        return NextResponse.json({
            success: true,
            data: {
                totalPrompts: 0,
                totalFolders: 0,
                activeProjects: 0,
                totalTasks: 0,
                daysUsing: 0,
                currentStreak: 0,
            },
        });
    }
}
