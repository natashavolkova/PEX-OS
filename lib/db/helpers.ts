// ============================================================================
// DATABASE HELPERS - ID GENERATION & TYPE CONVERSION
// ATHENA Architecture | SQLite/Turso Compatible
// ============================================================================

/**
 * Generate a unique ID (cuid-like)
 */
export function generateId(): string {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `${timestamp}${randomPart}`;
}

/**
 * Get current timestamp as ISO string
 */
export function nowISO(): string {
    return new Date().toISOString();
}

/**
 * Parse JSON from TEXT field safely
 */
export function parseJsonField<T>(value: string | null, defaultValue: T): T {
    if (!value) return defaultValue;
    try {
        return JSON.parse(value) as T;
    } catch {
        return defaultValue;
    }
}

/**
 * Stringify for JSON TEXT field
 */
export function stringifyJsonField(value: unknown): string {
    return JSON.stringify(value ?? []);
}

// Athena admin user ID - constant across system
export const ATHENA_USER_ID = 'athena-supreme-user-001';
export const ATHENA_EMAIL = 'athena@pex-os.ai';
export const ATHENA_NAME = 'Athena';
