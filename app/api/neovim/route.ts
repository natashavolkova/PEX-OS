// ============================================================================
// ATHENAPEX - NEOVIM API
// CRUD for Neovim configurations
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import * as neovimDb from '@/lib/db/neovim';

// GET /api/neovim - Get all configs
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const base = searchParams.get('base') as neovimDb.NeovimBase | null;
        const search = searchParams.get('search') || undefined;

        // TODO: Get userId from auth session
        const userId = 'demo-user';

        const { configs, total } = await neovimDb.getConfigs(userId, {
            base: base || undefined,
            search,
        });

        return NextResponse.json({
            data: configs,
            total,
            success: true,
        });
    } catch (error) {
        console.error('Neovim configs fetch error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch configs' },
            { status: 500 }
        );
    }
}

// POST /api/neovim - Create new config
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, base, lspConfigs, plugins } = body;

        if (!name || !base) {
            return NextResponse.json(
                { success: false, message: 'Name and base are required' },
                { status: 400 }
            );
        }

        // TODO: Get userId from auth session
        const userId = 'demo-user';

        // Generate config content
        const content = neovimDb.generateConfigContent(
            base,
            lspConfigs || [],
            plugins || []
        );

        const config = await neovimDb.createConfig(userId, {
            name,
            base,
            lspConfigs: lspConfigs || [],
            plugins: plugins || [],
            content,
        });

        return NextResponse.json({
            data: config,
            success: true,
            message: 'Config created successfully',
        });
    } catch (error) {
        console.error('Neovim config create error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create config' },
            { status: 500 }
        );
    }
}
