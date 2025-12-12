'use client';

import { memo, useState, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Palette } from 'lucide-react';

// Shape types
type NodeShape = 'process' | 'decision' | 'terminal' | 'note';
type NodeStyle = 'default' | 'success' | 'warning' | 'danger';

interface CustomNodeData {
    label: string;
    shape?: NodeShape;
    style?: NodeStyle;
    onLabelChange?: (id: string, label: string) => void;
    onStyleChange?: (id: string, style: NodeStyle) => void;
}

interface CustomNodeProps {
    id: string;
    data: CustomNodeData;
    selected?: boolean;
}

const shapeStyles: Record<NodeShape, string> = {
    process: 'rounded-lg',
    decision: 'rotate-45',
    terminal: 'rounded-full',
    note: 'rounded-sm border-l-4 border-l-amber-500',
};

const colorStyles: Record<NodeStyle, string> = {
    default: 'border-indigo-500 bg-indigo-950/90',
    success: 'border-emerald-500 bg-emerald-950/90',
    warning: 'border-amber-500 bg-amber-950/90',
    danger: 'border-red-500 bg-red-950/90',
};

const styleLabels: Record<NodeStyle, string> = {
    default: '🔵 Padrão',
    success: '✅ Sucesso',
    warning: '⚠️ Atenção',
    danger: '❌ Risco',
};

const CustomNode = memo(({ id, data, selected }: CustomNodeProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(data.label || '');
    const [showStyleMenu, setShowStyleMenu] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const shape: NodeShape = data.shape || 'process';
    const style: NodeStyle = data.style || 'default';
    const shapeClass = shapeStyles[shape];
    const colorClass = colorStyles[style];

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
        else if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(data.label || '');
        }
    };

    const handleStyleSelect = (s: NodeStyle) => {
        setShowStyleMenu(false);
        if (data.onStyleChange) data.onStyleChange(id, s);
    };

    // Decision diamond
    if (shape === 'decision') {
        return (
            <div className="relative">
                <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3" style={{ top: -6 }} />
                <div
                    className={`w-24 h-24 ${colorClass} border-2 shadow-xl rotate-45 flex items-center justify-center ${selected ? 'ring-2 ring-white/50' : ''}`}
                    onDoubleClick={handleDoubleClick}
                >
                    <div className="-rotate-45 text-xs font-medium text-slate-200 text-center px-1 max-w-[80px] truncate">
                        {isEditing ? (
                            <input
                                ref={inputRef}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSave}
                                onKeyDown={handleKeyDown}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full bg-slate-800 text-slate-200 text-xs text-center px-1 py-0.5 rounded border border-slate-600"
                            />
                        ) : (
                            data.label
                        )}
                    </div>
                </div>
                {selected && !isEditing && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowStyleMenu(!showStyleMenu); }}
                        className="absolute -top-3 -right-3 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center shadow-lg z-10"
                    >
                        <Palette size={12} className="text-slate-300" />
                    </button>
                )}
                {showStyleMenu && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 overflow-hidden">
                        {(Object.keys(styleLabels) as NodeStyle[]).map((s) => (
                            <button key={s} onClick={(e) => { e.stopPropagation(); handleStyleSelect(s); }}
                                className={`w-full px-3 py-2 text-xs text-left hover:bg-slate-700 whitespace-nowrap ${style === s ? 'bg-slate-700' : ''}`}>
                                {styleLabels[s]}
                            </button>
                        ))}
                    </div>
                )}
                <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3" style={{ bottom: -6 }} />
            </div>
        );
    }

    // Terminal (capsule)
    if (shape === 'terminal') {
        return (
            <div className="relative">
                <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3" />
                <div
                    className={`px-6 py-4 ${shapeClass} ${colorClass} border-2 shadow-xl min-w-[100px] flex items-center justify-center ${selected ? 'ring-2 ring-white/50' : ''}`}
                    onDoubleClick={handleDoubleClick}
                >
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-slate-800 text-slate-200 text-sm text-center px-2 py-1 rounded border border-slate-600"
                        />
                    ) : (
                        <span className="text-sm font-medium text-slate-200 text-center">{data.label}</span>
                    )}
                </div>
                {selected && !isEditing && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowStyleMenu(!showStyleMenu); }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center shadow-lg z-10"
                    >
                        <Palette size={12} className="text-slate-300" />
                    </button>
                )}
                {showStyleMenu && (
                    <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 overflow-hidden">
                        {(Object.keys(styleLabels) as NodeStyle[]).map((s) => (
                            <button key={s} onClick={(e) => { e.stopPropagation(); handleStyleSelect(s); }}
                                className={`w-full px-3 py-2 text-xs text-left hover:bg-slate-700 whitespace-nowrap ${style === s ? 'bg-slate-700' : ''}`}>
                                {styleLabels[s]}
                            </button>
                        ))}
                    </div>
                )}
                <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3" />
            </div>
        );
    }

    // Note (sticky)
    if (shape === 'note') {
        return (
            <div className="relative">
                <div
                    className={`px-4 py-3 ${shapeClass} bg-amber-900/90 border border-amber-700 shadow-xl min-w-[120px] max-w-[200px] ${selected ? 'ring-2 ring-white/50' : ''}`}
                    onDoubleClick={handleDoubleClick}
                >
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-amber-800 text-amber-100 text-xs px-2 py-1 rounded border border-amber-600"
                        />
                    ) : (
                        <span className="text-xs text-amber-100 whitespace-pre-wrap">{data.label}</span>
                    )}
                </div>
            </div>
        );
    }

    // Default: Process (rectangle)
    return (
        <div className="relative">
            <Handle type="target" position={Position.Top} className="!bg-slate-400 !w-3 !h-3" />
            <div
                className={`px-5 py-3 ${shapeClass} ${colorClass} border-2 shadow-xl min-w-[140px] ${selected ? 'ring-2 ring-white/50' : ''}`}
                onDoubleClick={handleDoubleClick}
            >
                {isEditing ? (
                    <input
                        ref={inputRef}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-slate-800 text-slate-200 text-sm text-center px-2 py-1 rounded border border-slate-600"
                    />
                ) : (
                    <span className="text-sm font-medium text-slate-200 text-center block">{data.label}</span>
                )}
            </div>
            {selected && !isEditing && (
                <button
                    onClick={(e) => { e.stopPropagation(); setShowStyleMenu(!showStyleMenu); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center shadow-lg z-10"
                >
                    <Palette size={12} className="text-slate-300" />
                </button>
            )}
            {showStyleMenu && (
                <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 overflow-hidden">
                    {(Object.keys(styleLabels) as NodeStyle[]).map((s) => (
                        <button key={s} onClick={(e) => { e.stopPropagation(); handleStyleSelect(s); }}
                            className={`w-full px-3 py-2 text-xs text-left hover:bg-slate-700 whitespace-nowrap ${style === s ? 'bg-slate-700' : ''}`}>
                            {styleLabels[s]}
                        </button>
                    ))}
                </div>
            )}
            <Handle type="source" position={Position.Bottom} className="!bg-slate-400 !w-3 !h-3" />
        </div>
    );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
export type { NodeShape, NodeStyle, CustomNodeData };
