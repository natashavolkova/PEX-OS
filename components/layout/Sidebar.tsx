'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - SIDEBAR NAVIGATION
// Athena Architecture | Olympian Theme | Premium Navigation
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Target,
    BarChart2,
    Settings,
    Command,
    Youtube,
    FileCode2,
    BookTemplate,
    Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { label: 'Prompts', icon: Command, href: '/pex-os/prompts', shortcut: '1' },
    { label: 'Projects', icon: FolderKanban, href: '/pex-os/projects', shortcut: '2' },
    { label: 'Tasks', icon: CheckSquare, href: '/pex-os/tasks', shortcut: '3' },
    { label: 'Battle Plan', icon: Target, href: '/pex-os/battle-plan', shortcut: '4' },
    { label: 'Analytics', icon: BarChart2, href: '/pex-os/analytics', shortcut: '5' },
    { label: 'YouTube', icon: Youtube, href: '/pex-os/youtube', shortcut: '6' },
    { label: 'Templates', icon: BookTemplate, href: '/pex-os/templates', shortcut: '7' },
    { label: 'Neovim', icon: FileCode2, href: '/pex-os/neovim', shortcut: '8' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-athena-navy/90 backdrop-blur-md border-r border-athena-gold/20 transition-transform">
            <div className="flex h-full flex-col">
                {/* Logo Area - Athena Styled */}
                <div className="flex h-16 items-center border-b border-athena-gold/20 px-6">
                    <div className="flex items-center gap-3 font-cinzel font-bold text-xl tracking-wide">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-athena-gold to-athena-gold-dark flex items-center justify-center shadow-lg shadow-athena-gold/20">
                            <Sparkles className="h-5 w-5 text-athena-navy-deep" />
                        </div>
                        <span className="text-athena-platinum">
                            ATHENA<span className="text-athena-gold">PEX</span>
                        </span>
                    </div>
                </div>

                {/* Navigation - Athena Themed */}
                <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname?.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-athena-gold text-athena-navy-deep shadow-lg shadow-athena-gold/20"
                                        : "text-athena-silver hover:bg-athena-navy-light hover:text-athena-platinum"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={cn(
                                        "h-5 w-5 transition-colors",
                                        isActive ? "text-athena-navy-deep" : "text-athena-silver group-hover:text-athena-gold"
                                    )} />
                                    <span>{item.label}</span>
                                </div>
                                <span className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded border text-[10px] font-mono",
                                    isActive
                                        ? "border-athena-navy-deep/20 bg-athena-navy-deep/10 text-athena-navy-deep"
                                        : "border-athena-gold/20 bg-athena-navy-deep/50 text-athena-silver/60 group-hover:border-athena-gold/40 group-hover:text-athena-gold"
                                )}>
                                    {item.shortcut}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Settings - Athena Styled */}
                <div className="border-t border-athena-gold/20 p-3">
                    <Link
                        href="/pex-os/settings"
                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-athena-silver hover:bg-athena-navy-light hover:text-athena-platinum transition-all duration-200"
                    >
                        <Settings className="h-5 w-5 text-athena-silver group-hover:text-athena-gold transition-colors" />
                        <span>Settings</span>
                    </Link>
                    
                    {/* Version Badge */}
                    <div className="mt-3 px-3">
                        <div className="flex items-center justify-between text-[10px] text-athena-silver/40">
                            <span>AthenaPeX</span>
                            <span className="font-mono">v2.0.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
