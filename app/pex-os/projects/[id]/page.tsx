'use client';

// ============================================================================
// PROJECT DETAILS PAGE - War Room
// ATHENA Architecture | Premium Dark Theme | ENTJ Focus
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Clock,
    Target,
    TrendingUp,
    Calendar,
    CheckCircle2,
    Circle,
    AlertCircle,
    FileText,
    ListTodo,
    BarChart3,
    Plus,
    Edit3,
    RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Project {
    id: string;
    name: string;
    description: string | null;
    status: string;
    progress: number;
    roiScore: number | null;
    members: number;
    dueDate: string | null;
    taskCount: number;
    completedTaskCount: number;
    calculatedProgress: number;
}

interface Task {
    id: string;
    title: string;
    status: string;
    priority: string;
    dueDate: string | null;
}

interface BattlePlan {
    id: string;
    title: string;
    content: string | null;
    status: string;
}

// --- TASK ITEM COMPONENT ---
const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
    const statusIcons = {
        completed: <CheckCircle2 size={14} className="text-green-400" />,
        in_progress: <RefreshCw size={14} className="text-blue-400" />,
        todo: <Circle size={14} className="text-gray-500" />,
    };

    const priorityColors = {
        high: 'text-red-400',
        medium: 'text-yellow-400',
        low: 'text-gray-400',
    };

    return (
        <div className="flex items-center justify-between p-3 bg-[#1e2330] border border-white/5 rounded-lg hover:border-[#2979ff]/30 transition-all">
            <div className="flex items-center gap-3">
                {statusIcons[task.status as keyof typeof statusIcons] || statusIcons.todo}
                <span className={`text-sm ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                    {task.title}
                </span>
            </div>
            <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase font-medium ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.medium}`}>
                    {task.priority}
                </span>
                {task.dueDate && (
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Calendar size={10} />
                        {task.dueDate}
                    </span>
                )}
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [battlePlan, setBattlePlan] = useState<BattlePlan | null>(null);
    const [activeTab, setActiveTab] = useState<'tasks' | 'battle-plan' | 'analytics'>('tasks');
    const [isLoading, setIsLoading] = useState(true);

    // Fetch project data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch project details
                const projectRes = await fetch(`/api/projects/${projectId}`);
                const projectData = await projectRes.json();
                if (projectData.success) {
                    setProject(projectData.data);
                }

                // Fetch tasks
                const tasksRes = await fetch(`/api/projects/${projectId}/tasks`);
                const tasksData = await tasksRes.json();
                if (tasksData.success) {
                    setTasks(tasksData.data);
                }

                // Fetch battle plan
                const planRes = await fetch(`/api/projects/${projectId}/battle-plan`);
                const planData = await planRes.json();
                if (planData.success && planData.data) {
                    setBattlePlan(planData.data);
                }
            } catch (error) {
                console.error('Failed to fetch project data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [projectId]);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center bg-[#0f111a]">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 text-[#2979ff] animate-spin mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="h-full flex items-center justify-center bg-[#0f111a]">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                    <h2 className="text-lg font-bold text-white mb-2">Project Not Found</h2>
                    <Link
                        href="/pex-os/projects"
                        className="text-[#2979ff] text-sm hover:underline"
                    >
                        ← Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    const statusColors = {
        active: 'bg-green-500/10 text-green-400 border-green-500/20',
        completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        hold: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };

    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <div className="h-full flex flex-col bg-[#0f111a] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Link href="/pex-os/projects" className="hover:text-[#2979ff] transition-colors flex items-center gap-1">
                        <ArrowLeft size={12} />
                        Projects
                    </Link>
                    <span>/</span>
                    <span className="text-gray-300">{project.name}</span>
                </div>

                {/* Title Row */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white flex items-center gap-3 mb-2">
                            📁 {project.name}
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[project.status as keyof typeof statusColors] || statusColors.active}`}>
                                {project.status}
                            </span>
                        </h1>
                        {project.description && (
                            <p className="text-sm text-gray-400">{project.description}</p>
                        )}
                    </div>
                    <button className="px-3 py-1.5 text-xs font-medium rounded-lg text-gray-300 border border-white/10 hover:bg-white/5 transition-all flex items-center gap-1">
                        <Edit3 size={12} />
                        Edit
                    </button>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#1e2330] rounded-lg flex items-center justify-center">
                            <ListTodo size={16} className="text-[#2979ff]" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Tasks</div>
                            <div className="text-sm font-bold text-white">
                                {project.completedTaskCount}/{project.taskCount}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#1e2330] rounded-lg flex items-center justify-center">
                            <Target size={16} className="text-purple-400" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">Progress</div>
                            <div className="text-sm font-bold text-white">{project.calculatedProgress}%</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#1e2330] rounded-lg flex items-center justify-center">
                            <TrendingUp size={16} className="text-green-400" />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">ROI Score</div>
                            <div className="text-sm font-bold text-green-400">{project.roiScore || 0}</div>
                        </div>
                    </div>

                    {project.dueDate && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#1e2330] rounded-lg flex items-center justify-center">
                                <Calendar size={16} className="text-orange-400" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Deadline</div>
                                <div className="text-sm font-bold text-white">{project.dueDate}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="h-2 bg-[#1e2330] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#2979ff] to-[#5b4eff] rounded-full transition-all"
                            style={{ width: `${project.calculatedProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 border-b border-white/5">
                <div className="flex gap-1">
                    {[
                        { id: 'tasks', label: 'Tasks', icon: ListTodo, count: tasks.length },
                        { id: 'battle-plan', label: 'Battle Plan', icon: FileText },
                        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all border-b-2 ${activeTab === tab.id
                                    ? 'text-[#2979ff] border-[#2979ff]'
                                    : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="px-1.5 py-0.5 bg-white/5 rounded text-[10px]">{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'tasks' && (
                    <div className="space-y-6">
                        {/* Add Task Button */}
                        <button className="w-full p-3 border-2 border-dashed border-white/10 rounded-lg text-gray-500 text-xs hover:border-[#2979ff]/50 hover:text-[#2979ff] transition-all flex items-center justify-center gap-2">
                            <Plus size={14} />
                            Add Task to Project
                        </button>

                        {/* Task Sections */}
                        {todoTasks.length > 0 && (
                            <div>
                                <h3 className="text-xs uppercase font-bold text-gray-500 mb-3">To Do ({todoTasks.length})</h3>
                                <div className="space-y-2">
                                    {todoTasks.map(task => <TaskItem key={task.id} task={task} />)}
                                </div>
                            </div>
                        )}

                        {inProgressTasks.length > 0 && (
                            <div>
                                <h3 className="text-xs uppercase font-bold text-blue-400 mb-3">In Progress ({inProgressTasks.length})</h3>
                                <div className="space-y-2">
                                    {inProgressTasks.map(task => <TaskItem key={task.id} task={task} />)}
                                </div>
                            </div>
                        )}

                        {completedTasks.length > 0 && (
                            <div>
                                <h3 className="text-xs uppercase font-bold text-green-400 mb-3">Completed ({completedTasks.length})</h3>
                                <div className="space-y-2">
                                    {completedTasks.map(task => <TaskItem key={task.id} task={task} />)}
                                </div>
                            </div>
                        )}

                        {tasks.length === 0 && (
                            <div className="text-center py-12">
                                <ListTodo size={40} className="text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">No tasks assigned to this project yet</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'battle-plan' && (
                    <div>
                        {battlePlan ? (
                            <div className="bg-[#1e2330] border border-white/5 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">{battlePlan.title}</h3>
                                <div className="prose prose-invert prose-sm max-w-none">
                                    {battlePlan.content || <p className="text-gray-500">No content yet...</p>}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <FileText size={40} className="text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm mb-4">No battle plan created for this project</p>
                                <button className="px-4 py-2 bg-[#2979ff] hover:bg-[#2264d1] text-white text-xs font-bold rounded-lg transition-all">
                                    Create Battle Plan
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="text-center py-12">
                        <BarChart3 size={40} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">Analytics coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
