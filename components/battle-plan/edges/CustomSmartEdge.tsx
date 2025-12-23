'use client';

// =============================================================================
// CUSTOM SMART EDGE - Strict collision detection with debug visualization
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
// COLLISION DETECTION - Strict line-rectangle intersection
// =============================================================================

function lineIntersectsRect(
    p1: Point,
    p2: Point,
    rect: { x: number; y: number; width: number; height: number }
): boolean {
    const padding = 12; // Safety padding
    const left = rect.x - padding;
    const right = rect.x + rect.width + padding;
    const top = rect.y - padding;
    const bottom = rect.y + rect.height + padding;

    // Quick bounding box check
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    if (maxX < left || minX > right || maxY < top || minY > bottom) {
        return false;
    }

    // For horizontal/vertical lines, the bounding box check is sufficient
    if (Math.abs(p1.x - p2.x) < 1 || Math.abs(p1.y - p2.y) < 1) {
        return true; // Line passes through the bounding box
    }

    // Cohen-Sutherland for diagonal lines
    const outcode = (p: Point) => {
        let code = 0;
        if (p.x < left) code |= 1;
        if (p.x > right) code |= 2;
        if (p.y < top) code |= 4;
        if (p.y > bottom) code |= 8;
        return code;
    };

    const code1 = outcode(p1);
    const code2 = outcode(p2);

    if (code1 & code2) return false;
    if (!code1 && !code2) return true;
    return true; // Crosses the rectangle
}

function validatePath(
    path: Point[],
    allCards: Card[],
    sourceId: string,
    targetId: string
): { valid: boolean; collidingCard?: string } {
    for (let i = 0; i < path.length - 1; i++) {
        for (const card of allCards) {
            if (card.id === sourceId || card.id === targetId) continue;
            if (lineIntersectsRect(path[i], path[i + 1], card)) {
                return { valid: false, collidingCard: card.id };
            }
        }
    }
    return { valid: true };
}

// =============================================================================
// ANCHOR SELECTION - Strict direction-based selection
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

// Ordered by priority for different relative positions
const ANCHOR_PRIORITY: Array<{ source: Anchor; target: Anchor }> = [
    // Target below (most common hierarchy)
    { source: 'bottom', target: 'top' },
    // Target to the right
    { source: 'right', target: 'left' },
    // Target to the left
    { source: 'left', target: 'right' },
    // Target above
    { source: 'top', target: 'bottom' },
    // Diagonals
    { source: 'bottom', target: 'left' },
    { source: 'bottom', target: 'right' },
    { source: 'right', target: 'top' },
    { source: 'right', target: 'bottom' },
    { source: 'left', target: 'top' },
    { source: 'left', target: 'bottom' },
    { source: 'top', target: 'left' },
    { source: 'top', target: 'right' },
];

// =============================================================================
// PATH GENERATION - Pure orthogonal with margin around cards
// =============================================================================

function generatePath(
    source: Card,
    target: Card,
    sourceAnchor: Anchor,
    targetAnchor: Anchor,
    allCards: Card[]
): Point[] {
    const start = getAnchorPoint(source, sourceAnchor);
    const end = getAnchorPoint(target, targetAnchor);
    const margin = 40; // Distance from cards

    // Simple L-path for aligned anchors
    if (
        (sourceAnchor === 'bottom' && targetAnchor === 'top') ||
        (sourceAnchor === 'top' && targetAnchor === 'bottom')
    ) {
        // Vertical dominant - go straight down/up then horizontal if needed
        if (Math.abs(start.x - end.x) < 5) {
            return [start, end]; // Direct vertical line
        }
        const midY = (start.y + end.y) / 2;
        return [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end];
    }

    if (
        (sourceAnchor === 'right' && targetAnchor === 'left') ||
        (sourceAnchor === 'left' && targetAnchor === 'right')
    ) {
        // Horizontal dominant - go straight across then vertical if needed
        if (Math.abs(start.y - end.y) < 5) {
            return [start, end]; // Direct horizontal line
        }
        const midX = (start.x + end.x) / 2;
        return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
    }

    // Mixed anchors - L-shaped path
    const isSourceVertical = sourceAnchor === 'top' || sourceAnchor === 'bottom';
    if (isSourceVertical) {
        return [start, { x: start.x, y: end.y }, end];
    } else {
        return [start, { x: end.x, y: start.y }, end];
    }
}

function generateDetourPath(
    source: Card,
    target: Card,
    sourceAnchor: Anchor,
    targetAnchor: Anchor,
    detourDirection: 'left' | 'right' | 'up' | 'down',
    margin: number
): Point[] {
    const start = getAnchorPoint(source, sourceAnchor);
    const end = getAnchorPoint(target, targetAnchor);

    switch (detourDirection) {
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

    // Distance
    for (let i = 0; i < path.length - 1; i++) {
        score += Math.abs(path[i + 1].x - path[i].x) + Math.abs(path[i + 1].y - path[i].y);
    }

    // Turn penalty
    score += (path.length - 2) * 50;

    // Hierarchy: penalize going up when target is below
    if (target.y > source.y + 30) {
        for (let i = 0; i < path.length - 1; i++) {
            if (path[i + 1].y < path[i].y - 5) {
                score += 200;
            }
        }
    }

    return score;
}

// =============================================================================
// MAIN PATH FINDER - STRICT: Never returns a colliding path
// =============================================================================

interface PathResult {
    path: Point[];
    valid: boolean;
    collidingCard?: string;
}

function findOptimalPath(
    source: Card,
    target: Card,
    allCards: Card[]
): PathResult {
    const candidates: Array<{ path: Point[]; score: number }> = [];

    // Try all anchor combinations with simple paths
    for (const anchors of ANCHOR_PRIORITY) {
        const path = generatePath(source, target, anchors.source, anchors.target, allCards);
        const validation = validatePath(path, allCards, source.id, target.id);
        if (validation.valid) {
            candidates.push({ path, score: scorePath(path, source, target) });
        }
    }

    // If no valid simple paths, try detours
    if (candidates.length === 0) {
        const detours: Array<'left' | 'right' | 'up' | 'down'> = ['up', 'down', 'left', 'right'];
        const margins = [50, 80, 120];

        for (const anchors of ANCHOR_PRIORITY.slice(0, 4)) {
            for (const dir of detours) {
                for (const margin of margins) {
                    const path = generateDetourPath(source, target, anchors.source, anchors.target, dir, margin);
                    const validation = validatePath(path, allCards, source.id, target.id);
                    if (validation.valid) {
                        candidates.push({ path, score: scorePath(path, source, target) + 100 }); // Detour penalty
                    }
                }
            }
        }
    }

    // Return best valid path
    if (candidates.length > 0) {
        candidates.sort((a, b) => a.score - b.score);
        return { path: candidates[0].path, valid: true };
    }

    // NO VALID PATH - Return simple path but mark as invalid for debug rendering
    console.error('[SmartEdge] NO VALID PATH FOUND - all routes collide', {
        source: source.id,
        target: target.id,
        cardsCount: allCards.length
    });

    const fallbackPath = [
        getAnchorPoint(source, 'bottom'),
        getAnchorPoint(target, 'top')
    ];
    const validation = validatePath(fallbackPath, allCards, source.id, target.id);

    return {
        path: fallbackPath,
        valid: false,
        collidingCard: validation.collidingCard
    };
}

// =============================================================================
// SVG PATH GENERATION - Smooth corners
// =============================================================================

const CORNER_RADIUS = 8;

function generateSmoothPath(waypoints: Point[]): string {
    if (waypoints.length < 2) return '';

    // Collapse redundant points
    const collapsed: Point[] = [waypoints[0]];
    for (let i = 1; i < waypoints.length; i++) {
        const prev = collapsed[collapsed.length - 1];
        const curr = waypoints[i];
        if (Math.abs(prev.x - curr.x) > 1 || Math.abs(prev.y - curr.y) > 1) {
            collapsed.push(curr);
        }
    }

    if (collapsed.length < 2) return `M ${waypoints[0].x} ${waypoints[0].y}`;

    const parts: string[] = [`M ${collapsed[0].x} ${collapsed[0].y}`];

    for (let i = 1; i < collapsed.length; i++) {
        const prev = collapsed[i - 1];
        const curr = collapsed[i];
        const next = collapsed[i + 1];

        if (!next) {
            parts.push(`L ${curr.x} ${curr.y}`);
            break;
        }

        // Check for corner
        const isHorizIn = Math.abs(prev.y - curr.y) < 2;
        const isHorizOut = Math.abs(curr.y - next.y) < 2;

        if (isHorizIn !== isHorizOut) {
            // Corner detected
            const len1 = isHorizIn ? Math.abs(curr.x - prev.x) : Math.abs(curr.y - prev.y);
            const len2 = isHorizOut ? Math.abs(next.x - curr.x) : Math.abs(next.y - curr.y);

            const r = Math.min(CORNER_RADIUS, len1 / 2, len2 / 2);

            if (r > 2) {
                const dx1 = isHorizIn ? Math.sign(curr.x - prev.x) : 0;
                const dy1 = !isHorizIn ? Math.sign(curr.y - prev.y) : 0;
                const dx2 = isHorizOut ? Math.sign(next.x - curr.x) : 0;
                const dy2 = !isHorizOut ? Math.sign(next.y - curr.y) : 0;

                const startX = curr.x - dx1 * r;
                const startY = curr.y - dy1 * r;
                const endX = curr.x + dx2 * r;
                const endY = curr.y + dy2 * r;

                parts.push(`L ${startX} ${startY}`);
                parts.push(`Q ${curr.x} ${curr.y} ${endX} ${endY}`);
                continue;
            }
        }

        parts.push(`L ${curr.x} ${curr.y}`);
    }

    return parts.join(' ');
}

// =============================================================================
// MAIN COMPONENT
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

    // Convert nodes to Cards
    const allCards: Card[] = useMemo(() => {
        return nodes.map(node => ({
            id: node.id,
            x: node.position.x,
            y: node.position.y,
            width: node.measured?.width ?? (node as unknown as { width?: number }).width ?? 150,
            height: node.measured?.height ?? (node as unknown as { height?: number }).height ?? 80,
        }));
    }, [nodes]);

    // Find source and target cards
    const sourceCard = allCards.find(c => c.id === source);
    const targetCard = allCards.find(c => c.id === target);

    // Generate optimal path
    const { path, isValid } = useMemo(() => {
        if (!sourceCard || !targetCard) {
            return { path: '', isValid: true };
        }

        const result = findOptimalPath(sourceCard, targetCard, allCards);
        const svgPath = generateSmoothPath(result.path);

        if (!result.valid) {
            console.error(`[SmartEdge] Edge ${id} has INVALID path - collides with ${result.collidingCard}`);
        }

        return { path: svgPath, isValid: result.valid };
    }, [sourceCard, targetCard, allCards, id]);

    // Invalid paths render in RED DASHED for debugging
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
