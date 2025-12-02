'use client';

// ============================================================================
// PEX-OS PRODUCTIVITY MANAGER - MAIN PAGE
// ATHENA Architecture | Premium Dark Theme | Comprehensive Dashboard
// ============================================================================

import React from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { TopBar } from '@/components/shared/TopBar';
import { ProjectsHub } from '@/components/projects/ProjectsHub';
import { TaskManager } from '@/components/tasks/TaskManager';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { BattlePlanView } from '@/components/battle-plan/BattlePlanView';
import { YouTubeManager } from '@/components/youtube/YouTubeManager';
import { TemplatesLibrary } from '@/components/templates/TemplatesLibrary';
import { PromptManager } from '@/components/prompt-manager/PromptManager';
import { useProductivityStore } from '@/stores/productivityStore';

// --- PLACEHOLDER COMPONENTS ---

const NeovimConfig: React.FC = () => (
  <div className="h-full flex items-center justify-center bg-[#0f111a]">
    <div className="text-center">
      <span className="text-6xl mb-4 block">⚙️</span>
      <h2 className="text-2xl font-bold text-white mb-2">Neovim Configuration</h2>
      <p className="text-gray-400 text-sm">Generate complete Neovim setups with LazyVim, LSP configs, and ENTJ macros</p>
    </div>
  </div>
);

const AgentView: React.FC = () => {
  const agentStatus = useProductivityStore((s) => s.agentStatus);
  
  return (
    <div className="h-full flex items-center justify-center bg-[#0f111a]">
      <div className="text-center max-w-md">
        <span className="text-6xl mb-4 block">🤖</span>
        <h2 className="text-2xl font-bold text-white mb-2">Fara-7B Agent Integration</h2>
        <p className="text-gray-400 text-sm mb-6">
          Connect your local AI agent for automated task delegation, file generation, and code refactoring
        </p>
        
        <div className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full border
          ${agentStatus.connected 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : 'bg-gray-500/10 border-gray-500/30 text-gray-400'
          }
        `}>
          <div className={`w-2 h-2 rounded-full ${agentStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
          {agentStatus.connected ? 'Agent Connected' : 'Agent Offline'}
        </div>
        
        {!agentStatus.connected && (
          <div className="mt-6 p-4 bg-[#1e2330] border border-white/5 rounded-lg text-left">
            <h3 className="text-xs font-bold text-white mb-2">Connection Setup</h3>
            <code className="text-[10px] text-gray-400 font-mono block">
              Endpoint: ws://localhost:8765
            </code>
            <p className="text-[10px] text-gray-500 mt-2">
              Start your local Fara-7B agent via Magentic-UI to enable automation features.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function PexOSPage() {
  const activeSection = useProductivityStore((s) => s.activeSection);

  const renderSection = () => {
    switch (activeSection) {
      case 'projects':
        return <ProjectsHub />;
      case 'tasks':
        return <TaskManager />;
      case 'prompts':
        return <PromptManager />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'battle-plan':
        return <BattlePlanView />;
      case 'youtube':
        return <YouTubeManager />;
      case 'templates':
        return <TemplatesLibrary />;
      case 'neovim':
        return <NeovimConfig />;
      case 'agent':
        return <AgentView />;
      default:
        return <ProjectsHub />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
