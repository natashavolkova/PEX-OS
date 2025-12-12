'use client';

import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';
import { Trash2, Palette } from 'lucide-react';

interface StickyNoteNodeData {
    label: string;
    color?: string;
    onLabelChange?: (id: string, label: string) => void;
    onColorChange?: (id: string, color: string) => void;
    onDelete?: (id: string) => void;
}

interface StickyNoteNodeProps {
    id: string;
    data: StickyNoteNodeData;
    selected?: boolean;
}

const colorMap: Record<string, { bg: string; text: string; shadow: string }> = {
    yellow: { bg: 'bg-yellow-200', text: 'text-yellow-900', shadow: 'shadow-yellow-300/50' },
    pink: { bg: 'bg-pink-200', text: 'text-pink-900', shadow: 'shadow-pink-300/50' },
    blue: { bg: 'bg-blue-200', text: 'text-blue-900', shadow: 'shadow-blue-300/50' },
    green: { bg: 'bg-green-200', text: 'text-green-900', shadow: 'shadow-green-300/50' },
    orange: { bg: 'bg-orange-200', text: 'text-orange-900', shadow: 'shadow-orange-300/50' },
    purple: { bg: 'bg-purple-200', text: 'text-purple-900', shadow: 'shadow-purple-300/50' },
};

const colorOptions = ['yellow', 'pink', 'blue', 'green', 'orange', 'purple'];

const StickyNoteNode = memo(({ id, data, selected }: StickyNoteNodeProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(data.label || '');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const color = data.color || 'yellow';
    const colors = colorMap[color] || colorMap.yellow;

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.select();
        }
    }, [isEditing]);

    useEffect(() => {
        setEditValue(data.label || '');
    }, [data.label]);

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditValue(data.label || '');
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        const trimmed = editValue.trim();
        if (trimmed && trimmed !== data.label && data.onLabelChange) {
            data.onLabelChange(id, trimmed);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(data.label || '');
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
        e.stopPropagation();
    };

    const handleColorSelect = (newColor: string) => {
        setShowColorPicker(false);
        if (data.onColorChange) {
            data.onColorChange(id, newColor);
        }
    };

    return (
        <>
            {/* Floating Toolbar */}
            <NodeToolbar isVisible={selected} position={Position.Top} className="flex gap-1">
                <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                    title="Mudar cor"
                >
                    <Palette size={14} />
                </button>
                <button
                    onClick={() => data.onDelete?.(id)}
                    className="p-1.5 bg-red-900/80 hover:bg-red-800 rounded text-red-300"
                    title="Excluir"
                >
                    <Trash2 size={14} />
                </button>
            </NodeToolbar>

            {/* Color Picker */}
            {showColorPicker && selected && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 rounded-lg p-2 shadow-xl z-50">
                    <div className="grid grid-cols-3 gap-1">
                        {colorOptions.map((c) => (
                            <button
                                key={c}
                                onClick={() => handleColorSelect(c)}
                                className={`w-6 h-6 rounded ${colorMap[c].bg} hover:scale-110 transition-transform ${color === c ? 'ring-2 ring-slate-500' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Sticky Note */}
            <div
                className={`relative w-32 h-32 ${colors.bg} ${colors.shadow} shadow-lg rounded-sm cursor-pointer group ${selected ? 'ring-2 ring-indigo-500' : ''}`}
                onDoubleClick={handleDoubleClick}
                style={{ fontFamily: "'Comic Sans MS', cursive, sans-serif" }}
            >
                {/* Folded corner effect */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-br from-black/10 to-transparent"
                    style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}
                />

                {/* UNIVERSAL 4-WAY HANDLES - Standardized IDs: t, r, b, l */}
                <Handle
                    type="source"
                    position={Position.Top}
                    id="t"
                    isConnectable={true}
                    className="!bg-blue-500 !w-3 !h-3 !border-2 !border-slate-900 !opacity-0 group-hover:!opacity-100 transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    id="r"
                    isConnectable={true}
                    className="!bg-blue-500 !w-3 !h-3 !border-2 !border-slate-900 !opacity-0 group-hover:!opacity-100 transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="b"
                    isConnectable={true}
                    className="!bg-blue-500 !w-3 !h-3 !border-2 !border-slate-900 !opacity-0 group-hover:!opacity-100 transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Left}
                    id="l"
                    isConnectable={true}
                    className="!bg-blue-500 !w-3 !h-3 !border-2 !border-slate-900 !opacity-0 group-hover:!opacity-100 transition-opacity"
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
                            {data.label || 'Clique duas vezes'}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
});

StickyNoteNode.displayName = 'StickyNoteNode';

export default StickyNoteNode;
export type { StickyNoteNodeData };
