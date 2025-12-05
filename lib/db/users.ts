// ============================================================================
// ATHENAPEX - USER DATA ACCESS
// User management and authentication helpers
// ============================================================================

import prisma from '@/lib/prisma';

// Admin user ID (Athena)
const ADMIN_USER_ID = 'athena-admin-001';

// --- GET CURRENT USER ---
// For now, returns the admin user (Athena)
// TODO: Integrate with real auth (Stack, NextAuth, etc.)
export async function getCurrentUser() {
    // Check if admin user exists, if not create it
    let user = await prisma.user.findUnique({
        where: { id: ADMIN_USER_ID },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                id: ADMIN_USER_ID,
                email: 'natashavolkova771@gmail.com',
                name: 'Athena',
            },
        });
    }

    return user;
}

// --- GET USER ID ---
// Convenience function to get just the ID
export async function getCurrentUserId(): Promise<string> {
    const user = await getCurrentUser();
    return user.id;
}

// --- GET USER BY ID ---
export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: { id },
    });
}

// --- GET USER BY EMAIL ---
export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}

// --- CREATE USER ---
export async function createUser(data: {
    id: string;
    email: string;
    name?: string;
}) {
    return prisma.user.create({ data });
}

// --- UPDATE USER ---
export async function updateUser(id: string, data: { name?: string; email?: string }) {
    return prisma.user.update({
        where: { id },
        data,
    });
}

// Export admin ID for reference
export { ADMIN_USER_ID };
