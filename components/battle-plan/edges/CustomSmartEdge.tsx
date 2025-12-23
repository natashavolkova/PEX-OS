'use client';

// =============================================================================
// CUSTOM SMART EDGE - Fixed arrow direction + strict collision detection
// =============================================================================

import { memo, useMemo } from 'react';
import { EdgeProps, useNodes } from '@xyflow/react';

interface Point {
    x: number;
    y: number;
}

interface Card {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

// =============================================================================
// COLLISION DETECTION - Liang-Barsky algorithm
// =============================================================================

function lineIntersectsRect(
    p1: Point,
    p2: Point,
    card: Card
): boolean {
    const padding = 15;
    const left = card.x - padding;
    const right = card.x + card.width + padding;
    const top = card.y - padding;
    const bottom = card.y + card.height + padding;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    let tMin = 0;
    let tMax = 1;

    // Check each edge
    const edges = [
        { p: -dx, q: p1.x - left },
        { p: dx, q: right - p1.x },
        { p: -dy, q: p1.y - top },
        { p: dy, q: bottom - p1.y }
    ];

    for (const { p, q } of edges) {
        if (p === 0) {
            if (q < 0) return false;
        } else {
            const t = q / p;
            if (p < 0) {
                tMin = Math.max(tMin, t);
            } else {
                tMax = Math.min(tMax, t);
            }
            if (tMin > tMax) return false;
        }
    }

    return true;
}

function validatePath(
    path: Point[],
    allCards: Card[],
    sourceId: string,
    targetId: string
): boolean {
    for (let i = 0; i < path.length - 1; i++) {
        for (const card of allCards) {
            if (card.id === sourceId || card.id === targetId) continue;
            if (lineIntersectsRect(path[i], path[i + 1], card)) {
                console.error(`[SmartEdge] Collision: segment ${i} hits ${card.id}`);
                return false;
            }
        }
    }
    return true;
}

// =============================================================================
// ANCHOR SELECTION - Based on relative position
// =============================================================================

type Anchor = 'top' | 'right' | 'bottom' | 'left';

function getAnchorPoint(card: Card, anchor: Anchor): Point {
    switch (anchor) {
        case 'top': return { x: card.x + card.width / 2, y: card.y };
        case 'bottom': return { x: card.x + card.width / 2, y: card.y + card.height };
        case 'left': return { x: card.x, y: card.y + card.height / 2 };
        case 'right': return { x: card.x + card.width, y: card.y + card.height / 2 };
    }
}

// Get anchor based on relative position of other card
function selectAnchors(source: Card, target: Card): { sourceAnchor: Anchor; targetAnchor: Anchor } {
    const dx = (target.x + target.width / 2) - (source.x + source.width / 2);
    const dy = (target.y + target.height / 2) - (source.y + source.height / 2);

    // Vertical dominant
    if (Math.abs(dy) > Math.abs(dx)) {
        if (dy > 0) {
            return { sourceAnchor: 'bottom', targetAnchor: 'top' };
        } else {
            return { sourceAnchor: 'top', targetAnchor: 'bottom' };
        }
    }
    // Horizontal dominant
    if (dx > 0) {
        return { sourceAnchor: 'right', targetAnchor: 'left' };
    } else {
        return { sourceAnchor: 'left', targetAnchor: 'right' };
    }
}

// =============================================================================
// PATH GENERATION - Ensures last segment points INTO target
// =============================================================================

function generatePath(
    source: Card,
    target: Card,
    sourceAnchor: Anchor,
    targetAnchor: Anchor
): Point[] {
    const start = getAnchorPoint(source, sourceAnchor);
    const end = getAnchorPoint(target, targetAnchor);

    // Approach distance from anchor
    const approach = 30;

    // Calculate approach point based on TARGET anchor
    // This ensures the last segment points INTO the target
    let approachPoint: Point;
    switch (targetAnchor) {
        case 'top':
            approachPoint = { x: end.x, y: end.y - approach };
            break;
        case 'bottom':
            approachPoint = { x: end.x, y: end.y + approach };
            break;
        case 'left':
            approachPoint = { x: end.x - approach, y: end.y };
            break;
        case 'right':
            approachPoint = { x: end.x + approach, y: end.y };
            break;
    }

    // Calculate exit point from source anchor
    let exitPoint: Point;
    switch (sourceAnchor) {
        case 'top':
            exitPoint = { x: start.x, y: start.y - approach };
            break;
        case 'bottom':
            exitPoint = { x: start.x, y: start.y + approach };
            break;
        case 'left':
            exitPoint = { x: start.x - approach, y: start.y };
            break;
        case 'right':
            exitPoint = { x: start.x + approach, y: start.y };
            break;
    }

    // Check if direct connection is possible (same axis)
    if (sourceAnchor === 'bottom' && targetAnchor === 'top' && Math.abs(start.x - end.x) < 5) {
        return [start, end];
    }
    if (sourceAnchor === 'top' && targetAnchor === 'bottom' && Math.abs(start.x - end.x) < 5) {
        return [start, end];
    }
    if (sourceAnchor === 'right' && targetAnchor === 'left' && Math.abs(start.y - end.y) < 5) {
        return [start, end];
    }
    if (sourceAnchor === 'left' && targetAnchor === 'right' && Math.abs(start.y - end.y) < 5) {
        return [start, end];
    }

    // Build orthogonal path
    const isSourceVertical = sourceAnchor === 'top' || sourceAnchor === 'bottom';
    const isTargetVertical = targetAnchor === 'top' || targetAnchor === 'bottom';

    if (isSourceVertical && isTargetVertical) {
        // Both vertical - horizontal middle segment
        const midY = (exitPoint.y + approachPoint.y) / 2;
        return [
            start,
            exitPoint,
            { x: exitPoint.x, y: midY },
            { x: approachPoint.x, y: midY },
            approachPoint,
            end
        ];
    }

    if (!isSourceVertical && !isTargetVertical) {
        // Both horizontal - vertical middle segment
        const midX = (exitPoint.x + approachPoint.x) / 2;
        return [
            start,
            exitPoint,
            { x: midX, y: exitPoint.y },
            { x: midX, y: approachPoint.y },
            approachPoint,
            end
        ];
    }

    // Mixed - L-shape
    if (isSourceVertical) {
        // Vertical exit, horizontal approach
        return [
            start,
            exitPoint,
            { x: exitPoint.x, y: approachPoint.y },
            approachPoint,
            end
        ];
    } else {
        // Horizontal exit, vertical approach
        return [
            start,
            exitPoint,
            { x: approachPoint.x, y: exitPoint.y },
            approachPoint,
            end
        ];
    }
}

function generateDetourPath(
    source: Card,
    target: Card,
    direction: 'left' | 'right' | 'up' | 'down',
    margin: number
): Point[] {
    const anchors = selectAnchors(source, target);
    const start = getAnchorPoint(source, anchors.sourceAnchor);
    const end = getAnchorPoint(target, anchors.targetAnchor);

    switch (direction) {
        case 'left': {
            const x = Math.min(source.x, target.x) - margin;
            return [start, { x: start.x, y: start.y }, { x, y: start.y }, { x, y: end.y }, { x: end.x, y: end.y }, end];
        }
        case 'right': {
            const x = Math.max(source.x + source.width, target.x + target.width) + margin;
            return [start, { x, y: start.y }, { x, y: end.y }, end];
        }
        case 'up': {
            const y = Math.min(source.y, target.y) - margin;
            return [start, { x: start.x, y }, { x: end.x, y }, end];
        }
        case 'down': {
            const y = Math.max(source.y + source.height, target.y + target.height) + margin;
            return [start, { x: start.x, y }, { x: end.x, y }, end];
        }
    }
}

// =============================================================================
// SCORING
// =============================================================================

function scorePath(path: Point[], source: Card, target: Card): number {
    let score = 0;
    for (let i = 0; i < path.length - 1; i++) {
        score += Math.abs(path[i + 1].x - path[i].x) + Math.abs(path[i + 1].y - path[i].y);
    }
    score += (path.length - 2) * 30;

    if (target.y > source.y + 30) {
        for (let i = 0; i < path.length - 1; i++) {
            if (path[i + 1].y < path[i].y - 5) score += 200;
        }
    }
    return score;
}

// =============================================================================
// PATH FINDER
// =============================================================================

interface PathResult {
    path: Point[];
    valid: boolean;
}

function findOptimalPath(source: Card, target: Card, allCards: Card[]): PathResult {
    const candidates: Array<{ path: Point[]; score: number }> = [];
    const anchors: Anchor[] = ['top', 'right', 'bottom', 'left'];

    // Try all anchor combinations
    for (const sourceAnchor of anchors) {
        for (const targetAnchor of anchors) {
            const path = generatePath(source, target, sourceAnchor, targetAnchor);
            if (validatePath(path, allCards, source.id, target.id)) {
                candidates.push({ path, score: scorePath(path, source, target) });
            }
        }
    }

    // Try detours if needed
    if (candidates.length === 0) {
        const dirs: Array<'left' | 'right' | 'up' | 'down'> = ['up', 'down', 'left', 'right'];
        for (const dir of dirs) {
            for (const margin of [50, 80, 120]) {
                const path = generateDetourPath(source, target, dir, margin);
                if (validatePath(path, allCards, source.id, target.id)) {
                    candidates.push({ path, score: scorePath(path, source, target) + 100 });
                }
            }
        }
    }

    if (candidates.length > 0) {
        candidates.sort((a, b) => a.score - b.score);
        return { path: candidates[0].path, valid: true };
    }

    // No valid path - use fallback with optimal anchors
    console.error('[SmartEdge] NO VALID PATH', { source: source.id, target: target.id });
    const optimal = selectAnchors(source, target);
    return {
        path: generatePath(source, target, optimal.sourceAnchor, optimal.targetAnchor),
        valid: false
    };
}

// =============================================================================
// SVG PATH - Collapse redundant points, smooth corners
// =============================================================================

function collapsePoints(points: Point[]): Point[] {
    if (points.length < 2) return points;
    const result: Point[] = [points[0]];
    for (let i = 1; i < points.length; i++) {
        const prev = result[result.length - 1];
        const curr = points[i];
        if (Math.abs(prev.x - curr.x) > 2 || Math.abs(prev.y - curr.y) > 2) {
            result.push(curr);
        }
    }
    return result;
}

const CORNER_RADIUS = 8;

function generateSvgPath(waypoints: Point[]): string {
    const points = collapsePoints(waypoints);
    if (points.length < 2) return '';

    const parts: string[] = [`M ${points[0].x} ${points[0].y}`];

    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        if (!next) {
            parts.push(`L ${curr.x} ${curr.y}`);
            break;
        }

        const isHorizIn = Math.abs(prev.y - curr.y) < 2;
        const isHorizOut = Math.abs(curr.y - next.y) < 2;

        if (isHorizIn !== isHorizOut) {
            const len1 = isHorizIn ? Math.abs(curr.x - prev.x) : Math.abs(curr.y - prev.y);
            const len2 = isHorizOut ? Math.abs(next.x - curr.x) : Math.abs(next.y - curr.y);
            const r = Math.min(CORNER_RADIUS, len1 / 2, len2 / 2);

            if (r > 2) {
                const dx1 = isHorizIn ? Math.sign(curr.x - prev.x) : 0;
                const dy1 = !isHorizIn ? Math.sign(curr.y - prev.y) : 0;
                const dx2 = isHorizOut ? Math.sign(next.x - curr.x) : 0;
                const dy2 = !isHorizOut ? Math.sign(next.y - curr.y) : 0;

                parts.push(`L ${curr.x - dx1 * r} ${curr.y - dy1 * r}`);
                parts.push(`Q ${curr.x} ${curr.y} ${curr.x + dx2 * r} ${curr.y + dy2 * r}`);
                continue;
            }
        }
        parts.push(`L ${curr.x} ${curr.y}`);
    }

    return parts.join(' ');
}

// =============================================================================
// COMPONENT
// =============================================================================

function CustomSmartEdge({
    id,
    source,
    target,
    style,
    markerEnd,
    markerStart,
}: EdgeProps) {
    const nodes = useNodes();

    const allCards: Card[] = useMemo(() => {
        return nodes.map(node => ({
            id: node.id,
            x: node.position.x,
            y: node.position.y,
            width: node.measured?.width ?? (node as unknown as { width?: number }).width ?? 150,
            height: node.measured?.height ?? (node as unknown as { height?: number }).height ?? 80,
        }));
    }, [nodes]);

    const sourceCard = allCards.find(c => c.id === source);
    const targetCard = allCards.find(c => c.id === target);

    const { path, isValid } = useMemo(() => {
        if (!sourceCard || !targetCard) {
            return { path: '', isValid: true };
        }
        const result = findOptimalPath(sourceCard, targetCard, allCards);
        return { path: generateSvgPath(result.path), isValid: result.valid };
    }, [sourceCard, targetCard, allCards]);

    const edgeStyle = isValid ? style : {
        ...style,
        stroke: '#ff4444',
        strokeWidth: 3,
        strokeDasharray: '8,4',
    };

    return (
        <path
            id={id}
            d={path}
            style={edgeStyle}
            fill="none"
            className="react-flow__edge-path"
            markerEnd={markerEnd as string}
            markerStart={markerStart as string}
        />
    );
}

export default memo(CustomSmartEdge);
