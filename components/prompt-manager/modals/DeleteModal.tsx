'use client';

// ============================================================================
// AthenaPeX PROMPT MANAGER - DELETE MODAL
// ATHENA Architecture | Context-Aware Batch Delete | Premium Dark Theme
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Trash2,
  Folder,
  FileText,
  AlertTriangle,
  CheckSquare,
  Square,
} from 'lucide-react';
import { Overlay, ModalAnimation } from '../MotionWrappers';
import { usePromptManagerStore } from '@/stores/promptManager';
import type { TreeNode, Folder as FolderType, Prompt } from '@/types/prompt-manager';

// --- DELETE MODAL PROPS ---

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- ITEM ROW COMPONENT ---

interface ItemRowProps {
  item: TreeNode;
  isSelected: boolean;
  onToggle: () => void;
  childCount?: number;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, isSelected, onToggle, childCount }) => {
  const isFolder = item.type === 'folder';

  return (
    <div
      onClick={onToggle}
      className={`
        flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
        ${isSelected
          ? 'bg-red-500/10 border border-red-500/30'
          : 'bg-white/[0.02] border border-transparent hover:bg-white/5 hover:border-white/10'}
      `}
    >
      {/* Checkbox */}
      <div className="shrink-0">
        {isSelected ? (
          <CheckSquare size={18} className="text-red-400" />
        ) : (
          <Square size={18} className="text-gray-500" />
        )}
      </div>

      {/* Icon */}
      <div className={`
        w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0
        ${isFolder
          ? 'bg-blue-500/10 text-blue-400'
          : 'bg-emerald-500/10 text-emerald-400'}
      `}>
        {item.emoji || (isFolder ? '📁' : '📄')}
      </div>

      {/* Name & Meta */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-medium text-sm truncate ${isSelected ? 'text-red-300' : 'text-gray-200'}`}>
            {item.name}
          </span>
          <span className={`
            px-1.5 py-0.5 rounded text-[9px] font-bold uppercase
            ${isFolder
              ? 'bg-blue-500/15 text-blue-400'
              : 'bg-emerald-500/15 text-emerald-400'}
          `}>
            {isFolder ? 'Pasta' : 'Prompt'}
          </span>
        </div>
        {isFolder && childCount !== undefined && childCount > 0 && (
          <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1">
            <AlertTriangle size={10} className="text-yellow-500/60" />
            Contém {childCount} {childCount === 1 ? 'item' : 'itens'} que também serão excluídos
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN DELETE MODAL ---

export const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isConfirmStep, setIsConfirmStep] = useState(false);

  const data = usePromptManagerStore((s) => s.data);
  const sequentialPath = usePromptManagerStore((s) => s.sequentialPath);
  const { getCurrentSequentialNodes, deleteItem, showToast } = usePromptManagerStore((s) => s.actions);

  // Get current level items - recalculate when data or path changes
  const currentView = useMemo(() => {
    return getCurrentSequentialNodes();
  }, [data, sequentialPath]);

  const { nodes, title } = currentView;

  // Separate folders and prompts
  const folders = useMemo(() => nodes.filter((n): n is FolderType => n.type === 'folder'), [nodes]);
  const prompts = useMemo(() => nodes.filter((n): n is Prompt => n.type === 'prompt'), [nodes]);

  // Get child count for folders
  const getChildCount = (folder: FolderType): number => {
    return folder.children?.length || 0;
  };

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setSelectedIds(new Set());
      setIsConfirmStep(false);
    }
  }, [isOpen]);

  // Keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isConfirmStep) {
          setIsConfirmStep(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isConfirmStep]);

  if (!isOpen) return null;

  const totalItems = nodes.length;
  const selectedCount = selectedIds.size;

  // Toggle single item
  const toggleItem = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // Select/Deselect all
  const toggleAll = () => {
    if (selectedIds.size === totalItems) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(nodes.map((n) => n.id)));
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedIds.size === 0) return;

    // Delete each selected item
    const idsToDelete = Array.from(selectedIds);
    idsToDelete.forEach((id) => {
      deleteItem(id);
    });

    showToast(`${idsToDelete.length} ${idsToDelete.length === 1 ? 'item excluído' : 'itens excluídos'}!`, 'success');
    onClose();
  };

  // Proceed to confirm
  const handleProceed = () => {
    if (selectedIds.size === 0) {
      showToast('Selecione ao menos um item', 'warning');
      return;
    }
    setIsConfirmStep(true);
  };

  return (
    <Overlay onClick={onClose}>
      <ModalAnimation>
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#1e2330] rounded-xl border border-white/10 shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 size={18} className="text-red-400" />
              {isConfirmStep ? 'Confirmar Exclusão' : 'Gerenciar Exclusões'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          {!isConfirmStep ? (
            <>
              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="text-xs text-gray-400">
                  <span className="text-white font-medium">{title}</span>
                  <span className="mx-2">•</span>
                  {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                </div>
                {totalItems > 0 && (
                  <button
                    onClick={toggleAll}
                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/5 transition-all"
                  >
                    {selectedIds.size === totalItems ? (
                      <>
                        <CheckSquare size={12} /> Desmarcar
                      </>
                    ) : (
                      <>
                        <Square size={12} /> Selecionar Todos
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {totalItems === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Folder size={40} className="opacity-30 mb-3" />
                    <p className="text-sm">Nenhum item neste nível</p>
                    <p className="text-xs text-gray-600 mt-1">Navegue para uma pasta com conteúdo</p>
                  </div>
                ) : (
                  <>
                    {/* Folders Section */}
                    {folders.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2 px-1">
                          <Folder size={12} className="text-blue-400" />
                          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                            Pastas ({folders.length})
                          </span>
                        </div>
                        <div className="space-y-2">
                          {folders.map((folder) => (
                            <ItemRow
                              key={folder.id}
                              item={folder}
                              isSelected={selectedIds.has(folder.id)}
                              onToggle={() => toggleItem(folder.id)}
                              childCount={getChildCount(folder)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Prompts Section */}
                    {prompts.length > 0 && (
                      <div>
                        {folders.length > 0 && (
                          <div className="flex items-center gap-2 mb-2 px-1">
                            <FileText size={12} className="text-emerald-400" />
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                              Prompts ({prompts.length})
                            </span>
                          </div>
                        )}
                        <div className="space-y-2">
                          {prompts.map((prompt) => (
                            <ItemRow
                              key={prompt.id}
                              item={prompt}
                              isSelected={selectedIds.has(prompt.id)}
                              onToggle={() => toggleItem(prompt.id)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-4 border-t border-white/5 shrink-0 bg-[#1e2330]">
                <div className="text-xs text-gray-400">
                  {selectedCount > 0 ? (
                    <span className="text-red-400 font-medium">{selectedCount} selecionado{selectedCount > 1 ? 's' : ''}</span>
                  ) : (
                    'Nenhum item selecionado'
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium rounded-lg text-gray-300 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleProceed}
                    disabled={selectedCount === 0}
                    className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Excluir ({selectedCount})
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Confirmation Step */
            <>
              <div className="p-6 flex-1">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle size={32} className="text-red-400" />
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white text-center mb-2">
                  Tem certeza?
                </h4>
                <p className="text-sm text-gray-400 text-center mb-6">
                  Você está prestes a excluir <span className="text-red-400 font-bold">{selectedCount}</span> {selectedCount === 1 ? 'item' : 'itens'}.
                  Esta ação não pode ser desfeita.
                </p>

                {/* Selected items preview */}
                <div className="bg-[#0f111a] rounded-lg border border-white/5 p-3 max-h-40 overflow-y-auto custom-scrollbar">
                  <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">Itens a excluir:</div>
                  <div className="space-y-1">
                    {nodes.filter((n) => selectedIds.has(n.id)).map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-xs">
                        <span className="text-base">{item.emoji || (item.type === 'folder' ? '📁' : '📄')}</span>
                        <span className="text-gray-300 truncate">{item.name}</span>
                        <span className={`
                          px-1 py-0.5 rounded text-[8px] font-bold uppercase
                          ${item.type === 'folder' ? 'bg-blue-500/15 text-blue-400' : 'bg-emerald-500/15 text-emerald-400'}
                        `}>
                          {item.type === 'folder' ? 'Pasta' : 'Prompt'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 px-5 py-4 border-t border-white/5 shrink-0">
                <button
                  onClick={() => setIsConfirmStep(false)}
                  className="flex-1 px-4 py-2.5 text-xs font-medium rounded-lg text-gray-300 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-5 py-2.5 text-xs font-bold rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Confirmar Exclusão
                </button>
              </div>
            </>
          )}
        </div>
      </ModalAnimation>
    </Overlay>
  );
};

// --- DELETE MODAL HOOK ---

export const useDeleteModal = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openDeleteModal = () => {
    setIsOpen(true);
  };

  const closeDeleteModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openDeleteModal,
    closeDeleteModal,
  };
};

export default DeleteModal;
