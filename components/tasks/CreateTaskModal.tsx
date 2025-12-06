'use client';

// ============================================================================
// ATHENAPEX - CREATE TASK MODAL COMPONENT
// ATHENA Architecture | Task Creation Form Modal
// ============================================================================

import React, { useState } from 'react';
import { Plus, ListTodo } from 'lucide-react';
import { useProductivityStore } from '@/stores';
import type { Task } from '@/types';

// --- CREATE TASK MODAL ---

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, projectId }) => {
    const projects = useProductivityStore((s) => s.projects);
    const { addTask } = useProductivityStore((s) => s.actions);

    const [form, setForm] = useState({
        name: '',
        description: '',
        emoji: '📋',
        projectId: projectId || '',
        priority: 'medium' as Task['priority'],
        impactScore: 5,
        effortScore: 5,
        dueDate: '',
        estimatedMinutes: 60,
        tags: '',
    });

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!form.name.trim() || !form.projectId) return;

        addTask({
            name: form.name,
            description: form.description,
            emoji: form.emoji,
            projectId: form.projectId,
            status: 'pending',
            priority: form.priority,
            impactScore: form.impactScore,
            effortScore: form.effortScore,
            owner: 'Natasha (ENTJ)',
            tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
            dueDate: form.dueDate || undefined,
            estimatedMinutes: form.estimatedMinutes,
            blockers: [],
            dependencies: [],
        });

        setForm({
            name: '',
            description: '',
            emoji: '📋',
            projectId: projectId || '',
            priority: 'medium',
            impactScore: 5,
            effortScore: 5,
            dueDate: '',
            estimatedMinutes: 60,
            tags: '',
        });
        onClose();
    };

    const calculatedROI = form.effortScore > 0
        ? (form.impactScore / form.effortScore).toFixed(1)
        : '∞';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#1e2330] border border-white/10 rounded-xl shadow-2xl w-full max-w-md p-0 animate-modal-bounce">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <ListTodo size={18} className="text-[#2979ff]" />
                        Create Task
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Project Selection */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                            Project
                        </label>
                        <select
                            value={form.projectId}
                            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                            className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
                        >
                            <option value="">Select a project...</option>
                            {projects.filter((p) => p.status === 'active').map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.emoji} {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Task Name */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                            Task Name
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="What needs to be done?"
                            className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff] transition-all"
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Task details..."
                            rows={2}
                            className="w-full bg-[#0f111a] border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff] transition-all resize-none"
                        />
                    </div>

                    {/* Impact & Effort Grid */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                                Impact (1-10)
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={10}
                                value={form.impactScore}
                                onChange={(e) => setForm({ ...form, impactScore: parseInt(e.target.value) || 5 })}
                                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                                Effort (1-10)
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={10}
                                value={form.effortScore}
                                onChange={(e) => setForm({ ...form, effortScore: parseInt(e.target.value) || 5 })}
                                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                                ROI Score
                            </label>
                            <div className="h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 flex items-center">
                                <span className={`text-sm font-bold ${parseFloat(calculatedROI) >= 2 ? 'text-green-400' : parseFloat(calculatedROI) >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                                    {calculatedROI}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Priority & Due Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                                Priority
                            </label>
                            <select
                                value={form.priority}
                                onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}
                                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
                            >
                                <option value="critical">🔴 Critical</option>
                                <option value="high">🟠 High</option>
                                <option value="medium">🟡 Medium</option>
                                <option value="low">⚪ Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1.5 block">
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={form.dueDate}
                                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                                className="w-full h-9 bg-[#0f111a] border border-white/10 rounded-lg px-3 text-sm text-gray-200 focus:outline-none focus:border-[#2979ff]"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-5 py-4 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-medium rounded-lg text-gray-300 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!form.name.trim() || !form.projectId}
                        className="px-5 py-2 text-xs font-bold rounded-lg text-white bg-[#2979ff] hover:bg-[#2264d1] transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Plus size={14} />
                        Create Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
