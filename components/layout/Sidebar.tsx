'use client';

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
    Command
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { label: 'Prompts', icon: Command, href: '/pex-os/prompts', shortcut: '1' },
    { label: 'Projects', icon: FolderKanban, href: '/pex-os/projects', shortcut: '2' },
    { label: 'Tasks', icon: CheckSquare, href: '/pex-os/tasks', shortcut: '3' },
    { label: 'Battle Plan', icon: Target, href: '/pex-os/battle-plan', shortcut: '4' },
    { label: 'Analytics', icon: BarChart2, href: '/pex-os/analytics', shortcut: '5' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-[var(--pex-border)] bg-[var(--pex-bg-secondary)] transition-transform">
            <div className="flex h-full flex-col">
                {/* Logo Area */}
                <div className="flex h-16 items-center border-b border-[var(--pex-border)] px-6">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter text-white">
                        <div className="h-8 w-8 rounded bg-[var(--pex-primary)] flex items-center justify-center">
                            <span className="text-white">P</span>
                        </div>
                        <span>ATHENA<span className="text-[var(--pex-primary)]">PEX</span></span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname?.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-[var(--pex-primary)] text-white"
                                        : "text-gray-400 hover:bg-[var(--pex-bg-tertiary)] hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400 group-hover:text-white")} />
                                    <span>{item.label}</span>
                                </div>
                                <span className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded border text-[10px]",
                                    isActive
                                        ? "border-white/20 bg-white/10 text-white"
                                        : "border-gray-700 bg-gray-800 text-gray-500 group-hover:border-gray-600 group-hover:text-gray-300"
                                )}>
                                    {item.shortcut}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Settings */}
                <div className="border-t border-[var(--pex-border)] p-3">
                    <Link
                        href="/pex-os/settings"
                        className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-[var(--pex-bg-tertiary)] hover:text-white transition-colors"
                    >
                        <Settings className="h-5 w-5 text-gray-400 group-hover:text-white" />
                        <span>Settings</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
