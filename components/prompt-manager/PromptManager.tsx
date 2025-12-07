'use client';

// ============================================================================
// AthenaPeX PROMPT MANAGER - MAIN COMPONENT
// ATHENA Architecture | Integrates All Modules | Premium Dark Theme
// ============================================================================

import React, { useEffect, useState } from 'react';
import { ActionsToolbar, FloatingActionButton } from './ActionsToolbar';
import { SequentialView } from './SequentialView';
import { MillerColumns } from './MillerColumns';
import { HierarchyView } from './views/HierarchyView';
import { SharedView } from './SharedView';
import { ModalEdit } from './modals/ModalEdit';
import { PromptViewer } from './modals/PromptViewer';
import { SettingsModal } from './modals/SettingsModal';
import { NotificationsModal } from './modals/NotificationsModal';
import { MasterKeyModal } from './modals/MasterKeyModal';
import { MoveSelectorModal } from './modals/MoveSelectorModal';
import { CreateModal, useCreateModal } from './modals/CreateModal';
import { DeleteModal } from './modals/DeleteModal';
import { Toast } from './Toast';
import { TagBar } from './TagBar';
import { usePromptManagerStore } from '@/stores/promptManager';
import { Tooltip } from './TooltipWrapper';
import { Lock, Unlock, List, Columns, Network, Users } from 'lucide-react';

// Import animations CSS
import '@/styles/animations.css';

// --- GLOBAL STYLES ---

const globalStyles = `
  /* Custom Scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: #3e4559; }
  .custom-scrollbar::-webkit-scrollbar { width: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 2px; }

  /* Selection */
  ::selection { background: rgba(212, 175, 55, 0.3); color: #F5F5F5; }
`;

// --- VIEW LABELS ---

const VIEW_LABELS: Record<string, string> = {
  sequential: 'Navegação Sequencial',
  miller: 'Miller Columns',
  mindmap: 'Estrutura Hierárquica',
  shared: 'Compartilhados',
};

// --- MAIN PROMPT MANAGER COMPONENT ---

export const PromptManager: React.FC = () => {
  const activeView = usePromptManagerStore((s) => s.activeView);
  const slideDirection = usePromptManagerStore((s) => s.slideDirection);
  const toast = usePromptManagerStore((s) => s.toast);
  const isLocked = usePromptManagerStore((s) => s.isLocked);
  const selectedFolder = usePromptManagerStore((s) => s.selectedFolder);
  const createModal = usePromptManagerStore((s) => s.createModal);
  const { setSearchQuery, setIsLocked, showToast, setActiveView, openCreateModal, closeCreateModal } =
    usePromptManagerStore((s) => s.actions);

  // Delete Modal State - from store
  const isDeleteModalOpen = usePromptManagerStore((s) => s.isDeleteModalOpen);
  const { setDeleteModalOpen } = usePromptManagerStore((s) => s.actions);

  // Tag Filter State
  const [filteredTags, setFilteredTags] = useState<string[]>([]);

  // --- Keyboard Shortcuts ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modal is open or focus is in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl+F: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          showToast('Busca rápida ativada', 'info');
        }
      }

      // Ctrl+L: Toggle lock
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        setIsLocked(!isLocked);
      }

      // Ctrl+1/2/3: Switch views
      if ((e.ctrlKey || e.metaKey) && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault();
        const views: Record<string, 'sequential' | 'miller' | 'mindmap'> = {
          '1': 'sequential',
          '2': 'miller',
          '3': 'mindmap',
        };
        setActiveView(views[e.key]);
        showToast(`Vista: ${VIEW_LABELS[views[e.key]]}`, 'info');
      }

      // Ctrl+N: New folder (always allowed - locked only prevents drag & drop)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        openCreateModal('folder', selectedFolder?.id || null);
      }

      // Ctrl+P: New prompt (always allowed - locked only prevents drag & drop)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p' && !e.shiftKey) {
        e.preventDefault();
        openCreateModal('prompt', selectedFolder?.id || null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSearchQuery, setIsLocked, showToast, setActiveView, isLocked, selectedFolder, openCreateModal]);

  // --- Clear slide direction after animation ---
  useEffect(() => {
    if (slideDirection !== 'none') {
      const timer = setTimeout(() => {
        usePromptManagerStore.setState({ slideDirection: 'none' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [slideDirection]);

  // --- Handle tag filter change ---
  const handleTagFilterChange = (tags: string[]) => {
    setFilteredTags(tags);
    if (tags.length > 0) {
      showToast(`Filtrando por ${tags.length} tag(s)`, 'info');
    }
  };

  // --- Render Current View ---
  const renderView = () => {
    switch (activeView) {
      case 'sequential':
        return <SequentialView />;
      case 'miller':
        return <MillerColumns />;
      case 'mindmap':
        return <HierarchyView />;
      case 'shared':
        return <SharedView />;
      default:
        return <SequentialView />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-athena-navy-deep text-athena-platinum font-sans overflow-hidden antialiased">
      {/* Inject Global Styles */}
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

      {/* Secondary Toolbar - Now includes View Switcher and Lock */}
      <div className="h-12 bg-athena-navy border-b border-athena-gold/20 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          {/* View Switcher */}
          <div className="flex items-center gap-1 bg-athena-navy-deep/50 p-1 rounded-lg border border-athena-gold/10">
            <Tooltip content="Sequencial (Ctrl+1)" position="bottom">
              <button
                onClick={() => setActiveView('sequential')}
                className={`p-1.5 rounded transition-all ${activeView === 'sequential' ? 'bg-athena-gold text-athena-navy-deep shadow-lg' : 'text-athena-silver hover:text-athena-platinum hover:bg-athena-navy-light'}`}
              >
                <List size={14} />
              </button>
            </Tooltip>
            <Tooltip content="Colunas (Ctrl+2)" position="bottom">
              <button
                onClick={() => setActiveView('miller')}
                className={`p-1.5 rounded transition-all ${activeView === 'miller' ? 'bg-athena-gold text-athena-navy-deep shadow-lg' : 'text-athena-silver hover:text-athena-platinum hover:bg-athena-navy-light'}`}
              >
                <Columns size={14} />
              </button>
            </Tooltip>
            <Tooltip content="Hierarquia (Ctrl+3)" position="bottom">
              <button
                onClick={() => setActiveView('mindmap')}
                className={`p-1.5 rounded transition-all ${activeView === 'mindmap' ? 'bg-athena-gold text-athena-navy-deep shadow-lg' : 'text-athena-silver hover:text-athena-platinum hover:bg-athena-navy-light'}`}
              >
                <Network size={14} />
              </button>
            </Tooltip>
            <div className="w-px h-4 bg-athena-gold/10 mx-1" />
            <Tooltip content="Compartilhados" position="bottom">
              <button
                onClick={() => setActiveView('shared')}
                className={`p-1.5 rounded transition-all ${activeView === 'shared' ? 'bg-athena-info text-white shadow-lg' : 'text-athena-silver hover:text-athena-platinum hover:bg-athena-navy-light'}`}
              >
                <Users size={14} />
              </button>
            </Tooltip>
          </div>

          <div className="w-px h-4 bg-athena-gold/10" />

          {/* Lock Toggle */}
          <Tooltip content={isLocked ? 'Desbloquear Edição (Ctrl+L)' : 'Bloquear Edição (Ctrl+L)'} position="bottom">
            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${isLocked
                ? 'text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20'
                : 'text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20'
                }`}
            >
              {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
              <span>{isLocked ? 'Locked' : 'Editable'}</span>
            </button>
          </Tooltip>

          {/* Tag Filter - Show for non-shared views */}
          {activeView !== 'shared' && (
            <>
              <div className="w-px h-4 bg-athena-gold/10" />
              <TagBar
                variant="compact"
                maxVisible={5}
                onFilterChange={handleTagFilterChange}
              />
            </>
          )}
        </div>
        <ActionsToolbar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 bg-athena-navy-deep overflow-hidden relative">
        <div key={activeView} className="w-full h-full animate-in fade-in duration-300">
          {renderView()}
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Modals */}
      <ModalEdit />
      <PromptViewer />
      <SettingsModal />
      <NotificationsModal />
      <MasterKeyModal />
      <MoveSelectorModal />

      {/* Create Modal */}
      <CreateModal
        isOpen={createModal.isOpen}
        onClose={closeCreateModal}
        type={createModal.type}
        parentId={createModal.parentId}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default PromptManager;
