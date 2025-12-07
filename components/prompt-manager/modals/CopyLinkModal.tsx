'use client';

// ============================================================================
// AthenaPeX PROMPT MANAGER - COPY LINK MODAL
// ATHENA Architecture | Quick Link Generation | Premium Dark Theme
// ============================================================================

import React, { useMemo } from 'react';
import {
    X,
    Link as LinkIcon,
    Folder,
    FileText,
    Copy,
    Check,
    ExternalLink,
} from 'lucide-react';
import { OptimizedModal } from './OptimizedModal';
import { usePromptManagerStore } from '@/stores/promptManager';
import type { TreeNode, Folder as FolderType, Prompt } from '@/types/prompt-manager';

interface CopyLinkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CopyLinkModal: React.FC<CopyLinkModalProps> = ({ isOpen, onClose }) => {
    const [copiedId, setCopiedId] = React.useState<string | null>(null);

    const { getCurrentSequentialNodes, showToast } = usePromptManagerStore((s) => s.actions);

    // Get current level items
    const currentView = useMemo(() => {
        return getCurrentSequentialNodes();
    }, []);

    const { nodes, title, currentItem } = currentView;

    // Reset on open
    React.useEffect(() => {
        if (isOpen) {
            setCopiedId(null);
        }
    }, [isOpen]);

    // Copy item link
    const handleCopyItemLink = (item: TreeNode) => {
        const link = `${window.location.origin}/share/${item.id}`;
        navigator.clipboard.writeText(link);
        setCopiedId(item.id);
        showToast(`Link de "${item.name}" copiado!`, 'success');

        // Reset copied state after 2 seconds
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Copy current page link
    const handleCopyPageLink = () => {
        const link = window.location.href;
        navigator.clipboard.writeText(link);
        setCopiedId('page');
        showToast('Link da página copiado!', 'success');
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <OptimizedModal isOpen={isOpen} onClose={onClose} maxWidth="md">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <LinkIcon size={18} className="text-cyan-400" />
                    Copiar Link
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/5"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Current Page Link */}
            <div className="px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                <button
                    onClick={handleCopyPageLink}
                    className={`
            w-full flex items-center justify-between p-3 rounded-lg transition-all
            ${copiedId === 'page'
                            ? 'bg-cyan-500/10 border border-cyan-500/30'
                            : 'bg-white/[0.02] border border-white/10 hover:bg-white/5 hover:border-white/20'}
          `}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            <ExternalLink size={16} className="text-cyan-400" />
                        </div>
                        <div className="text-left">
                            <span className="text-sm text-white font-medium block">Página Atual</span>
                            <span className="text-[10px] text-gray-500">{title}</span>
                        </div>
                    </div>
                    {copiedId === 'page' ? (
                        <Check size={16} className="text-cyan-400" />
                    ) : (
                        <Copy size={16} className="text-gray-400" />
                    )}
                </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[50vh] custom-scrollbar">
                {nodes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                        <Folder size={32} className="opacity-30 mb-2" />
                        <p className="text-xs">Nenhum item neste nível</p>
                    </div>
                ) : (
                    <>
                        <div className="text-[10px] uppercase font-bold text-gray-500 mb-2">
                            Itens ({nodes.length})
                        </div>
                        {nodes.map((item) => {
                            const isFolder = item.type === 'folder';
                            const isCopied = copiedId === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleCopyItemLink(item)}
                                    className={`
                    w-full flex items-center justify-between p-3 rounded-lg transition-all text-left
                    ${isCopied
                                            ? 'bg-cyan-500/10 border border-cyan-500/30'
                                            : 'bg-white/[0.02] border border-transparent hover:bg-white/5 hover:border-white/10'}
                  `}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center text-sm
                      ${isFolder ? 'bg-blue-500/10' : 'bg-emerald-500/10'}
                    `}>
                                            {item.emoji || (isFolder ? '📁' : '📄')}
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-200 block">{item.name}</span>
                                            <span className={`
                        text-[9px] font-bold uppercase
                        ${isFolder ? 'text-blue-400' : 'text-emerald-400'}
                      `}>
                                                {isFolder ? 'Pasta' : 'Prompt'}
                                            </span>
                                        </div>
                                    </div>
                                    {isCopied ? (
                                        <div className="flex items-center gap-1 text-cyan-400">
                                            <Check size={14} />
                                            <span className="text-[10px] font-medium">Copiado!</span>
                                        </div>
                                    ) : (
                                        <Copy size={14} className="text-gray-500" />
                                    )}
                                </button>
                            );
                        })}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-end px-5 py-4 border-t border-white/5 shrink-0">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium rounded-lg text-gray-300 border border-white/10 hover:bg-white/10 transition-colors"
                >
                    Fechar
                </button>
            </div>
        </OptimizedModal>
    );
};

export default CopyLinkModal;
