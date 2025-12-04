'use client';

// ============================================================================
// ATHENAPEX - QUICK ACTIONS
// Dashboard action buttons for common tasks
// ============================================================================

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    PlusCircle,
    FolderPlus,
    Timer,
    Youtube,
    Terminal,
    Zap,
} from 'lucide-react';

interface QuickActionsProps {
    onStartFocus?: () => void;
}

export function QuickActions({ onStartFocus }: QuickActionsProps) {
    const router = useRouter();

    const actions = [
        {
            label: 'Novo Prompt',
            icon: PlusCircle,
            color: 'from-athena-gold to-athena-gold-dark',
            onClick: () => router.push('/pex-os/prompts?new=true'),
        },
        {
            label: 'Novo Projeto',
            icon: FolderPlus,
            color: 'from-blue-500 to-blue-600',
            onClick: () => router.push('/pex-os/projects?new=true'),
        },
        {
            label: 'Iniciar Foco',
            icon: Timer,
            color: 'from-green-500 to-green-600',
            onClick: onStartFocus,
        },
        {
            label: 'Adicionar Vídeo',
            icon: Youtube,
            color: 'from-red-500 to-red-600',
            onClick: () => router.push('/pex-os/youtube?new=true'),
        },
        {
            label: 'Gerar Config',
            icon: Terminal,
            color: 'from-purple-500 to-purple-600',
            onClick: () => router.push('/pex-os/neovim'),
        },
        {
            label: 'Battle Plan',
            icon: Zap,
            color: 'from-orange-500 to-orange-600',
            onClick: () => router.push('/pex-os/battle-plan'),
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {actions.map((action) => {
                const Icon = action.icon;
                return (
                    <button
                        key={action.label}
                        onClick={action.onClick}
                        className={`
              group relative overflow-hidden rounded-xl p-4
              bg-gradient-to-br ${action.color}
              hover:scale-105 transition-all duration-200
              shadow-lg hover:shadow-xl
            `}
                    >
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Icon className="w-6 h-6 text-white mb-2" />
                        <div className="text-sm font-medium text-white">
                            {action.label}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
