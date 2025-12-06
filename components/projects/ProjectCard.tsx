'use client';

// ============================================================================
// ATHENAPEX - PROJECT CARD COMPONENT
// ATHENA Architecture | Reusable Project Display Card
// ============================================================================

import React, { useState } from 'react';
import {
    Folder,
    MoreVertical,
    Trash2,
    Edit3,
    Archive,
    TrendingUp,
    Calendar,
    CheckCircle2,
    Clock,
} from 'lucide-react';
import type { Project } from '@/types';

interface ProjectCardProps {
    project: Project;
    onSelect: () => void;
    onEdit: () => void;
    onArchive: () => void;
    onDelete: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    onSelect,
    onEdit,
    onArchive,
    onDelete,
}) => {
    const [showMenu, setShowMenu] = useState(false);

    const statusColors = {
        active: 'bg-green-500/10 text-green-400 border-green-500/20',
        on_hold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        archived: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };

    const priorityColors = {
        critical: 'text-red-400',
        high: 'text-orange-400',
        medium: 'text-yellow-400',
        low: 'text-gray-400',
    };

    const progressPercentage = project.tasksCount > 0
        ? Math.round((project.completedTasksCount / project.tasksCount) * 100)
        : 0;

    return (
        <div
            className="bg-[#1e2330] border border-white/5 rounded-xl p-4 hover:border-[#2979ff]/30 transition-all cursor-pointer group"
            onClick={onSelect}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl shrink-0">{project.emoji || '📁'}</span>
                    <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white truncate group-hover:text-[#2979ff] transition-colors">
                            {project.name}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[project.status]}`}>
                            {project.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {/* Menu */}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                    >
                        <MoreVertical size={14} />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
                            <div className="absolute right-0 top-full mt-1 bg-[#252b3b] border border-white/10 rounded-lg shadow-xl z-20 py-1 min-w-[100px] animate-pop-in-menu">
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEdit(); setShowMenu(false); }}
                                    className="w-full px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                >
                                    <Edit3 size={12} /> Edit
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onArchive(); setShowMenu(false); }}
                                    className="w-full px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                >
                                    <Archive size={12} /> Archive
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDelete(); setShowMenu(false); }}
                                    className="w-full px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 line-clamp-2 mb-3">{project.description}</p>

            {/* Progress Bar */}
            <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-white font-medium">{progressPercentage}%</span>
                </div>
                <div className="h-1.5 bg-[#0f111a] rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-[#2979ff] to-[#00e5ff] transition-all"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px]">
                <div className="flex items-center gap-3">
                    <span className="text-gray-500 flex items-center gap-1">
                        <Clock size={10} />
                        {project.tasksCount} tasks
                    </span>
                    <span className="text-green-400 flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        {project.completedTasksCount} done
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <TrendingUp size={10} className={priorityColors[project.priority]} />
                    <span className={priorityColors[project.priority]}>{project.priority}</span>
                </div>
            </div>

            {/* Deadline */}
            {project.deadline && (
                <div className="mt-2 text-[10px] text-gray-500 flex items-center gap-1">
                    <Calendar size={10} />
                    Due: {project.deadline}
                </div>
            )}
        </div>
    );
};

export default ProjectCard;
