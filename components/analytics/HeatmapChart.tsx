'use client';

// ============================================================================
// ATHENAPEX - HEATMAP CHART
// 7x24 productivity heatmap visualization
// ============================================================================

import React from 'react';

interface HeatmapHour {
    hour: number;
    value: number;
}

interface HeatmapDay {
    day: string;
    dayIndex: number;
    hours: HeatmapHour[];
}

interface HeatmapChartProps {
    data?: HeatmapDay[];
    isLoading?: boolean;
}

// Generate mock data for initial display
function generateMockData(): HeatmapDay[] {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days.map((day, dayIndex) => ({
        day,
        dayIndex,
        hours: Array.from({ length: 24 }, (_, hour) => {
            let base = 0;
            if (dayIndex >= 1 && dayIndex <= 5) {
                if (hour >= 9 && hour <= 12) base = 0.7;
                else if (hour >= 14 && hour <= 18) base = 0.6;
                else if (hour >= 20 && hour <= 23) base = 0.3;
            } else {
                if (hour >= 10 && hour <= 14) base = 0.3;
            }
            return {
                hour,
                value: Math.max(0, Math.min(1, base + (Math.random() - 0.5) * 0.3)),
            };
        }),
    }));
}

function getColorForValue(value: number): string {
    if (value === 0) return 'bg-athena-navy-light';
    if (value < 0.25) return 'bg-athena-gold/20';
    if (value < 0.5) return 'bg-athena-gold/40';
    if (value < 0.75) return 'bg-athena-gold/60';
    return 'bg-athena-gold';
}

export function HeatmapChart({ data, isLoading }: HeatmapChartProps) {
    const displayData = data || generateMockData();
    const hours = Array.from({ length: 24 }, (_, i) => i);

    if (isLoading) {
        return (
            <div className="bg-athena-navy/60 border border-athena-gold/10 rounded-xl p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-athena-navy-light rounded w-48 mb-4" />
                    <div className="h-48 bg-athena-navy-light rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-athena-navy/60 border border-athena-gold/10 rounded-xl p-6">
            <h3 className="text-lg font-cinzel text-athena-gold mb-4">
                Mapa de Produtividade
            </h3>

            {/* Hour labels */}
            <div className="flex mb-2 ml-12">
                {hours.filter((_, i) => i % 3 === 0).map((hour) => (
                    <div
                        key={hour}
                        className="text-xs text-athena-silver/40"
                        style={{ width: `${100 / 8}%` }}
                    >
                        {hour.toString().padStart(2, '0')}h
                    </div>
                ))}
            </div>

            {/* Heatmap grid */}
            <div className="space-y-1">
                {displayData.map((dayData) => (
                    <div key={dayData.day} className="flex items-center gap-2">
                        <div className="w-10 text-xs text-athena-silver/60 text-right">
                            {dayData.day}
                        </div>
                        <div className="flex-1 flex gap-0.5">
                            {dayData.hours.map((hourData) => (
                                <div
                                    key={hourData.hour}
                                    className={`
                    flex-1 h-4 rounded-sm
                    ${getColorForValue(hourData.value)}
                    hover:ring-1 hover:ring-athena-gold/50
                    transition-all cursor-pointer
                  `}
                                    title={`${dayData.day} ${hourData.hour}h: ${Math.round(hourData.value * 100)}%`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-athena-silver/40">
                <span>Menos</span>
                <div className="flex gap-0.5">
                    <div className="w-3 h-3 rounded-sm bg-athena-navy-light" />
                    <div className="w-3 h-3 rounded-sm bg-athena-gold/20" />
                    <div className="w-3 h-3 rounded-sm bg-athena-gold/40" />
                    <div className="w-3 h-3 rounded-sm bg-athena-gold/60" />
                    <div className="w-3 h-3 rounded-sm bg-athena-gold" />
                </div>
                <span>Mais</span>
            </div>
        </div>
    );
}
