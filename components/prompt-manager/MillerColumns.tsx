'use client';

// ============================================================================
// PEX-OS PROMPT MANAGER - MILLER COLUMNS VIEW
// ATHENA Architecture | Four Column Navigation | Premium Dark Theme
// Refactored: Modular components for maintainability
// ============================================================================

import React, { useState } from 'react';
import { Folder, CornerDownRight, Sparkles } from 'lucide-react';
import { ContextMenu, useContextMenu } from './ContextMenu';
import { ColumnWrapper } from './miller/ColumnWrapper';
import { ColumnPreview } from './miller/ColumnPreview';
import { usePromptManagerStore } from '@/stores/promptManager';
import type { TreeNode, Folder as FolderType, Prompt } from '@/types/prompt-manager';

// --- MAIN MILLER COLUMNS VIEW ---

export const MillerColumns: React.FC = () => {
  const [previewPrompt, setPreviewPrompt] = useState<Prompt | null>(null);

  const data = usePromptManagerStore((s) => s.data);
  const selectedFolder = usePromptManagerStore((s) => s.selectedFolder);
  const selectedSubfolder = usePromptManagerStore((s) => s.selectedSubfolder);
  const isLocked = usePromptManagerStore((s) => s.isLocked);
  const dragState = usePromptManagerStore((s) => s.dragState);
  const justDroppedId = usePromptManagerStore((s) => s.justDroppedId);
  const {
    setSelectedFolder,
    setSelectedSubfolder,
    setSelectedPrompt,
    setPromptViewerOpen,
    setDragState,
    openEditModal,
    showToast,
    moveItem,
    getValidMoveTargets,
    setMoveSelector,
    findItem,
    isDescendant,
  } = usePromptManagerStore((s) => s.actions);

  const { contextMenu, openContextMenu, closeContextMenu } = useContextMenu();

  // --- Derived State ---

  const rootFolders = data.filter((item) => item.type === 'folder') as FolderType[];

  const subFolders = selectedFolder
    ? (selectedFolder.children || []).filter((i) => i.type === 'folder') as FolderType[]
    : [];

  const prompts = selectedSubfolder
    ? (selectedSubfolder.children || []).filter((i) => i.type === 'prompt') as Prompt[]
    : selectedFolder
      ? (selectedFolder.children || []).filter((i) => i.type === 'prompt') as Prompt[]
      : [];

  // --- Handlers ---

  const handleFolderSelect = (item: TreeNode) => {
    if (item.type === 'folder') {
      setSelectedFolder(item);
      setPreviewPrompt(null);
    }
  };

  const handleSubfolderSelect = (item: TreeNode) => {
    if (item.type === 'folder') {
      setSelectedSubfolder(item);
      setPreviewPrompt(null);
    }
  };

  const handlePromptSelect = (item: TreeNode) => {
    if (item.type === 'prompt') {
      setPreviewPrompt(item);
    }
  };

  const handlePromptOpen = () => {
    if (previewPrompt) {
      setSelectedPrompt(previewPrompt);
      setPromptViewerOpen(true);
    }
  };

  const handleEdit = (item: TreeNode) => {
    openEditModal(item, item.type === 'prompt');
  };

  const handleDelete = (item: TreeNode) => {
    if (isLocked) {
      showToast('Desbloqueie para excluir', 'warning');
      return;
    }
    showToast(`Excluir "${item.name}"?`, 'warning');
  };

  const handleNewFolder = () => {
    if (isLocked) {
      showToast('Desbloqueie para criar', 'warning');
      return;
    }
    showToast('Criar nova pasta...', 'info');
  };

  const handleNewSubfolder = () => {
    if (isLocked) {
      showToast('Desbloqueie para criar', 'warning');
      return;
    }
    if (!selectedFolder) {
      showToast('Selecione uma pasta primeiro', 'warning');
      return;
    }
    showToast('Criar subpasta...', 'info');
  };

  const handleNewPrompt = () => {
    if (isLocked) {
      showToast('Desbloqueie para criar', 'warning');
      return;
    }
    if (!selectedFolder && !selectedSubfolder) {
      showToast('Selecione uma pasta primeiro', 'warning');
      return;
    }
    showToast('Criar prompt...', 'info');
  };

  // --- Drag & Drop ---

  const handleDragStart = (e: React.DragEvent, item: TreeNode) => {
    if (isLocked) {
      e.preventDefault();
      showToast('Desbloqueie para arrastar', 'warning');
      return;
    }
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    setDragState({ draggedItemId: item.id, draggedItemType: item.type });
  };

  const handleItemDragOver = (e: React.DragEvent) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('ring-2', 'ring-[#2979ff]', 'scale-[1.02]');
  };

  const handleItemDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-[#2979ff]', 'scale-[1.02]');
  };

  const handleItemDrop = (e: React.DragEvent, targetItem: TreeNode) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('ring-2', 'ring-[#2979ff]', 'scale-[1.02]');

    const draggedId = dragState.draggedItemId;
    if (!draggedId || draggedId === targetItem.id) {
      setDragState({ draggedItemId: null, draggedItemType: null });
      return;
    }

    // Validate move
    const draggedItem = findItem(draggedId);
    if (draggedItem?.type === 'folder' && targetItem.type === 'folder') {
      if (isDescendant(draggedId, targetItem.id)) {
        showToast('Não é possível mover para dentro de si mesmo', 'error');
        setDragState({ draggedItemId: null, draggedItemType: null });
        return;
      }
    }

    if (targetItem.type === 'folder') {
      moveItem(draggedId, targetItem.id);
    } else {
      showToast('Solte sobre uma pasta', 'info');
    }

    setDragState({ draggedItemId: null, draggedItemType: null });
  };

  const handleColumnDragOver = (e: React.DragEvent) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleColumnDrop = (e: React.DragEvent, columnType: string) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();

    const draggedId = dragState.draggedItemId;
    if (!draggedId) return;

    const draggedItem = findItem(draggedId);
    if (!draggedItem) return;

    const isDropOnContainer = !(e.target as HTMLElement).closest('[data-item-id]');

    if (isDropOnContainer) {
      const validTargets = getValidMoveTargets(draggedId);
      setMoveSelector({
        open: true,
        draggedId,
        draggedType: draggedItem.type,
        availableTargets: validTargets,
      });
    }

    setDragState({ draggedItemId: null, draggedItemType: null });
  };

  return (
    <>
      <div className="flex h-full divide-x divide-white/5 overflow-x-auto">
        {/* Column 1: Root Folders */}
        <ColumnWrapper
          title="Pastas"
          icon={<Folder size={14} />}
          items={rootFolders}
          selectedId={selectedFolder?.id || null}
          onSelect={handleFolderSelect}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onContextMenu={openContextMenu}
          onNewItem={handleNewFolder}
          newItemLabel="Nova Pasta"
          emptyTitle="Sem pastas"
          emptyDescription="Crie sua primeira pasta"
          columnType="root"
          onDragOver={handleColumnDragOver}
          onDrop={(e) => handleColumnDrop(e, 'root')}
          isLocked={isLocked}
          draggedItemId={dragState.draggedItemId}
          justDroppedId={justDroppedId}
          onDragStart={handleDragStart}
          onItemDragOver={handleItemDragOver}
          onItemDragLeave={handleItemDragLeave}
          onItemDrop={handleItemDrop}
        />

        {/* Column 2: Subfolders */}
        <ColumnWrapper
          title="Subpastas"
          icon={<CornerDownRight size={14} />}
          items={subFolders}
          selectedId={selectedSubfolder?.id || null}
          onSelect={handleSubfolderSelect}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onContextMenu={openContextMenu}
          onNewItem={handleNewSubfolder}
          newItemLabel="Nova Subpasta"
          emptyTitle={selectedFolder ? 'Vazio' : 'Nenhuma pasta selecionada'}
          emptyDescription={selectedFolder ? 'Sem subpastas aqui' : 'Selecione uma pasta raiz'}
          columnType="subfolder"
          onDragOver={handleColumnDragOver}
          onDrop={(e) => handleColumnDrop(e, 'subfolder')}
          isLocked={isLocked}
          draggedItemId={dragState.draggedItemId}
          justDroppedId={justDroppedId}
          onDragStart={handleDragStart}
          onItemDragOver={handleItemDragOver}
          onItemDragLeave={handleItemDragLeave}
          onItemDrop={handleItemDrop}
        />

        {/* Column 3: Prompts */}
        <ColumnWrapper
          title="Prompts"
          icon={<Sparkles size={14} />}
          items={prompts}
          selectedId={previewPrompt?.id || null}
          onSelect={handlePromptSelect}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onContextMenu={openContextMenu}
          onNewItem={handleNewPrompt}
          newItemLabel="Novo Prompt"
          emptyTitle={selectedFolder ? 'Nenhum prompt' : 'Nenhuma pasta selecionada'}
          emptyDescription={selectedFolder ? 'Esta pasta está vazia' : 'Navegue pelas pastas'}
          columnType="prompt"
          onDragOver={handleColumnDragOver}
          onDrop={(e) => handleColumnDrop(e, 'prompt')}
          isLocked={isLocked}
          draggedItemId={dragState.draggedItemId}
          justDroppedId={justDroppedId}
          onDragStart={handleDragStart}
          onItemDragOver={handleItemDragOver}
          onItemDragLeave={handleItemDragLeave}
          onItemDrop={handleItemDrop}
        />

        {/* Column 4: Preview Panel */}
        <ColumnPreview
          prompt={previewPrompt}
          onEdit={() => previewPrompt && handleEdit(previewPrompt)}
          onOpenFull={handlePromptOpen}
          isLocked={isLocked}
        />
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

export default MillerColumns;
