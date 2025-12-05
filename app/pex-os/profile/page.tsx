'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - PROFILE PAGE
// User Profile with ENTJ Rules, Stats, and Account Settings
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Crown,
    Shield,
    Mail,
    Key,
    LogOut,
    Zap,
    Calendar,
    MessageSquare,
    FolderOpen,
    Flame,
    RefreshCw,
    Trash2,
    AlertTriangle,
    Sparkles,
    Check,
} from 'lucide-react';

// --- TYPES ---
interface UserStats {
    daysUsing: number;
    totalPrompts: number;
    completedProjects: number;
    currentStreak: number;
}

export default function ProfilePage() {
    const router = useRouter();
    const [stats, setStats] = useState<UserStats>({
        daysUsing: 0,
        totalPrompts: 0,
        completedProjects: 0,
        currentStreak: 0,
    });
    const [loading, setLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [regenerating, setRegenerating] = useState(false);

    // Fetch user stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/analytics/stats');
                const data = await res.json();
                if (data.success && data.data) {
                    setStats({
                        daysUsing: Math.floor((Date.now() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24)),
                        totalPrompts: data.data.totalPrompts || 0,
                        completedProjects: data.data.activeProjects || 0,
                        currentStreak: 0,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('athena-auth');
        router.push('/login');
    };

    const handleRegenerateKey = async () => {
        setRegenerating(true);
        // Simulated - in production would call API
        await new Promise(resolve => setTimeout(resolve, 1500));
        setRegenerating(false);
        alert('Master Key regenerada com sucesso! Verifique seu email.');
    };

    const handleDeleteAccount = () => {
        // In production would call API
        localStorage.removeItem('athena-auth');
        router.push('/login');
    };

    const entjRules = [
        'Maximum productivity over comfort',
        'Aggressive velocity over perfection',
        'Real impact over work quantity',
        'Ruthless elimination of weak ideas',
        'ROI optimization always',
    ];

    return (
        <div className="h-full overflow-y-auto p-6 bg-[#0f111a] custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-cinzel font-bold text-athena-gold flex items-center gap-3">
                        <Crown className="w-7 h-7" />
                        User Profile
                    </h1>
                </div>

                {/* SECTION 1: User Information */}
                <div className="bg-[#1e2330] border border-athena-gold/20 rounded-xl p-6">
                    <h2 className="text-lg font-cinzel text-athena-platinum mb-6 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-athena-gold" />
                        Informações do Usuário
                    </h2>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-athena-gold to-athena-gold-dark flex items-center justify-center shadow-lg shadow-athena-gold/30">
                                <Sparkles className="w-12 h-12 text-athena-navy-deep" />
                            </div>
                        </div>

                        {/* User Details */}
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="text-xs text-athena-silver/60 uppercase tracking-wide">Nome</label>
                                <p className="text-xl font-semibold text-athena-platinum">Athena</p>
                            </div>

                            <div className="flex flex-wrap gap-6">
                                <div>
                                    <label className="text-xs text-athena-silver/60 uppercase tracking-wide">Role</label>
                                    <p className="text-athena-platinum flex items-center gap-2">
                                        <Crown className="w-4 h-4 text-athena-gold" />
                                        Supreme Admin
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs text-athena-silver/60 uppercase tracking-wide flex items-center gap-1">
                                        <Mail className="w-3 h-3" />
                                        Email
                                    </label>
                                    <p className="text-athena-platinum">natashavolkova771@gmail.com</p>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-athena-silver/60 uppercase tracking-wide flex items-center gap-1">
                                    <Key className="w-3 h-3" />
                                    Status da Master Key
                                </label>
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-athena-gold/20 text-athena-gold text-sm font-medium border border-athena-gold/30 mt-1">
                                    <span className="w-2 h-2 rounded-full bg-athena-gold animate-pulse" />
                                    Ativa
                                </span>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: ENTJ Productivity Rules */}
                <div className="bg-gradient-to-br from-[#2979ff]/10 to-[#5b4eff]/10 border border-[#2979ff]/20 rounded-xl p-6">
                    <h2 className="text-lg font-cinzel text-athena-platinum mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[#2979ff]" />
                        ENTJ Productivity Rules
                    </h2>

                    <p className="text-sm text-athena-silver/60 mb-4">
                        Princípios que guiam cada decisão no sistema AthenaPeX.
                    </p>

                    <ul className="space-y-3">
                        {entjRules.map((rule, index) => (
                            <li
                                key={index}
                                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-[#2979ff]/30 transition-all"
                            >
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-400" />
                                </span>
                                <span className="text-athena-platinum">{rule}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* SECTION 3: Personal Statistics */}
                <div className="bg-[#1e2330] border border-white/5 rounded-xl p-6">
                    <h2 className="text-lg font-cinzel text-athena-platinum mb-6 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-400" />
                        Estatísticas Pessoais
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[#0f111a] rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-athena-silver/60 text-xs mb-2">
                                <Calendar className="w-4 h-4" />
                                Dias no Sistema
                            </div>
                            <div className="text-2xl font-bold text-athena-platinum">
                                {loading ? '...' : stats.daysUsing}
                            </div>
                        </div>

                        <div className="bg-[#0f111a] rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-athena-silver/60 text-xs mb-2">
                                <MessageSquare className="w-4 h-4" />
                                Prompts Criados
                            </div>
                            <div className="text-2xl font-bold text-athena-platinum">
                                {loading ? '...' : stats.totalPrompts}
                            </div>
                        </div>

                        <div className="bg-[#0f111a] rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-athena-silver/60 text-xs mb-2">
                                <FolderOpen className="w-4 h-4" />
                                Projetos Completos
                            </div>
                            <div className="text-2xl font-bold text-athena-platinum">
                                {loading ? '...' : stats.completedProjects}
                            </div>
                        </div>

                        <div className="bg-[#0f111a] rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 text-athena-silver/60 text-xs mb-2">
                                <Flame className="w-4 h-4 text-orange-400" />
                                Streak Atual
                            </div>
                            <div className="text-2xl font-bold text-athena-platinum flex items-center gap-1">
                                {loading ? '...' : stats.currentStreak}
                                {stats.currentStreak > 0 && <span className="text-orange-400">🔥</span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 4: Account Settings */}
                <div className="bg-[#1e2330] border border-white/5 rounded-xl p-6">
                    <h2 className="text-lg font-cinzel text-athena-platinum mb-6 flex items-center gap-2">
                        <Key className="w-5 h-5 text-athena-gold" />
                        Configurações de Conta
                    </h2>

                    <div className="space-y-4">
                        {/* Regenerate Master Key */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#0f111a] border border-white/5">
                            <div>
                                <h3 className="text-athena-platinum font-medium">Regenerar Master Key</h3>
                                <p className="text-sm text-athena-silver/60">
                                    Gera uma nova chave de acesso. A chave atual será invalidada.
                                </p>
                            </div>
                            <button
                                onClick={handleRegenerateKey}
                                disabled={regenerating}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-athena-gold/10 text-athena-gold hover:bg-athena-gold/20 border border-athena-gold/20 hover:border-athena-gold/40 transition-all disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                                {regenerating ? 'Gerando...' : 'Regenerar'}
                            </button>
                        </div>

                        {/* Delete Account */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/10">
                            <div>
                                <h3 className="text-red-400 font-medium flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Zona de Perigo
                                </h3>
                                <p className="text-sm text-athena-silver/60">
                                    Excluir permanentemente sua conta e todos os dados.
                                </p>
                            </div>
                            {!showDeleteConfirm ? (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Excluir Conta
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-3 py-2 rounded-lg text-athena-silver hover:text-athena-platinum transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Confirmar Exclusão
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
