// ============================================================================
// ATHENAPEX - NOTIFICATIONS API
// ATHENA Architecture | REST API Endpoints
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Mock user ID for development
const MOCK_USER_ID = 'user_athena_dev';

// GET /api/notifications - List all notifications
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unread') === 'true';
        const limit = parseInt(searchParams.get('limit') || '20');

        const notifications = await prisma.notification.findMany({
            where: {
                userId: MOCK_USER_ID,
                ...(unreadOnly && { isRead: false }),
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });

        const unreadCount = await prisma.notification.count({
            where: {
                userId: MOCK_USER_ID,
                isRead: false,
            },
        });

        return NextResponse.json({
            data: notifications,
            unreadCount,
            success: true,
        });
    } catch (error) {
        console.error('GET /api/notifications error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

// POST /api/notifications - Create new notification
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.title || !body.message) {
            return NextResponse.json(
                { success: false, message: 'Title and message are required' },
                { status: 400 }
            );
        }

        const notification = await prisma.notification.create({
            data: {
                type: body.type || 'system',
                title: body.title,
                message: body.message,
                priority: body.priority || 'normal',
                actionUrl: body.actionUrl,
                metadata: body.metadata,
                userId: MOCK_USER_ID,
            },
        });

        return NextResponse.json({
            data: notification,
            success: true,
            message: 'Notification created successfully',
        });
    } catch (error) {
        console.error('POST /api/notifications error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create notification' },
            { status: 500 }
        );
    }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { ids, markAllRead } = body;

        if (markAllRead) {
            // Mark all notifications as read
            await prisma.notification.updateMany({
                where: {
                    userId: MOCK_USER_ID,
                    isRead: false,
                },
                data: { isRead: true },
            });
        } else if (ids && Array.isArray(ids)) {
            // Mark specific notifications as read
            await prisma.notification.updateMany({
                where: {
                    id: { in: ids },
                    userId: MOCK_USER_ID,
                },
                data: { isRead: true },
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Notifications updated',
        });
    } catch (error) {
        console.error('PATCH /api/notifications error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update notifications' },
            { status: 500 }
        );
    }
}

// DELETE /api/notifications - Delete notification
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Notification ID is required' },
                { status: 400 }
            );
        }

        await prisma.notification.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: 'Notification deleted',
        });
    } catch (error) {
        console.error('DELETE /api/notifications error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete notification' },
            { status: 500 }
        );
    }
}
