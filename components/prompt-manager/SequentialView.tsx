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

// --- ITEM CARD COMPONENT ---

interface ItemCardProps {
  item: TreeNode;
  index: number;
  onNavigate: (folder: FolderType) => void;
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

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  index,
  onNavigate,
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
  const isFolder = item.type === 'folder';
  const prompt = item as Prompt;
  const folder = item as FolderType;

  return (
    <div
      draggable={!isLocked}
      onDragStart={(e) => onDragStart(e, item)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, item)}
      onClick={() => isFolder ? onNavigate(folder) : onSelectPrompt(prompt)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          isFolder ? onNavigate(folder) : onSelectPrompt(prompt);
        }
      }}
      className={`
        group relative flex flex-col min-h-[280px] w-full
        bg-gradient-to-br from-athena-navy/90 to-athena-navy-deep/80 
        backdrop-blur-xl border-2 rounded-2xl p-8
        transition-all duration-300 cursor-pointer
        ${isFolder
          ? 'border-blue-500/30 hover:border-blue-400/60 hover:shadow-[0_0_40px_rgba(41,121,255,0.2)]'
          : 'border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]'
        }
        ${!isLocked ? 'cursor-grab active:cursor-grabbing' : ''}
        ${isDragging ? 'opacity-40 scale-95 border-dashed' : ''}
        ${isJustDropped ? 'animate-success-pulse ring-2 ring-green-500' : ''}
        hover:scale-[1.02] hover:-translate-y-1
      `}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Type Badge */}
      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
        ${isFolder ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'}
      `}>
        {isFolder ? 'Pasta' : 'Prompt'}
      </div>

      {/* Icon */}
      <div className={`
        w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6
        shadow-2xl transition-transform group-hover:scale-110 group-hover:rotate-3
        ${isFolder
          ? 'bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 border border-blue-500/30'
          : 'bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/30'}
      `}>
        {item.emoji || (isFolder ? '📁' : '📄')}
      </div>

      {/* Title */}
      <h3 className="text-white font-bold text-xl mb-3 line-clamp-2 leading-tight">
        {item.name}
      </h3>

      {/* Content Preview (Prompts only) */}
      {!isFolder && prompt.content && (
        <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed flex-grow">
          {prompt.content.substring(0, 150)}...
        </p>
      )}

      {/* Meta Info */}
      <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500/70" />
          {prompt.date || 'Hoje'}
        </span>
        {isFolder && folder.children && (
          <>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="font-medium text-blue-400">{folder.children.length} itens</span>
          </>
        )}
        {!isFolder && prompt.category && (
          <>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-medium">
              {prompt.category}
            </span>
          </>
        )}
      </div>

      {/* Tags (Prompts only) */}
      {!isFolder && prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs uppercase font-bold px-3 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/10"
            >
              {tag}
            </span>
          ))}
          {prompt.tags.length > 3 && (
            <span className="text-xs text-gray-500 flex items-center">
              +{prompt.tags.length - 3} mais
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-5 border-t border-white/10 mt-auto">
        <Tooltip content={`Editar ${item.type}`} position="top">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#2979ff] to-[#5b4eff] hover:from-[#2264d1] hover:to-[#4a3fd1] text-white rounded-xl transition-all text-sm font-bold shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50 active:scale-95"
          >
            <Edit2 size={16} /> EDITAR
          </button>
        </Tooltip>

        <Tooltip content="Compartilhar" position="top">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(item);
            }}
            className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all border border-white/10 hover:border-white/30 active:scale-95 group"
          >
            <Share2 size={18} className="group-hover:rotate-12 transition-transform" />
          </button>
        </Tooltip>
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

        {/* Items Grid - Responsive with larger cards */}
        <SlideView
          direction={slideDirection}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {nodes.map((node, index) => (
            <ItemCard
              key={node.id}
              item={node}
              index={index}
              onNavigate={handleNavigate}
              onSelectPrompt={handleSelectPrompt}
              onEdit={handleEdit}
              onShare={handleShare}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              isLocked={isLocked}
              isDragging={dragState.draggedItemId === node.id}
              isJustDropped={justDroppedId === node.id}
            />
          ))}

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-gray-400 border-2 border-dashed border-white/10 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent">
              <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                <FolderOpen size={48} className="opacity-40" />
              </div>
              <p className="text-xl font-bold text-gray-300 mb-2">Esta pasta está vazia</p>
              <p className="text-base text-gray-500">Comece criando uma nova pasta ou prompt.</p>
            </div>
          )}

          {/* New Folder Button */}
          <button
            onClick={handleNewFolder}
            className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#1e2330]/50 to-transparent border-2 border-dashed border-white/10 hover:border-[#2979ff]/50 hover:bg-[#2979ff]/5 rounded-2xl p-8 cursor-pointer transition-all group min-h-[280px]"
            style={{ animationDelay: `${nodes.length * 30}ms` }}
          >
            <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#2979ff] group-hover:scale-110 group-hover:bg-[#2979ff]/10 transition-all border border-white/10 group-hover:border-[#2979ff]/30">
              <Plus size={36} />
            </div>
            <span className="text-lg font-medium text-gray-400 group-hover:text-[#2979ff] transition-colors">
              Nova Pasta
            </span>
          </button>
        </SlideView>
      </div>
    </div>
  );
};

export default SequentialView;

