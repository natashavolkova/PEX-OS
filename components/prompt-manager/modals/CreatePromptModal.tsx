'use client';

// ============================================================================
// AthenaPeX PROMPT MANAGER - CREATE PROMPT MODAL
// ATHENA Architecture | Golden Rule: Prompts Only in Subfolders
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { X, FilePlus, Check, Loader2, AlertTriangle, ChevronDown, FolderPlus } from 'lucide-react';
import { OptimizedModal } from './OptimizedModal';
import { EmojiPicker, EmojiButton } from '../EmojiPicker';
import { usePromptManagerStore } from '@/stores/promptManager';
import type { Folder, TreeNode } from '@/types/prompt-manager';

interface CreatePromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreatePromptModal: React.FC<CreatePromptModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('📄');
    const [content, setContent] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const data = usePromptManagerStore((s) => s.data);
    const sequentialPath = usePromptManagerStore((s) => s.sequentialPath);
    const { addItem, showToast, getCurrentSequentialNodes } = usePromptManagerStore((s) => s.actions);

    // Get all subfolders (folders that are inside other folders - level 2+)
    const getAllSubfolders = useMemo((): Folder[] => {
        const subfolders: Folder[] = [];

        const traverse = (items: TreeNode[], depth: number, parentName: string) => {
            for (const item of items) {
                if (item.type === 'folder') {
                    // Only include folders at depth 1+ (subfolders)
                    if (depth >= 1) {
                        subfolders.push({
                            ...item,
                            // Add parent path for display
                            name: parentName ? `${parentName} / ${item.name}` : item.name,
                        } as Folder);
                    }
                    // Continue traversing children
                    if (item.children) {
                        traverse(item.children, depth + 1, depth >= 1 ? (parentName ? `${parentName} / ${item.name}` : item.name) : item.name);
                    }
                }
            }
        };

        traverse(data, 0, '');
        return subfolders;
    }, [data]);

    // Check if we're currently in a subfolder (level 2+)
    const isInSubfolder = useMemo((): boolean => {
        return sequentialPath.length >= 2;
    }, [sequentialPath]);

    // Get current folder ID if in subfolder
    const getCurrentSubfolderId = (): string | null => {
        if (sequentialPath.length >= 2) {
            return sequentialPath[sequentialPath.length - 1];
        }
        return null;
    };

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setName('');
            setEmoji('📄');
            setContent('');
            setShowEmojiPicker(false);
            setIsCreating(false);

            // Pre-select current subfolder if we're in one
            const currentSubfolderId = getCurrentSubfolderId();
            setSelectedFolderId(currentSubfolderId);
        }
    }, [isOpen, sequentialPath]);

    const { title } = getCurrentSequentialNodes();

    // Determine if creation is allowed
    const canCreate = name.trim() && selectedFolderId;
    const noSubfoldersExist = getAllSubfolders.length === 0;

    // Handle Create
    const handleCreate = async () => {
        if (!canCreate || isCreating) return;
        setIsCreating(true);

        try {
            // Call API to create prompt in Turso
            const response = await fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: name.trim(),
                    content: content.trim() || 'Novo prompt...',
                    emoji,
                    folderId: selectedFolderId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create prompt');
            }

            const result = await response.json();

            // Add to local state
            const newPrompt = {
                id: result.data.id,
                name: name.trim(),
                type: 'prompt' as const,
                emoji,
                content: content.trim() || 'Novo prompt...',
                date: new Date().toLocaleDateString('pt-BR'),
                tags: [],
            };

            addItem(newPrompt, selectedFolderId);
            showToast(`Prompt "${name}" criado!`, 'success');
            onClose();
        } catch (error) {
            console.error('[CreatePromptModal] Error:', error);
            showToast('Erro ao criar prompt', 'error');
        } finally {
            setIsCreating(false);
        }
    };

    // Keyboard handling
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Get display name for selected folder
    const getSelectedFolderName = (): string => {
        if (!selectedFolderId) return '';
        const folder = getAllSubfolders.find(f => f.id === selectedFolderId);
        return folder?.name || '';
    };

    return (
        <OptimizedModal isOpen={isOpen} onClose={onClose} maxWidth="lg">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FilePlus size={18} className="text-emerald-400" />
                    Novo Prompt
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
                {/* No Subfolders Warning */}
                {noSubfoldersExist && (
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <AlertTriangle size={20} className="text-yellow-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-yellow-300">
                                Nenhuma subpasta disponível
                            </p>
                            <p className="text-xs text-yellow-400/80 mt-1">
                                Prompts só podem ser criados dentro de subpastas. Crie uma pasta primeiro.
                            </p>
                            <button
                                onClick={() => {
                                    onClose();
                                    // Open create folder modal
                                    usePromptManagerStore.getState().actions.openCreateModal('folder', null);
                                }}
                                className="mt-3 text-xs font-medium text-yellow-400 hover:text-yellow-300 flex items-center gap-1.5"
                            >
                                <FolderPlus size={14} />
                                Criar Pasta Agora
                            </button>
                        </div>
                    </div>
                )}

                {/* Subfolder Selection (only if not already in subfolder) */}
                {!isInSubfolder && !noSubfoldersExist && (
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block flex items-center gap-1">
                            Subpasta <span className="text-red-400">*</span>
                            <span className="text-gray-500 normal-case font-normal">(obrigatório)</span>
                        </label>
                        <div className="relative">
                            <select
                                value={selectedFolderId || ''}
                                onChange={(e) => setSelectedFolderId(e.target.value || null)}
                                className="w-full h-10 bg-[#0f111a] border border-white/10 rounded-lg px-3 pr-10 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff] appearance-none cursor-pointer transition-all"
                            >
                                <option value="">Selecione uma subpasta...</option>
                                {getAllSubfolders.map((folder) => (
                                    <option key={folder.id} value={folder.id}>
                                        {folder.emoji} {folder.name}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={14}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                        </div>
                    </div>
                )}

                {/* Already in Subfolder Info */}
                {isInSubfolder && (
                    <div className="text-xs text-gray-400 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                        <span className="text-gray-500">Criando em:</span>{' '}
                        <span className="text-emerald-400 font-medium">{title}</span>
                    </div>
                )}

                {/* Emoji + Name */}
                <div className="flex gap-3">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold text-gray-400">Ícone</label>
                        <EmojiButton
                            emoji={emoji}
                            onOpenPicker={() => setShowEmojiPicker(!showEmojiPicker)}
                        />
                    </div>

                    <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                            Nome do Prompt
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome..."
                            className="w-full h-10 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff] transition-all placeholder-gray-600"
                            autoFocus={!noSubfoldersExist}
                            disabled={noSubfoldersExist}
                        />
                    </div>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div className="animate-in slide-in-from-top-2 duration-150 p-2 bg-[#0f111a] rounded-lg border border-white/5">
                        <EmojiPicker
                            onSelect={(e) => {
                                setEmoji(e);
                                setShowEmojiPicker(false);
                            }}
                            selectedEmoji={emoji}
                        />
                    </div>
                )}

                {/* Content (Optional) */}
                {!noSubfoldersExist && (
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                            Conteúdo <span className="text-gray-500 normal-case font-normal">(opcional)</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Digite o conteúdo do prompt aqui..."
                            className="w-full h-32 bg-[#0f111a] border border-white/10 rounded-lg p-3 text-xs text-gray-300 focus:outline-none focus:border-[#2979ff] transition-all font-mono leading-relaxed resize-none custom-scrollbar"
                        />
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-5 py-4 border-t border-white/5 shrink-0">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium rounded-lg text-gray-300 border border-white/10 hover:bg-white/10 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleCreate}
                    disabled={!canCreate || isCreating}
                    className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isCreating ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Criando...
                        </>
                    ) : (
                        <>
                            <Check size={14} />
                            Criar Prompt
                        </>
                    )}
                </button>
            </div>
        </OptimizedModal>
    );
};

export default CreatePromptModal;
