'use client';

// =============================================================================
// CUSTOM SMART EDGE - Complete rewrite with straight line priority
// Pipeline: STRAIGHT -> ORTHOGONAL -> A* -> FALLBACK
// =============================================================================

import { memo, useMemo } from 'react';
import { EdgeProps, useNodes } from '@xyflow/react';

interface Point {
    x: number;
    y: number;
}

interface CardBoundingBox {
    nodeId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    collisionBox: {
        left: number;
        right: number;
        top: number;
        bottom: number;
    };
}

// =============================================================================
// BOUNDING BOX - Using REAL measured dimensions
// =============================================================================

const COLLISION_PADDING = 20;
const ALIGNMENT_THRESHOLD = 40; // px tolerance for "aligned"

function getCardBoundingBox(node: { id: string; x: number; y: number; width: number; height: number }): CardBoundingBox {
    return {
        nodeId: node.id,
        x: node.x,
        y: node.y,
        width: node.width,
        height: node.height,
        collisionBox: {
            left: node.x - COLLISION_PADDING,
            right: node.x + node.width + COLLISION_PADDING,
            top: node.y - COLLISION_PADDING,
            bottom: node.y + node.height + COLLISION_PADDING,
        },
    };
}

// =============================================================================
// COLLISION DETECTION - Liang-Barsky algorithm
// =============================================================================

function doesLineIntersectBox(p1: Point, p2: Point, box: CardBoundingBox['collisionBox']): boolean {
    // Quick rejection
    if (p1.x < box.left && p2.x < box.left) return false;
    if (p1.x > box.right && p2.x > box.right) return false;
    if (p1.y < box.top && p2.y < box.top) return false;
    if (p1.y > box.bottom && p2.y > box.bottom) return false;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    let tMin = 0;
    let tMax = 1;

    const edges = [
        { p: -dx, q: p1.x - box.left },
        { p: dx, q: box.right - p1.x },
        { p: -dy, q: p1.y - box.top },
        { p: dy, q: box.bottom - p1.y },
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

interface CollisionResult {
    hasCollision: boolean;
    collidingNodes: string[];
}

function checkPathCollision(
    path: Point[],
    obstacles: CardBoundingBox[],
    sourceId: string,
    targetId: string
): CollisionResult {
    const collidingNodes: string[] = [];

    for (let i = 0; i < path.length - 1; i++) {
        for (const box of obstacles) {
            if (box.nodeId === sourceId || box.nodeId === targetId) continue;
            if (doesLineIntersectBox(path[i], path[i + 1], box.collisionBox)) {
                if (!collidingNodes.includes(box.nodeId)) {
                    collidingNodes.push(box.nodeId);
                    console.log(`[COLLISION] ❌ Segment ${i} HITS ${box.nodeId}`);
                }
            }
        }
    }

    const hasCollision = collidingNodes.length > 0;
    console.log(`[COLLISION] Result: ${hasCollision ? `HIT ${collidingNodes.join(', ')}` : 'CLEAR'}`);
    return { hasCollision, collidingNodes };
}

// =============================================================================
// ANCHOR POINTS
// =============================================================================

type Anchor = 'top' | 'bottom' | 'left' | 'right';

function getAnchor(card: { x: number; y: number; width: number; height: number }, pos: Anchor): Point {
    switch (pos) {
        case 'top': return { x: card.x + card.width / 2, y: card.y };
        case 'bottom': return { x: card.x + card.width / 2, y: card.y + card.height };
        case 'left': return { x: card.x, y: card.y + card.height / 2 };
        case 'right': return { x: card.x + card.width, y: card.y + card.height / 2 };
    }
}

// =============================================================================
// STRAIGHT LINE HEURISTIC - Priority #1
// =============================================================================

function tryGenerateStraightLine(
    source: { id: string; x: number; y: number; width: number; height: number },
    target: { id: string; x: number; y: number; width: number; height: number },
    obstacles: CardBoundingBox[]
): Point[] | null {
    const sourceCenterX = source.x + source.width / 2;
    const sourceCenterY = source.y + source.height / 2;
    const targetCenterX = target.x + target.width / 2;
    const targetCenterY = target.y + target.height / 2;

    const dx = Math.abs(sourceCenterX - targetCenterX);
    const dy = Math.abs(sourceCenterY - targetCenterY);

    console.log(`[STRAIGHT] Checking alignment: dx=${dx.toFixed(0)} dy=${dy.toFixed(0)} threshold=${ALIGNMENT_THRESHOLD}`);

    let path: Point[] | null = null;

    // Vertically aligned (dx small, dy large)
    if (dx <= ALIGNMENT_THRESHOLD && dy > 0) {
        console.log(`[STRAIGHT] Vertically aligned`);
        if (sourceCenterY < targetCenterY) {
            // Source above target: bottom -> top
            path = [getAnchor(source, 'bottom'), getAnchor(target, 'top')];
        } else {
            // Source below target: top -> bottom
            path = [getAnchor(source, 'top'), getAnchor(target, 'bottom')];
        }
    }
    // Horizontally aligned (dy small, dx large)
    else if (dy <= ALIGNMENT_THRESHOLD && dx > 0) {
        console.log(`[STRAIGHT] Horizontally aligned`);
        if (sourceCenterX < targetCenterX) {
            // Source left of target: right -> left
            path = [getAnchor(source, 'right'), getAnchor(target, 'left')];
        } else {
            // Source right of target: left -> right
            path = [getAnchor(source, 'left'), getAnchor(target, 'right')];
        }
    }

    if (!path) {
        console.log(`[STRAIGHT] Not aligned, skipping straight line`);
        return null;
    }

    // Validate: straight line must not collide
    const collision = checkPathCollision(path, obstacles, source.id, target.id);
    if (collision.hasCollision) {
        console.log(`[STRAIGHT] ❌ Rejected - would collide with: ${collision.collidingNodes.join(', ')}`);
        return null;
    }

    console.log(`[STRAIGHT] ✅ Using straight line`);
    return path;
}

// =============================================================================
// ORTHOGONAL PATH - Priority #2
// =============================================================================

function generateOrthogonalPath(
    source: { id: string; x: number; y: number; width: number; height: number },
    target: { id: string; x: number; y: number; width: number; height: number }
): Point[] {
    const sourceCenterX = source.x + source.width / 2;
    const sourceCenterY = source.y + source.height / 2;
    const targetCenterX = target.x + target.width / 2;
    const targetCenterY = target.y + target.height / 2;

    const dx = targetCenterX - sourceCenterX;
    const dy = targetCenterY - sourceCenterY;

    let srcAnchor: Anchor;
    let tgtAnchor: Anchor;

    if (Math.abs(dy) > Math.abs(dx)) {
        if (dy > 0) {
            srcAnchor = 'bottom';
            tgtAnchor = 'top';
        } else {
            srcAnchor = 'top';
            tgtAnchor = 'bottom';
        }
    } else {
        if (dx > 0) {
            srcAnchor = 'right';
            tgtAnchor = 'left';
        } else {
            srcAnchor = 'left';
            tgtAnchor = 'right';
        }
    }

    const start = getAnchor(source, srcAnchor);
    const end = getAnchor(target, tgtAnchor);
    const midY = (start.y + end.y) / 2;
    const midX = (start.x + end.x) / 2;

    const isVerticalStart = srcAnchor === 'top' || srcAnchor === 'bottom';
    const isVerticalEnd = tgtAnchor === 'top' || tgtAnchor === 'bottom';

    if (isVerticalStart && isVerticalEnd) {
        return [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end];
    } else if (!isVerticalStart && !isVerticalEnd) {
        return [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
    } else if (isVerticalStart) {
        return [start, { x: start.x, y: end.y }, end];
    } else {
        return [start, { x: end.x, y: start.y }, end];
    }
}

// =============================================================================
// DETOUR PATHS - Priority #3
// =============================================================================

function generateDetourPaths(
    source: { x: number; y: number; width: number; height: number },
    target: { x: number; y: number; width: number; height: number },
    obstacles: CardBoundingBox[]
): Point[][] {
    const paths: Point[][] = [];

    // Calculate bounds of all cards
    let minX = Math.min(source.x, target.x);
    let maxX = Math.max(source.x + source.width, target.x + target.width);
    let minY = Math.min(source.y, target.y);
    let maxY = Math.max(source.y + source.height, target.y + target.height);

    for (const obs of obstacles) {
        minX = Math.min(minX, obs.x);
        maxX = Math.max(maxX, obs.x + obs.width);
        minY = Math.min(minY, obs.y);
        maxY = Math.max(maxY, obs.y + obs.height);
    }

    const margins = [50, 80, 120];
    const srcCenter = { x: source.x + source.width / 2, y: source.y + source.height / 2 };
    const tgtCenter = { x: target.x + target.width / 2, y: target.y + target.height / 2 };

    for (const margin of margins) {
        // Go above everything
        const topY = minY - margin;
        paths.push([
            { x: srcCenter.x, y: source.y },
            { x: srcCenter.x, y: topY },
            { x: tgtCenter.x, y: topY },
            { x: tgtCenter.x, y: target.y }
        ]);

        // Go below everything
        const bottomY = maxY + margin;
        paths.push([
            { x: srcCenter.x, y: source.y + source.height },
            { x: srcCenter.x, y: bottomY },
            { x: tgtCenter.x, y: bottomY },
            { x: tgtCenter.x, y: target.y + target.height }
        ]);

        // Go left of everything
        const leftX = minX - margin;
        paths.push([
            { x: source.x, y: srcCenter.y },
            { x: leftX, y: srcCenter.y },
            { x: leftX, y: tgtCenter.y },
            { x: target.x, y: tgtCenter.y }
        ]);

        // Go right of everything
        const rightX = maxX + margin;
        paths.push([
            { x: source.x + source.width, y: srcCenter.y },
            { x: rightX, y: srcCenter.y },
            { x: rightX, y: tgtCenter.y },
            { x: target.x + target.width, y: tgtCenter.y }
        ]);
    }

    return paths;
}

// =============================================================================
// MAIN ROUTING PIPELINE
// =============================================================================

interface RoutingResult {
    path: Point[];
    pathType: 'straight' | 'orthogonal' | 'detour' | 'fallback';
    hasCollision: boolean;
}

function routeEdge(
    source: { id: string; x: number; y: number; width: number; height: number },
    target: { id: string; x: number; y: number; width: number; height: number },
    allCards: { id: string; x: number; y: number; width: number; height: number }[]
): RoutingResult {
    console.log(`\n[ROUTING] ========== ${source.id} -> ${target.id} ==========`);

    // Build obstacle list
    const obstacles = allCards
        .filter(c => c.id !== source.id && c.id !== target.id)
        .map(getCardBoundingBox);

    console.log(`[ROUTING] Obstacles: ${obstacles.map(o => o.nodeId).join(', ') || 'none'}`);

    // STEP 1: Try straight line (HIGHEST PRIORITY)
    const straightPath = tryGenerateStraightLine(source, target, obstacles);
    if (straightPath) {
        return { path: straightPath, pathType: 'straight', hasCollision: false };
    }

    // STEP 2: Try basic orthogonal path
    const orthoPath = generateOrthogonalPath(source, target);
    const orthoCollision = checkPathCollision(orthoPath, obstacles, source.id, target.id);

    if (!orthoCollision.hasCollision) {
        console.log(`[ROUTING] ✅ Using orthogonal path`);
        return { path: orthoPath, pathType: 'orthogonal', hasCollision: false };
    }

    console.log(`[ROUTING] Orthogonal path has collision, trying detours...`);

    // STEP 3: Try detour paths
    const detourPaths = generateDetourPaths(source, target, obstacles);
    for (let i = 0; i < detourPaths.length; i++) {
        const path = detourPaths[i];
        const collision = checkPathCollision(path, obstacles, source.id, target.id);
        if (!collision.hasCollision) {
            console.log(`[ROUTING] ✅ Using detour path #${i}`);
            return { path, pathType: 'detour', hasCollision: false };
        }
    }

    // STEP 4: FALLBACK - No valid path found, use orthogonal but mark as invalid
    console.error(`[ROUTING] ❌ CRITICAL: No collision-free path found!`);
    return { path: orthoPath, pathType: 'fallback', hasCollision: true };
}

// =============================================================================
// SVG PATH GENERATION
// =============================================================================

const CORNER_RADIUS = 8;

function pathToSvg(path: Point[], isStraight: boolean): string {
    if (path.length < 2) return '';

    if (isStraight || path.length === 2) {
        return `M ${path[0].x} ${path[0].y} L ${path[1].x} ${path[1].y}`;
    }

    // Orthogonal with smooth corners
    const parts: string[] = [`M ${path[0].x} ${path[0].y}`];

    for (let i = 1; i < path.length; i++) {
        const prev = path[i - 1];
        const curr = path[i];
        const next = path[i + 1];

        if (!next) {
            parts.push(`L ${curr.x} ${curr.y}`);
            break;
        }

        const dx1 = curr.x - prev.x;
        const dy1 = curr.y - prev.y;
        const dx2 = next.x - curr.x;
        const dy2 = next.y - curr.y;

        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (len1 < 1 || len2 < 1) {
            parts.push(`L ${curr.x} ${curr.y}`);
            continue;
        }

        const r = Math.min(CORNER_RADIUS, len1 / 2, len2 / 2);

        const beforeX = curr.x - (dx1 / len1) * r;
        const beforeY = curr.y - (dy1 / len1) * r;
        const afterX = curr.x + (dx2 / len2) * r;
        const afterY = curr.y + (dy2 / len2) * r;

        parts.push(`L ${beforeX} ${beforeY}`);
        parts.push(`Q ${curr.x} ${curr.y} ${afterX} ${afterY}`);
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

    // Build card list from nodes
    const allCards = useMemo(() => {
        return nodes.map(node => {
            // Correct fallback dimensions based on node type
            let fallbackWidth = 80;
            let fallbackHeight = 80;

            if (node.type === 'stickyNote') {
                fallbackWidth = 128;  // w-32 = 128px
                fallbackHeight = 128; // h-32 = 128px
            } else if (node.type === 'shape') {
                // ShapeNode: 80x80 default, cloud is 120x80
                const shape = (node.data as { shape?: string })?.shape;
                if (shape === 'cloud') {
                    fallbackWidth = 120;
                    fallbackHeight = 80;
                }
            }

            return {
                id: node.id,
                x: node.position.x,
                y: node.position.y,
                width: node.measured?.width ?? fallbackWidth,
                height: node.measured?.height ?? fallbackHeight,
            };
        });
    }, [nodes]);

    const sourceCard = allCards.find(c => c.id === source);
    const targetCard = allCards.find(c => c.id === target);

    const result = useMemo(() => {
        if (!sourceCard || !targetCard) {
            console.error(`[EDGE] Missing card: source=${source} target=${target}`);
            return { path: '', pathType: 'fallback' as const, hasCollision: true };
        }

        const routing = routeEdge(sourceCard, targetCard, allCards);
        const svgPath = pathToSvg(routing.path, routing.pathType === 'straight');

        console.log(`[EDGE] ${id}: type=${routing.pathType} collision=${routing.hasCollision}`);

        return { ...routing, path: svgPath };
    }, [sourceCard, targetCard, allCards, source, target, id]);

    // Visual styling based on path type
    let edgeStyle = style;
    if (result.hasCollision) {
        // RED DASHED for invalid paths
        edgeStyle = { ...style, stroke: '#ff4444', strokeWidth: 3, strokeDasharray: '8,4' };
    } else if (result.pathType === 'straight') {
        // GREEN for straight lines
        edgeStyle = { ...style, stroke: '#44aa44' };
    } else if (result.pathType === 'detour') {
        // ORANGE for detour paths
        edgeStyle = { ...style, stroke: '#ff9900' };
    }

    return (
        <path
            id={id}
            d={result.path}
            style={edgeStyle}
            fill="none"
            className="react-flow__edge-path"
            markerEnd={markerEnd as string}
            markerStart={markerStart as string}
        />
    );
}

export default memo(CustomSmartEdge);
