'use client';

// ============================================================================
// PEX-OS - ANALYTICS PAGE
// ATHENA Architecture | Productivity Analytics Module
// ============================================================================

import React, { useEffect } from 'react';
import { MainShell } from '@/components/shared/MainShell';
import { useProductivityStore } from '@/stores/productivityStore';

export default function AnalyticsPage() {
  const { setActiveSection } = useProductivityStore((s) => s.actions);

  useEffect(() => {
    setActiveSection('analytics');
  }, [setActiveSection]);

  return <MainShell />;
}
