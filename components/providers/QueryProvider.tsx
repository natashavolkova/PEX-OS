'use client';

// ============================================================================
// REACT QUERY PROVIDER - CACHE CONFIGURATION
// ATHENA Architecture | Aggressive Caching for Neon Free Tier
// ============================================================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
    children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    // Create client with aggressive caching for Neon Free Tier
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Cache for 5 minutes by default
                        staleTime: 5 * 60 * 1000,
                        // Keep in cache for 30 minutes
                        gcTime: 30 * 60 * 1000,
                        // Retry failed requests 2 times
                        retry: 2,
                        // Don't refetch on window focus (saves DB calls)
                        refetchOnWindowFocus: false,
                        // Don't refetch on reconnect
                        refetchOnReconnect: false,
                    },
                    mutations: {
                        // Retry mutations once
                        retry: 1,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}

export default QueryProvider;
