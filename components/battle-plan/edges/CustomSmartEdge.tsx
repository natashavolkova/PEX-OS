'use client';

// =============================================================================
// CUSTOM SMART EDGE - With A* fallback and absolute collision rejection
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
// COLLISION DETECTION
// =============================================================================

function lineIntersectsCard(p1: Point, p2: Point, card: Card, padding: number = 15): boolean {
    const left = card.x - padding;
    const right = card.x + card.width + padding;
    const top = card.y - padding;
    const bottom = card.y + card.height + padding;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    let tMin = 0;
    let tMax = 1;

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

function validatePath(path: Point[], obstacles: Card[], sourceId: string, targetId: string): boolean {
    for (let i = 0; i < path.length - 1; i++) {
        for (const card of obstacles) {
            if (card.id === sourceId || card.id === targetId) continue;
            if (lineIntersectsCard(path[i], path[i + 1], card)) {
                return false;
            }
        }
    }
    return true;
}

// =============================================================================
// A* GRID PATHFINDING - Guaranteed collision-free paths
// =============================================================================

interface GridNode {
    x: number;
    y: number;
    g: number;
    h: number;
    f: number;
    parent: GridNode | null;
}

function isPointBlocked(x: number, y: number, obstacles: Card[], sourceId: string, targetId: string): boolean {
    const padding = 20;
    for (const card of obstacles) {
        if (card.id === sourceId || card.id === targetId) continue;
        if (x >= card.x - padding && x <= card.x + card.width + padding &&
            y >= card.y - padding && y <= card.y + card.height + padding) {
            return true;
        }
    }
    return false;
}

function findAStarPath(
    start: Point,
    end: Point,
    obstacles: Card[],
    sourceId: string,
    targetId: string
): Point[] | null {
    const gridSize = 20;
    const maxIterations = 2000;

    // Snap to grid
    const startGrid = {
        x: Math.round(start.x / gridSize) * gridSize,
        y: Math.round(start.y / gridSize) * gridSize
    };
    const endGrid = {
        x: Math.round(end.x / gridSize) * gridSize,
        y: Math.round(end.y / gridSize) * gridSize
    };

    const openSet: GridNode[] = [];
    const closedSet = new Set<string>();

    const startNode: GridNode = {
        x: startGrid.x,
        y: startGrid.y,
        g: 0,
        h: Math.abs(endGrid.x - startGrid.x) + Math.abs(endGrid.y - startGrid.y),
        f: 0,
        parent: null
    };
    startNode.f = startNode.g + startNode.h;
    openSet.push(startNode);

    let iterations = 0;

    while (openSet.length > 0 && iterations < maxIterations) {
        iterations++;

        // Get node with lowest f
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift()!;

        // Check if reached goal
        if (Math.abs(current.x - endGrid.x) < gridSize &&
            Math.abs(current.y - endGrid.y) < gridSize) {
            // Reconstruct path
            const path: Point[] = [];
            let node: GridNode | null = current;
            while (node) {
                path.unshift({ x: node.x, y: node.y });
                node = node.parent;
            }
            // Add actual start and end points
            path[0] = start;
            path.push(end);
            return simplifyPath(path);
        }

        const key = `${current.x},${current.y}`;
        if (closedSet.has(key)) continue;
        closedSet.add(key);

        // Explore neighbors (4 directions for orthogonal paths)
        const directions = [
            { dx: gridSize, dy: 0 },
            { dx: -gridSize, dy: 0 },
            { dx: 0, dy: gridSize },
            { dx: 0, dy: -gridSize }
        ];

        for (const dir of directions) {
            const nx = current.x + dir.dx;
            const ny = current.y + dir.dy;
            const nKey = `${nx},${ny}`;

            if (closedSet.has(nKey)) continue;
            if (isPointBlocked(nx, ny, obstacles, sourceId, targetId)) continue;

            const g = current.g + gridSize;
            const h = Math.abs(endGrid.x - nx) + Math.abs(endGrid.y - ny);

            const neighbor: GridNode = {
                x: nx,
                y: ny,
                g,
                h,
                f: g + h,
                parent: current
            };

            openSet.push(neighbor);
        }
    }

    console.error('[A*] No path found after', iterations, 'iterations');
    return null;
}

function simplifyPath(path: Point[]): Point[] {
    if (path.length < 3) return path;

    const result: Point[] = [path[0]];

    for (let i = 1; i < path.length - 1; i++) {
        const prev = result[result.length - 1];
        const curr = path[i];
        const next = path[i + 1];

        // Check if direction changes
        const prevHoriz = Math.abs(curr.y - prev.y) < 2;
        const nextHoriz = Math.abs(next.y - curr.y) < 2;

        if (prevHoriz !== nextHoriz) {
            result.push(curr); // Keep corner points
        }
    }

    result.push(path[path.length - 1]);
    return result;
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

function selectAnchors(source: Card, target: Card): { source: Anchor; target: Anchor } {
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
// SIMPLE PATH GENERATION
// =============================================================================

function generateSimplePath(source: Card, target: Card, srcAnc: Anchor, tgtAnc: Anchor): Point[] {
    const start = getAnchorPoint(source, srcAnc);
    const end = getAnchorPoint(target, tgtAnc);
    const offset = 30;

    // Exit point
    let exit: Point;
    switch (srcAnc) {
        case 'top': exit = { x: start.x, y: start.y - offset }; break;
        case 'bottom': exit = { x: start.x, y: start.y + offset }; break;
        case 'left': exit = { x: start.x - offset, y: start.y }; break;
        case 'right': exit = { x: start.x + offset, y: start.y }; break;
    }

    // Approach point
    let approach: Point;
    switch (tgtAnc) {
        case 'top': approach = { x: end.x, y: end.y - offset }; break;
        case 'bottom': approach = { x: end.x, y: end.y + offset }; break;
        case 'left': approach = { x: end.x - offset, y: end.y }; break;
        case 'right': approach = { x: end.x + offset, y: end.y }; break;
    }

    const isSourceVert = srcAnc === 'top' || srcAnc === 'bottom';
    const isTargetVert = tgtAnc === 'top' || tgtAnc === 'bottom';

    // Direct line if aligned
    if (srcAnc === 'bottom' && tgtAnc === 'top' && Math.abs(start.x - end.x) < 5) {
        return [start, end];
    }
    if (srcAnc === 'right' && tgtAnc === 'left' && Math.abs(start.y - end.y) < 5) {
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

    if (isSourceVert) {
        return [start, exit, { x: exit.x, y: approach.y }, approach, end];
    } else {
        return [start, exit, { x: approach.x, y: exit.y }, approach, end];
    }
}

function generateDetour(source: Card, target: Card, dir: 'left' | 'right' | 'up' | 'down', margin: number): Point[] {
    const anchors = selectAnchors(source, target);
    const start = getAnchorPoint(source, anchors.source);
    const end = getAnchorPoint(target, anchors.target);

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
// MAIN PATH FINDER - Escalates to A* if simple paths fail
// =============================================================================

function scorePath(path: Point[]): number {
    let dist = 0;
    for (let i = 0; i < path.length - 1; i++) {
        dist += Math.abs(path[i + 1].x - path[i].x) + Math.abs(path[i + 1].y - path[i].y);
    }
    return dist + path.length * 20;
}

interface PathResult {
    path: Point[];
    valid: boolean;
    method: 'simple' | 'detour' | 'astar' | 'failed';
}

function findPath(source: Card, target: Card, obstacles: Card[], edgeId: string): PathResult {
    const anchors: Anchor[] = ['top', 'right', 'bottom', 'left'];
    const validPaths: Array<{ path: Point[]; score: number; method: string }> = [];

    // Try all simple anchor combinations
    for (const src of anchors) {
        for (const tgt of anchors) {
            const path = generateSimplePath(source, target, src, tgt);
            if (validatePath(path, obstacles, source.id, target.id)) {
                validPaths.push({ path, score: scorePath(path), method: 'simple' });
            }
        }
    }

    // Try detours
    if (validPaths.length === 0) {
        const dirs: Array<'left' | 'right' | 'up' | 'down'> = ['up', 'down', 'left', 'right'];
        for (const dir of dirs) {
            for (const margin of [50, 80, 120, 180]) {
                const path = generateDetour(source, target, dir, margin);
                if (validatePath(path, obstacles, source.id, target.id)) {
                    validPaths.push({ path, score: scorePath(path) + 100, method: 'detour' });
                }
            }
        }
    }

    // Return best simple/detour path
    if (validPaths.length > 0) {
        validPaths.sort((a, b) => a.score - b.score);
        return {
            path: validPaths[0].path,
            valid: true,
            method: validPaths[0].method as 'simple' | 'detour'
        };
    }

    // ESCALATE TO A* - grid-based pathfinding
    console.warn(`[SmartEdge] No simple path for ${edgeId}, using A*`);

    const optimal = selectAnchors(source, target);
    const start = getAnchorPoint(source, optimal.source);
    const end = getAnchorPoint(target, optimal.target);

    const astarPath = findAStarPath(start, end, obstacles, source.id, target.id);

    if (astarPath && validatePath(astarPath, obstacles, source.id, target.id)) {
        console.log(`[SmartEdge] A* found valid path for ${edgeId}`);
        return { path: astarPath, valid: true, method: 'astar' };
    }

    // ABSOLUTE FAILURE - Return minimal path that goes AROUND everything
    console.error(`[SmartEdge] A* FAILED for ${edgeId} - using extreme detour`);

    // Calculate extreme detour that definitely avoids all cards
    let minX = source.x, maxX = source.x + source.width;
    let minY = source.y, maxY = source.y + source.height;

    for (const card of obstacles) {
        minX = Math.min(minX, card.x);
        maxX = Math.max(maxX, card.x + card.width);
        minY = Math.min(minY, card.y);
        maxY = Math.max(maxY, card.y + card.height);
    }

    // Try extreme routes
    const extremeMargin = 60;
    const extremePaths = [
        // Go far above
        [start, { x: start.x, y: minY - extremeMargin }, { x: end.x, y: minY - extremeMargin }, end],
        // Go far below
        [start, { x: start.x, y: maxY + extremeMargin }, { x: end.x, y: maxY + extremeMargin }, end],
        // Go far left
        [start, { x: minX - extremeMargin, y: start.y }, { x: minX - extremeMargin, y: end.y }, end],
        // Go far right  
        [start, { x: maxX + extremeMargin, y: start.y }, { x: maxX + extremeMargin, y: end.y }, end]
    ];

    for (const path of extremePaths) {
        if (validatePath(path, obstacles, source.id, target.id)) {
            return { path, valid: true, method: 'astar' };
        }
    }

    // TRUE FAILURE - Cannot find any valid path
    console.error(`[SmartEdge] CRITICAL: No valid path possible for ${edgeId}`);
    return {
        path: [start, end],
        valid: false,
        method: 'failed'
    };
}

// =============================================================================
// SVG PATH GENERATION
// =============================================================================

const CORNER_RADIUS = 8;

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

    const { allCards, sourceCard, targetCard } = useMemo(() => {
        const cards: Card[] = nodes.map(node => ({
            id: node.id,
            x: node.position.x,
            y: node.position.y,
            width: node.measured?.width ?? 150,
            height: node.measured?.height ?? 80,
        }));

        return {
            allCards: cards,
            sourceCard: cards.find(c => c.id === source),
            targetCard: cards.find(c => c.id === target)
        };
    }, [nodes, source, target]);

    const { path, isValid, method } = useMemo(() => {
        if (!sourceCard || !targetCard) {
            return { path: '', isValid: false, method: 'failed' };
        }

        const result = findPath(sourceCard, targetCard, allCards, id);

        // FINAL VALIDATION - Even if findPath says valid, double-check
        const finalValid = result.valid && validatePath(result.path, allCards, source, target);

        if (!finalValid && result.valid) {
            console.error(`[SmartEdge] CRITICAL: findPath returned valid but final validation failed for ${id}`);
        }

        return {
            path: generateSvgPath(result.path),
            isValid: finalValid,
            method: result.method
        };
    }, [sourceCard, targetCard, allCards, id, source, target]);

    // INVALID = RED, ASTAR = ORANGE, VALID = NORMAL
    let edgeStyle = style;
    if (!isValid) {
        edgeStyle = {
            ...style,
            stroke: '#ff4444',
            strokeWidth: 3,
            strokeDasharray: '8,4',
        };
    } else if (method === 'astar') {
        edgeStyle = {
            ...style,
            stroke: '#ff9900',
            strokeWidth: 2,
        };
    }

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
