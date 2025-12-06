// ============================================================================
// ATHENAPEX - TEMPLATES API
// ATHENA Architecture | REST API Endpoints
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Mock user ID for development
const MOCK_USER_ID = 'user_athena_dev';

// GET /api/templates - List all templates
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const templates = await prisma.template.findMany({
            where: {
                OR: [
                    { userId: MOCK_USER_ID },
                    { isPublic: true },
                ],
                ...(category && { category }),
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],
                }),
            },
            orderBy: [
                { usageCount: 'desc' },
                { updatedAt: 'desc' },
            ],
        });

        return NextResponse.json({
            data: templates,
            total: templates.length,
            success: true,
        });
    } catch (error) {
        console.error('GET /api/templates error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch templates' },
            { status: 500 }
        );
    }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.name || !body.content) {
            return NextResponse.json(
                { success: false, message: 'Name and content are required' },
                { status: 400 }
            );
        }

        const template = await prisma.template.create({
            data: {
                name: body.name,
                description: body.description,
                category: body.category || 'general',
                content: body.content,
                emoji: body.emoji,
                tags: body.tags || [],
                isPublic: body.isPublic || false,
                userId: MOCK_USER_ID,
            },
        });

        return NextResponse.json({
            data: template,
            success: true,
            message: 'Template created successfully',
        });
    } catch (error) {
        console.error('POST /api/templates error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create template' },
            { status: 500 }
        );
    }
}

// PUT /api/templates - Update template
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.id) {
            return NextResponse.json(
                { success: false, message: 'Template ID is required' },
                { status: 400 }
            );
        }

        const template = await prisma.template.update({
            where: { id: body.id },
            data: {
                name: body.name,
                description: body.description,
                category: body.category,
                content: body.content,
                emoji: body.emoji,
                tags: body.tags,
                isPublic: body.isPublic,
            },
        });

        return NextResponse.json({
            data: template,
            success: true,
            message: 'Template updated successfully',
        });
    } catch (error) {
        console.error('PUT /api/templates error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update template' },
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
                { success: false, message: 'Template ID is required' },
                { status: 400 }
            );
        }

        await prisma.template.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: 'Template deleted',
        });
    } catch (error) {
        console.error('DELETE /api/templates error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete template' },
            { status: 500 }
        );
    }
}
