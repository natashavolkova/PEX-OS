'use client';

import React from 'react';
import { MarkerType, type Edge } from '@xyflow/react';
import {
    Minus,
    TrendingUp,
    CornerDownRight,
    ArrowRight,
    Circle,
} from 'lucide-react';

interface EdgeToolbarProps {
    selectedEdge: Edge | null;
    position: { x: number; y: number };
    onUpdateEdge: (updates: {
        type?: string;
        style?: Record<string, string>;
        markerEnd?: { type: MarkerType; color: string } | undefined;
    }) => void;
    onClose: () => void;
}

export default function EdgeToolbar({
    selectedEdge,
    position,
    onUpdateEdge,
    onClose,
}: EdgeToolbarProps) {
    if (!selectedEdge) return null;

    const currentType = selectedEdge.type || 'default';
    // strokeDasharray can be string or number, coerce to string
    const rawDash = (selectedEdge.style as Record<string, unknown>)?.strokeDasharray;
    const currentDash = typeof rawDash === 'string' ? rawDash : (rawDash !== undefined ? String(rawDash) : '0');
    const hasMarker = !!selectedEdge.markerEnd;

    return (
        <>
            {/* Backdrop to close on click outside */}
            <div
                className="fixed inset-0 z-40"
                onClick={onClose}
            />

            {/* Toolbar */}
            <div
                className="absolute z-50 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 flex items-center gap-1"
                style={{
                    left: position.x,
                    top: position.y - 60,
                    transform: 'translateX(-50%)',
                }}
            >
                {/* GROUP A: Path Type */}
                <div className="flex items-center gap-0.5 px-2 border-r border-slate-700">
                    <button
                        onClick={() => onUpdateEdge({ type: 'straight' })}
                        className={`p-2 rounded-lg transition-all ${currentType === 'straight'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        title="Linha Reta"
                    >
                        <Minus size={16} />
                    </button>
                    <button
                        onClick={() => onUpdateEdge({ type: 'default' })}
                        className={`p-2 rounded-lg transition-all ${currentType === 'default'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        title="Curva Bezier"
                    >
                        <TrendingUp size={16} />
                    </button>
                    <button
                        onClick={() => onUpdateEdge({ type: 'smoothstep' })}
                        className={`p-2 rounded-lg transition-all ${currentType === 'smoothstep' || currentType === 'step'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        title="Cotovelo"
                    >
                        <CornerDownRight size={16} />
                    </button>
                </div>

                {/* GROUP B: Stroke Style */}
                <div className="flex items-center gap-0.5 px-2 border-r border-slate-700">
                    <button
                        onClick={() => onUpdateEdge({ style: { strokeDasharray: '0' } })}
                        className={`p-2 rounded-lg transition-all ${currentDash === '0' || currentDash === ''
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        title="Linha Sólida"
                    >
                        <div className="w-4 h-0.5 bg-current" />
                    </button>
                    <button
                        onClick={() => onUpdateEdge({ style: { strokeDasharray: '5, 5' } })}
                        className={`p-2 rounded-lg transition-all ${currentDash === '5, 5'
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        title="Linha Tracejada"
                    >
                        <div className="flex gap-0.5">
                            <div className="w-1.5 h-0.5 bg-current" />
                            <div className="w-1.5 h-0.5 bg-current" />
                        </div>
                    </button>
                    <button
                        onClick={() => onUpdateEdge({ style: { strokeDasharray: '2, 2' } })}
                        className={`p-2 rounded-lg transition-all ${currentDash === '2, 2'
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        title="Linha Pontilhada"
                    >
                        <div className="flex gap-0.5">
                            <div className="w-0.5 h-0.5 bg-current rounded-full" />
                            <div className="w-0.5 h-0.5 bg-current rounded-full" />
                            <div className="w-0.5 h-0.5 bg-current rounded-full" />
                        </div>
                    </button>
                </div>

                {/* GROUP C: Markers */}
                <div className="flex items-center gap-0.5 px-2">
                    <button
                        onClick={() => onUpdateEdge({ markerEnd: undefined })}
                        className={`p-2 rounded-lg transition-all ${!hasMarker
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        title="Sem Seta"
                    >
                        <Circle size={14} />
                    </button>
                    <button
                        onClick={() => onUpdateEdge({ markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' } })}
                        className={`p-2 rounded-lg transition-all ${hasMarker
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                        title="Com Seta"
                    >
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </>
    );
}
