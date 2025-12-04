'use client';

// ============================================================================
// ATHENAPEX - VELOCITY GRAPH
// Task completion velocity over time (SVG line chart)
// ============================================================================

import React from 'react';

interface VelocityPoint {
    date: string;
    count: number;
}

interface VelocityGraphProps {
    data?: VelocityPoint[];
    isLoading?: boolean;
}

// Generate mock data for initial display
function generateMockData(): VelocityPoint[] {
    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 8) + 1,
        };
    });
}

export function VelocityGraph({ data, isLoading }: VelocityGraphProps) {
    const displayData = data || generateMockData();

    const maxCount = Math.max(...displayData.map((d) => d.count), 1);
    const width = 100;
    const height = 50;
    const padding = 5;

    // Calculate points for the line
    const points = displayData.map((point, index) => {
        const x = padding + (index / (displayData.length - 1)) * (width - 2 * padding);
        const y = height - padding - (point.count / maxCount) * (height - 2 * padding);
        return { x, y, ...point };
    });

    // Create SVG path
    const pathD = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

    // Create area path (for gradient fill)
    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

    if (isLoading) {
        return (
            <div className="bg-athena-navy/60 border border-athena-gold/10 rounded-xl p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-athena-navy-light rounded w-48 mb-4" />
                    <div className="h-32 bg-athena-navy-light rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-athena-navy/60 border border-athena-gold/10 rounded-xl p-6">
            <h3 className="text-lg font-cinzel text-athena-gold mb-4">
                Velocidade Semanal
            </h3>

            <div className="relative">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-32"
                    preserveAspectRatio="none"
                >
                    {/* Gradient definition */}
                    <defs>
                        <linearGradient id="velocityGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="rgb(212, 175, 55)" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="rgb(212, 175, 55)" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75].map((ratio) => (
                        <line
                            key={ratio}
                            x1={padding}
                            y1={height - padding - ratio * (height - 2 * padding)}
                            x2={width - padding}
                            y2={height - padding - ratio * (height - 2 * padding)}
                            stroke="rgba(212, 175, 55, 0.1)"
                            strokeDasharray="2 2"
                        />
                    ))}

                    {/* Area fill */}
                    <path
                        d={areaD}
                        fill="url(#velocityGradient)"
                    />

                    {/* Line */}
                    <path
                        d={pathD}
                        fill="none"
                        stroke="rgb(212, 175, 55)"
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Points */}
                    {points.map((point, i) => (
                        <g key={i}>
                            <circle
                                cx={point.x}
                                cy={point.y}
                                r="1.5"
                                fill="rgb(26, 31, 53)"
                                stroke="rgb(212, 175, 55)"
                                strokeWidth="0.5"
                                className="cursor-pointer hover:r-2"
                            />
                        </g>
                    ))}
                </svg>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 px-1">
                    {displayData.map((point, i) => (
                        <div key={i} className="text-xs text-athena-silver/40">
                            {new Date(point.date).toLocaleDateString('pt-BR', { weekday: 'short' })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between mt-4 pt-4 border-t border-athena-gold/10">
                <div>
                    <div className="text-2xl font-bold text-athena-platinum">
                        {displayData.reduce((sum, d) => sum + d.count, 0)}
                    </div>
                    <div className="text-xs text-athena-silver/60">tasks esta semana</div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-athena-gold">
                        {(displayData.reduce((sum, d) => sum + d.count, 0) / displayData.length).toFixed(1)}
                    </div>
                    <div className="text-xs text-athena-silver/60">média por dia</div>
                </div>
            </div>
        </div>
    );
}
