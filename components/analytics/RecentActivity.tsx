'use client';

// ============================================================================
// ATHENAPEX - RECENT ACTIVITY
// Activity feed with relative timestamps
// ============================================================================

import React from 'react';
import {
    FileText,
    FolderOpen,
    CheckCircle,
    Timer,
    Edit3,
    Trash2,
    Eye,
} from 'lucide-react';

interface ActivityEvent {
    id: string;
    type: string;
    metadata: Record<string, unknown> | null;
    createdAt: string | Date;
    relativeTime: string;
}

interface RecentActivityProps {
    data?: ActivityEvent[];
    isLoading?: boolean;
}

const eventConfig: Record<string, { icon: typeof FileText; label: string; color: string }> = {
    prompt_create: { icon: FileText, label: 'Prompt criado', color: 'text-athena-gold' },
    prompt_update: { icon: Edit3, label: 'Prompt editado', color: 'text-blue-400' },
    project_create: { icon: FolderOpen, label: 'Projeto criado', color: 'text-green-400' },
    project_update: { icon: Edit3, label: 'Projeto atualizado', color: 'text-blue-400' },
    task_create: { icon: FileText, label: 'Task criada', color: 'text-purple-400' },
    task_complete: { icon: CheckCircle, label: 'Task concluída', color: 'text-emerald-400' },
    focus_start: { icon: Timer, label: 'Foco iniciado', color: 'text-orange-400' },
    focus_end: { icon: Timer, label: 'Foco finalizado', color: 'text-green-400' },
    page_view: { icon: Eye, label: 'Página visitada', color: 'text-athena-silver' },
    default: { icon: FileText, label: 'Atividade', color: 'text-athena-silver' },
};

// Generate mock data for initial display
function generateMockData(): ActivityEvent[] {
    const types = ['prompt_create', 'task_complete', 'focus_end', 'project_update', 'prompt_update'];
    const times = ['2min atrás', '15min atrás', '1h atrás', '3h atrás', '5h atrás', '1d atrás'];

    return types.slice(0, 5).map((type, i) => ({
        id: `mock-${i}`,
        type,
        metadata: { title: `Item ${i + 1}` },
        createdAt: new Date().toISOString(),
        relativeTime: times[i],
    }));
}

export function RecentActivity({ data, isLoading }: RecentActivityProps) {
    const displayData = data?.length ? data : generateMockData();

    if (isLoading) {
        return (
            <div className="bg-athena-navy/60 border border-athena-gold/10 rounded-xl p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-athena-navy-light rounded w-48 mb-4" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 py-3">
                            <div className="w-8 h-8 bg-athena-navy-light rounded-lg" />
                            <div className="flex-1">
                                <div className="h-4 bg-athena-navy-light rounded w-32 mb-2" />
                                <div className="h-3 bg-athena-navy-light rounded w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-athena-navy/60 border border-athena-gold/10 rounded-xl p-6">
            <h3 className="text-lg font-cinzel text-athena-gold mb-4">
                Atividade Recente
            </h3>

            {displayData.length === 0 ? (
                <div className="text-center py-8 text-athena-silver/40">
                    Nenhuma atividade recente
                </div>
            ) : (
                <div className="space-y-1">
                    {displayData.map((event) => {
                        const config = eventConfig[event.type] || eventConfig.default;
                        const Icon = config.icon;
                        const title = (event.metadata?.title as string) || '';

                        return (
                            <div
                                key={event.id}
                                className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-athena-navy-light/50 transition-colors"
                            >
                                <div className={`${config.color} bg-athena-navy-light/50 w-8 h-8 rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-athena-platinum truncate">
                                        {config.label}
                                        {title && <span className="text-athena-silver/60">: {title}</span>}
                                    </div>
                                </div>
                                <div className="text-xs text-athena-silver/40 whitespace-nowrap">
                                    {event.relativeTime}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {displayData.length > 0 && (
                <button className="w-full mt-4 pt-4 border-t border-athena-gold/10 text-sm text-athena-gold hover:text-athena-gold-light transition-colors">
                    Ver toda atividade →
                </button>
            )}
        </div>
    );
}
