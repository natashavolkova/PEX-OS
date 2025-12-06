'use client';

// ============================================================================
// ATHENAPEX - YOUTUBE VIDEO CARD COMPONENT
// ATHENA Architecture | Reusable Video Reference Card
// ============================================================================

import React, { useState } from 'react';
import {
    Youtube,
    ExternalLink,
    Lightbulb,
    MoreVertical,
    Trash2,
    Star,
} from 'lucide-react';
import type { YouTubeReference } from '@/types';

interface YouTubeCardProps {
    reference: YouTubeReference;
    onSelect: () => void;
    onDelete: () => void;
}

export const YouTubeCard: React.FC<YouTubeCardProps> = ({ reference, onSelect, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div
            className="bg-[#1e2330] border border-white/5 rounded-xl overflow-hidden hover:border-red-500/30 transition-all cursor-pointer group"
            onClick={onSelect}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-[#0f111a]">
                {reference.thumbnailUrl ? (
                    <img
                        src={reference.thumbnailUrl}
                        alt={reference.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Youtube size={48} className="text-red-500/50" />
                    </div>
                )}

                {/* Duration Badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                    {reference.duration}
                </div>

                {/* Output Generated Badge */}
                {reference.outputGenerated && (
                    <div className="absolute top-2 left-2 bg-green-500/90 text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Lightbulb size={10} />
                        Output Generated
                    </div>
                )}

                {/* Menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        className="p-1.5 bg-black/60 text-white hover:bg-black/80 rounded-lg"
                    >
                        <MoreVertical size={14} />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
                            <div className="absolute right-0 top-full mt-1 bg-[#252b3b] border border-white/10 rounded-lg shadow-xl z-20 py-1 min-w-[100px] animate-pop-in-menu">
                                <a
                                    href={reference.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full px-3 py-1.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                                >
                                    <ExternalLink size={12} /> Open
                                </a>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete();
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <h3 className="text-sm font-medium text-white line-clamp-2 mb-1 group-hover:text-red-400 transition-colors">
                    {reference.title}
                </h3>

                <div className="text-[10px] text-gray-500 mb-2">{reference.channelName}</div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                    {reference.tags.slice(0, 3).map((tag, i) => (
                        <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 bg-red-500/10 text-red-400 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 flex items-center gap-1">
                            <Lightbulb size={10} />
                            {reference.insights.length} insights
                        </span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                        <Star size={10} className={reference.impactScore >= 7 ? 'text-yellow-400 fill-yellow-400' : ''} />
                        {reference.impactScore}/10
                    </div>
                </div>
            </div>
        </div>
    );
};

export default YouTubeCard;
