'use client';

// ============================================================================
// PEX-OS - PROMPTS PAGE
// ATHENA Architecture | Prompt Manager Module
// ============================================================================

import React, { useEffect } from 'react';
import { MainShell } from '@/components/shared/MainShell';
import { useProductivityStore } from '@/stores/productivityStore';

export default function PromptsPage() {
  const { setActiveSection } = useProductivityStore((s) => s.actions);

  useEffect(() => {
    setActiveSection('prompts');
  }, [setActiveSection]);

  return <MainShell />;
}
