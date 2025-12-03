'use client';

import React from 'react';
import { Bell, Search, User } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--pex-border)] bg-[var(--pex-bg-dark)]/80 px-6 backdrop-blur-sm">
            {/* Left: Breadcrumbs or Page Title (Placeholder for now) */}
            <div className="flex items-center gap-4">
                <div className="hidden md:block">
                    <h1 className="text-lg font-semibold text-white">Command Center</h1>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search (Cmd+K)..."
                        className="h-9 w-64 rounded-md border border-[var(--pex-border)] bg-[var(--pex-bg-secondary)] pl-9 pr-4 text-sm text-gray-300 placeholder-gray-500 focus:border-[var(--pex-primary)] focus:ring-1 focus:ring-[var(--pex-primary)]"
                    />
                </div>

                {/* Notifications */}
                <button className="relative rounded-full p-2 text-gray-400 hover:bg-[var(--pex-bg-tertiary)] hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--pex-primary)]"></span>
                </button>

                {/* User Profile */}
                <button className="flex items-center gap-2 rounded-full bg-[var(--pex-bg-tertiary)] p-1 pr-3 hover:bg-[var(--pex-bg-panel)] transition-colors">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--pex-primary)]">
                        <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">Commander</span>
                </button>
            </div>
        </header>
    );
}
