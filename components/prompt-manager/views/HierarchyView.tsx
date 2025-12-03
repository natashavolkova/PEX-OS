'use client';

// ============================================================================
// AthenaPeX PROMPT MANAGER - HIERARCHY VIEW
// ATHENA Architecture | Mindmap/Tree View | Premium Dark Theme
// Refactored: Modular components for better maintainability
// ============================================================================

import React, { useState, useCallback } from 'react';
import {
  Network,
  Maximize2,
  Minimize2,
  Plus,
  Folder,
} from 'lucide-react';
import { Tooltip } from '../TooltipWrapper';
import { ContextMenu, useContextMenu } from '../ContextMenu';
import { SearchBar } from './hierarchy/SearchBar';
import { TreeNodeItem } from './hierarchy/TreeNodeItem';
import { usePromptManagerStore } from '@/stores/promptManager';
import type { TreeNode, Folder as FolderType, Prompt } from '@/types/prompt-manager';

// --- MAIN HIERARCHY VIEW ---

export const HierarchyView: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['f1', 'f1-1']));

  const data = usePromptManagerStore((s) => s.data);
  const selectedPrompt = usePromptManagerStore((s) => s.selectedPrompt);
  const isLocked = usePromptManagerStore((s) => s.isLocked);
  const {
    setSelectedPrompt,
    setPromptViewerOpen,
    openEditModal,
    showToast,
  } = usePromptManagerStore((s) => s.actions);

  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelect = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setPromptViewerOpen(true);
  };

  const handleEdit = (node: TreeNode) => {
    openEditModal(node, node.type === 'prompt');
  };

  const handleDelete = (node: TreeNode) => {
    if (isLocked) {
      showToast('Desbloqueie para excluir', 'warning');
      return;
    }
    showToast(`Excluir "${node.name}"?`, 'warning');
  };

  const handleExpandAll = () => {
    const allIds = new Set<string>();
    const traverse = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.type === 'folder') {
          allIds.add(node.id);
          if ((node as FolderType).children) {
            traverse((node as FolderType).children);
          }
        }
      }
    };
    traverse(data);
    setExpandedIds(allIds);
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  // Count total items
  const countItems = (nodes: TreeNode[]): { folders: number; prompts: number } => {
    let folders = 0;
    let prompts = 0;
    for (const node of nodes) {
      if (node.type === 'folder') {
        folders++;
        if ((node as FolderType).children) {
          const childCounts = countItems((node as FolderType).children);
          folders += childCounts.folders;
          prompts += childCounts.prompts;
        }
      } else {
        prompts++;
      }
    }
    return { folders, prompts };
  };

  const { folders: totalFolders, prompts: totalPrompts } = countItems(data);

  return (
    <>
      <div
        className={`
          flex flex-col overflow-hidden transition-all duration-300
          ${isFullscreen ? 'fixed inset-0 z-50 bg-[#0f111a]' : 'h-full'}
        `}
      >
        {/* Header */}
        <div className="p-6 pb-4 shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Network size={24} className="text-[#2979ff]" />
                Estrutura Hierárquica
              </h2>
              <div className="flex items-center gap-2">
                <Tooltip content="Expandir Todos" position="bottom">
                  <button
                    onClick={handleExpandAll}
                    className="p-2 bg-[#1e2330] hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </Tooltip>
                <Tooltip content="Recolher Todos" position="bottom">
                  <button
                    onClick={handleCollapseAll}
                    className="p-2 bg-[#1e2330] hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <Minimize2 size={16} />
                  </button>
                </Tooltip>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <Tooltip content={isFullscreen ? 'Sair Tela Cheia' : 'Tela Cheia'} position="bottom">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 bg-[#1e2330] hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                </Tooltip>
              </div>
            </div>

            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalFolders={totalFolders}
              totalPrompts={totalPrompts}
            />
          </div>
        </div>

        {/* Tree Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#1e2330] rounded-xl border border-white/10 p-6 shadow-2xl min-h-[400px]">
              {data.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Folder size={32} className="opacity-40" />
                  </div>
                  <p className="text-sm font-bold text-gray-300">Nenhum conteúdo</p>
                  <p className="text-xs mt-1 text-gray-500">Comece criando uma pasta</p>
                </div>
              ) : (
                data.map((node) => (
                  <TreeNodeItem
                    key={node.id}
                    node={node}
                    onSelect={handleSelect}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onContextMenu={openContextMenu}
                    isLocked={isLocked}
                    selectedPromptId={selectedPrompt?.id}
                    searchQuery={searchQuery}
                    expandedIds={expandedIds}
                    onToggleExpand={handleToggleExpand}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          onClose={closeContextMenu}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default HierarchyView;
