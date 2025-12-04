'use client';

// ============================================================================
// ATHENAPEX - STATS CARDS
// Dashboard metric cards with icons and trends
// ============================================================================

import React from 'react';
import {
    FileText,
    FolderOpen,
    Clock,
    CheckCircle,
    Youtube,
    Terminal,
} from 'lucide-react';

interface StatsData {
    totalPrompts: number;
    activeProjects: number;
    focusHoursWeek: number;
    completedTasks: number;
    youtubeVideos: number;
    neovimConfigs: number;
}

interface StatsCardsProps {
    data?: StatsData;
    isLoading?: boolean;
}

const defaultStats: StatsData = {
    totalPrompts: 0,
    activeProjects: 0,
    focusHoursWeek: 0,
    completedTasks: 0,
    youtubeVideos: 0,
    neovimConfigs: 0,
};

export function StatsCards({ data = defaultStats, isLoading }: StatsCardsProps) {
    const cards = [
        {
            label: 'Total Prompts',
            value: data.totalPrompts,
            icon: FileText,
            color: 'text-athena-gold',
            bgColor: 'bg-athena-gold/10',
        },
        {
            label: 'Projetos Ativos',
            value: data.activeProjects,
            icon: FolderOpen,
            color: 'text-blue-400',
            bgColor: 'bg-blue-400/10',
        },
        {
            label: 'Horas de Foco',
            value: `${data.focusHoursWeek}h`,
            icon: Clock,
            color: 'text-green-400',
            bgColor: 'bg-green-400/10',
            sublabel: 'esta semana',
        },
        {
            label: 'Tasks Concluídas',
            value: data.completedTasks,
            icon: CheckCircle,
            color: 'text-emerald-400',
            bgColor: 'bg-emerald-400/10',
        },
        {
            label: 'Vídeos Salvos',
            value: data.youtubeVideos,
            icon: Youtube,
            color: 'text-red-400',
            bgColor: 'bg-red-400/10',
        },
        {
            label: 'Neovim Configs',
            value: data.neovimConfigs,
            icon: Terminal,
            color: 'text-purple-400',
            bgColor: 'bg-purple-400/10',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.label}
                        className="bg-athena-navy/60 border border-athena-gold/10 rounded-xl p-4 hover:border-athena-gold/30 transition-all"
                    >
                        {isLoading ? (
                            <div className="animate-pulse">
                                <div className="h-10 w-10 bg-athena-navy-light rounded-lg mb-3" />
                                <div className="h-6 bg-athena-navy-light rounded w-12 mb-1" />
                                <div className="h-4 bg-athena-navy-light rounded w-20" />
                            </div>
                        ) : (
                            <>
                                <div className={`${card.bgColor} ${card.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="text-2xl font-bold text-athena-platinum">
                                    {card.value}
                                </div>
                                <div className="text-sm text-athena-silver/60">
                                    {card.label}
                                </div>
                                {card.sublabel && (
                                    <div className="text-xs text-athena-silver/40 mt-1">
                                        {card.sublabel}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
