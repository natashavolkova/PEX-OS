'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - MAIN LAYOUT
// Athena Architecture | Premium Olympian Theme | Global App Shell
// ============================================================================

import React, { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import '@/styles/animations.css';

import Sidebar from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/lib/auth';
import { DataSyncProvider } from '@/hooks/useDataSync';

export default function AthenaPexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  // F5 Protocol: On page refresh, always redirect to /analytics (Dashboard)
  useEffect(() => {
    if (!hasRedirected.current) {
      hasRedirected.current = true;

      // Check navigation type
      const navEntries = typeof window !== 'undefined'
        ? window.performance?.getEntriesByType('navigation') as PerformanceNavigationTiming[]
        : [];

      const navType = navEntries?.[0]?.type;
      const isRefresh = navType === 'reload';
      const isDirectEntry = navType === 'navigate';

      // Redirect to analytics on refresh or direct URL entry (except if already there)
      if ((isRefresh || isDirectEntry) && pathname !== '/pex-os/analytics') {
        console.log('[Layout] F5 Protocol: Redirecting to /analytics');
        router.replace('/pex-os/analytics');
      }
    }
  }, [router, pathname]);

  return (
    <AuthGuard>
      <DataSyncProvider>
        <div className="flex h-screen bg-athena-gradient overflow-hidden">
          {/* Global Sidebar - Athena Themed */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
            <Header />

            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </DataSyncProvider>
    </AuthGuard>
  );
}
