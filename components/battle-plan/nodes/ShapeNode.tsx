'use client';

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Handle, Position, NodeToolbar, type NodeProps } from '@xyflow/react';
import { Trash2 } from 'lucide-react';

// Types
interface ShapeData {
    label?: string;
    shape?: 'rectangle' | 'circle' | 'diamond' | 'triangle' | 'hexagon' | 'cloud';
    color?: 'slate' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan';
    onLabelChange?: (nodeId: string, label: string) => void;
    onColorChange?: (nodeId: string, color: string) => void;
    onDelete?: (nodeId: string) => void;
}

// Color palette
const colorMap: Record<string, { fill: string; stroke: string; text: string }> = {
    slate: { fill: '#334155', stroke: '#475569', text: 'text-slate-100' },
    indigo: { fill: '#4338ca', stroke: '#6366f1', text: 'text-white' },
    emerald: { fill: '#059669', stroke: '#10b981', text: 'text-white' },
    amber: { fill: '#d97706', stroke: '#f59e0b', text: 'text-white' },
    rose: { fill: '#e11d48', stroke: '#f43f5e', text: 'text-white' },
    cyan: { fill: '#0891b2', stroke: '#06b6d4', text: 'text-white' },
};

const colorOptions = ['slate', 'indigo', 'emerald', 'amber', 'rose', 'cyan'];

function ShapeNode({ id, data, selected }: NodeProps) {
    const shapeData = data as ShapeData;
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(shapeData.label || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const shape = shapeData.shape || 'rectangle';
    const color = shapeData.color || 'indigo';
    const colors = colorMap[color] || colorMap.indigo;

    // Shape dimensions
    const size = 80;
    const width = shape === 'cloud' ? 120 : size;
    const height = shape === 'cloud' ? 80 : size;
    const strokeWidth = 2;

    useEffect(() => {
        setEditValue(shapeData.label || '');
    }, [shapeData.label]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsEditing(true);
    }, []);

    const handleSave = useCallback(() => {
        setIsEditing(false);
        if (shapeData.onLabelChange && editValue !== shapeData.label) {
            shapeData.onLabelChange(id, editValue);
        }
    }, [id, editValue, shapeData]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(shapeData.label || '');
        }
    }, [handleSave, shapeData.label]);

    const handleColorSelect = useCallback((c: string) => {
        if (shapeData.onColorChange) {
            shapeData.onColorChange(id, c);
        }
    }, [id, shapeData]);

    const handleDelete = useCallback(() => {
        if (shapeData.onDelete) {
            shapeData.onDelete(id);
        }
    }, [id, shapeData]);

    const renderShape = () => {
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
                        <polygon points="50,10 90,85 10,85" fill={colors.fill} stroke={colors.stroke} strokeWidth={strokeWidth} />
                    </svg>
                );
            case 'hexagon':
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0">
                        <polygon points="30,10 70,10 95,50 70,90 30,90 5,50" fill={colors.fill} stroke={colors.stroke} strokeWidth={strokeWidth} />
                    </svg>
                );
            case 'cloud':
                return (
                    <svg width="120" height="80" viewBox="0 0 120 80" className="absolute inset-0">
                        <path d="M30 60c-11 0-20-9-20-20 0-8.3 5-15.3 12.3-18.3C26 12.7 35.3 6 47 6c9.3 0 17.3 5.3 21.3 13.3 1.3-.3 2.3-.3 3.7-.3 11 0 20 9 20 20s-9 20-20 20H30z" fill={colors.fill} stroke={colors.stroke} strokeWidth={strokeWidth} />
                    </svg>
                );
            default: // rectangle
                return (
                    <svg width={size} height={size} viewBox="0 0 100 100" className="absolute inset-0">
                        <rect x="5" y="15" width="90" height="70" rx="8" fill={colors.fill} stroke={colors.stroke} strokeWidth={strokeWidth} />
                    </svg>
                );
        }
    };

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
                                className={`w-6 h-6 rounded hover:scale-110 transition-transform ${color === c ? 'ring-2 ring-white' : ''}`}
                                style={{ backgroundColor: colorMap[c].stroke }}
                            />
                        ))}
                    </div>
                </NodeToolbar>
            )}

            {/* Shape - z-50 relative for layering above edges */}
            <div
                className={`relative z-50 group cursor-pointer ${selected ? 'ring-2 ring-blue-500 rounded' : ''}`}
                style={{ width, height }}
                onDoubleClick={handleDoubleClick}
            >
                {renderShape()}

                {/* HANDLES - Aggressive positioning for zero gap (-5px = center inside border) */}
                <Handle
                    type="source"
                    position={Position.Top}
                    id="t"
                    className="!w-3 !h-3 !bg-blue-500 !z-[100] !-top-[5px] !opacity-0 group-hover:!opacity-100 !border-2 !border-white transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Right}
                    id="r"
                    className="!w-3 !h-3 !bg-blue-500 !z-[100] !-right-[5px] !opacity-0 group-hover:!opacity-100 !border-2 !border-white transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="b"
                    className="!w-3 !h-3 !bg-blue-500 !z-[100] !-bottom-[5px] !opacity-0 group-hover:!opacity-100 !border-2 !border-white transition-opacity"
                />
                <Handle
                    type="source"
                    position={Position.Left}
                    id="l"
                    className="!w-3 !h-3 !bg-blue-500 !z-[100] !-left-[5px] !opacity-0 group-hover:!opacity-100 !border-2 !border-white transition-opacity"
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
                            {shapeData.label || 'Label'}
                        </span>
                    )}
                </div>
            </div>
        </>
    );
}

export default memo(ShapeNode);
