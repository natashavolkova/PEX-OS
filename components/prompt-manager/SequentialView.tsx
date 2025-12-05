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
        backdrop-blur-xl border rounded-xl p-5
        transition-all duration-200 cursor-pointer
        border-blue-500/25 hover:border-blue-400/50 hover:shadow-[0_0_25px_rgba(41,121,255,0.15)]
        ${!isLocked ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isDragging ? 'opacity-40 scale-95 border-dashed' : ''}
        ${isJustDropped ? 'animate-success-pulse ring-2 ring-green-500' : ''}
        hover:scale-[1.01] hover:-translate-y-0.5
      `}
      style={{ animationDelay: `${index * 20}ms` }}
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

// --- PROMPT CARD COMPONENT (WIDESCREEN HORIZONTAL) ---

interface PromptCardProps {
  prompt: Prompt;
  index: number;
  onSelectPrompt: (prompt: Prompt) => void;
  onEdit: (item: TreeNode) => void;
  onShare: (item: TreeNode) => void;
  onDragStart: (e: React.DragEvent, item: TreeNode) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, item: TreeNode) => void;
  isLocked: boolean;
  isDragging: boolean;
  isJustDropped: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({
  prompt,
  index,
  onSelectPrompt,
  onEdit,
  onShare,
  onDragStart,
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
      onDragStart={(e) => onDragStart(e, prompt)}
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
        group relative flex flex-col w-full overflow-hidden
        bg-gradient-to-br from-[#1a1f2e] via-[#1e2536] to-[#1a1f2e]
        backdrop-blur-xl rounded-2xl
        border border-white/[0.08] hover:border-emerald-500/40
        shadow-[0_4px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_40px_rgba(16,185,129,0.15)]
        transition-all duration-300 cursor-pointer
        ${!isLocked ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isDragging ? 'opacity-40 scale-95 border-dashed' : ''}
        ${isJustDropped ? 'animate-success-pulse ring-2 ring-green-500' : ''}
        hover:translate-y-[-2px]
      `}
      style={{ animationDelay: `${index * 25}ms` }}
    >
      {/* Top Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500/60 via-teal-400/60 to-cyan-400/60" />

      {/* Card Content */}
      <div className="p-6">
        {/* Header Row */}
        <div className="flex items-start gap-4 mb-5">
          {/* Icon */}
          <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-2xl 
            bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/10 
            border border-emerald-500/25 shadow-lg
            group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            {prompt.emoji || '📄'}
          </div>

          {/* Title & Badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 
                border border-emerald-500/20">
                Prompt
              </span>
            </div>
            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-emerald-50 transition-colors">
              {prompt.name}
            </h3>
          </div>
        </div>

        {/* Content Preview */}
        {prompt.content && (
          <div className="mb-5 pl-[72px]">
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 
              border-l-2 border-emerald-500/30 pl-4 italic">
              {prompt.content.substring(0, 180)}...
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          {/* Meta Info */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500/60 animate-pulse" />
              {formatDate(prompt.date)}
            </span>
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex items-center gap-2">
                {prompt.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] uppercase font-semibold 
                    bg-white/5 text-gray-400 border border-white/5">
                    {tag}
                  </span>
                ))}
                {prompt.tags.length > 2 && (
                  <span className="text-[10px] text-gray-600">+{prompt.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Tooltip content="Editar" position="top">
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(prompt); }}
                className="flex items-center gap-2 px-4 py-2.5 
                  bg-gradient-to-r from-[#2979ff] to-[#5b4eff] 
                  hover:from-[#3d8bff] hover:to-[#7264ff]
                  text-white rounded-xl transition-all text-xs font-bold 
                  shadow-lg shadow-blue-900/25 hover:shadow-blue-900/40
                  active:scale-95"
              >
                <Edit2 size={14} /> EDITAR
              </button>
            </Tooltip>
            <Tooltip content="Compartilhar" position="top">
              <button
                onClick={(e) => { e.stopPropagation(); onShare(prompt); }}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white 
                  rounded-xl transition-all active:scale-95 border border-white/5 hover:border-white/10"
              >
                <Share2 size={16} />
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
    moveItem,
  } = usePromptManagerStore((s) => s.actions);

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
    e.currentTarget.classList.add('ring-2', 'ring-[#2979ff]', 'scale-[1.02]');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('ring-2', 'ring-[#2979ff]', 'scale-[1.02]');
  };

  const handleDrop = (e: React.DragEvent, targetItem: TreeNode) => {
    if (isLocked) return;
    e.preventDefault();
    e.currentTarget.classList.remove('ring-2', 'ring-[#2979ff]', 'scale-[1.02]');

    const draggedId = dragState.draggedItemId;
    if (!draggedId || draggedId === targetItem.id) {
      setDragState({ draggedItemId: null, draggedItemType: null });
      return;
    }

    if (targetItem.type === 'folder') {
      moveItem(draggedId, targetItem.id);
    } else {
      showToast('Solte sobre uma pasta', 'info');
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
    if (isLocked) {
      showToast('Desbloqueie para criar', 'warning');
      return;
    }
    showToast('Criar nova pasta...', 'info');
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      <div className="p-10 min-h-full">
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
              direction={slideDirection}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
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
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  isLocked={isLocked}
                  isDragging={dragState.draggedItemId === folder.id}
                  isJustDropped={justDroppedId === folder.id}
                />
              ))}

              {/* New Folder Button */}
              <button
                onClick={handleNewFolder}
                className="flex flex-col items-center justify-center gap-3 bg-white/[0.02] border border-dashed border-white/10 hover:border-[#2979ff]/40 hover:bg-[#2979ff]/5 rounded-xl p-5 cursor-pointer transition-all group min-h-[180px]"
                style={{ animationDelay: `${folders.length * 20}ms` }}
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

        {/* Prompts Grid - 3 columns (sweet spot) - max 4 for ultrawide */}
        {prompts.length > 0 && (
          <div>
            {folders.length > 0 && (
              <h3 className="text-lg font-semibold text-gray-400 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Prompts ({prompts.length})
              </h3>
            )}
            <SlideView
              direction={slideDirection}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
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
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  isLocked={isLocked}
                  isDragging={dragState.draggedItemId === prompt.id}
                  isJustDropped={justDroppedId === prompt.id}
                />
              ))}
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


