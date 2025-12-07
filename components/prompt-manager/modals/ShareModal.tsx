'use client';

// ============================================================================
// AthenaPeX PROMPT MANAGER - SHARE MODAL
// ATHENA Architecture | Context-Aware Sharing | Premium Dark Theme
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
    X,
    Share2,
    Folder,
    FileText,
    CheckSquare,
    Square,
    Link as LinkIcon,
    Copy,
    Users,
    Eye,
    Edit3,
} from 'lucide-react';
import { OptimizedModal } from './OptimizedModal';
import { usePromptManagerStore } from '@/stores/promptManager';
import type { TreeNode, Folder as FolderType, Prompt } from '@/types/prompt-manager';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [permission, setPermission] = useState<'view' | 'edit'>('view');

    const { getCurrentSequentialNodes, showToast } = usePromptManagerStore((s) => s.actions);

    // Get current level items
    const currentView = useMemo(() => {
        return getCurrentSequentialNodes();
    }, []);

    const { nodes, title } = currentView;

    // Separate folders and prompts
    const folders = useMemo(() => nodes.filter((n): n is FolderType => n.type === 'folder'), [nodes]);
    const prompts = useMemo(() => nodes.filter((n): n is Prompt => n.type === 'prompt'), [nodes]);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setSelectedIds(new Set());
            setPermission('view');
        }
    }, [isOpen]);

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

    // Handle Share
    const handleShare = () => {
        if (selectedIds.size === 0) {
            showToast('Selecione ao menos um item', 'warning');
            return;
        }

        // Generate share link (mock for now)
        const shareLink = `${window.location.origin}/share/${Array.from(selectedIds).join(',')}?p=${permission}`;
        navigator.clipboard.writeText(shareLink);

        showToast(
            `Link de compartilhamento copiado! (${selectedCount} ${selectedCount === 1 ? 'item' : 'itens'})`,
            'success'
        );
        onClose();
    };

    return (
        <OptimizedModal isOpen={isOpen} onClose={onClose} maxWidth="lg">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Share2 size={18} className="text-purple-400" />
                    Compartilhar
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
                >
                    <X size={16} />
                </button>
            </div>

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
            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[40vh] custom-scrollbar">
                {totalItems === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Folder size={40} className="opacity-30 mb-3" />
                        <p className="text-sm">Nenhum item neste nível</p>
                    </div>
                ) : (
                    <>
                        {/* Folders Section */}
                        {folders.length > 0 && (
                            <div className="space-y-2">
                                {folders.map((folder) => (
                                    <div
                                        key={folder.id}
                                        onClick={() => toggleItem(folder.id)}
                                        className={`
                      flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                      ${selectedIds.has(folder.id)
                                                ? 'bg-purple-500/10 border border-purple-500/30'
                                                : 'bg-white/[0.02] border border-transparent hover:bg-white/5'}
                    `}
                                    >
                                        <div className="shrink-0">
                                            {selectedIds.has(folder.id) ? (
                                                <CheckSquare size={18} className="text-purple-400" />
                                            ) : (
                                                <Square size={18} className="text-gray-500" />
                                            )}
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-sm">
                                            {folder.emoji || '📁'}
                                        </div>
                                        <span className="text-sm text-gray-200">{folder.name}</span>
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/15 text-blue-400">
                                            Pasta
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Prompts Section */}
                        {prompts.length > 0 && (
                            <div className="space-y-2">
                                {prompts.map((prompt) => (
                                    <div
                                        key={prompt.id}
                                        onClick={() => toggleItem(prompt.id)}
                                        className={`
                      flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all
                      ${selectedIds.has(prompt.id)
                                                ? 'bg-purple-500/10 border border-purple-500/30'
                                                : 'bg-white/[0.02] border border-transparent hover:bg-white/5'}
                    `}
                                    >
                                        <div className="shrink-0">
                                            {selectedIds.has(prompt.id) ? (
                                                <CheckSquare size={18} className="text-purple-400" />
                                            ) : (
                                                <Square size={18} className="text-gray-500" />
                                            )}
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">
                                            {prompt.emoji || '📄'}
                                        </div>
                                        <span className="text-sm text-gray-200">{prompt.name}</span>
                                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/15 text-emerald-400">
                                            Prompt
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Permission Selector */}
            <div className="px-5 py-3 border-t border-white/5 bg-white/[0.02]">
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">
                    Permissão
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPermission('view')}
                        className={`
              flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium transition-all
              ${permission === 'view'
                                ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400'
                                : 'bg-white/[0.02] border border-white/10 text-gray-400 hover:bg-white/5'}
            `}
                    >
                        <Eye size={14} />
                        Visualizar
                    </button>
                    <button
                        onClick={() => setPermission('edit')}
                        className={`
              flex-1 flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-medium transition-all
              ${permission === 'edit'
                                ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400'
                                : 'bg-white/[0.02] border border-white/10 text-gray-400 hover:bg-white/5'}
            `}
                    >
                        <Edit3 size={14} />
                        Editar
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/5 shrink-0">
                <div className="text-xs text-gray-400">
                    {selectedCount > 0 ? (
                        <span className="text-purple-400 font-medium">{selectedCount} selecionado{selectedCount > 1 ? 's' : ''}</span>
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
                        onClick={handleShare}
                        disabled={selectedCount === 0}
                        className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-purple-500 hover:bg-purple-600 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Copy size={14} />
                        Gerar Link ({selectedCount})
                    </button>
                </div>
            </div>
        </OptimizedModal>
    );
};

export default ShareModal;
