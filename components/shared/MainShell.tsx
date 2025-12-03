'use client';

// ============================================================================
// PEX-OS PRODUCTIVITY MANAGER - MAIN SHELL
// ATHENA Architecture | Global App Shell with Routing
// ============================================================================

import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useProductivityStore } from '@/stores/productivityStore';
import { PromptManager } from '@/components/prompt-manager/PromptManager';
import { ProjectsHub } from '@/components/projects/ProjectsHub';
import { TaskManager } from '@/components/tasks/TaskManager';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { BattlePlanView } from '@/components/battle-plan/BattlePlanView';
import { YouTubeManager } from '@/components/youtube/YouTubeManager';
import { TemplatesLibrary } from '@/components/templates/TemplatesLibrary';
import { NeovimConfig } from '@/components/neovim/NeovimConfig';

// --- MODULE COMPONENTS MAP ---

const moduleComponents: Record<string, React.ComponentType> = {
  projects: ProjectsHub,
  tasks: TaskManager,
  prompts: PromptManager,
  analytics: AnalyticsDashboard,
  'battle-plan': BattlePlanView,
  youtube: YouTubeManager,
  templates: TemplatesLibrary,
  neovim: NeovimConfig,
};

// --- MAIN SHELL COMPONENT ---

export const MainShell: React.FC = () => {
  const activeSection = useProductivityStore((s) => s.activeSection);

  // Get the active module component
  const ActiveModule = moduleComponents[activeSection] || ProjectsHub;

  return (
    <div className="h-screen flex bg-pex-dark overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - Only show for modules that need it */}
        {activeSection !== 'prompts' && <TopBar />}

        {/* Module Content */}
        <main className="flex-1 overflow-hidden">
          <ActiveModule />
        </main>
      </div>
    </div>
  );
};

export default MainShell;
