'use client';

import React, { useState, useEffect } from 'react';
import { Shapes, StickyNote, Waypoints } from 'lucide-react';
import { MarkerType, type Edge } from '@xyflow/react';

// Miro Palette - Exact colors from spec
const stickyColors = [
    { id: 'yellow', hex: '#ffef9e', label: 'Amarelo' },
    { id: 'green', hex: '#cbf0f8', label: 'Verde' },
    { id: 'pink', hex: '#ffc7e9', label: 'Rosa' },
    { id: 'blue', hex: '#b3e5fc', label: 'Azul' },
];

// Shape definitions with SVG paths
const shapes = [
    { id: 'rectangle', label: 'Retângulo', svg: <rect x="4" y="8" width="32" height="24" rx="2" fill="currentColor" /> },
    { id: 'circle', label: 'Círculo', svg: <circle cx="20" cy="20" r="14" fill="currentColor" /> },
    { id: 'triangle', label: 'Triângulo', svg: <polygon points="20,6 36,34 4,34" fill="currentColor" /> },
    { id: 'diamond', label: 'Losango', svg: <polygon points="20,4 36,20 20,36 4,20" fill="currentColor" /> },
    { id: 'hexagon', label: 'Hexágono', svg: <polygon points="14,6 26,6 34,20 26,34 14,34 6,20" fill="currentColor" /> },
    { id: 'cloud', label: 'Nuvem', svg: <path d="M12 28c-3.3 0-6-2.7-6-6 0-2.5 1.5-4.6 3.7-5.5C10.3 13.4 13 11 16.5 11c2.8 0 5.2 1.6 6.4 4 .4-.1.7-.1 1.1-.1 3.3 0 6 2.7 6 6s-2.7 6-6 6H12z" fill="currentColor" /> },
];

type PanelType = 'shapes' | 'sticky' | 'connectors' | null;

// Edge configuration types
export interface EdgeConfig {
    type: 'bezier' | 'smoothstep' | 'straight';  // 3 TYPES: Curva, Ortogonal, Reta
    strokeStyle: 'solid' | 'dashed' | 'dotted';
    markerStart: 'none' | 'arrow' | 'circle';
    markerEnd: 'none' | 'arrowClosed' | 'arrowOpen';
    animated: boolean;
}

interface LibrarySidebarProps {
    className?: string;
    // Edge configuration
    edgeConfig: EdgeConfig;
    onEdgeConfigChange: (config: Partial<EdgeConfig>) => void;
    // Selected edges from canvas
    selectedEdges: Edge[];
    onApplyToSelected: (config: Partial<EdgeConfig>) => void;
    // Mass selection
    onSelectAllEdges: () => void;
    totalEdgesCount: number;
}

export default function LibrarySidebar({
    className = '',
    edgeConfig,
    onEdgeConfigChange,
    selectedEdges,
    onApplyToSelected,
    onSelectAllEdges,
    totalEdgesCount,
}: LibrarySidebarProps) {
    const [activePanel, setActivePanel] = useState<PanelType>(null);

    const hasSelectedEdges = selectedEdges.length > 0;

    const onDragStart = (
        event: React.DragEvent,
        nodeType: string,
        data: Record<string, string>
    ) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, data }));
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleIconClick = (panel: PanelType) => {
        setActivePanel(activePanel === panel ? null : panel);
    };

    // Smart apply: if edges selected, apply to them; otherwise update defaults
    // IMPORTANT: Only updates the specific property, NOT others (type change doesn't affect markers)
    const applyConfig = (updates: Partial<EdgeConfig>) => {
        if (hasSelectedEdges) {
            onApplyToSelected(updates);
        } else {
            onEdgeConfigChange(updates);
        }
    };

    return (
        <div className={`flex h-full ${className}`}>
            {/* THE DOCK - Vertical icon bar */}
            <div className="w-16 bg-slate-950 border-r border-slate-800 flex flex-col items-center py-4 gap-2 z-50">
                {/* Shapes Icon */}
                <button
                    onClick={() => handleIconClick('shapes')}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activePanel === 'shapes'
                        ? 'bg-purple-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    title="Formas"
                >
                    <Shapes size={22} />
                </button>

                {/* Sticky Note Icon */}
                <button
                    onClick={() => handleIconClick('sticky')}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activePanel === 'sticky'
                        ? 'bg-yellow-500 text-slate-900'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    title="Notas Adesivas"
                >
                    <StickyNote size={22} />
                </button>

                {/* Connectors Icon */}
                <button
                    onClick={() => handleIconClick('connectors')}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${activePanel === 'connectors'
                        ? 'bg-blue-500 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                    title="Conectores"
                >
                    <Waypoints size={22} />
                </button>
            </div>

            {/* THE FLYOUT PANEL */}
            {activePanel && (
                <div className="w-72 h-full bg-slate-900/95 backdrop-blur-md border-r border-slate-700 shadow-2xl flex flex-col z-40 overflow-hidden">
                    {/* Panel Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 shrink-0">
                        <span className="text-sm font-semibold text-slate-200">
                            {activePanel === 'shapes' && '🔶 Formas'}
                            {activePanel === 'sticky' && '📝 Notas'}
                            {activePanel === 'connectors' && '↗️ Conectores'}
                        </span>
                        <button
                            onClick={() => setActivePanel(null)}
                            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors text-lg"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {/* SHAPES PANEL */}
                        {activePanel === 'shapes' && (
                            <div className="grid grid-cols-3 gap-3">
                                {shapes.map((shape) => (
                                    <div
                                        key={shape.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, 'shape', { shape: shape.id })}
                                        className="aspect-square bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-all hover:scale-105 hover:shadow-lg group"
                                        title={shape.label}
                                    >
                                        <svg
                                            width={40}
                                            height={40}
                                            viewBox="0 0 40 40"
                                            className="text-slate-400 group-hover:text-indigo-400 transition-colors"
                                        >
                                            {shape.svg}
                                        </svg>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* STICKY NOTES PANEL */}
                        {activePanel === 'sticky' && (
                            <div className="grid grid-cols-2 gap-3">
                                {stickyColors.map((color) => (
                                    <div
                                        key={color.id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, 'stickyNote', { color: color.id })}
                                        className="aspect-square rounded-lg cursor-grab active:cursor-grabbing transition-all hover:scale-105 shadow-md hover:shadow-xl relative overflow-hidden"
                                        style={{ backgroundColor: color.hex }}
                                        title={color.label}
                                    >
                                        <div
                                            className="absolute top-0 right-0 w-4 h-4"
                                            style={{
                                                background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.15) 50%)`,
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CONNECTORS PANEL - MASTER CONTROL */}
                        {activePanel === 'connectors' && (
                            <div className="space-y-6">
                                {/* Mass Selection Controls */}
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-slate-400">Seleção em Massa</span>
                                        <span className="text-[10px] text-slate-500">
                                            {selectedEdges.length}/{totalEdgesCount} linhas
                                        </span>
                                    </div>
                                    <button
                                        onClick={onSelectAllEdges}
                                        disabled={totalEdgesCount === 0}
                                        className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        📋 Selecionar Todas as Linhas
                                    </button>
                                    {hasSelectedEdges && (
                                        <p className="text-[10px] text-blue-400 mt-2 text-center">
                                            🎯 {selectedEdges.length} selecionada(s) — alterações aplicam a todas
                                        </p>
                                    )}
                                </div>

                                {/* SECTION A: Geometry (Path Type) - 3 TYPES RESTORED */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                        🔷 Geometria
                                    </h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => applyConfig({ type: 'bezier' })}
                                            className={`p-3 rounded-lg transition-all flex flex-col items-center gap-2 ${edgeConfig.type === 'bezier'
                                                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                }`}
                                        >
                                            <svg viewBox="0 0 40 20" className="w-full h-5">
                                                <path d="M4 16 C 12 16, 12 4, 20 4 S 28 16, 36 4" stroke="currentColor" strokeWidth="2" fill="none" />
                                            </svg>
                                            <span className="text-[10px]">Curva</span>
                                        </button>
                                        <button
                                            onClick={() => applyConfig({ type: 'smoothstep' })}
                                            className={`p-3 rounded-lg transition-all flex flex-col items-center gap-2 ${edgeConfig.type === 'smoothstep'
                                                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                }`}
                                        >
                                            <svg viewBox="0 0 40 20" className="w-full h-5">
                                                <path d="M4 16 L 4 10 L 20 10 L 20 4 L 36 4" stroke="currentColor" strokeWidth="2" fill="none" />
                                            </svg>
                                            <span className="text-[10px]">Ortogonal</span>
                                        </button>
                                        <button
                                            onClick={() => applyConfig({ type: 'straight' })}
                                            className={`p-3 rounded-lg transition-all flex flex-col items-center gap-2 ${edgeConfig.type === 'straight'
                                                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                }`}
                                        >
                                            <svg viewBox="0 0 40 20" className="w-full h-5">
                                                <line x1="4" y1="16" x2="36" y2="4" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                            <span className="text-[10px]">Reta</span>
                                        </button>
                                    </div>
                                </div>

                                {/* SECTION B: Stroke Style */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                        ✏️ Estilo de Traço
                                    </h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => applyConfig({ strokeStyle: 'solid' })}
                                            className={`p-3 rounded-lg transition-all flex flex-col items-center gap-2 ${edgeConfig.strokeStyle === 'solid'
                                                ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                }`}
                                        >
                                            <div className="w-full h-0.5 bg-current" />
                                            <span className="text-[10px]">Sólido</span>
                                        </button>
                                        <button
                                            onClick={() => applyConfig({ strokeStyle: 'dashed' })}
                                            className={`p-3 rounded-lg transition-all flex flex-col items-center gap-2 ${edgeConfig.strokeStyle === 'dashed'
                                                ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                }`}
                                        >
                                            <div className="flex gap-1 justify-center">
                                                <div className="w-3 h-0.5 bg-current" />
                                                <div className="w-3 h-0.5 bg-current" />
                                                <div className="w-3 h-0.5 bg-current" />
                                            </div>
                                            <span className="text-[10px]">Tracejado</span>
                                        </button>
                                        <button
                                            onClick={() => applyConfig({ strokeStyle: 'dotted' })}
                                            className={`p-3 rounded-lg transition-all flex flex-col items-center gap-2 ${edgeConfig.strokeStyle === 'dotted'
                                                ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                }`}
                                        >
                                            <div className="flex gap-1 justify-center">
                                                <div className="w-1 h-1 bg-current rounded-full" />
                                                <div className="w-1 h-1 bg-current rounded-full" />
                                                <div className="w-1 h-1 bg-current rounded-full" />
                                                <div className="w-1 h-1 bg-current rounded-full" />
                                            </div>
                                            <span className="text-[10px]">Pontilhado</span>
                                        </button>
                                    </div>
                                </div>

                                {/* SECTION C: Markers */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                        ➡️ Ponteiras
                                    </h4>

                                    {/* Marker Start */}
                                    <div className="mb-3">
                                        <label className="text-[10px] text-slate-500 block mb-2">Início:</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => applyConfig({ markerStart: 'none' })}
                                                className={`p-2 rounded-lg text-[10px] transition-all ${edgeConfig.markerStart === 'none'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                    }`}
                                            >
                                                Nenhum
                                            </button>
                                            <button
                                                onClick={() => applyConfig({ markerStart: 'arrow' })}
                                                className={`p-2 rounded-lg text-[10px] transition-all ${edgeConfig.markerStart === 'arrow'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                    }`}
                                            >
                                                ← Seta
                                            </button>
                                            <button
                                                onClick={() => applyConfig({ markerStart: 'circle' })}
                                                className={`p-2 rounded-lg text-[10px] transition-all ${edgeConfig.markerStart === 'circle'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                    }`}
                                            >
                                                ○ Círculo
                                            </button>
                                        </div>
                                    </div>

                                    {/* Marker End */}
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-2">Fim:</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <button
                                                onClick={() => applyConfig({ markerEnd: 'none' })}
                                                className={`p-2 rounded-lg text-[10px] transition-all ${edgeConfig.markerEnd === 'none'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                    }`}
                                            >
                                                Nenhum
                                            </button>
                                            <button
                                                onClick={() => applyConfig({ markerEnd: 'arrowClosed' })}
                                                className={`p-2 rounded-lg text-[10px] transition-all ${edgeConfig.markerEnd === 'arrowClosed'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                    }`}
                                            >
                                                →| Fechada
                                            </button>
                                            <button
                                                onClick={() => applyConfig({ markerEnd: 'arrowOpen' })}
                                                className={`p-2 rounded-lg text-[10px] transition-all ${edgeConfig.markerEnd === 'arrowOpen'
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                                    }`}
                                            >
                                                → Aberta
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION D: Physics (Animated Flow) */}
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                        ⚡ Dinâmica
                                    </h4>
                                    <button
                                        onClick={() => applyConfig({ animated: !edgeConfig.animated })}
                                        className={`w-full p-4 rounded-lg transition-all flex items-center justify-between ${edgeConfig.animated
                                            ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{edgeConfig.animated ? '⚡' : '💤'}</span>
                                            <div className="text-left">
                                                <div className="text-sm font-medium">Fluxo Animado</div>
                                                <div className={`text-[10px] ${edgeConfig.animated ? 'text-amber-200' : 'text-slate-500'}`}>
                                                    {edgeConfig.animated ? 'Ligado - Linhas em movimento' : 'Desligado'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full relative transition-colors ${edgeConfig.animated ? 'bg-amber-400' : 'bg-slate-600'
                                            }`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${edgeConfig.animated ? 'left-7' : 'left-1'
                                                }`} />
                                        </div>
                                    </button>
                                </div>

                                {/* Help text */}
                                {!hasSelectedEdges && (
                                    <p className="text-[10px] text-slate-500 text-center mt-4 p-3 bg-slate-800/50 rounded-lg">
                                        💡 Dica: Clique em uma linha no canvas para editar suas propriedades diretamente
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
