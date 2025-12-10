'use client';

// ============================================================================
// AthenaPeX PROMPT MANAGER - SEQUENTIAL VIEW
// ATHENA Architecture | Stack Navigation | Premium Dark Theme
// ============================================================================

import React from 'react';
import {
  Folder,
  FileText,
  ChevronRight,
  ArrowLeft,
  Home,
  FolderOpen,
  Edit2,
  Share2,
  Trash2,
  Plus,
} from 'lucide-react';
import { Tooltip } from './TooltipWrapper';
import { SlideView, PulseSuccess } from './MotionWrappers';
import { usePromptManagerStore } from '@/stores/promptManager';
import type { TreeNode, Folder as FolderType, Prompt } from '@/types/prompt-manager';

// Date formatting helper
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return 'Hoje';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return original if invalid
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', ' às');
  } catch {
    return dateStr;
  }
};

// --- FOLDER CARD COMPONENT (APPROVED - FROZEN) ---

interface FolderCardProps {
  folder: FolderType;
  index: number;
  onNavigate: (folder: FolderType) => void;
  onEdit: (item: TreeNode) => void;
  onShare: (item: TreeNode) => void;
  onDragStart: (e: React.DragEvent, item: TreeNode) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, item: TreeNode) => void;
  isLocked: boolean;
  isDragging: boolean;
  isJustDropped: boolean;
}

const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  index,
  onNavigate,
  onEdit,
  onShare,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isLocked,
  isDragging,
  isJustDropped,
}) => {
  return (
    <div
      draggable={!isLocked}
      onDragStart={(e) => onDragStart(e, folder)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, folder)}
      onClick={() => onNavigate(folder)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigate(folder);
        }
      }}
      className={`
        group relative flex flex-col min-h-[180px] w-full
        bg-gradient-to-br from-athena-navy/90 to-athena-navy-deep/80 
        border rounded-xl p-5
        transition-[transform,border-color,box-shadow] duration-200 cursor-pointer
        border-blue-500/25 hover:border-blue-400/50 hover:shadow-blue-900/20
        ${!isLocked ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isDragging ? 'opacity-40 scale-95 border-dashed' : ''}
        ${isJustDropped ? 'ring-2 ring-green-500' : ''}
        hover:scale-[1.01] hover:-translate-y-0.5
        animate-stagger-in
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        willChange: 'transform, opacity',
      }}
    >
      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400">
        Pasta
      </div>

      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 shadow-lg transition-transform group-hover:scale-105 bg-gradient-to-br from-blue-500/15 to-indigo-500/15 border border-blue-500/20">
        {folder.emoji || '📁'}
      </div>

      <h3 className="text-white font-semibold text-base mb-2 line-clamp-2 leading-snug">
        {folder.name}
      </h3>

      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
          Hoje
        </span>
        {folder.children && (
          <>
            <span className="w-0.5 h-0.5 rounded-full bg-gray-600" />
            <span className="font-medium text-blue-400">{folder.children.length} itens</span>
          </>
        )}
      </div>

      <div className="flex gap-2 pt-3 border-t border-white/5 mt-auto">
        <Tooltip content="Editar pasta" position="top">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(folder); }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#2979ff] hover:bg-[#2264d1] text-white rounded-lg transition-all text-xs font-bold active:scale-95"
          >
            <Edit2 size={12} /> EDITAR
          </button>
        </Tooltip>
        <Tooltip content="Compartilhar" position="top">
          <button
            onClick={(e) => { e.stopPropagation(); onShare(folder); }}
            className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all active:scale-95"
          >
            <Share2 size={14} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

// --- PROMPT CARD COMPONENT (RIGID 3-ZONE LAYOUT) ---

interface PromptCardProps {
  prompt: Prompt;
  index: number;
  onSelectPrompt: (prompt: Prompt) => void;
  onEdit: (item: TreeNode) => void;
  onShare: (item: TreeNode) => void;
  onDragStart: (e: React.DragEvent, item: TreeNode) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, item: TreeNode) => void;
  isLocked: boolean;
  isDragging: boolean;
  isJustDropped: boolean;
  isCompact?: boolean; // For high density mode
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  index,
  onSelectPrompt,
  onEdit,
  onShare,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
  isLocked,
  isDragging,
  isJustDropped,
  isCompact = false,
}) => {
  return (
    <div
      draggable={!isLocked}
      onDragStart={(e) => onDragStart(e, prompt)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, prompt)}
      onClick={() => onSelectPrompt(prompt)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectPrompt(prompt);
        }
      }}
      className={`
        group relative flex flex-col h-full w-full
        ${isCompact ? 'min-h-[240px]' : 'min-h-[280px]'}
        bg-gradient-to-br from-[#1a1f2e] via-[#1e2536] to-[#1a1f2e]
        ${isCompact ? 'rounded-xl' : 'rounded-2xl'} overflow-hidden
        border border-white/[0.08] hover:border-emerald-500/40
        shadow-lg hover:shadow-emerald-900/20
        transition-[transform,border-color,box-shadow] duration-200 cursor-pointer
        ${!isLocked ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isDragging ? 'opacity-40 scale-95 border-dashed' : ''}
        ${isJustDropped ? 'ring-2 ring-green-500' : ''}
        hover:translate-y-[-2px]
        animate-stagger-in
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {/* Top Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500/60 via-teal-400/60 to-cyan-400/60 shrink-0" />

      {/* === ZONA 1: TOPO (Altura Fixa) - Ícone + Badge + Título === */}
      <div className={`shrink-0 ${isCompact ? 'p-4 pb-2' : 'p-5 pb-3'}`}>
        <div className={`flex items-start ${isCompact ? 'gap-3' : 'gap-4'}`}>
          {/* Icon */}
          <div className={`shrink-0 ${isCompact ? 'w-10 h-10 text-base' : 'w-12 h-12 text-xl'} rounded-xl flex items-center justify-center 
            bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/10 
            border border-emerald-500/25 shadow-lg
            group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            {prompt.emoji || '📄'}
          </div>

          {/* Title & Badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2 py-0.5 rounded-full ${isCompact ? 'text-[8px]' : 'text-[9px]'} font-bold uppercase tracking-wider 
                bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 
                border border-emerald-500/20`}>
                Prompt
              </span>
            </div>
            <h3 className={`text-white font-bold ${isCompact ? 'text-sm' : 'text-base'} leading-snug line-clamp-2 group-hover:text-emerald-50 transition-colors`}>
              {prompt.name}
            </h3>
          </div>
        </div>
      </div>

      {/* === ZONA 2: MEIO (Flex-Grow) - Descrição com line-clamp === */}
      <div className={`flex-grow ${isCompact ? 'px-4 min-h-[50px]' : 'px-5 min-h-[60px]'}`}>
        {prompt.content ? (
          <p className={`text-gray-400 ${isCompact ? 'text-xs' : 'text-sm'} leading-relaxed ${isCompact ? 'line-clamp-2' : 'line-clamp-3'} 
            border-l-2 border-emerald-500/30 pl-3 italic`}>
            {prompt.content.substring(0, 200)}{prompt.content.length > 200 ? '...' : ''}
          </p>
        ) : (
          <p className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'} italic`}>Sem descrição</p>
        )}
      </div>

      {/* === ZONA 3: RODAPÉ (Ancorado no Fundo) - Data + Botões === */}
      <div className={`shrink-0 mt-auto ${isCompact ? 'p-4 pt-3' : 'p-5 pt-4'} border-t border-white/5 bg-black/10`}>
        <div className="flex items-center justify-between gap-3">
          {/* Meta Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className={`flex items-center gap-1.5 ${isCompact ? 'text-[10px]' : 'text-xs'} text-gray-500 shrink-0`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
              {formatDate(prompt.date)}
            </span>
          </div>

          {/* Actions - Sempre visíveis */}
          <div className="flex items-center gap-2 shrink-0">
            <Tooltip content="Editar" position="top">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(prompt); }}
                className="flex items-center gap-1.5 px-3 py-2 
                  bg-gradient-to-r from-[#2979ff] to-[#5b4eff] 
                  hover:from-[#3d8bff] hover:to-[#7264ff]
                  text-white rounded-lg transition-all text-xs font-bold 
                  shadow-lg shadow-blue-900/25 hover:shadow-blue-900/40
                  active:scale-95"
              >
                <Edit2 size={12} /> EDITAR
              </button>
            </Tooltip>
            <Tooltip content="Compartilhar" position="top">
              <button
                onClick={(e) => { e.stopPropagation(); onShare(prompt); }}
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white 
                  rounded-lg transition-all active:scale-95 border border-white/5 hover:border-white/10"
              >
                <Share2 size={14} />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- MAIN SEQUENTIAL VIEW ---

export const SequentialView: React.FC = () => {
  const data = usePromptManagerStore((s) => s.data);
  const sequentialPath = usePromptManagerStore((s) => s.sequentialPath);
  const slideDirection = usePromptManagerStore((s) => s.slideDirection);
  const isLocked = usePromptManagerStore((s) => s.isLocked);
  const dragState = usePromptManagerStore((s) => s.dragState);
  const justDroppedId = usePromptManagerStore((s) => s.justDroppedId);
  const preferences = usePromptManagerStore((s) => s.preferences);
  const {
    navigateToFolder,
    navigateToIndex,
    goBack,
    goToRoot,
    setDragState,
    openEditModal,
    setPromptViewerOpen,
    setSelectedPrompt,
    showToast,
    swapItems,
    setCreateFolderModalOpen,
    setCreatePromptModalOpen,
  } = usePromptManagerStore((s) => s.actions);

  // Grid density: 'standard' = 4 cols, 'high' = 5 cols
  const gridDensity = preferences.gridDensity || 'standard';

  // Get current nodes based on path
  const getCurrentNodes = () => {
    let currentNodes = data;
    let title = 'Pastas Principais';

    for (const id of sequentialPath) {
      const found = currentNodes.find((node) => node.id === id);
      if (found && found.type === 'folder' && (found as FolderType).children) {
        currentNodes = (found as FolderType).children;
        title = found.name;
      } else {
        return { nodes: [], title: 'Erro' };
      }
    }

    return { nodes: currentNodes, title };
  };

  const { nodes, title } = getCurrentNodes();

  // Separate folders and prompts
  const folders = nodes.filter((node: TreeNode) => node.type === 'folder');
  const prompts = nodes.filter((node: TreeNode) => node.type === 'prompt');

  // Build breadcrumb path
  const getBreadcrumbPath = () => {
    const path: { id: string; name: string; emoji?: string }[] = [];
    let currentNodes = data;

    for (const id of sequentialPath) {
      const found = currentNodes.find((node) => node.id === id);
      if (found && found.type === 'folder') {
        path.push({ id: found.id, name: found.name, emoji: found.emoji });
        currentNodes = (found as FolderType).children || [];
      }
    }

    return path;
  };

  const breadcrumbPath = getBreadcrumbPath();

  // --- Drag & Drop Handlers ---

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

  const handleDragOver = (e: React.DragEvent) => {
    if (isLocked) return;
    e.preventDefault();
    // Visual feedback for SWAP - left border glow (indicates position swap)
    const target = e.currentTarget as HTMLElement;
    target.style.borderLeftWidth = '4px';
    target.style.borderLeftColor = '#fbbf24'; // amber-400
    target.style.transform = 'translateX(4px)';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Reset swap visual
    const target = e.currentTarget as HTMLElement;
    target.style.borderLeftWidth = '';
    target.style.borderLeftColor = '';
    target.style.transform = '';
  };

  const handleDrop = (e: React.DragEvent, targetItem: TreeNode) => {
    if (isLocked) return;
    e.preventDefault();
    // Reset visual
    const target = e.currentTarget as HTMLElement;
    target.style.borderLeftWidth = '';
    target.style.borderLeftColor = '';
    target.style.transform = '';

    const draggedId = dragState.draggedItemId;
    if (!draggedId || draggedId === targetItem.id) {
      setDragState({ draggedItemId: null, draggedItemType: null });
      return;
    }

    // SWAP behavior - reorder items, never nest
    // Only swap items of the same type
    if (dragState.draggedItemType === targetItem.type) {
      swapItems(draggedId, targetItem.id);
    } else {
      showToast('Só é possível reordenar itens do mesmo tipo', 'info');
    }

    setDragState({ draggedItemId: null, draggedItemType: null });
  };

  // --- Action Handlers ---

  const handleNavigate = (folder: FolderType) => {
    navigateToFolder(folder);
  };

  const handleSelectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setPromptViewerOpen(true);
  };

  const handleEdit = (item: TreeNode) => {
    openEditModal(item, false);
  };

  const handleShare = (item: TreeNode) => {
    showToast(`Compartilhando "${item.name}"...`, 'success');
  };

  const handleNewFolder = () => {
    // Opens the optimized CreateFolderModal
    setCreateFolderModalOpen(true);
  };

  const handleNewPrompt = () => {
    // Opens the optimized CreatePromptModal
    setCreatePromptModalOpen(true);
  };

  // Check if we're in a subfolder (can create prompts)
  const isInSubfolder = sequentialPath.length >= 2;

  // Handle drag end (reset opacity even if cancelled)
  const handleDragEnd = () => {
    setDragState({ draggedItemId: null, draggedItemType: null });
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <div className="px-4 py-6 min-h-full">
        {/* Header with Breadcrumbs */}
        <div className="flex items-center gap-6 mb-10">
          {sequentialPath.length > 0 && (
            <button
              onClick={goBack}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all hover:-translate-x-1 border border-white/10"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4 mb-3">
              {sequentialPath.length === 0 ? (
                <Home size={36} className="text-[#2979ff]" />
              ) : (
                <FolderOpen size={36} className="text-[#2979ff]" />
              )}
              {title}
            </h2>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-3 text-base text-gray-400">
              <button
                onClick={goToRoot}
                className={`hover:text-white transition-colors flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/5 ${sequentialPath.length === 0 ? 'text-white font-bold bg-white/5' : ''
                  }`}
              >
                <Home size={16} /> Início
              </button>
              {breadcrumbPath.map((folder, index) => (
                <React.Fragment key={folder.id}>
                  <ChevronRight size={16} className="text-gray-600" />
                  <button
                    onClick={() => navigateToIndex(index)}
                    className={`hover:text-white transition-colors flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/5 ${index === breadcrumbPath.length - 1 ? 'text-white font-bold bg-white/5' : ''
                      }`}
                  >
                    {folder.emoji} {folder.name}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center gap-2 text-gray-400 text-lg">
                <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">{nodes.length}</span> itens disponíveis
              </span>
            </div>
          </div>
        </div>

        {/* Folders Grid - APPROVED/FROZEN - 4-6 columns */}
        {folders.length > 0 && (
          <div className="mb-8">
            <SlideView
              key={`folders-${sequentialPath.join('-')}`}
              direction={slideDirection}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3"
            >
              {folders.map((folder, index) => (
                <FolderCard
                  key={folder.id}
                  folder={folder as FolderType}
                  index={index}
                  onNavigate={handleNavigate}
                  onEdit={handleEdit}
                  onShare={handleShare}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  isLocked={isLocked}
                  isDragging={dragState.draggedItemId === folder.id}
                  isJustDropped={justDroppedId === folder.id}
                />
              ))}

              {/* New Folder Button - Treated as item N+1 in stagger sequence */}
              <button
                onClick={handleNewFolder}
                className="flex flex-col items-center justify-center gap-3 bg-white/[0.02] border border-dashed border-white/10 hover:border-[#2979ff]/40 hover:bg-[#2979ff]/5 rounded-xl p-5 cursor-pointer transition-all group min-h-[180px] animate-stagger-in"
                style={{
                  opacity: 0, // Ensure hidden until animation starts
                  animationDelay: `${folders.length * 50}ms`,
                  animationFillMode: 'forwards',
                  willChange: 'transform, opacity',
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#2979ff] group-hover:scale-105 transition-all">
                  <Plus size={24} />
                </div>
                <span className="text-sm font-medium text-gray-400 group-hover:text-[#2979ff] transition-colors">
                  Nova Pasta
                </span>
              </button>
            </SlideView>
          </div>
        )}

        {/* Prompts Grid - Responsive with density preference */}
        {prompts.length > 0 && (
          <div>
            {folders.length > 0 && (
              <h3 className="text-lg font-semibold text-gray-400 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Prompts ({prompts.length})
              </h3>
            )}
            <SlideView
              key={`prompts-${sequentialPath.join('-')}`}
              direction={slideDirection}
              className={`grid ${gridDensity === 'high'
                ? 'gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
                : 'gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'
                }`}
            >
              {prompts.map((prompt, index) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt as Prompt}
                  index={index}
                  onSelectPrompt={handleSelectPrompt}
                  onEdit={handleEdit}
                  onShare={handleShare}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  isLocked={isLocked}
                  isDragging={dragState.draggedItemId === prompt.id}
                  isJustDropped={justDroppedId === prompt.id}
                  isCompact={gridDensity === 'high'}
                />
              ))}

              {/* New Prompt Placeholder - Only in Subfolders, treated as item N+1 */}
              {isInSubfolder && (
                <button
                  onClick={handleNewPrompt}
                  className={`
                    flex flex-col items-center justify-center gap-3 
                    bg-white/[0.02] border border-dashed border-white/10 
                    hover:border-emerald-500/40 hover:bg-emerald-500/5 
                    ${gridDensity === 'high' ? 'rounded-xl min-h-[240px]' : 'rounded-2xl min-h-[280px]'}
                    cursor-pointer transition-all group
                    animate-stagger-in
                  `}
                  style={{
                    opacity: 0, // Ensure hidden until animation starts
                    animationDelay: `${prompts.length * 50}ms`,
                    animationFillMode: 'forwards',
                    willChange: 'transform, opacity',
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-gray-400 group-hover:text-emerald-400 group-hover:scale-105 transition-all border border-emerald-500/20">
                    <Plus size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-400 group-hover:text-emerald-400 transition-colors">
                    Novo Prompt
                  </span>
                </button>
              )}
            </SlideView>
          </div>
        )}

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
            <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center mb-4">
              <FolderOpen size={32} className="opacity-40" />
            </div>
            <p className="text-base font-semibold text-gray-300 mb-1">Pasta vazia</p>
            <p className="text-sm text-gray-500">Crie uma nova pasta ou prompt</p>
            <button
              onClick={handleNewFolder}
              className="mt-4 px-4 py-2 bg-[#2979ff] hover:bg-[#2264d1] text-white rounded-lg transition-all text-sm font-bold"
            >
              <Plus size={16} className="inline mr-1" /> Nova Pasta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SequentialView;


