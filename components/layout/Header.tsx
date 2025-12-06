'use client';

// ============================================================================
// ATHENAPEX PRODUCTIVITY MANAGER - HEADER
// Athena Architecture | Olympian Theme | Command Center Header
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Bell, Search, Command, Sparkles, ChevronDown, Check, X } from 'lucide-react';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export function Header() {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch notifications
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/notifications?limit=5');
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data || []);
                setUnreadCount(data.unreadCount || 0);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mark all as read
    const markAllRead = async () => {
        try {
            await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllRead: true }),
            });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark notifications as read:', error);
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch on mount
    useEffect(() => {
        fetchNotifications();
    }, []);

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

                {/* Notifications - Athena Styled with Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            if (!showNotifications) fetchNotifications();
                        }}
                        className="relative rounded-full p-2 text-athena-silver hover:bg-athena-navy-light hover:text-athena-gold transition-all duration-200"
                    >
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-athena-gold border-2 border-athena-navy animate-pulse"></span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-athena-gold/20 bg-athena-navy-deep shadow-2xl shadow-black/50 overflow-hidden z-50">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-athena-gold/10">
                                <h3 className="text-sm font-semibold text-athena-gold">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-xs text-athena-silver hover:text-athena-gold flex items-center gap-1"
                                    >
                                        <Check className="h-3 w-3" /> Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-64 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center text-athena-silver/60 text-sm">Loading...</div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-6 text-center">
                                        <Bell className="h-8 w-8 text-athena-silver/30 mx-auto mb-2" />
                                        <p className="text-athena-silver/60 text-sm">No notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            className={`px-4 py-3 border-b border-athena-gold/5 hover:bg-athena-navy-light/50 transition-colors ${!notif.isRead ? 'bg-athena-gold/5' : ''}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-athena-gold' : 'bg-athena-silver/30'}`} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-athena-platinum truncate">{notif.title}</p>
                                                    <p className="text-xs text-athena-silver/60 line-clamp-2">{notif.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Profile - Navigate to Profile Page */}
                <Link
                    href="/pex-os/profile"
                    className="flex items-center gap-2 rounded-full bg-athena-navy-light/80 p-1 pr-3 hover:bg-athena-navy-light border border-athena-gold/10 hover:border-athena-gold/30 transition-all duration-200"
                >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-athena-gold to-athena-gold-dark shadow-lg shadow-athena-gold/20">
                        <Sparkles className="h-4 w-4 text-athena-navy-deep" />
                    </div>
                    <span className="text-sm font-medium text-athena-platinum">Commander</span>
                </Link>
            </div>
        </header>
    );
}
