'use client';

// ============================================================================
// PEX-OS - NEOVIM PAGE
// ATHENA Architecture | Neovim Configuration Module
// ============================================================================

import React, { useEffect } from 'react';
import { MainShell } from '@/components/shared/MainShell';
import { useProductivityStore } from '@/stores/productivityStore';

export default function NeovimPage() {
  const { setActiveSection } = useProductivityStore((s) => s.actions);

  useEffect(() => {
    setActiveSection('neovim');
  }, [setActiveSection]);

  return <MainShell />;
}
