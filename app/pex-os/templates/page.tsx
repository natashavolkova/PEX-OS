'use client';

// ============================================================================
// PEX-OS - TEMPLATES PAGE
// ATHENA Architecture | Strategic Templates Module
// ============================================================================

import React, { useEffect } from 'react';
import { MainShell } from '@/components/shared/MainShell';
import { useProductivityStore } from '@/stores/productivityStore';

export default function TemplatesPage() {
  const { setActiveSection } = useProductivityStore((s) => s.actions);

  useEffect(() => {
    setActiveSection('templates');
  }, [setActiveSection]);

  return <MainShell />;
}
