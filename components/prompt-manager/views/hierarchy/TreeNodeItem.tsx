'use client';

// ============================================================================
// HIERARCHY VIEW - TREE NODE ITEM COMPONENT
// Recursive tree node renderer with expand/collapse and filtering
// ============================================================================

import React, { useCallback } from 'react';
import {
  ChevronRight,
  Folder,
  FileText,
  Settings,
  Edit2,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { AnimatedTreeItem } from '../../MotionWrappers';
import type { TreeNode, Folder as FolderType, Prompt } from '@/types/prompt-manager';

interface TreeNodeProps {
  node: TreeNode;
  level?: number;
  onSelect: (prompt: Prompt) => void;
  onEdit: (node: TreeNode) => void;
  onDelete: (node: TreeNode) => void;
  onContextMenu: (e: React.MouseEvent, node: TreeNode) => void;
  isLocked: boolean;
  selectedPromptId?: string;
  searchQuery: string;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}

export const TreeNodeItem: React.FC<TreeNodeProps> = ({
  node,
  level = 0,
  onSelect,
  onEdit,
  onDelete,
  onContextMenu,
  isLocked,
  selectedPromptId,
  searchQuery,
  expandedIds,
  onToggleExpand,
}) => {
  const isFolder = node.type === 'folder';
  const hasChildren = isFolder && (node as FolderType).children?.length > 0;
  const isExpanded = expandedIds.has(node.id);
  const isNodeSelected = node.type === 'prompt' && selectedPromptId === node.id;

  // Filter check for search
  const matchesSearch = searchQuery
    ? node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.type === 'prompt' &&
        ((node as Prompt).content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (node as Prompt).tags?.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase())
          )))
    : true;

  // Check if any child matches
  const hasMatchingChildren = useCallback((): boolean => {
    if (!isFolder || !searchQuery) return false;
    
    const checkChildren = (children: TreeNode[]): boolean => {
      for (const child of children) {
        if (child.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return true;
        }
        if (child.type === 'folder' && (child as FolderType).children) {
          if (checkChildren((child as FolderType).children)) {
            return true;
          }
        }
      }
      return false;
    };
    
    return checkChildren((node as FolderType).children || []);
  }, [isFolder, node, searchQuery]);

  if (searchQuery && !matchesSearch && !hasMatchingChildren()) {
    return null;
  }

  const renderIcon = () => {
    if (node.emoji) {
      return <span className="text-base leading-none w-5 text-center shrink-0">{node.emoji}</span>;
    }
    if (isFolder) {
      if ((node as FolderType).isSystem) {
        return <Settings size={16} className="text-gray-300 shrink-0" />;
      }
      return isExpanded ? (
        <FolderOpen size={16} className="text-[#2979ff] shrink-0" />
      ) : (
        <Folder size={16} className="text-gray-400 shrink-0" />
      );
    }
    return <FileText size={14} className="text-gray-400 shrink-0" />;
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFolder) {
      onToggleExpand(node.id);
    } else {
      onSelect(node as Prompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as unknown as React.MouseEvent);
    }
    if (e.key === 'ArrowRight' && isFolder && !isExpanded) {
      onToggleExpand(node.id);
    }
    if (e.key === 'ArrowLeft' && isFolder && isExpanded) {
      onToggleExpand(node.id);
    }
  };

  const childrenCount = isFolder ? (node as FolderType).children?.length || 0 : 0;

  return (
    <div className="flex flex-col">
      <div
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onContextMenu={(e) => onContextMenu(e, node)}
        tabIndex={0}
        role="button"
        aria-label={`${isFolder ? 'Pasta' : 'Prompt'}: ${node.name}`}
        aria-expanded={isFolder ? isExpanded : undefined}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
        className={`
          group flex items-center justify-between transition-all duration-150 
          cursor-pointer text-gray-300 border-l-[3px] my-0.5 rounded-r-md py-2
          ${isNodeSelected
            ? 'bg-gradient-to-r from-[#2979ff]/10 to-transparent border-l-[#2979ff] text-white'
            : 'border-l-transparent hover:bg-gradient-to-r hover:from-white/5 hover:to-transparent hover:border-l-white/20'
          }
          ${matchesSearch && searchQuery ? 'bg-[#2979ff]/5' : ''}
        `}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(node.id);
              }}
              className="p-0.5 hover:bg-white/10 rounded transition-colors"
            >
              <ChevronRight
                size={14}
                className={`text-gray-400 transition-transform duration-200 ease-out ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            </button>
          ) : (
            <div className="w-4" />
          )}

          {renderIcon()}

          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className={`
                truncate
                ${isFolder ? 'font-medium text-sm' : 'text-[13px] font-normal text-gray-300 group-hover:text-gray-200'}
              `}
            >
              {node.name}
            </span>

            {isFolder && childrenCount > 0 && (
              <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                {childrenCount}
              </span>
            )}

            {isFolder && (node as FolderType).isSystem && (
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                SYS
              </span>
            )}

            {!isFolder && (node as Prompt).tags && (node as Prompt).tags!.length > 0 && (
              <div className="flex items-center gap-1">
                {(node as Prompt).tags!.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] uppercase tracking-[0.5px] text-gray-400 border border-white/10 px-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
                {(node as Prompt).tags!.length > 2 && (
                  <span className="text-[9px] text-gray-500">
                    +{(node as Prompt).tags!.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 mr-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(node);
            }}
            className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Editar"
          >
            <Edit2 size={12} />
          </button>
          {!isLocked && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(node);
              }}
              className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
              title="Excluir"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {hasChildren && (
        <AnimatedTreeItem isExpanded={isExpanded}>
          {(node as FolderType).children.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onContextMenu={onContextMenu}
              isLocked={isLocked}
              selectedPromptId={selectedPromptId}
              searchQuery={searchQuery}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </AnimatedTreeItem>
      )}
    </div>
  );
};
