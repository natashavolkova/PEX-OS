// ============================================================================
// TURSO DATABASE CLIENT - LIBSQL CONNECTION
// ATHENA Architecture | Serverless-Optimized | AWS US East (Virginia)
// ============================================================================

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

// Turso connection - optimized for Vercel Serverless
const tursoClient = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

// Drizzle ORM instance with schema
export const db = drizzle(tursoClient, { schema });

// Export client for direct queries if needed
export { tursoClient };

export default db;
