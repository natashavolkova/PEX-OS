'use client';

// =============================================================================
// CUSTOM SMART EDGE - Complete rewrite with collision detection & smooth corners
// DO NOT USE getSmoothStepPath - always generate our own paths
// =============================================================================

import { memo, useMemo } from 'react';
import { BaseEdge, EdgeProps, Position, useNodes } from '@xyflow/react';
import type { Node } from '@xyflow/react';

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

interface SmartEdgeData {
    waypoints?: Point[];
    label?: string;
    [key: string]: unknown;
}

// =============================================================================
// COLLISION DETECTION - Liang-Barsky line-rectangle intersection
// =============================================================================

function lineIntersectsRect(
    p1: Point,
    p2: Point,
    rect: { x: number; y: number; width: number; height: number }
): boolean {
    const padding = 8; // Extra padding to avoid lines "grazing" edges
    const left = rect.x - padding;
    const right = rect.x + rect.width + padding;
    const top = rect.y - padding;
    const bottom = rect.y + rect.height + padding;

    // Cohen-Sutherland outcode
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

    // Both outside same side - no intersection
    if (code1 & code2) return false;

    // Both inside - intersection
    if (!code1 && !code2) return true;

    // Need detailed intersection check using parametric form
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    let t0 = 0, t1 = 1;

    const clip = (p: number, q: number): boolean => {
        if (p === 0) return q >= 0;
        const t = q / p;
        if (p < 0) {
            if (t > t1) return false;
            if (t > t0) t0 = t;
        } else {
            if (t < t0) return false;
            if (t < t1) t1 = t;
        }
        return true;
    };

    return clip(-dx, p1.x - left) &&
        clip(dx, right - p1.x) &&
        clip(-dy, p1.y - top) &&
        clip(dy, bottom - p1.y);
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
                return false;
            }
        }
    }
    return true;
}

// =============================================================================
// ANCHOR POINT CALCULATION - Based on relative position
// =============================================================================

type Anchor = 'top' | 'right' | 'bottom' | 'left';

function getAnchorPoint(node: Card, anchor: Anchor): Point {
    switch (anchor) {
        case 'top': return { x: node.x + node.width / 2, y: node.y };
        case 'bottom': return { x: node.x + node.width / 2, y: node.y + node.height };
        case 'left': return { x: node.x, y: node.y + node.height / 2 };
        case 'right': return { x: node.x + node.width, y: node.y + node.height / 2 };
    }
}

function selectOptimalAnchors(
    source: Card,
    target: Card
): { sourceAnchor: Anchor; targetAnchor: Anchor } {
    const sourceCenterX = source.x + source.width / 2;
    const sourceCenterY = source.y + source.height / 2;
    const targetCenterX = target.x + target.width / 2;
    const targetCenterY = target.y + target.height / 2;

    const dx = targetCenterX - sourceCenterX;
    const dy = targetCenterY - sourceCenterY;

    // Vertical movement dominant
    if (Math.abs(dy) > Math.abs(dx)) {
        if (dy > 0) {
            return { sourceAnchor: 'bottom', targetAnchor: 'top' };
        } else {
            return { sourceAnchor: 'top', targetAnchor: 'bottom' };
        }
    }
    // Horizontal movement dominant
    if (dx > 0) {
        return { sourceAnchor: 'right', targetAnchor: 'left' };
    } else {
        return { sourceAnchor: 'left', targetAnchor: 'right' };
    }
}

// =============================================================================
// ORTHOGONAL PATH GENERATION - Pure H/V segments
// =============================================================================

function generateOrthogonalPath(
    source: Card,
    target: Card,
    sourceAnchor: Anchor,
    targetAnchor: Anchor
): Point[] {
    const start = getAnchorPoint(source, sourceAnchor);
    const end = getAnchorPoint(target, targetAnchor);

    const offset = 30; // Distance to extend before turning

    // Generate path based on anchor combination
    const isSourceVertical = sourceAnchor === 'top' || sourceAnchor === 'bottom';
    const isTargetVertical = targetAnchor === 'top' || targetAnchor === 'bottom';

    if (isSourceVertical && isTargetVertical) {
        // Both vertical - need horizontal segment in middle
        const midY = (start.y + end.y) / 2;
        return [
            start,
            { x: start.x, y: midY },
            { x: end.x, y: midY },
            end
        ];
    }

    if (!isSourceVertical && !isTargetVertical) {
        // Both horizontal - need vertical segment in middle
        const midX = (start.x + end.x) / 2;
        return [
            start,
            { x: midX, y: start.y },
            { x: midX, y: end.y },
            end
        ];
    }

    // Mixed - L-shaped path
    if (isSourceVertical) {
        // Vertical out, horizontal in
        return [
            start,
            { x: start.x, y: end.y },
            end
        ];
    } else {
        // Horizontal out, vertical in
        return [
            start,
            { x: end.x, y: start.y },
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
    const anchors = selectOptimalAnchors(source, target);
    const start = getAnchorPoint(source, anchors.sourceAnchor);
    const end = getAnchorPoint(target, anchors.targetAnchor);

    switch (direction) {
        case 'right': {
            const detourX = Math.max(source.x + source.width, target.x + target.width) + margin;
            return [start, { x: detourX, y: start.y }, { x: detourX, y: end.y }, end];
        }
        case 'left': {
            const detourX = Math.min(source.x, target.x) - margin;
            return [start, { x: detourX, y: start.y }, { x: detourX, y: end.y }, end];
        }
        case 'down': {
            const detourY = Math.max(source.y + source.height, target.y + target.height) + margin;
            return [start, { x: start.x, y: detourY }, { x: end.x, y: detourY }, end];
        }
        case 'up': {
            const detourY = Math.min(source.y, target.y) - margin;
            return [start, { x: start.x, y: detourY }, { x: end.x, y: detourY }, end];
        }
    }
}

// =============================================================================
// PATH SCORING - Lower is better
// =============================================================================

interface PathScore {
    distance: number;
    turns: number;
    hierarchyPenalty: number;
    total: number;
}

function scorePath(path: Point[], source: Card, target: Card): PathScore {
    let distance = 0;
    let turns = 0;
    let hierarchyPenalty = 0;

    // Calculate total distance
    for (let i = 0; i < path.length - 1; i++) {
        const dx = path[i + 1].x - path[i].x;
        const dy = path[i + 1].y - path[i].y;
        distance += Math.abs(dx) + Math.abs(dy); // Manhattan distance
    }

    // Count direction changes
    for (let i = 1; i < path.length - 1; i++) {
        const prevDx = path[i].x - path[i - 1].x;
        const prevDy = path[i].y - path[i - 1].y;
        const nextDx = path[i + 1].x - path[i].x;
        const nextDy = path[i + 1].y - path[i].y;

        const prevHoriz = Math.abs(prevDx) > Math.abs(prevDy);
        const nextHoriz = Math.abs(nextDx) > Math.abs(nextDy);

        if (prevHoriz !== nextHoriz) turns++;
    }

    // Hierarchy penalty: penalize going UP when target is below
    const isTargetBelow = target.y > source.y + 50;
    if (isTargetBelow) {
        for (let i = 0; i < path.length - 1; i++) {
            if (path[i + 1].y < path[i].y - 5) {
                hierarchyPenalty += 150;
            }
        }
    }

    const total = distance + (turns * 30) + hierarchyPenalty;
    return { distance, turns, hierarchyPenalty, total };
}

// =============================================================================
// MAIN PATH FINDER - Generates multiple candidates and picks best valid one
// =============================================================================

function findOptimalPath(
    source: Card,
    target: Card,
    allCards: Card[]
): Point[] {
    const candidates: Array<{ path: Point[]; score: PathScore }> = [];
    const anchors: Anchor[] = ['top', 'right', 'bottom', 'left'];

    // Test all 16 anchor combinations
    for (const sourceAnchor of anchors) {
        for (const targetAnchor of anchors) {
            const path = generateOrthogonalPath(source, target, sourceAnchor, targetAnchor);
            if (validatePath(path, allCards, source.id, target.id)) {
                candidates.push({ path, score: scorePath(path, source, target) });
            }
        }
    }

    // If no valid direct paths, try detours
    if (candidates.length === 0) {
        const directions: Array<'left' | 'right' | 'up' | 'down'> = ['left', 'right', 'up', 'down'];
        for (const dir of directions) {
            for (const margin of [60, 100, 150]) {
                const path = generateDetourPath(source, target, dir, margin);
                if (validatePath(path, allCards, source.id, target.id)) {
                    candidates.push({ path, score: scorePath(path, source, target) });
                }
            }
        }
    }

    // Sort by score and return best
    if (candidates.length > 0) {
        candidates.sort((a, b) => a.score.total - b.score.total);
        return candidates[0].path;
    }

    // Fallback: simple L-path (will be drawn even if it collides)
    console.warn('[SmartEdge] No collision-free path found, using fallback');
    const optimal = selectOptimalAnchors(source, target);
    return generateOrthogonalPath(source, target, optimal.sourceAnchor, optimal.targetAnchor);
}

// =============================================================================
// SVG PATH GENERATION - Smooth corners with quadratic bezier
// =============================================================================

const CORNER_RADIUS = 10;

function generateSmoothPath(waypoints: Point[]): string {
    if (waypoints.length < 2) return '';

    const parts: string[] = [`M ${waypoints[0].x} ${waypoints[0].y}`];

    for (let i = 1; i < waypoints.length; i++) {
        const prev = waypoints[i - 1];
        const curr = waypoints[i];
        const next = waypoints[i + 1];

        if (!next) {
            // Last point - straight line
            parts.push(`L ${curr.x} ${curr.y}`);
            break;
        }

        // Check for direction change (corner)
        const dir1 = { x: curr.x - prev.x, y: curr.y - prev.y };
        const dir2 = { x: next.x - curr.x, y: next.y - curr.y };

        const len1 = Math.sqrt(dir1.x ** 2 + dir1.y ** 2);
        const len2 = Math.sqrt(dir2.x ** 2 + dir2.y ** 2);

        if (len1 < 1 || len2 < 1) {
            parts.push(`L ${curr.x} ${curr.y}`);
            continue;
        }

        // Normalize directions
        const n1 = { x: dir1.x / len1, y: dir1.y / len1 };
        const n2 = { x: dir2.x / len2, y: dir2.y / len2 };

        // Check if it's actually a corner (not collinear)
        const dot = n1.x * n2.x + n1.y * n2.y;
        const isCorner = Math.abs(dot) < 0.95;

        if (isCorner) {
            const r = Math.min(CORNER_RADIUS, len1 / 2, len2 / 2);

            if (r > 2) {
                const startCurve = {
                    x: curr.x - n1.x * r,
                    y: curr.y - n1.y * r
                };
                const endCurve = {
                    x: curr.x + n2.x * r,
                    y: curr.y + n2.y * r
                };

                parts.push(`L ${startCurve.x} ${startCurve.y}`);
                parts.push(`Q ${curr.x} ${curr.y} ${endCurve.x} ${endCurve.y}`);
            } else {
                parts.push(`L ${curr.x} ${curr.y}`);
            }
        } else {
            parts.push(`L ${curr.x} ${curr.y}`);
        }
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
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
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
    const path = useMemo(() => {
        if (!sourceCard || !targetCard) {
            // Fallback to simple line if cards not found
            return `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
        }

        const waypoints = findOptimalPath(sourceCard, targetCard, allCards);
        return generateSmoothPath(waypoints);
    }, [sourceCard, targetCard, allCards, sourceX, sourceY, targetX, targetY]);

    return (
        <BaseEdge
            id={id}
            path={path}
            style={style}
            markerEnd={markerEnd}
            markerStart={markerStart}
        />
    );
}

export default memo(CustomSmartEdge);
