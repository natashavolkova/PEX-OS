// ============================================================================
// ATHENAPEX - TEMPLATES API
// ATHENA Architecture | Turso/Drizzle (SQLite) - Optimized for Serverless
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { templates, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateId, nowISO, parseJsonField, stringifyJsonField, ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME } from '@/lib/db/helpers';

// GET /api/templates - List templates
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');

        let results = await db.select({
            id: templates.id,
            name: templates.name,
            description: templates.description,
            category: templates.category,
            content: templates.content,
            emoji: templates.emoji,
            tags: templates.tags,
            isPublic: templates.isPublic,
            usageCount: templates.usageCount,
            createdAt: templates.createdAt,
        })
            .from(templates)
            .where(eq(templates.userId, ATHENA_USER_ID))
            .orderBy(desc(templates.createdAt))
            .limit(50);

        // Filter by category
        if (category) {
            results = results.filter(t => t.category === category);
        }

        // Parse JSON fields
        const parsed = results.map(t => ({
            ...t,
            content: parseJsonField(t.content, {}),
            tags: parseJsonField<string[]>(t.tags, []),
        }));

        return NextResponse.json({
            success: true,
            data: parsed,
        });
    } catch (error) {
        console.error('[API] GET /api/templates error:', error);
        return NextResponse.json(
            { success: false, error: 'Database error' },
            { status: 500 }
        );
    }
}

// POST /api/templates - Create template
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.name || !body.content) {
            return NextResponse.json(
                { success: false, error: 'Name and content are required' },
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

        const newTemplate = {
            id: generateId(),
            name: body.name,
            description: body.description || null,
            category: body.category || 'general',
            content: stringifyJsonField(body.content),
            emoji: body.emoji || null,
            tags: stringifyJsonField(body.tags || []),
            isPublic: body.isPublic || false,
            usageCount: 0,
            createdAt: nowISO(),
            updatedAt: nowISO(),
            userId: ATHENA_USER_ID,
        };

        await db.insert(templates).values(newTemplate);

        return NextResponse.json({
            success: true,
            data: {
                ...newTemplate,
                content: body.content,
                tags: body.tags || [],
            },
            message: 'Template created',
        });
    } catch (error) {
        console.error('[API] POST /api/templates error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create template' },
            { status: 400 }
        );
    }
}

// PUT /api/templates - Update template
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { success: false, error: 'Template ID required' },
                { status: 400 }
            );
        }

        const updateData: Record<string, unknown> = {
            updatedAt: nowISO(),
        };
        if (body.name) updateData.name = body.name;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.category) updateData.category = body.category;
        if (body.content) updateData.content = stringifyJsonField(body.content);
        if (body.emoji !== undefined) updateData.emoji = body.emoji;
        if (body.tags) updateData.tags = stringifyJsonField(body.tags);
        if (body.isPublic !== undefined) updateData.isPublic = body.isPublic;

        await db.update(templates).set(updateData).where(eq(templates.id, body.id));

        const result = await db.select().from(templates).where(eq(templates.id, body.id)).limit(1);

        return NextResponse.json({
            success: true,
            data: result[0],
            message: 'Template updated',
        });
    } catch (error) {
        console.error('[API] PUT /api/templates error:', error);
        return NextResponse.json(
            { success: false, error: 'Update failed' },
            { status: 500 }
        );
    }
}

// DELETE /api/templates - Delete template
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Template ID required' },
                { status: 400 }
            );
        }

        await db.delete(templates).where(eq(templates.id, id));

        return NextResponse.json({
            success: true,
            message: 'Template deleted',
        });
    } catch (error) {
        console.error('[API] DELETE /api/templates error:', error);
        return NextResponse.json(
            { success: false, error: 'Delete failed' },
            { status: 500 }
        );
    }
}
