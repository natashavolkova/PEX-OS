'use client';

// =============================================================================
// CUSTOM SMART EDGE - With comprehensive collision audit logging
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

interface CardBounds {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

// =============================================================================
// COLLISION DETECTION - With detailed audit logging
// =============================================================================

function getCardBounds(card: Card, padding: number = 15): CardBounds {
    return {
        left: card.x - padding,
        right: card.x + card.width + padding,
        top: card.y - padding,
        bottom: card.y + card.height + padding
    };
}

function lineSegmentIntersectsRect(
    p1: Point,
    p2: Point,
    bounds: CardBounds
): boolean {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    let tMin = 0;
    let tMax = 1;

    const edges = [
        { p: -dx, q: p1.x - bounds.left },
        { p: dx, q: bounds.right - p1.x },
        { p: -dy, q: p1.y - bounds.top },
        { p: dy, q: bounds.bottom - p1.y }
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

interface ValidationResult {
    valid: boolean;
    collisions: string[];
}

function validatePathWithAudit(
    path: Point[],
    obstacles: Card[],
    edgeId: string,
    sourceId: string,
    targetId: string
): ValidationResult {
    const collisions: string[] = [];

    console.log(`[CollisionAudit] Validating edge ${edgeId}`, {
        pathLength: path.length,
        obstacleCount: obstacles.length,
        obstacleIds: obstacles.map(o => o.id)
    });

    for (let i = 0; i < path.length - 1; i++) {
        const segStart = path[i];
        const segEnd = path[i + 1];

        for (const obstacle of obstacles) {
            if (obstacle.id === sourceId || obstacle.id === targetId) {
                continue; // Skip source/target
            }

            const bounds = getCardBounds(obstacle, 15);
            const intersects = lineSegmentIntersectsRect(segStart, segEnd, bounds);

            if (intersects) {
                console.error(`[CollisionAudit] COLLISION!`, {
                    edgeId,
                    segment: i,
                    from: segStart,
                    to: segEnd,
                    obstacle: obstacle.id,
                    obstacleBounds: bounds
                });
                if (!collisions.includes(obstacle.id)) {
                    collisions.push(obstacle.id);
                }
            }
        }
    }

    const valid = collisions.length === 0;

    if (!valid) {
        console.error(`[CollisionAudit] Path INVALID for ${edgeId}`, { collisions });
    }

    return { valid, collisions };
}

// =============================================================================
// ANCHOR SELECTION
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

function selectOptimalAnchors(source: Card, target: Card): { source: Anchor; target: Anchor } {
    const dx = (target.x + target.width / 2) - (source.x + source.width / 2);
    const dy = (target.y + target.height / 2) - (source.y + source.height / 2);

    if (Math.abs(dy) > Math.abs(dx)) {
        return dy > 0
            ? { source: 'bottom', target: 'top' }
            : { source: 'top', target: 'bottom' };
    }
    return dx > 0
        ? { source: 'right', target: 'left' }
        : { source: 'left', target: 'right' };
}

// =============================================================================
// PATH GENERATION - Each edge calculates independently
// =============================================================================

const APPROACH_DISTANCE = 30;

function generateOrthogonalPath(
    source: Card,
    target: Card,
    sourceAnchor: Anchor,
    targetAnchor: Anchor
): Point[] {
    const start = getAnchorPoint(source, sourceAnchor);
    const end = getAnchorPoint(target, targetAnchor);

    // Exit point from source
    let exit: Point;
    switch (sourceAnchor) {
        case 'top': exit = { x: start.x, y: start.y - APPROACH_DISTANCE }; break;
        case 'bottom': exit = { x: start.x, y: start.y + APPROACH_DISTANCE }; break;
        case 'left': exit = { x: start.x - APPROACH_DISTANCE, y: start.y }; break;
        case 'right': exit = { x: start.x + APPROACH_DISTANCE, y: start.y }; break;
    }

    // Approach point to target
    let approach: Point;
    switch (targetAnchor) {
        case 'top': approach = { x: end.x, y: end.y - APPROACH_DISTANCE }; break;
        case 'bottom': approach = { x: end.x, y: end.y + APPROACH_DISTANCE }; break;
        case 'left': approach = { x: end.x - APPROACH_DISTANCE, y: end.y }; break;
        case 'right': approach = { x: end.x + APPROACH_DISTANCE, y: end.y }; break;
    }

    const isSourceVert = sourceAnchor === 'top' || sourceAnchor === 'bottom';
    const isTargetVert = targetAnchor === 'top' || targetAnchor === 'bottom';

    // Direct line if aligned
    if (sourceAnchor === 'bottom' && targetAnchor === 'top' && Math.abs(start.x - end.x) < 5) {
        return [start, end];
    }
    if (sourceAnchor === 'right' && targetAnchor === 'left' && Math.abs(start.y - end.y) < 5) {
        return [start, end];
    }

    if (isSourceVert && isTargetVert) {
        const midY = (exit.y + approach.y) / 2;
        return [start, exit, { x: exit.x, y: midY }, { x: approach.x, y: midY }, approach, end];
    }

    if (!isSourceVert && !isTargetVert) {
        const midX = (exit.x + approach.x) / 2;
        return [start, exit, { x: midX, y: exit.y }, { x: midX, y: approach.y }, approach, end];
    }

    // Mixed L-shape
    if (isSourceVert) {
        return [start, exit, { x: exit.x, y: approach.y }, approach, end];
    } else {
        return [start, exit, { x: approach.x, y: exit.y }, approach, end];
    }
}

function generateDetourPath(
    source: Card,
    target: Card,
    dir: 'left' | 'right' | 'up' | 'down',
    margin: number
): Point[] {
    const optimal = selectOptimalAnchors(source, target);
    const start = getAnchorPoint(source, optimal.source);
    const end = getAnchorPoint(target, optimal.target);

    switch (dir) {
        case 'left': {
            const x = Math.min(source.x, target.x) - margin;
            return [start, { x, y: start.y }, { x, y: end.y }, end];
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
// SCORING - Simple distance + turns
// =============================================================================

function scorePath(path: Point[]): number {
    let distance = 0;
    let turns = 0;

    for (let i = 0; i < path.length - 1; i++) {
        distance += Math.abs(path[i + 1].x - path[i].x) + Math.abs(path[i + 1].y - path[i].y);
    }

    for (let i = 1; i < path.length - 1; i++) {
        const isHorizIn = Math.abs(path[i].y - path[i - 1].y) < 2;
        const isHorizOut = Math.abs(path[i + 1].y - path[i].y) < 2;
        if (isHorizIn !== isHorizOut) turns++;
    }

    return distance + turns * 50;
}

// =============================================================================
// MAIN PATH FINDER - No route sharing, each edge independent
// =============================================================================

interface PathResult {
    path: Point[];
    valid: boolean;
    collisions: string[];
}

function findOptimalPath(
    source: Card,
    target: Card,
    obstacles: Card[],
    edgeId: string
): PathResult {
    console.log(`[CollisionAudit] Finding path for edge ${edgeId}`, {
        source: source.id,
        target: target.id,
        obstacles: obstacles.filter(o => o.id !== source.id && o.id !== target.id).map(o => o.id)
    });

    const candidates: Array<{ path: Point[]; score: number; validation: ValidationResult }> = [];
    const anchors: Anchor[] = ['top', 'right', 'bottom', 'left'];

    // Test all 16 anchor combinations
    for (const srcAnc of anchors) {
        for (const tgtAnc of anchors) {
            const path = generateOrthogonalPath(source, target, srcAnc, tgtAnc);
            const validation = validatePathWithAudit(path, obstacles, edgeId, source.id, target.id);

            if (validation.valid) {
                candidates.push({ path, score: scorePath(path), validation });
            }
        }
    }

    console.log(`[CollisionAudit] After anchor combinations: ${candidates.length} valid paths for ${edgeId}`);

    // Try detours if needed
    if (candidates.length === 0) {
        const dirs: Array<'left' | 'right' | 'up' | 'down'> = ['up', 'down', 'left', 'right'];
        for (const dir of dirs) {
            for (const margin of [50, 80, 120, 180]) {
                const path = generateDetourPath(source, target, dir, margin);
                const validation = validatePathWithAudit(path, obstacles, edgeId, source.id, target.id);

                if (validation.valid) {
                    candidates.push({ path, score: scorePath(path) + 100, validation });
                }
            }
        }
    }

    console.log(`[CollisionAudit] After detours: ${candidates.length} valid paths for ${edgeId}`);

    if (candidates.length > 0) {
        candidates.sort((a, b) => a.score - b.score);
        return { path: candidates[0].path, valid: true, collisions: [] };
    }

    // NO VALID PATH - Use fallback but mark as INVALID
    console.error(`[CollisionAudit] NO VALID PATH for ${edgeId} - ALL PATHS COLLIDE`);

    const optimal = selectOptimalAnchors(source, target);
    const fallback = generateOrthogonalPath(source, target, optimal.source, optimal.target);
    const fallbackValidation = validatePathWithAudit(fallback, obstacles, edgeId, source.id, target.id);

    return {
        path: fallback,
        valid: false,
        collisions: fallbackValidation.collisions
    };
}

// =============================================================================
// SVG PATH GENERATION
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

    // Build obstacle list from ALL nodes with dimension audit
    const { allCards, sourceCard, targetCard } = useMemo(() => {
        const cards: Card[] = [];
        let src: Card | undefined;
        let tgt: Card | undefined;

        for (const node of nodes) {
            const width = node.measured?.width ?? (node as unknown as { width?: number }).width ?? 150;
            const height = node.measured?.height ?? (node as unknown as { height?: number }).height ?? 80;

            if (!node.measured?.width || !node.measured?.height) {
                console.warn(`[CollisionAudit] Node ${node.id} without measured dimensions, using fallback:`, { width, height });
            }

            const card: Card = {
                id: node.id,
                x: node.position.x,
                y: node.position.y,
                width,
                height
            };

            cards.push(card);

            if (node.id === source) src = card;
            if (node.id === target) tgt = card;
        }

        console.log(`[CollisionAudit] Built obstacle list for edge ${id}`, {
            totalNodes: nodes.length,
            totalCards: cards.length,
            hasSource: !!src,
            hasTarget: !!tgt
        });

        return { allCards: cards, sourceCard: src, targetCard: tgt };
    }, [nodes, source, target, id]);

    // Calculate path
    const { path, isValid, collisions } = useMemo(() => {
        if (!sourceCard || !targetCard) {
            console.error(`[CollisionAudit] Missing source/target for edge ${id}`);
            return { path: '', isValid: false, collisions: [] };
        }

        const result = findOptimalPath(sourceCard, targetCard, allCards, id);
        const svgPath = generateSvgPath(result.path);

        return {
            path: svgPath,
            isValid: result.valid,
            collisions: result.collisions
        };
    }, [sourceCard, targetCard, allCards, id]);

    // Invalid paths render RED DASHED
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
