'use client';

// ============================================================================
// PEX-OS PRODUCTIVITY MANAGER - MAIN LAYOUT
// ATHENA Architecture | Premium Dark Theme | Global App Shell
// ============================================================================

import React from 'react';
import '@/styles/animations.css';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function PexOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--pex-bg-dark)]">
      {/* Global Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-64 transition-all duration-300">
        <Header />

        <main className="flex-1 overflow-y-auto bg-[var(--pex-bg-dark)] p-6">
          <div className="mx-auto max-w-7xl animate-slide-up-fade">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
