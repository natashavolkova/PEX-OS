'use client';

import React from 'react';
import { StickyNote, Square, Circle, Diamond, Triangle } from 'lucide-react';

// Sticky Note colors
const stickyColors = [
    { id: 'yellow', bg: 'bg-yellow-300', label: 'Amarelo' },
    { id: 'pink', bg: 'bg-pink-300', label: 'Rosa' },
    { id: 'blue', bg: 'bg-blue-300', label: 'Azul' },
    { id: 'green', bg: 'bg-green-300', label: 'Verde' },
];

// Shape types
const shapes = [
    { id: 'rectangle', icon: Square, label: 'Retângulo' },
    { id: 'circle', icon: Circle, label: 'Círculo' },
    { id: 'diamond', icon: Diamond, label: 'Losango' },
    { id: 'triangle', icon: Triangle, label: 'Triângulo' },
];

interface SidebarProps {
    className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
    const onDragStart = (
        event: React.DragEvent,
        nodeType: string,
        data: Record<string, string>
    ) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType, data }));
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className={`w-16 bg-slate-900/95 border-r border-slate-700 flex flex-col py-3 gap-4 ${className}`}>
            {/* Sticky Notes Section */}
            <div className="px-2">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 text-center">
                    Notas
                </div>
                <div className="grid grid-cols-2 gap-1">
                    {stickyColors.map((color) => (
                        <div
                            key={color.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, 'stickyNote', { color: color.id })}
                            className={`w-6 h-6 ${color.bg} rounded cursor-grab shadow-sm hover:shadow-md hover:scale-110 transition-all active:cursor-grabbing`}
                            title={color.label}
                        />
                    ))}
                </div>
            </div>

            {/* Divider */}
            <hr className="border-slate-700 mx-2" />

            {/* Shapes Section */}
            <div className="px-2">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 text-center">
                    Formas
                </div>
                <div className="flex flex-col gap-1">
                    {shapes.map((shape) => (
                        <div
                            key={shape.id}
                            draggable
                            onDragStart={(e) => onDragStart(e, 'shape', { shape: shape.id })}
                            className="w-full h-10 bg-slate-800 hover:bg-slate-700 rounded flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors"
                            title={shape.label}
                        >
                            <shape.icon size={20} className="text-slate-400" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
