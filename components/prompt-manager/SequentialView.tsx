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
  onDragOver: (e: React.DragEvent, item: TreeNode) => void;
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
      onDragOver={(e) => onDragOver(e, folder)}
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
  onDragOver: (e: React.DragEvent, item: TreeNode) => void;
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
      onDragOver={(e) => onDragOver(e, prompt)}
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
    moveItem,
    setCreateFolderModalOpen,
    setCreatePromptModalOpen,
  } = usePromptManagerStore((s) => s.actions);

  // Hold-to-nest state (600ms hold = nest mode)
  const holdTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const [nestModeTarget, setNestModeTarget] = React.useState<string | null>(null);

  // Magnetic collision: track mouse movement direction
  const lastMouseXRef = React.useRef<number>(0);

  // Sticky target: persist last valid target for overshoot tolerance
  const lastValidTargetRef = React.useRef<{ id: string; rect: DOMRect } | null>(null);
  const OVERSHOOT_TOLERANCE = 50; // pixels of forgiveness outside card bounds

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

  const handleDragOver = (e: React.DragEvent, targetItem: TreeNode) => {
    if (isLocked) return;
    e.preventDefault();

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseX = e.clientX;

    // === STICKY TARGET: Save this as the last valid target ===
    lastValidTargetRef.current = { id: targetItem.id, rect };

    // === MAGNETIC COLLISION DETECTION ===
    // Edge tolerance: 30% padding for permissive hitbox
    const leftEdge = rect.left + rect.width * 0.30;
    const rightEdge = rect.left + rect.width * 0.70;

    // Directional priority: Calculate mouse movement vector
    const movingRight = mouseX > lastMouseXRef.current;
    lastMouseXRef.current = mouseX;

    // Determine side: magnetic detection with directional priority
    let isRight: boolean;
    if (mouseX > rightEdge) {
      isRight = true;  // Clearly in RIGHT zone
    } else if (mouseX < leftEdge) {
      isRight = false; // Clearly in LEFT zone
    } else {
      // Dead zone eliminated: Use movement direction as tiebreaker
      isRight = movingRight;
    }

    // If already in nest mode for this target, show nest visual
    if (nestModeTarget === targetItem.id) {
      target.style.borderLeftWidth = '';
      target.style.borderRightWidth = '';
      target.style.transform = 'scale(1.02)';
      target.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
      return;
    }

    // === VISUAL SWAP FEEDBACK: Make target card slide out of the way ===
    // Use aggressive transforms so cards visually move apart during drag
    target.style.transition = 'transform 0.15s ease-out';
    target.style.transform = isRight ? 'translateX(-40px)' : 'translateX(40px)';
    target.style.boxShadow = '';

    if (isRight) {
      target.style.borderLeftWidth = '';
      target.style.borderRightWidth = '4px';
      target.style.borderRightColor = '#fbbf24';
    } else {
      target.style.borderRightWidth = '';
      target.style.borderLeftWidth = '4px';
      target.style.borderLeftColor = '#fbbf24';
    }

    // Start hold-to-nest timer (only for folders)
    // === STRICT BOUNDS FOR NESTING: Only trigger if mouse is INSIDE original card ===
    const mouseY = e.clientY;
    const isInsideOriginalBounds =
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom;

    if (targetItem.type === 'folder' && dragState.draggedItemType === 'folder' && isInsideOriginalBounds) {
      if (!holdTimerRef.current) {
        holdTimerRef.current = setTimeout(() => {
          setNestModeTarget(targetItem.id);
          showToast('Solte agora para mover para dentro', 'info');
        }, 600);
      }
    } else {
      // Cancel timer if mouse moved outside strict bounds
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // === OVERSHOOT TOLERANCE: Check if mouse is still within expanded hitbox ===
    const expandedLeft = rect.left - OVERSHOOT_TOLERANCE;
    const expandedRight = rect.right + OVERSHOOT_TOLERANCE;
    const expandedTop = rect.top - OVERSHOOT_TOLERANCE;
    const expandedBottom = rect.bottom + OVERSHOOT_TOLERANCE;

    const stillInExpandedZone =
      mouseX >= expandedLeft &&
      mouseX <= expandedRight &&
      mouseY >= expandedTop &&
      mouseY <= expandedBottom;

    // If still in expanded zone, REAPPLY visuals (not just keep them)
    if (stillInExpandedZone) {
      // === UNIFIED VISUAL SYNC: Reapply both indicator AND transform ===
      const centerX = rect.left + rect.width / 2;
      const isRight = mouseX > centerX;

      // Reapply transform (slide effect)
      target.style.transition = 'transform 0.15s ease-out';
      target.style.transform = isRight ? 'translateX(-40px)' : 'translateX(40px)';

      // Reapply indicator (yellow line)
      if (isRight) {
        target.style.borderLeftWidth = '';
        target.style.borderRightWidth = '4px';
        target.style.borderRightColor = '#fbbf24';
      } else {
        target.style.borderRightWidth = '';
        target.style.borderLeftWidth = '4px';
        target.style.borderLeftColor = '#fbbf24';
      }
      return;
    }

    // Reset all visuals (user has moved far away)
    target.style.transition = '';
    target.style.borderLeftWidth = '';
    target.style.borderLeftColor = '';
    target.style.borderRightWidth = '';
    target.style.borderRightColor = '';
    target.style.transform = '';
    target.style.boxShadow = '';

    // Clear hold timer
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setNestModeTarget(null);
    lastValidTargetRef.current = null;
  };

  const handleDrop = (e: React.DragEvent, targetItem: TreeNode) => {
    if (isLocked) return;
    e.preventDefault();

    // Reset all visuals
    const target = e.currentTarget as HTMLElement;
    target.style.borderLeftWidth = '';
    target.style.borderLeftColor = '';
    target.style.borderRightWidth = '';
    target.style.borderRightColor = '';
    target.style.transform = '';
    target.style.boxShadow = '';

    // Clear hold timer
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    const draggedId = dragState.draggedItemId;
    if (!draggedId || draggedId === targetItem.id) {
      setDragState({ draggedItemId: null, draggedItemType: null });
      setNestModeTarget(null);
      return;
    }

    // HOLD-TO-NEST: If in nest mode, move INTO the folder
    if (nestModeTarget === targetItem.id && targetItem.type === 'folder') {
      moveItem(draggedId, targetItem.id);
      showToast(`Movido para dentro de "${targetItem.name}"`, 'success');
    }
    // QUICK DROP: Swap positions (only same type)
    else if (dragState.draggedItemType === targetItem.type) {
      swapItems(draggedId, targetItem.id);
    }
    else {
      showToast('Só é possível reordenar itens do mesmo tipo', 'info');
    }

    setDragState({ draggedItemId: null, draggedItemType: null });
    setNestModeTarget(null);
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
  // === SOVEREIGN YELLOW LINE: If indicator was visible, execute the swap ===
  const handleDragEnd = () => {
    const draggedId = dragState.draggedItemId;
    const storedTarget = lastValidTargetRef.current;

    // === SOVEREIGN DROP: If we had a valid target, execute the swap ===
    if (draggedId && storedTarget && draggedId !== storedTarget.id) {
      // Check if we're in nest mode (hold-to-nest)
      if (nestModeTarget === storedTarget.id) {
        // Find the target item to check if it's a folder
        const targetNode = nodes.find(n => n.id === storedTarget.id);
        if (targetNode?.type === 'folder' && dragState.draggedItemType === 'folder') {
          moveItem(draggedId, storedTarget.id);
          showToast(`Movido para dentro da pasta`, 'success');
        }
      } else {
        // Regular swap: same type items only
        const draggedNode = nodes.find(n => n.id === draggedId);
        const targetNode = nodes.find(n => n.id === storedTarget.id);
        if (draggedNode && targetNode && draggedNode.type === targetNode.type) {
          swapItems(draggedId, storedTarget.id);
        }
      }
    }

    // Clear drag state
    setDragState({ draggedItemId: null, draggedItemType: null });
    setNestModeTarget(null);
    lastValidTargetRef.current = null;

    // Clear any pending timers
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }

    // HARD RESET: Clean up ALL cards' visual states
    // This prevents phantom/stuck drag states
    const allCards = document.querySelectorAll('[draggable="true"]');
    allCards.forEach((card) => {
      const el = card as HTMLElement;
      el.style.transition = '';
      el.style.borderLeftWidth = '';
      el.style.borderLeftColor = '';
      el.style.borderRightWidth = '';
      el.style.borderRightColor = '';
      el.style.transform = '';
      el.style.boxShadow = '';
      el.style.opacity = '';
    });
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


