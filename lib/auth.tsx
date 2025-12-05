'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthState {
    userId: string;
    name: string;
    email: string;
    authenticated: boolean;
    timestamp: number;
}

export function useAuth() {
    const [auth, setAuth] = useState<AuthState | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check localStorage for auth
        const stored = localStorage.getItem('athena-auth');

        if (stored) {
            try {
                const parsed = JSON.parse(stored) as AuthState;
                // Check if session is still valid (24 hours)
                const isValid = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;

                if (isValid && parsed.authenticated) {
                    setAuth(parsed);
                } else {
                    localStorage.removeItem('athena-auth');
                    if (pathname?.startsWith('/pex-os')) {
                        router.push('/login');
                    }
                }
            } catch {
                localStorage.removeItem('athena-auth');
            }
        } else if (pathname?.startsWith('/pex-os')) {
            router.push('/login');
        }

        setLoading(false);
    }, [pathname, router]);

    const logout = () => {
        localStorage.removeItem('athena-auth');
        setAuth(null);
        router.push('/login');
    };

    return { auth, loading, logout, isAuthenticated: !!auth?.authenticated };
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { loading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !isAuthenticated && pathname?.startsWith('/pex-os')) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-athena-navy-deep flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-athena-gold/30 border-t-athena-gold rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
