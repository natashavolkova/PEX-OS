// ============================================================================
// PEX-OS PRODUCTIVITY MANAGER - UTILITY FUNCTIONS
// ATHENA Architecture | ENTJ Productivity System
// ============================================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- CLASSNAME UTILITY ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- ID GENERATION ---
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateUniqueKey(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase() +
    '-' +
    Date.now().toString().substring(8);
}

// --- ROI CALCULATION (ENTJ Core) ---
export function calculateROI(impact: number, effort: number): number {
  if (effort === 0) return impact * 10;
  return Math.round((impact / effort) * 10) / 10;
}

export function getROICategory(roi: number): 'execute' | 'schedule' | 'delegate' | 'eliminate' {
  if (roi >= 2.0) return 'execute';
  if (roi >= 1.0) return 'schedule';
  if (roi >= 0.5) return 'delegate';
  return 'eliminate';
}

export function getROIColor(roi: number): string {
  if (roi >= 2.0) return 'text-green-400';
  if (roi >= 1.5) return 'text-blue-400';
  if (roi >= 1.0) return 'text-yellow-400';
  return 'text-red-400';
}

export function getROIBgColor(roi: number): string {
  if (roi >= 2.0) return 'bg-green-500/10 border-green-500/30';
  if (roi >= 1.5) return 'bg-blue-500/10 border-blue-500/30';
  if (roi >= 1.0) return 'bg-yellow-500/10 border-yellow-500/30';
  return 'bg-red-500/10 border-red-500/30';
}

// --- PRIORITY UTILITIES ---
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'text-red-400';
    case 'high': return 'text-orange-400';
    case 'medium': return 'text-yellow-400';
    case 'low': return 'text-gray-400';
    default: return 'text-gray-400';
  }
}

export function getPriorityBgColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-500/10 border-red-500/30';
    case 'high': return 'bg-orange-500/10 border-orange-500/30';
    case 'medium': return 'bg-yellow-500/10 border-yellow-500/30';
    case 'low': return 'bg-gray-500/10 border-gray-500/30';
    default: return 'bg-gray-500/10 border-gray-500/30';
  }
}

export function calculatePriorityScore(
  roi: number,
  impact: number,
  urgency: number,
  effort: number
): number {
  return (roi * 0.4) + (impact * 0.3) + (urgency * 0.2) + ((10 - effort) * 0.1);
}

// --- DATE UTILITIES ---
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d atrás`;
  if (hours > 0) return `${hours}h atrás`;
  if (minutes > 0) return `${minutes}m atrás`;
  return 'agora';
}

export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

// --- TIME FORMATTING ---
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

export function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// --- STRING UTILITIES ---
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// --- ARRAY UTILITIES ---
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function sortByKey<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

// --- YOUTUBE UTILITIES ---
export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

// --- PRODUCTIVITY HEATMAP ---
export function getHeatmapLevel(value: number): 0 | 1 | 2 | 3 | 4 {
  if (value === 0) return 0;
  if (value <= 2) return 1;
  if (value <= 4) return 2;
  if (value <= 6) return 3;
  return 4;
}

export function getHeatmapColor(level: number): string {
  switch (level) {
    case 0: return 'bg-gray-800/50';
    case 1: return 'bg-green-900/50';
    case 2: return 'bg-green-700/60';
    case 3: return 'bg-green-500/70';
    case 4: return 'bg-green-400/80';
    default: return 'bg-gray-800/50';
  }
}

// --- STATUS UTILITIES ---
export function getStatusColor(status: string): string {
  switch (status) {
    case 'completed': return 'text-green-400';
    case 'in_progress': return 'text-blue-400';
    case 'blocked': return 'text-red-400';
    case 'pending': return 'text-yellow-400';
    case 'cancelled': return 'text-gray-500';
    default: return 'text-gray-400';
  }
}

export function getStatusBgColor(status: string): string {
  switch (status) {
    case 'completed': return 'bg-green-500/10 border-green-500/30';
    case 'in_progress': return 'bg-blue-500/10 border-blue-500/30';
    case 'blocked': return 'bg-red-500/10 border-red-500/30';
    case 'pending': return 'bg-yellow-500/10 border-yellow-500/30';
    case 'cancelled': return 'bg-gray-500/10 border-gray-500/30';
    default: return 'bg-gray-500/10 border-gray-500/30';
  }
}

// --- DEBOUNCE ---
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// --- THROTTLE ---
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// --- COPY TO CLIPBOARD ---
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// --- DOWNLOAD FILE ---
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- LOCAL STORAGE HELPERS ---
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

// --- ENTJ EVALUATION ---
export function evaluateENTJ(
  impactScore: number,
  effortScore: number
): {
  roi: number;
  recommendation: 'execute' | 'delegate' | 'defer' | 'eliminate';
  priority: 'critical' | 'high' | 'medium' | 'low';
} {
  const roi = calculateROI(impactScore, effortScore);
  
  let recommendation: 'execute' | 'delegate' | 'defer' | 'eliminate';
  let priority: 'critical' | 'high' | 'medium' | 'low';
  
  if (roi >= 2.0) {
    recommendation = 'execute';
    priority = 'critical';
  } else if (roi >= 1.5) {
    recommendation = 'execute';
    priority = 'high';
  } else if (roi >= 1.0) {
    recommendation = 'delegate';
    priority = 'medium';
  } else if (roi >= 0.5) {
    recommendation = 'defer';
    priority = 'low';
  } else {
    recommendation = 'eliminate';
    priority = 'low';
  }
  
  return { roi, recommendation, priority };
}
