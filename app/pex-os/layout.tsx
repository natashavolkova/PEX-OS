'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - MAIN LAYOUT
// Athena Architecture | Premium Olympian Theme | Global App Shell
// ============================================================================

import React from 'react';
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
  // NOTE: F5 redirect temporarily disabled for debugging
  // Will be re-enabled after import issues are fixed

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
