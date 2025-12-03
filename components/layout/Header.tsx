'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - HEADER
// Athena Architecture | Olympian Theme | Command Center Header
// ============================================================================

import React from 'react';
import { Bell, Search, User, Command, Sparkles } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-athena-gold/20 bg-athena-navy/95 backdrop-blur-md px-6 shadow-gold">
            {/* Left: Page Title */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                    <Command className="h-5 w-5 text-athena-gold" />
                    <h1 className="text-lg font-cinzel font-semibold text-athena-gold tracking-wide">
                        Command Center
                    </h1>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                {/* Search - Athena Styled */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-athena-silver/50" />
                    <input
                        type="text"
                        placeholder="Search (Cmd+K)..."
                        className="h-9 w-64 rounded-lg border border-athena-gold/20 bg-athena-navy-deep/80 pl-10 pr-4 text-sm text-athena-platinum placeholder-athena-silver/40 focus:border-athena-gold focus:ring-1 focus:ring-athena-gold/30 transition-all"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                        <span className="text-[10px] font-mono text-athena-silver/40 border border-athena-gold/10 px-1.5 rounded bg-athena-navy-deep/50">
                            Cmd
                        </span>
                        <span className="text-[10px] font-mono text-athena-silver/40 border border-athena-gold/10 px-1.5 rounded bg-athena-navy-deep/50">
                            K
                        </span>
                    </div>
                </div>

                {/* Notifications - Athena Styled */}
                <button className="relative rounded-full p-2 text-athena-silver hover:bg-athena-navy-light hover:text-athena-gold transition-all duration-200">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-athena-gold border-2 border-athena-navy animate-pulse"></span>
                </button>

                {/* User Profile - Athena Styled */}
                <button className="flex items-center gap-2 rounded-full bg-athena-navy-light/80 p-1 pr-3 hover:bg-athena-navy-light border border-athena-gold/10 hover:border-athena-gold/30 transition-all duration-200">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-athena-gold to-athena-gold-dark shadow-lg shadow-athena-gold/20">
                        <Sparkles className="h-4 w-4 text-athena-navy-deep" />
                    </div>
                    <span className="text-sm font-medium text-athena-platinum">Commander</span>
                </button>
            </div>
        </header>
    );
}
