'use client';

// ============================================================================
// AthenaPeX PROMPT MANAGER - FILTER TAGS MODAL
// ATHENA Architecture | Snappy Modal for Tag Filtering | Premium Dark Theme
// ============================================================================

import React, { useState, useMemo } from 'react';
import { X, Filter, Tag, Search, Check } from 'lucide-react';
import { OptimizedModal } from './OptimizedModal';
import { usePromptManagerStore } from '@/stores/promptManager';
import type { TreeNode, Prompt } from '@/types/prompt-manager';

// --- HELPER: Extract all tags from data ---
const extractAllTags = (nodes: TreeNode[]): string[] => {
    const tags = new Set<string>();

    const traverse = (items: TreeNode[]) => {
        for (const item of items) {
            if (item.type === 'prompt' && (item as Prompt).tags) {
                (item as Prompt).tags?.forEach((tag) => tags.add(tag));
            }
            if (item.type === 'folder' && (item as any).children) {
                traverse((item as any).children);
            }
        }
    };

    traverse(nodes);
    return Array.from(tags).sort();
};

// --- FILTER TAGS MODAL ---

export const FilterTagsModal: React.FC = () => {
    const isOpen = usePromptManagerStore((s) => s.isFilterTagsModalOpen);
    const activeFilters = usePromptManagerStore((s) => s.activeTagFilters);
    const data = usePromptManagerStore((s) => s.data);
    const { setFilterTagsModalOpen, setActiveTagFilters, showToast } = usePromptManagerStore((s) => s.actions);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set(activeFilters));

    // Extract all unique tags from data
    const allTags = useMemo(() => extractAllTags(data), [data]);

    // Filter tags by search
    const filteredTags = useMemo(() => {
        if (!searchQuery) return allTags;
        return allTags.filter((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allTags, searchQuery]);

    // Count occurrences of each tag
    const tagCounts = useMemo(() => {
        const counts: Record<string, number> = {};

        const traverse = (items: TreeNode[]) => {
            for (const item of items) {
                if (item.type === 'prompt' && (item as Prompt).tags) {
                    (item as Prompt).tags?.forEach((tag) => {
                        counts[tag] = (counts[tag] || 0) + 1;
                    });
                }
                if (item.type === 'folder' && (item as any).children) {
                    traverse((item as any).children);
                }
            }
        };

        traverse(data);
        return counts;
    }, [data]);

    const handleClose = () => {
        setSearchQuery('');
        setFilterTagsModalOpen(false);
    };

    const handleToggleTag = (tag: string) => {
        setSelectedTags((prev) => {
            const next = new Set(prev);
            if (next.has(tag)) {
                next.delete(tag);
            } else {
                next.add(tag);
            }
            return next;
        });
    };

    const handleApplyFilters = () => {
        const filters = Array.from(selectedTags);
        setActiveTagFilters(filters);
        if (filters.length > 0) {
            showToast(`Filtrando por ${filters.length} tag(s)`, 'success');
        } else {
            showToast('Filtros removidos', 'info');
        }
        handleClose();
    };

    const handleClearAll = () => {
        setSelectedTags(new Set());
    };

    // Sync selected tags when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setSelectedTags(new Set(activeFilters));
        }
    }, [isOpen, activeFilters]);

    return (
        <OptimizedModal isOpen={isOpen} onClose={handleClose} maxWidth="md">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2979ff]/15 flex items-center justify-center">
                        <Filter size={20} className="text-[#2979ff]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Filtrar por Tags</h2>
                        <p className="text-xs text-gray-400">
                            {allTags.length} tags disponíveis
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-white/5 shrink-0">
                <div className="relative">
                    <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar tags..."
                        className="w-full h-10 bg-[#0f111a] border border-white/10 rounded-lg pl-9 pr-3 text-sm text-gray-300 focus:outline-none focus:border-[#2979ff] transition-all placeholder-gray-600"
                        autoFocus
                    />
                </div>

                {/* Active filters count */}
                {selectedTags.size > 0 && (
                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400">
                            {selectedTags.size} tag(s) selecionada(s)
                        </span>
                        <button
                            onClick={handleClearAll}
                            className="text-xs text-gray-400 hover:text-white transition-colors"
                        >
                            Limpar seleção
                        </button>
                    </div>
                )}
            </div>

            {/* Tags Grid */}
            <div className="flex-1 overflow-y-auto p-4 min-h-[200px] max-h-[400px] custom-scrollbar">
                {filteredTags.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                        <Tag size={32} className="opacity-40 mb-3" />
                        <p className="text-sm font-medium">Nenhuma tag encontrada</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {searchQuery ? 'Tente outra busca' : 'Crie prompts com tags'}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {filteredTags.map((tag) => {
                            const isSelected = selectedTags.has(tag);
                            const count = tagCounts[tag] || 0;

                            return (
                                <button
                                    key={tag}
                                    onClick={() => handleToggleTag(tag)}
                                    className={`
                    inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
                    transition-all duration-150 border
                    ${isSelected
                                            ? 'bg-[#2979ff]/20 text-[#2979ff] border-[#2979ff]/40 shadow-sm shadow-blue-900/20'
                                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'}
                  `}
                                >
                                    {isSelected ? (
                                        <Check size={12} className="text-[#2979ff]" />
                                    ) : (
                                        <Tag size={12} />
                                    )}
                                    <span className="uppercase tracking-wide">{tag}</span>
                                    <span className={`
                    px-1.5 py-0.5 rounded text-[10px] font-bold
                    ${isSelected ? 'bg-[#2979ff]/30' : 'bg-white/10'}
                  `}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-white/10 bg-[#13161c] rounded-b-xl shrink-0">
                <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleApplyFilters}
                    className="px-4 py-2 text-sm font-bold text-white bg-[#2979ff] hover:bg-[#2264d1] rounded-lg transition-colors shadow-lg shadow-blue-900/30"
                >
                    Aplicar Filtros
                </button>
            </div>
        </OptimizedModal>
    );
};

export default FilterTagsModal;
