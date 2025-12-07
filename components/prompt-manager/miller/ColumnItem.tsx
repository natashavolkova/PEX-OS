'use client';

// ============================================================================
// MILLER COLUMNS - COLUMN ITEM COMPONENT
// Individual item display within Miller Columns
// ============================================================================

import React from 'react';
import { Edit2, Trash2, ChevronRight } from 'lucide-react';
import type { TreeNode, Folder as FolderType, Prompt } from '@/types/prompt-manager';

interface ColumnItemProps {
  item: TreeNode;
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isLocked: boolean;
  isDragging: boolean;
  isJustDropped: boolean;
}

export const ColumnItem: React.FC<ColumnItemProps> = ({
  item,
  index,
  isSelected,
  onClick,
  onEdit,
  onDelete,
  onContextMenu,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  isLocked,
  isDragging,
  isJustDropped,
}) => {
  const isFolder = item.type === 'folder';

  return (
    <div
      draggable={!isLocked}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      onContextMenu={onContextMenu}
      data-item-id={item.id}
      className={`
        group flex items-center justify-between p-3 rounded-lg cursor-pointer 
        transition-[background,border,transform,opacity] duration-200 border
        ${isSelected
          ? 'bg-[#2979ff]/10 border-[#2979ff]/30'
          : 'bg-[#1e2330] border-white/5 hover:border-white/20'}
        ${isDragging ? 'opacity-40 scale-95' : ''}
        ${isJustDropped ? 'ring-2 ring-green-500' : ''}
        animate-stagger-in
      `}
      style={{
        animationDelay: `${index * 50}ms`,
        willChange: 'transform, opacity',
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg">{item.emoji || (isFolder ? '📁' : '📄')}</span>
        <div className="min-w-0">
          <p className={`text-sm font-medium truncate ${isSelected ? 'text-white' : 'text-gray-300'}`}>
            {item.name}
          </p>
          <p className="text-[10px] text-gray-400">
            {isFolder
              ? `${(item as FolderType).children?.length || 0} itens`
              : (item as Prompt).category || 'Prompt'
            }
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onEdit}
          className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <Edit2 size={12} />
        </button>
        {!isLocked && onDelete && (
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
          >
            <Trash2 size={12} />
          </button>
        )}
        {isFolder && (
          <ChevronRight
            size={14}
            className={`text-gray-400 transition-colors ml-1 ${isSelected ? 'text-[#2979ff]' : ''}`}
          />
        )}
      </div>
    </div>
  );
};
