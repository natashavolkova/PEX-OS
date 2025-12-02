'use client';

// ============================================================================
// PEX-OS - DASHBOARD PAGE
// ATHENA Architecture | Main Dashboard
// ============================================================================

import React, { useEffect } from 'react';
import { MainShell } from '@/components/shared/MainShell';
import { useProductivityStore } from '@/stores/productivityStore';

export default function DashboardPage() {
  const { setActiveSection } = useProductivityStore((s) => s.actions);

  useEffect(() => {
    setActiveSection('analytics');
  }, [setActiveSection]);

  return <MainShell />;
}
