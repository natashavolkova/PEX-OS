'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    Brain,
    FolderKanban,
    CheckSquare,
    Target,
    BarChart3,
    Youtube,
    FileText,
    Terminal,
    Bot,
    Settings,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const menuItems = [
    {
        icon: BarChart3,
        label: 'Analytics',
        href: '/pex-os/analytics',
        badge: '5',
        color: 'text-purple-400'
    },
    {
        icon: Brain,
        label: 'Prompts',
        href: '/pex-os/prompts',
        badge: '1',
        color: 'text-blue-400'
    },
    {
        icon: FolderKanban,
        label: 'Projects',
        href: '/pex-os/projects',
        badge: '2',
        color: 'text-green-400'
    },
    {
        icon: CheckSquare,
        label: 'Tasks',
        href: '/pex-os/tasks',
        badge: '3',
        color: 'text-orange-400'
    },
    {
        icon: Target,
        label: 'Battle Plan',
        href: '/pex-os/battle-plan',
        badge: '4',
        color: 'text-red-400'
    },
    {
        icon: Youtube,
        label: 'YouTube',
        href: '/pex-os/youtube',
        badge: '6',
        color: 'text-red-500'
    },
    {
        icon: FileText,
        label: 'Templates',
        href: '/pex-os/templates',
        badge: '7',
        color: 'text-cyan-400'
    },
    {
        icon: Terminal,
        label: 'Neovim',
        href: '/pex-os/neovim',
        badge: '8',
        color: 'text-green-500'
    },
    {
        icon: Bot,
        label: 'AI Agent',
        href: '/pex-os/ai-agent',
        badge: null,
        color: 'text-athena-gold'
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`
        ${collapsed ? 'w-20' : 'w-64'} 
        bg-gradient-to-b from-athena-navy/95 to-athena-navy-deep/95 
        backdrop-blur-xl 
        border-r border-athena-gold/20 
        flex flex-col 
        transition-all duration-300 ease-in-out
        relative
      `}
        >
            {/* Collapse Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 z-50 w-6 h-6 bg-athena-gold rounded-full flex items-center justify-center hover:bg-athena-gold-dark transition-all shadow-lg"
            >
                {collapsed ? (
                    <ChevronRight className="w-4 h-4 text-athena-navy-deep" />
                ) : (
                    <ChevronLeft className="w-4 h-4 text-athena-navy-deep" />
                )}
            </button>

            {/* Logo */}
            <div className="h-16 flex items-center justify-center px-4 border-b border-athena-gold/20">
                {collapsed ? (
                    <div className="w-10 h-10 bg-gradient-to-br from-athena-gold to-athena-gold-dark rounded-lg flex items-center justify-center shadow-athena-glow">
                        <span className="text-athena-navy-deep font-bold text-xl">A</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-athena-gold to-athena-gold-dark rounded-lg flex items-center justify-center shadow-athena-glow">
                            <span className="text-athena-navy-deep font-bold text-xl">A</span>
                        </div>
                        <div>
                            <h1 className="font-cinzel text-athena-gold text-lg font-bold leading-none">
                                ATHENA<span className="text-athena-silver">PEX</span>
                            </h1>
                            <p className="text-athena-silver/50 text-xs">Productivity OS</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Menu Items */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-athena-gold/30 scrollbar-track-transparent">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
                ${isActive
                                    ? 'bg-athena-gold/20 border border-athena-gold/40 shadow-athena-glow'
                                    : 'hover:bg-athena-gold/10 border border-transparent hover:border-athena-gold/20'
                                }
                ${collapsed ? 'justify-center' : ''}
              `}
                            title={collapsed ? item.label : ''}
                        >
                            {/* Icon with glow effect */}
                            <div className={`
                ${isActive ? 'text-athena-gold' : `${item.color} group-hover:text-athena-gold`}
                transition-colors duration-200
                ${isActive ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' : ''}
              `}>
                                <Icon className="w-5 h-5" />
                            </div>

                            {/* Label */}
                            {!collapsed && (
                                <>
                                    <span className={`
                    flex-1 font-medium text-sm
                    ${isActive ? 'text-athena-gold font-semibold' : 'text-athena-silver group-hover:text-athena-platinum'}
                    transition-colors duration-200
                  `}>
                                        {item.label}
                                    </span>

                                    {/* Badge */}
                                    {item.badge && (
                                        <span className={`
                      text-xs px-2 py-0.5 rounded-full font-medium
                      ${isActive
                                                ? 'bg-athena-gold text-athena-navy-deep'
                                                : 'bg-athena-gold/20 text-athena-gold border border-athena-gold/30'
                                            }
                      transition-all duration-200
                    `}>
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}

                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-athena-gold rounded-r-full shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-athena-gold/30 to-transparent mx-4" />

            {/* Settings */}
            <div className="p-3">
                <Link
                    href="/pex-os/settings"
                    className={`
            flex items-center gap-3 px-3 py-3 rounded-lg text-athena-silver hover:bg-athena-gold/10 hover:text-athena-gold transition-all group
            ${collapsed ? 'justify-center' : ''}
          `}
                    title={collapsed ? 'Settings' : ''}
                >
                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    {!collapsed && <span className="font-medium text-sm">Settings</span>}
                </Link>

                {!collapsed && (
                    <div className="mt-3 px-3 flex items-center justify-between text-xs">
                        <span className="text-athena-silver/50">AthenaPeX</span>
                        <span className="text-athena-gold/60 font-mono">v2.0.0</span>
                    </div>
                )}
            </div>

            {/* Bottom accent */}
            <div className="h-1 bg-gradient-to-r from-athena-gold via-athena-silver to-athena-gold opacity-50" />
        </aside>
    );
}
