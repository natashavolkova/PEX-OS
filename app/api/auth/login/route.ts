// ============================================================================
// ATHENAPEX - AUTH LOGIN API
// Master Key validation and session creation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// Athena Master Key - Generated unique key
const ATHENA_MASTER_KEY = 'ATHENA-MASTER-2024-X9K7P2QM';

// Admin user data
const ATHENA_USER = {
    id: 'athena-admin-001',
    name: 'Athena',
    email: 'natashavolkova771@gmail.com',
    role: 'admin',
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { masterKey } = body;

        if (!masterKey) {
            return NextResponse.json(
                { success: false, message: 'Master Key is required' },
                { status: 400 }
            );
        }

        // Validate Master Key
        if (masterKey !== ATHENA_MASTER_KEY) {
            return NextResponse.json(
                { success: false, message: 'Invalid Master Key. Access denied.' },
                { status: 401 }
            );
        }

        // Success - return user data
        return NextResponse.json({
            success: true,
            message: 'Authentication successful',
            user: ATHENA_USER,
        });
    } catch (error) {
        console.error('Auth login error:', error);
        return NextResponse.json(
            { success: false, message: 'Authentication failed' },
            { status: 500 }
        );
    }
}
