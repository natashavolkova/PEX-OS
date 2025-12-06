// ============================================================================
// ATHENAPEX - NOTIFICATIONS API
// ATHENA Architecture | Turso/Drizzle (SQLite) - Optimized for Serverless
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { notifications, users } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { generateId, nowISO, parseJsonField, stringifyJsonField, ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME } from '@/lib/db/helpers';

// GET /api/notifications - List notifications
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const unreadOnly = searchParams.get('unread') === 'true';

        let query = db.select({
            id: notifications.id,
            type: notifications.type,
            title: notifications.title,
            message: notifications.message,
            priority: notifications.priority,
            isRead: notifications.isRead,
            actionUrl: notifications.actionUrl,
            createdAt: notifications.createdAt,
        })
            .from(notifications)
            .where(eq(notifications.userId, ATHENA_USER_ID))
            .orderBy(desc(notifications.createdAt))
            .limit(50);

        let results = await query;

        // Filter unread if needed
        if (unreadOnly) {
            results = results.filter(n => !n.isRead);
        }

        return NextResponse.json({
            success: true,
            data: results,
            unreadCount: results.filter(n => !n.isRead).length,
        });
    } catch (error) {
        console.error('[API] GET /api/notifications error:', error);
        return NextResponse.json(
            { success: false, error: 'Database error' },
            { status: 500 }
        );
    }
}

// POST /api/notifications - Create notification
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.title || !body.message) {
            return NextResponse.json(
                { success: false, error: 'Title and message are required' },
                { status: 400 }
            );
        }

        // Ensure user exists
        const existingUser = await db.select().from(users).where(eq(users.id, ATHENA_USER_ID)).limit(1);
        if (existingUser.length === 0) {
            await db.insert(users).values({
                id: ATHENA_USER_ID,
                email: ATHENA_EMAIL,
                name: ATHENA_NAME,
                createdAt: nowISO(),
                updatedAt: nowISO(),
            });
        }

        const newNotification = {
            id: generateId(),
            type: body.type || 'system',
            title: body.title,
            message: body.message,
            priority: body.priority || 'normal',
            isRead: false,
            actionUrl: body.actionUrl || null,
            metadata: body.metadata ? stringifyJsonField(body.metadata) : null,
            createdAt: nowISO(),
            userId: ATHENA_USER_ID,
        };

        await db.insert(notifications).values(newNotification);

        return NextResponse.json({
            success: true,
            data: newNotification,
            message: 'Notification created',
        });
    } catch (error) {
        console.error('[API] POST /api/notifications error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create notification' },
            { status: 400 }
        );
    }
}

// PATCH /api/notifications - Mark as read
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, markAllRead } = body;

        if (markAllRead) {
            // Mark all as read
            await db.update(notifications)
                .set({ isRead: true })
                .where(eq(notifications.userId, ATHENA_USER_ID));

            return NextResponse.json({
                success: true,
                message: 'All notifications marked as read',
            });
        }

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Notification ID required' },
                { status: 400 }
            );
        }

        await db.update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, id));

        return NextResponse.json({
            success: true,
            message: 'Notification marked as read',
        });
    } catch (error) {
        console.error('[API] PATCH /api/notifications error:', error);
        return NextResponse.json(
            { success: false, error: 'Update failed' },
            { status: 500 }
        );
    }
}

// DELETE /api/notifications - Delete notification or clear all
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const clearAll = searchParams.get('clearAll') === 'true';

        if (clearAll) {
            await db.delete(notifications).where(eq(notifications.userId, ATHENA_USER_ID));
            return NextResponse.json({
                success: true,
                message: 'All notifications cleared',
            });
        }

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Notification ID required' },
                { status: 400 }
            );
        }

        await db.delete(notifications).where(eq(notifications.id, id));

        return NextResponse.json({
            success: true,
            message: 'Notification deleted',
        });
    } catch (error) {
        console.error('[API] DELETE /api/notifications error:', error);
        return NextResponse.json(
            { success: false, error: 'Delete failed' },
            { status: 500 }
        );
    }
}
