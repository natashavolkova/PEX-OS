'use client';

// ============================================================================
// MILLER COLUMNS - COLUMN WRAPPER COMPONENT
// Wraps individual columns with header and empty states
// ============================================================================

import React from 'react';
import { Plus, FolderOpen } from 'lucide-react';
import { Tooltip } from '../TooltipWrapper';
import { ColumnItem } from './ColumnItem';
import type { TreeNode } from '@/types/prompt-manager';

interface ColumnWrapperProps {
  title: string;
  icon: React.ReactNode;
  items: TreeNode[];
  selectedId: string | null;
  onSelect: (item: TreeNode) => void;
  onEdit: (item: TreeNode) => void;
  onDelete: (item: TreeNode) => void;
  onContextMenu: (e: React.MouseEvent, item: TreeNode) => void;
  onNewItem?: () => void;
  newItemLabel?: string;
  emptyTitle: string;
  emptyDescription: string;
  columnType: 'root' | 'subfolder' | 'prompt';
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isLocked: boolean;
  draggedItemId: string | null;
  justDroppedId: string | null;
  onDragStart: (e: React.DragEvent, item: TreeNode) => void;
  onItemDragOver: (e: React.DragEvent) => void;
  onItemDragLeave: (e: React.DragEvent) => void;
  onItemDrop: (e: React.DragEvent, item: TreeNode) => void;
}

export const ColumnWrapper: React.FC<ColumnWrapperProps> = ({
  title,
  icon,
  items,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  onContextMenu,
  onNewItem,
  newItemLabel,
  emptyTitle,
  emptyDescription,
  columnType,
  onDragOver,
  onDrop,
  isLocked,
  draggedItemId,
  justDroppedId,
  onDragStart,
  onItemDragOver,
  onItemDragLeave,
  onItemDrop,
}) => {
  return (
    <div
      className={`
        min-w-[280px] max-w-[280px] flex flex-col shrink-0
        ${columnType === 'prompt' ? 'min-w-[320px] max-w-[320px]' : ''} bg-[#0f111a]
      `}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-white/5 flex justify-between items-center bg-[#13161c]">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          {icon}
          {title}
        </span>
        {onNewItem && (
          <Tooltip content={newItemLabel || 'Novo'} position="bottom">
            <button
              onClick={onNewItem}
              disabled={isLocked}
              className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
            </button>
          </Tooltip>
        )}
      </div>

      {/* Column Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500/50 p-4 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <FolderOpen size={20} className="opacity-50" />
            </div>
            <p className="text-xs font-medium text-gray-400">{emptyTitle}</p>
            <p className="text-[10px] mt-1 opacity-60 max-w-[150px]">{emptyDescription}</p>
          </div>
        ) : (
          items.map((item, index) => (
            <ColumnItem
              key={item.id}
              item={item}
              index={index}
              isSelected={selectedId === item.id}
              onClick={() => onSelect(item)}
              onEdit={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              onContextMenu={(e) => onContextMenu(e, item)}
              onDragStart={(e) => onDragStart(e, item)}
              onDragOver={onItemDragOver}
              onDragLeave={onItemDragLeave}
              onDrop={(e) => onItemDrop(e, item)}
              isLocked={isLocked}
              isDragging={draggedItemId === item.id}
              isJustDropped={justDroppedId === item.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
