// ============================================================================
// NEOVIM CONFIG API - Turso/Drizzle
// ATHENA Architecture | Simplified for migration
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { neovimConfigs, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { generateId, nowISO, parseJsonField, stringifyJsonField, ATHENA_USER_ID, ATHENA_EMAIL, ATHENA_NAME } from '@/lib/db/helpers';

// GET /api/neovim - List configs
export async function GET() {
    try {
        const results = await db.select({
            id: neovimConfigs.id,
            name: neovimConfigs.name,
            base: neovimConfigs.base,
            lspConfigs: neovimConfigs.lspConfigs,
            plugins: neovimConfigs.plugins,
            content: neovimConfigs.content,
            createdAt: neovimConfigs.createdAt,
        })
            .from(neovimConfigs)
            .where(eq(neovimConfigs.userId, ATHENA_USER_ID))
            .orderBy(desc(neovimConfigs.createdAt))
            .limit(20);

        const parsed = results.map(c => ({
            ...c,
            lspConfigs: parseJsonField<string[]>(c.lspConfigs, []),
            plugins: parseJsonField<string[]>(c.plugins, []),
        }));

        return NextResponse.json({
            success: true,
            data: parsed,
        });
    } catch (error) {
        console.error('[API] GET /api/neovim error:', error);
        return NextResponse.json(
            { success: false, error: 'Database error' },
            { status: 500 }
        );
    }
}

// POST /api/neovim - Create config
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

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

        const newConfig = {
            id: generateId(),
            name: body.name || 'New Config',
            base: body.base || 'lazyvim',
            lspConfigs: stringifyJsonField(body.lspConfigs || []),
            plugins: stringifyJsonField(body.plugins || []),
            content: body.content || '',
            createdAt: nowISO(),
            updatedAt: nowISO(),
            userId: ATHENA_USER_ID,
        };

        await db.insert(neovimConfigs).values(newConfig);

        return NextResponse.json({
            success: true,
            data: newConfig,
            message: 'Config created',
        });
    } catch (error) {
        console.error('[API] POST /api/neovim error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create config' },
            { status: 400 }
        );
    }
}
