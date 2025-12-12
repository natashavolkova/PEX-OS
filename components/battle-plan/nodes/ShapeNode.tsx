'use client';

import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position, NodeToolbar } from '@xyflow/react';
import { Trash2, Palette } from 'lucide-react';

interface ShapeNodeData {
    label: string;
    shape?: 'rectangle' | 'circle' | 'diamond' | 'triangle';
    color?: string;
    onLabelChange?: (id: string, label: string) => void;
    onColorChange?: (id: string, color: string) => void;
    onDelete?: (id: string) => void;
}

interface ShapeNodeProps {
    id: string;
    data: ShapeNodeData;
    selected?: boolean;
}

const colorMap: Record<string, { fill: string; stroke: string; text: string }> = {
    slate: { fill: '#1e293b', stroke: '#475569', text: 'text-slate-200' },
    indigo: { fill: '#312e81', stroke: '#6366f1', text: 'text-indigo-200' },
    emerald: { fill: '#064e3b', stroke: '#10b981', text: 'text-emerald-200' },
    amber: { fill: '#78350f', stroke: '#f59e0b', text: 'text-amber-200' },
    rose: { fill: '#881337', stroke: '#f43f5e', text: 'text-rose-200' },
    cyan: { fill: '#164e63', stroke: '#06b6d4', text: 'text-cyan-200' },
};

const colorOptions = Object.keys(colorMap);

const ShapeNode = memo(({ id, data, selected }: ShapeNodeProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(data.label || '');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const shape = data.shape || 'rectangle';
    const color = data.color || 'indigo';
    const colors = colorMap[color] || colorMap.indigo;

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
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
        e.stopPropagation();
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(data.label || '');
        }
    };

    const handleColorSelect = (newColor: string) => {
        setShowColorPicker(false);
        if (data.onColorChange) {
            data.onColorChange(id, newColor);
        }
    };

    // SVG Shapes
    const renderShape = () => {
        const size = 100;
        const strokeWidth = 2;

        switch (shape) {
            case 'circle':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0">
                        <circle cx="50" cy="50" r="45" fill={colors.fill} stroke={colors.stroke} strokeWidth={strokeWidth} />
                    </svg>
                );
            case 'diamond':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0">
                        <polygon points="50,5 95,50 50,95 5,50" fill={colors.fill} stroke={colors.stroke} strokeWidth={strokeWidth} />
                    </svg>
                );
            case 'triangle':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0">
                        <polygon points="50,5 95,90 5,90" fill={colors.fill} stroke={colors.stroke} strokeWidth={strokeWidth} />
                    </svg>
                );
            default: // rectangle
                return (
                    <svg width="120" height="60" viewBox="0 0 120 60" className="absolute inset-0">
                        <rect x="2" y="2" width="116" height="56" rx="8" fill={colors.fill} stroke={colors.stroke} strokeWidth={strokeWidth} />
                    </svg>
                );
        }
    };

    const isSquare = shape !== 'rectangle';
    const width = isSquare ? 100 : 120;
    const height = isSquare ? 100 : 60;

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
                                className={`w-6 h-6 rounded hover:scale-110 transition-transform ${color === c ? 'ring-2 ring-white' : ''}`}
                                style={{ backgroundColor: colorMap[c].stroke }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Shape */}
            <div
                className={`relative group cursor-pointer ${selected ? 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''}`}
                style={{ width, height }}
                onDoubleClick={handleDoubleClick}
            >
                {renderShape()}

                {/* Handles */}
                <Handle
                    type="target"
                    position={Position.Top}
                    className="!bg-slate-400 !w-2 !h-2 !opacity-0 group-hover:!opacity-100 transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="!bg-slate-400 !w-2 !h-2 !opacity-0 group-hover:!opacity-100 transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Left}
                    id="left"
                    className="!bg-slate-400 !w-2 !h-2 !opacity-0 group-hover:!opacity-100 transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    id="right"
                    className="!bg-slate-400 !w-2 !h-2 !opacity-0 group-hover:!opacity-100 transition-opacity"
                />

                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-center p-2">
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full bg-transparent ${colors.text} text-xs text-center outline-none`}
                        />
                    ) : (
                        <span className={`text-xs font-medium ${colors.text} text-center truncate`}>
                            {data.label || 'Label'}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
});

ShapeNode.displayName = 'ShapeNode';

export default ShapeNode;
export type { ShapeNodeData };
