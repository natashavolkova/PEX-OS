// ============================================================================
// ATHENAPEX - ANALYTICS DATA ACCESS
// Database operations for analytics events and aggregations
// ============================================================================

import prisma from '@/lib/prisma';

// --- EVENT TYPES ---
export type EventType =
    | 'focus_start'
    | 'focus_end'
    | 'task_create'
    | 'task_complete'
    | 'prompt_create'
    | 'prompt_update'
    | 'project_create'
    | 'project_update'
    | 'page_view';

// --- CREATE EVENT ---
export async function createEvent(
    userId: string,
    type: EventType,
    metadata?: Record<string, unknown>,
    duration?: number
) {
    return prisma.analyticsEvent.create({
        data: {
            userId,
            type,
            metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
            duration,
        },
    });
}

// --- GET HEATMAP DATA ---
export async function getHeatmapData(
    userId: string,
    startDate: Date,
    endDate: Date
) {
    const events = await prisma.analyticsEvent.findMany({
        where: {
            userId,
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        select: {
            createdAt: true,
            type: true,
            duration: true,
        },
    });

    // Aggregate by day and hour
    const heatmap: Record<number, Record<number, number>> = {};

    for (let day = 0; day < 7; day++) {
        heatmap[day] = {};
        for (let hour = 0; hour < 24; hour++) {
            heatmap[day][hour] = 0;
        }
    }

    events.forEach((event) => {
        const date = new Date(event.createdAt);
        const day = date.getDay();
        const hour = date.getHours();
        heatmap[day][hour] += event.duration || 1;
    });

    // Normalize values to 0-1
    const maxValue = Math.max(
        ...Object.values(heatmap).flatMap((h) => Object.values(h))
    );

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, dayIndex) => ({
        day,
        dayIndex,
        hours: Array.from({ length: 24 }, (_, hour) => ({
            hour,
            value: maxValue > 0 ? heatmap[dayIndex][hour] / maxValue : 0,
        })),
    }));
}

// --- GET FOCUS STATS ---
export async function getFocusStats(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await prisma.analyticsEvent.findMany({
        where: {
            userId,
            type: { in: ['focus_start', 'focus_end'] },
            createdAt: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        orderBy: { createdAt: 'asc' },
    });

    // Calculate total focus time and blocks
    let totalMinutes = 0;
    const blocks: Array<{ start: Date; end: Date; duration: number }> = [];
    let currentStart: Date | null = null;

    events.forEach((event) => {
        if (event.type === 'focus_start') {
            currentStart = event.createdAt;
        } else if (event.type === 'focus_end' && currentStart) {
            const duration = Math.round(
                (event.createdAt.getTime() - currentStart.getTime()) / 60000
            );
            totalMinutes += duration;
            blocks.push({
                start: currentStart,
                end: event.createdAt,
                duration,
            });
            currentStart = null;
        }
    });

    return {
        totalFocusMinutes: totalMinutes,
        focusBlocks: blocks,
        avgBlockDuration: blocks.length > 0 ? totalMinutes / blocks.length : 0,
    };
}

// --- GET VELOCITY DATA ---
export async function getVelocityData(userId: string, days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const events = await prisma.analyticsEvent.findMany({
        where: {
            userId,
            type: 'task_complete',
            createdAt: { gte: startDate },
        },
        select: { createdAt: true },
    });

    // Group by date
    const velocityMap: Record<string, number> = {};

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toISOString().split('T')[0];
        velocityMap[key] = 0;
    }

    events.forEach((event) => {
        const key = event.createdAt.toISOString().split('T')[0];
        if (velocityMap[key] !== undefined) {
            velocityMap[key]++;
        }
    });

    return Object.entries(velocityMap)
        .map(([date, count]) => ({ date, count }))
        .reverse();
}

// --- GET RECENT ACTIVITY ---
export async function getRecentActivity(userId: string, limit: number = 10) {
    const events = await prisma.analyticsEvent.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        select: {
            id: true,
            type: true,
            metadata: true,
            createdAt: true,
        },
    });

    return events.map((event) => ({
        id: event.id,
        type: event.type,
        metadata: event.metadata as Record<string, unknown> | null,
        createdAt: event.createdAt,
        relativeTime: getRelativeTime(event.createdAt),
    }));
}

// --- GET OVERVIEW STATS ---
export async function getOverviewStats(userId: string) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
        totalPrompts,
        activeProjects,
        weekFocusEvents,
        completedTasks,
        youtubeVideos,
        neovimConfigs,
    ] = await Promise.all([
        prisma.prompt.count({ where: { userId } }),
        prisma.project.count({ where: { userId, status: 'active' } }),
        prisma.analyticsEvent.findMany({
            where: {
                userId,
                type: 'focus_end',
                createdAt: { gte: weekAgo },
            },
            select: { duration: true },
        }),
        prisma.task.count({ where: { userId, status: 'completed' } }),
        prisma.youTubeVideo.count({ where: { userId } }),
        prisma.neovimConfig.count({ where: { userId } }),
    ]);

    const focusHours = weekFocusEvents.reduce(
        (sum, e) => sum + (e.duration || 0),
        0
    ) / 60;

    return {
        totalPrompts,
        activeProjects,
        focusHoursWeek: Math.round(focusHours * 10) / 10,
        completedTasks,
        youtubeVideos,
        neovimConfigs,
    };
}

// --- HELPER ---
function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR');
}
