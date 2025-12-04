// ============================================================================
// ATHENAPEX - YOUTUBE DATA ACCESS
// CRUD operations for YouTube video references
// ============================================================================

import prisma from '@/lib/prisma';

export type WatchStatus = 'unwatched' | 'watching' | 'watched' | 'revisit';

export interface CreateYouTubeVideoInput {
    videoId: string;
    title: string;
    channelName?: string;
    thumbnailUrl?: string;
    notes?: string;
}

export interface UpdateYouTubeVideoInput {
    title?: string;
    watchStatus?: WatchStatus;
    notes?: string;
    insights?: unknown[];
}

// --- CREATE ---
export async function createVideo(userId: string, data: CreateYouTubeVideoInput) {
    return prisma.youTubeVideo.create({
        data: {
            userId,
            ...data,
        },
    });
}

// --- READ ALL ---
export async function getVideos(
    userId: string,
    options?: {
        watchStatus?: WatchStatus;
        search?: string;
        limit?: number;
        offset?: number;
    }
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { userId };

    if (options?.watchStatus) {
        where.watchStatus = options.watchStatus;
    }

    if (options?.search) {
        where.OR = [
            { title: { contains: options.search, mode: 'insensitive' } },
            { channelName: { contains: options.search, mode: 'insensitive' } },
            { notes: { contains: options.search, mode: 'insensitive' } },
        ];
    }

    const [videos, total] = await Promise.all([
        prisma.youTubeVideo.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: options?.limit ?? 50,
            skip: options?.offset ?? 0,
        }),
        prisma.youTubeVideo.count({ where }),
    ]);

    return { videos, total };
}

// --- READ ONE ---
export async function getVideoById(id: string) {
    return prisma.youTubeVideo.findUnique({
        where: { id },
    });
}

// --- READ BY VIDEO ID ---
export async function getVideoByVideoId(videoId: string) {
    return prisma.youTubeVideo.findUnique({
        where: { videoId },
    });
}

// --- UPDATE ---
export async function updateVideo(id: string, data: UpdateYouTubeVideoInput) {
    return prisma.youTubeVideo.update({
        where: { id },
        data: {
            ...data,
            insights: data.insights ? JSON.parse(JSON.stringify(data.insights)) : undefined,
        },
    });
}

// --- DELETE ---
export async function deleteVideo(id: string) {
    return prisma.youTubeVideo.delete({
        where: { id },
    });
}

// --- ADD INSIGHT ---
export async function addInsight(id: string, insight: { text: string; timestamp?: string }) {
    const video = await prisma.youTubeVideo.findUnique({
        where: { id },
        select: { insights: true },
    });

    const currentInsights = (video?.insights as unknown[] | null) ?? [];
    const newInsights = [...currentInsights, { ...insight, createdAt: new Date().toISOString() }];

    return prisma.youTubeVideo.update({
        where: { id },
        data: {
            insights: JSON.parse(JSON.stringify(newInsights)),
        },
    });
}

// --- GET STATS ---
export async function getVideoStats(userId: string) {
    const [total, unwatched, watching, watched, revisit] = await Promise.all([
        prisma.youTubeVideo.count({ where: { userId } }),
        prisma.youTubeVideo.count({ where: { userId, watchStatus: 'unwatched' } }),
        prisma.youTubeVideo.count({ where: { userId, watchStatus: 'watching' } }),
        prisma.youTubeVideo.count({ where: { userId, watchStatus: 'watched' } }),
        prisma.youTubeVideo.count({ where: { userId, watchStatus: 'revisit' } }),
    ]);

    return { total, unwatched, watching, watched, revisit };
}
