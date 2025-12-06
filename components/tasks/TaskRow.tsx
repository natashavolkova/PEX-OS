'use client';

// ============================================================================
// ATHENAPEX - TASK ROW COMPONENT
// ATHENA Architecture | Reusable Task Display Component
// ============================================================================

import React, { useState } from 'react';
import {
    Play,
    CheckCircle2,
    AlertTriangle,
    Clock,
    MoreVertical,
    Trash2,
    Edit3,
    Calendar,
} from 'lucide-react';
import type { Task, Project } from '@/types';

// --- TASK ROW COMPONENT ---

interface TaskRowProps {
    task: Task;
    project?: Project;
    onStart: () => void;
    onComplete: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const TaskRow: React.FC<TaskRowProps> = ({
    task,
    project,
    onStart,
    onComplete,
    onEdit,
    onDelete,
}) => {
    const [showMenu, setShowMenu] = useState(false);

    const statusIcons = {
        pending: <Clock size={14} className="text-gray-400" />,
        in_progress: <Play size={14} className="text-[#2979ff]" />,
        blocked: <AlertTriangle size={14} className="text-red-400" />,
        completed: <CheckCircle2 size={14} className="text-green-400" />,
        cancelled: <Trash2 size={14} className="text-gray-500" />,
    };

    const priorityColors = {
        critical: 'bg-red-500/10 text-red-400 border-red-500/20',
        high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
        medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        low: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };

    const roiColor = task.roiScore >= 2 ? 'text-green-400' : task.roiScore >= 1.5 ? 'text-yellow-400' : 'text-gray-400';

    return (
        <div
            className={`
        group bg-[#1e2330] border border-white/5 rounded-lg p-3 hover:border-[#2979ff]/30 transition-all
        ${task.status === 'completed' ? 'opacity-60' : ''}
      `}
        >
            <div className="flex items-center gap-3">
                {/* Status Icon */}
                <div className="shrink-0">{statusIcons[task.status]}</div>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-base">{task.emoji || '📋'}</span>
                        <h4
                            className={`text-sm font-medium truncate ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'
                                }`}
                        >
                            {task.name}
                        </h4>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
                            {task.priority}
                        </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1">
                        {project && (
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                <span>{project.emoji}</span>
                                {project.name}
                            </span>
                        )}
                        {task.dueDate && (
                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                <Calendar size={10} />
                                {task.dueDate}
                            </span>
                        )}
                    </div>
                </div>

                {/* Metrics */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-[9px] text-gray-500 uppercase">Impact</div>
                        <div className="text-xs font-bold text-white">{task.impactScore}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] text-gray-500 uppercase">Effort</div>
                        <div className="text-xs font-bold text-white">{task.effortScore}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-[9px] text-gray-500 uppercase">ROI</div>
                        <div className={`text-xs font-bold ${roiColor}`}>{task.roiScore.toFixed(1)}</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {task.status === 'pending' && (
                        <button
                            onClick={onStart}
                            className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Start Task"
                        >
                            <Play size={14} />
                        </button>
                    )}
                    {task.status === 'in_progress' && (
                        <button
                            onClick={onComplete}
                            className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                            title="Complete Task"
                        >
                            <CheckCircle2 size={14} />
                        </button>
                    )}

                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-1.5 text-gray-400 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <MoreVertical size={14} />
                        </button>

                        {showMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                                <div className="absolute right-0 top-full mt-1 bg-[#252b3b] border border-white/10 rounded-lg shadow-xl z-20 py-1 min-w-[100px] animate-pop-in-menu">
                                    <button
                                        onClick={() => { onEdit(); setShowMenu(false); }}
                                        className="w-full px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                    >
                                        <Edit3 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => { onDelete(); setShowMenu(false); }}
                                        className="w-full px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                    >
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Blockers */}
            {task.blockers.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                    <AlertTriangle size={12} className="text-red-400" />
                    <span className="text-[10px] text-red-400">
                        Blocked: {task.blockers.join(', ')}
                    </span>
                </div>
            )}
        </div>
    );
};

export default TaskRow;
