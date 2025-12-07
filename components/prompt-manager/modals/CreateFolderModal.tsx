'use client';

// ============================================================================
// AthenaPeX PROMPT MANAGER - CREATE FOLDER MODAL
// ATHENA Architecture | Context-Aware Folder Creation | Premium Dark Theme
// ============================================================================

import React, { useState, useEffect } from 'react';
import { X, FolderPlus, Check, Loader2 } from 'lucide-react';
import { OptimizedModal } from './OptimizedModal';
import { EmojiPicker, EmojiButton } from '../EmojiPicker';
import { usePromptManagerStore } from '@/stores/promptManager';

interface CreateFolderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('📁');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const sequentialPath = usePromptManagerStore((s) => s.sequentialPath);
    const { addItem, showToast, getCurrentSequentialNodes } = usePromptManagerStore((s) => s.actions);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setName('');
            setEmoji('📁');
            setShowEmojiPicker(false);
            setIsCreating(false);
        }
    }, [isOpen]);

    // Get current folder context
    const getCurrentFolderId = (): string | null => {
        if (sequentialPath.length === 0) return null;
        return sequentialPath[sequentialPath.length - 1];
    };

    // Determine what type of folder will be created
    const getContextLabel = (): string => {
        if (sequentialPath.length === 0) return 'Pasta Mãe (Raiz)';
        if (sequentialPath.length === 1) return 'Subpasta';
        return 'Sub-subpasta';
    };

    const { title } = getCurrentSequentialNodes();

    // Handle Create
    const handleCreate = async () => {
        if (!name.trim() || isCreating) return;
        setIsCreating(true);

        const parentId = getCurrentFolderId();

        try {
            // Call API to create folder in Turso
            const response = await fetch('/api/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    emoji,
                    parentId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create folder');
            }

            const result = await response.json();

            // Add to local state
            const newFolder = {
                id: result.data.id,
                name: name.trim(),
                type: 'folder' as const,
                emoji,
                children: [],
            };

            addItem(newFolder, parentId);
            showToast(`Pasta "${name}" criada!`, 'success');
            onClose();
        } catch (error) {
            console.error('[CreateFolderModal] Error:', error);
            showToast('Erro ao criar pasta', 'error');
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
            } else if (e.key === 'Enter' && name.trim() && !isCreating) {
                handleCreate();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, name, isCreating]);

    return (
        <OptimizedModal isOpen={isOpen} onClose={onClose} maxWidth="sm">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FolderPlus size={18} className="text-[#2979ff]" />
                    Nova Pasta
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Context Info */}
                <div className="text-xs text-gray-400 bg-white/[0.02] px-3 py-2 rounded-lg border border-white/5">
                    <span className="text-gray-500">Localização:</span>{' '}
                    <span className="text-white font-medium">{title}</span>
                    <span className="mx-2">→</span>
                    <span className="text-[#2979ff]">{getContextLabel()}</span>
                </div>

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
                            Nome da Pasta
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Digite o nome..."
                            className="w-full h-10 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff] transition-all placeholder-gray-600"
                            autoFocus
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
                    disabled={!name.trim() || isCreating}
                    className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-[#2979ff] hover:bg-[#2264d1] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isCreating ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Criando...
                        </>
                    ) : (
                        <>
                            <Check size={14} />
                            Criar Pasta
                        </>
                    )}
                </button>
            </div>
        </OptimizedModal>
    );
};

export default CreateFolderModal;
