'use client';

// ============================================================================
// PEX-OS - YOUTUBE PAGE
// ATHENA Architecture | YouTube References Module
// ============================================================================

import React, { useEffect } from 'react';
import { MainShell } from '@/components/shared/MainShell';
import { useProductivityStore } from '@/stores/productivityStore';

export default function YouTubePage() {
  const { setActiveSection } = useProductivityStore((s) => s.actions);

  useEffect(() => {
    setActiveSection('youtube');
  }, [setActiveSection]);

  return <MainShell />;
}
