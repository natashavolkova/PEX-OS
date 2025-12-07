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

  // F5 Redirect: On initial mount (page refresh), always redirect to /analytics
  useEffect(() => {
    // Only redirect on first mount, not on client-side navigation
    if (!hasRedirected.current) {
      hasRedirected.current = true;

      // Check if this is a fresh page load (not client navigation)
      // by checking if navigation type is 'reload' or direct entry
      const isPageRefresh = typeof window !== 'undefined' && (
        window.performance?.getEntriesByType('navigation')?.[0] as PerformanceNavigationTiming
      )?.type === 'reload';

      const isDirectEntry = typeof window !== 'undefined' && (
        window.performance?.getEntriesByType('navigation')?.[0] as PerformanceNavigationTiming
      )?.type === 'navigate';

      // Redirect to analytics on refresh or direct URL entry (except if already on analytics)
      if ((isPageRefresh || isDirectEntry) && pathname !== '/pex-os/analytics') {
        console.log('[Layout] Redirecting to /analytics on page load...');
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
