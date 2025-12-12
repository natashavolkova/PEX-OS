'use client';

import React, { useState } from 'react';
import { Shapes, StickyNote, Waypoints } from 'lucide-react';

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

// Edge/Connector types
const connectorTypes = [
    {
        id: 'default',
        label: 'Curva Bézier',
        description: 'Linha curva suave',
        icon: (
            <svg viewBox="0 0 48 24" className="w-full h-6">
                <path d="M4 20 C 16 20, 16 4, 28 4 S 40 20, 44 4" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
        ),
    },
    {
        id: 'smoothstep',
        label: 'Ortogonal/Step',
        description: 'Linha com ângulos retos',
        icon: (
            <svg viewBox="0 0 48 24" className="w-full h-6">
                <path d="M4 20 L 4 12 L 24 12 L 24 4 L 44 4" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
        ),
    },
    {
        id: 'straight',
        label: 'Reta',
        description: 'Linha direta',
        icon: (
            <svg viewBox="0 0 48 24" className="w-full h-6">
                <line x1="4" y1="20" x2="44" y2="4" stroke="currentColor" strokeWidth="2" />
            </svg>
        ),
    },
];

type PanelType = 'shapes' | 'sticky' | 'connectors' | null;

interface LibrarySidebarProps {
    className?: string;
    onEdgeTypeChange?: (type: string) => void;
    currentEdgeType?: string;
}

export default function LibrarySidebar({
    className = '',
    onEdgeTypeChange,
    currentEdgeType = 'default'
}: LibrarySidebarProps) {
    const [activePanel, setActivePanel] = useState<PanelType>(null);

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

    const handleConnectorSelect = (type: string) => {
        if (onEdgeTypeChange) {
            onEdgeTypeChange(type);
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

                {/* Connectors Icon - REPLACES TEXT */}
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

            {/* THE FLYOUT PANEL - Slides out on icon click */}
            {activePanel && (
                <div className="w-64 h-full bg-slate-900/95 backdrop-blur-md border-r border-slate-700 shadow-2xl flex flex-col z-40">
                    {/* Panel Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
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
                                        {/* Folded corner effect */}
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

                        {/* CONNECTORS PANEL - NEW! */}
                        {activePanel === 'connectors' && (
                            <div className="space-y-3">
                                <p className="text-xs text-slate-500 mb-4">
                                    Selecione o tipo de linha para novas conexões:
                                </p>
                                {connectorTypes.map((connector) => (
                                    <button
                                        key={connector.id}
                                        onClick={() => handleConnectorSelect(connector.id)}
                                        className={`w-full p-4 rounded-lg transition-all text-left ${currentEdgeType === connector.id
                                                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                            }`}
                                    >
                                        <div className="mb-2 text-current">
                                            {connector.icon}
                                        </div>
                                        <div className="font-medium text-sm">{connector.label}</div>
                                        <div className={`text-xs mt-1 ${currentEdgeType === connector.id ? 'text-blue-200' : 'text-slate-500'
                                            }`}>
                                            {connector.description}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
