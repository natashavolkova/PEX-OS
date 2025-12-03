<<<<<<< HEAD
=======
'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - MAIN LAYOUT
// Athena Architecture | Premium Olympian Theme | Global App Shell
// ============================================================================

>>>>>>> fd5f221ce7e254cc7edfd92821cee2c739f40424
import React from 'react';
import '@/styles/animations.css';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function AthenaPexLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-athena-gradient">
      {/* Global Sidebar - Athena Themed */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-64 transition-all duration-300">
        <Header />

<<<<<<< HEAD
        <main className="flex-1 overflow-y-auto bg-athena-navy-deep p-6">
          <div className="mx-auto max-w-7xl animate-slide-up-fade h-full">
=======
        <main className="flex-1 overflow-y-auto bg-athena-gradient p-6">
          <div className="mx-auto max-w-7xl animate-slide-up-fade">
>>>>>>> fd5f221ce7e254cc7edfd92821cee2c739f40424
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
