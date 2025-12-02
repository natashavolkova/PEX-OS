'use client';

// ============================================================================
// PEX-OS - PROJECTS PAGE
// ATHENA Architecture | Projects Hub Module
// ============================================================================

import React, { useEffect } from 'react';
import { MainShell } from '@/components/shared/MainShell';
import { useProductivityStore } from '@/stores/productivityStore';

export default function ProjectsPage() {
  const { setActiveSection } = useProductivityStore((s) => s.actions);

  useEffect(() => {
    setActiveSection('projects');
  }, [setActiveSection]);

  return <MainShell />;
}
