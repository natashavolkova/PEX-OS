'use client';

// ============================================================================
// PEX-OS PRODUCTIVITY MANAGER - MAIN LAYOUT
// ATHENA Architecture | Premium Dark Theme | Global App Shell
// ============================================================================

import React from 'react';
import '@/styles/animations.css';

export default function PexOSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f111a] text-gray-300 font-sans antialiased">
      {children}
    </div>
  );
}
