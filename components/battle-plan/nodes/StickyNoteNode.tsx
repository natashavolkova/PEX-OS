'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Handle, Position, NodeToolbar, type NodeProps } from '@xyflow/react';
import { Trash2 } from 'lucide-react';

// Types
interface StickyNoteData {
    label?: string;
    color?: 'yellow' | 'pink' | 'blue' | 'green' | 'orange' | 'purple';
    onLabelChange?: (nodeId: string, label: string) => void;
    onColorChange?: (nodeId: string, color: string) => void;
    onDelete?: (nodeId: string) => void;
}

// Color palette - pastel Miro style
const colorMap: Record<string, { bg: string; text: string; shadow: string }> = {
    yellow: { bg: 'bg-yellow-200', text: 'text-yellow-900', shadow: 'shadow-yellow-300/50' },
    pink: { bg: 'bg-pink-200', text: 'text-pink-900', shadow: 'shadow-pink-300/50' },
    blue: { bg: 'bg-blue-200', text: 'text-blue-900', shadow: 'shadow-blue-300/50' },
    green: { bg: 'bg-green-200', text: 'text-green-900', shadow: 'shadow-green-300/50' },
    orange: { bg: 'bg-orange-200', text: 'text-orange-900', shadow: 'shadow-orange-300/50' },
    purple: { bg: 'bg-purple-200', text: 'text-purple-900', shadow: 'shadow-purple-300/50' },
};

const colorOptions = ['yellow', 'pink', 'blue', 'green', 'orange', 'purple'];

function StickyNoteNode({ id, data, selected }: NodeProps) {
    const noteData = data as StickyNoteData;
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(noteData.label || '');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const color = noteData.color || 'yellow';
    const colors = colorMap[color] || colorMap.yellow;

    useEffect(() => {
        setEditValue(noteData.label || '');
    }, [noteData.label]);

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    }, []);

    const handleSave = useCallback(() => {
        setIsEditing(false);
        if (noteData.onLabelChange && editValue !== noteData.label) {
            noteData.onLabelChange(id, editValue);
        }
    }, [id, editValue, noteData]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(noteData.label || '');
        }
    }, [handleSave, noteData.label]);

    const handleColorSelect = useCallback((c: string) => {
        if (noteData.onColorChange) {
            noteData.onColorChange(id, c);
        }
    }, [id, noteData]);

    const handleDelete = useCallback(() => {
        if (noteData.onDelete) {
            noteData.onDelete(id);
        }
    }, [id, noteData]);

    return (
        <>
            {/* Toolbar */}
            {selected && (
                <NodeToolbar isVisible position={Position.Top} offset={8}>
                    <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 shadow-xl border border-slate-600">
                        <button
                            onClick={handleDelete}
                            className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                            title="Excluir"
                        >
                            <Trash2 size={14} />
                        </button>
                        <div className="w-px h-4 bg-slate-600 mx-1" />
                        {colorOptions.map((c) => (
                            <button
                                key={c}
                                onClick={() => handleColorSelect(c)}
                                className={`w-5 h-5 rounded-full hover:scale-110 transition-transform ${color === c ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-800' : ''}`}
                                style={{ backgroundColor: { yellow: '#fde047', pink: '#f9a8d4', blue: '#93c5fd', green: '#86efac', orange: '#fdba74', purple: '#d8b4fe' }[c] }}
                            />
                        ))}
                    </div>
                </NodeToolbar>
            )}

            {/* Sticky Note - z-50 relative for layering above edges */}
            <div
                className={`relative z-50 w-32 h-32 ${colors.bg} ${colors.shadow} shadow-lg rounded-sm cursor-pointer group ${selected ? 'ring-2 ring-blue-500' : ''}`}
                onDoubleClick={handleDoubleClick}
                style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
            >
                {/* Folded corner effect */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-black/10 to-transparent"
                    style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                />

                {/* CLEAN HANDLES - Only 1 per side, type="source" with ConnectionMode.Loose */}
                <Handle
                    type="source"
                    position={Position.Top}
                    id="t"
                    className="!w-3 !h-3 !bg-blue-500 !z-[100] !-top-1.5 !opacity-0 group-hover:!opacity-100 !border-2 !border-white transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    id="r"
                    className="!w-3 !h-3 !bg-blue-500 !z-[100] !-right-1.5 !opacity-0 group-hover:!opacity-100 !border-2 !border-white transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="b"
                    className="!w-3 !h-3 !bg-blue-500 !z-[100] !-bottom-1.5 !opacity-0 group-hover:!opacity-100 !border-2 !border-white transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Left}
                    id="l"
                    className="!w-3 !h-3 !bg-blue-500 !z-[100] !-left-1.5 !opacity-0 group-hover:!opacity-100 !border-2 !border-white transition-opacity"
                />

                {/* Content */}
                <div className="p-3 h-full flex items-center justify-center">
                    {isEditing ? (
                        <textarea
                            ref={textareaRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full h-full bg-transparent ${colors.text} text-sm resize-none outline-none text-center`}
                            style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
                        />
                    ) : (
                        <span className={`text-sm ${colors.text} text-center break-words line-clamp-5`}>
                            {noteData.label || 'Clique duas vezes'}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
}

export default memo(StickyNoteNode);
