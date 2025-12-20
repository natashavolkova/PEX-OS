// =============================================================================
// EDGE PATHFINDING - Intelligent Routing Around Cards
// ATHENA Architecture | Performance: < 50ms per edge
// =============================================================================

import type { Node, XYPosition } from '@xyflow/react';

// =============================================================================
// TYPES
// =============================================================================
interface BoundingBox {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

interface PathSegment {
    start: XYPosition;
    end: XYPosition;
}

// =============================================================================
// GEOMETRY HELPERS
// =============================================================================

/**
 * Calculate center position of a node
 */
export function getNodeCenter(node: Node): XYPosition {
    const width = node.measured?.width ?? node.width ?? 150;
    const height = node.measured?.height ?? node.height ?? 50;
    return {
        x: node.position.x + width / 2,
        y: node.position.y + height / 2,
    };
}

/**
 * Get bounding box of a node with optional padding
 */
export function getNodeBounds(node: Node, padding: number = 20): BoundingBox {
    const width = node.measured?.width ?? node.width ?? 150;
    const height = node.measured?.height ?? node.height ?? 50;
    return {
        left: node.position.x - padding,
        right: node.position.x + width + padding,
        top: node.position.y - padding,
        bottom: node.position.y + height + padding,
    };
}

/**
 * Check if a point is inside a bounding box
 */
function pointInBounds(point: XYPosition, bounds: BoundingBox): boolean {
    return (
        point.x >= bounds.left &&
        point.x <= bounds.right &&
        point.y >= bounds.top &&
        point.y <= bounds.bottom
    );
}

/**
 * Check if a line segment intersects a bounding box
 * Handles all cases: line crosses edges, OR line passes through box
 */
function lineIntersectsBounds(
    start: XYPosition,
    end: XYPosition,
    bounds: BoundingBox
): boolean {
    // Quick check: if both points are on same side of box, no intersection
    if (start.x < bounds.left && end.x < bounds.left) return false;
    if (start.x > bounds.right && end.x > bounds.right) return false;
    if (start.y < bounds.top && end.y < bounds.top) return false;
    if (start.y > bounds.bottom && end.y > bounds.bottom) return false;

    // Check if either endpoint is INSIDE the box
    if (pointInBounds(start, bounds) || pointInBounds(end, bounds)) {
        return true;
    }

    // Check intersection with each edge of the box
    const edges = [
        { x1: bounds.left, y1: bounds.top, x2: bounds.right, y2: bounds.top },      // top
        { x1: bounds.left, y1: bounds.bottom, x2: bounds.right, y2: bounds.bottom }, // bottom
        { x1: bounds.left, y1: bounds.top, x2: bounds.left, y2: bounds.bottom },     // left
        { x1: bounds.right, y1: bounds.top, x2: bounds.right, y2: bounds.bottom },   // right
    ];

    for (const edge of edges) {
        if (lineSegmentsIntersect(
            start.x, start.y, end.x, end.y,
            edge.x1, edge.y1, edge.x2, edge.y2
        )) {
            return true;
        }
    }

    return false;
}

/**
 * Check if two line segments intersect
 */
function lineSegmentsIntersect(
    x1: number, y1: number, x2: number, y2: number,
    x3: number, y3: number, x4: number, y4: number
): boolean {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
    if (Math.abs(denom) < 0.0001) return false; // Parallel lines

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

    return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

/**
 * Calculate distance between two points
 */
function distance(a: XYPosition, b: XYPosition): number {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

/**
 * Calculate total path length
 */
function pathLength(points: XYPosition[]): number {
    let total = 0;
    for (let i = 1; i < points.length; i++) {
        total += distance(points[i - 1], points[i]);
    }
    return total;
}

// =============================================================================
// ALIGNMENT DETECTION - Using 50px threshold as specified
// =============================================================================

const ALIGNMENT_THRESHOLD = 50; // pixels

/**
 * Check if cards are vertically aligned (same column)
 * |deltaX| < 50px means they are in the same column
 */
export function isVerticallyAligned(source: XYPosition, target: XYPosition): boolean {
    const dx = Math.abs(target.x - source.x);
    return dx < ALIGNMENT_THRESHOLD;
}

/**
 * Check if cards are horizontally aligned (same row)
 * |deltaY| < 50px means they are in the same row
 */
export function isHorizontallyAligned(source: XYPosition, target: XYPosition): boolean {
    const dy = Math.abs(target.y - source.y);
    return dy < ALIGNMENT_THRESHOLD;
}

/**
 * Check if connection between two points is diagonal
 * Diagonal = NOT vertically aligned AND NOT horizontally aligned
 */
export function isDiagonalConnection(source: XYPosition, target: XYPosition): boolean {
    return !isVerticallyAligned(source, target) && !isHorizontallyAligned(source, target);
}

/**
 * Check if cards are aligned (either vertically OR horizontally)
 * Aligned connections should use STRAIGHT lines
 */
export function isAlignedConnection(source: XYPosition, target: XYPosition): boolean {
    return isVerticallyAligned(source, target) || isHorizontallyAligned(source, target);
}

/**
 * Get the OPTIMAL edge type based on connection geometry
 * This is used for auto-selection when creating new connections
 * 
 * Rules:
 * - Vertically aligned (same column): STRAIGHT
 * - Horizontally aligned (same row): STRAIGHT
 * - Diagonal: SMOOTHSTEP (never straight!)
 */
export function getOptimalEdgeType(source: XYPosition, target: XYPosition): 'smoothstep' | 'straight' {
    if (isAlignedConnection(source, target)) {
        return 'straight'; // Clean straight line for aligned cards
    }
    return 'smoothstep'; // Angular routing for diagonals
}

/**
 * Get suggested edge type based on connection geometry
 * @deprecated Use getOptimalEdgeType instead
 */
export function getSuggestedEdgeType(
    source: XYPosition,
    target: XYPosition
): 'smoothstep' | 'straight' {
    return getOptimalEdgeType(source, target);
}

/**
 * Check if straight line is appropriate for this connection
 */
export function isStraightLineAppropriate(source: XYPosition, target: XYPosition): boolean {
    return isAlignedConnection(source, target);
}

// =============================================================================
// COLLISION DETECTION
// =============================================================================

/**
 * Find all nodes that a direct line would collide with
 * Excludes source and target nodes
 */
export function findCollisions(
    sourcePos: XYPosition,
    targetPos: XYPosition,
    nodes: Node[],
    excludeIds: string[]
): Node[] {
    return nodes.filter(node => {
        if (excludeIds.includes(node.id)) return false;
        const bounds = getNodeBounds(node, 15); // 15px padding
        return lineIntersectsBounds(sourcePos, targetPos, bounds);
    });
}

/**
 * Check if a path has any collisions with nodes
 */
export function pathHasCollision(
    path: XYPosition[],
    nodes: Node[],
    excludeIds: string[]
): boolean {
    for (let i = 1; i < path.length; i++) {
        const collisions = findCollisions(path[i - 1], path[i], nodes, excludeIds);
        if (collisions.length > 0) return true;
    }
    return false;
}

// =============================================================================
// PATHFINDING - Route around obstacles
// =============================================================================

type Direction = 'top' | 'bottom' | 'left' | 'right';

/**
 * Calculate a route that goes around an obstacle in a given direction
 */
function routeAroundObstacle(
    source: XYPosition,
    target: XYPosition,
    obstacle: Node,
    direction: Direction
): XYPosition[] {
    const bounds = getNodeBounds(obstacle, 25); // 25px clearance
    const waypoints: XYPosition[] = [source];

    switch (direction) {
        case 'top':
            // Go over the obstacle
            waypoints.push({ x: source.x, y: bounds.top });
            waypoints.push({ x: target.x, y: bounds.top });
            break;
        case 'bottom':
            // Go under the obstacle
            waypoints.push({ x: source.x, y: bounds.bottom });
            waypoints.push({ x: target.x, y: bounds.bottom });
            break;
        case 'left':
            // Go left of the obstacle
            waypoints.push({ x: bounds.left, y: source.y });
            waypoints.push({ x: bounds.left, y: target.y });
            break;
        case 'right':
            // Go right of the obstacle
            waypoints.push({ x: bounds.right, y: source.y });
            waypoints.push({ x: bounds.right, y: target.y });
            break;
    }

    waypoints.push(target);
    return waypoints;
}

/**
 * Calculate optimal path between two points, routing around obstacles
 * Returns array of waypoints for the edge to follow
 */
export function calculatePath(
    sourceNode: Node,
    targetNode: Node,
    allNodes: Node[]
): XYPosition[] {
    const source = getNodeCenter(sourceNode);
    const target = getNodeCenter(targetNode);
    const excludeIds = [sourceNode.id, targetNode.id];

    // 1. Check if direct path is clear
    const collisions = findCollisions(source, target, allNodes, excludeIds);

    if (collisions.length === 0) {
        // Direct path is clear
        return [source, target];
    }

    // 2. Find the first obstacle and route around it
    // For simplicity, handle one obstacle at a time
    const obstacle = collisions[0];

    // 3. Calculate all 4 possible routes
    const routes: { path: XYPosition[]; length: number; collision: boolean }[] = [];

    for (const direction of ['top', 'bottom', 'left', 'right'] as Direction[]) {
        const path = routeAroundObstacle(source, target, obstacle, direction);
        routes.push({
            path,
            length: pathLength(path),
            collision: pathHasCollision(path, allNodes, excludeIds),
        });
    }

    // 4. Filter out routes with collisions and pick shortest
    const validRoutes = routes.filter(r => !r.collision);

    if (validRoutes.length === 0) {
        // All routes have collisions - return direct path as fallback
        // This can happen with complex layouts
        console.warn('[Pathfinding] No collision-free route found, using direct path');
        return [source, target];
    }

    // Sort by length and return shortest
    validRoutes.sort((a, b) => a.length - b.length);
    return validRoutes[0].path;
}

// =============================================================================
// EDGE HANDLE SELECTION - Smart handle positioning
// =============================================================================

type HandlePosition = 't' | 'b' | 'l' | 'r';

/**
 * Get optimal handle positions for source and target nodes
 * Returns [sourceHandle, targetHandle]
 */
export function getOptimalHandles(
    sourceNode: Node,
    targetNode: Node
): [HandlePosition, HandlePosition] {
    const sourceCenter = getNodeCenter(sourceNode);
    const targetCenter = getNodeCenter(targetNode);

    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;

    // Determine primary direction
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal dominant
        if (dx > 0) {
            return ['r', 'l']; // Source right → Target left
        } else {
            return ['l', 'r']; // Source left → Target right
        }
    } else {
        // Vertical dominant
        if (dy > 0) {
            return ['b', 't']; // Source bottom → Target top
        } else {
            return ['t', 'b']; // Source top → Target bottom
        }
    }
}

// =============================================================================
// EDGE TYPE RECOMMENDATION
// =============================================================================

export interface EdgeRecommendation {
    type: 'bezier' | 'smoothstep' | 'straight';
    reason: string;
    blocked: boolean;
    tooltip?: string;
}

/**
 * Get edge type recommendation based on connection geometry
 */
export function getEdgeRecommendation(
    sourceNode: Node,
    targetNode: Node,
    requestedType: 'bezier' | 'smoothstep' | 'straight'
): EdgeRecommendation {
    const sourceCenter = getNodeCenter(sourceNode);
    const targetCenter = getNodeCenter(targetNode);
    const isDiagonal = isDiagonalConnection(sourceCenter, targetCenter);

    // If user requested straight line on diagonal connection
    if (requestedType === 'straight' && isDiagonal) {
        return {
            type: 'smoothstep', // Force to smoothstep
            reason: 'diagonal',
            blocked: true,
            tooltip: 'Linhas retas não funcionam em diagonais. Usando linha angular.',
        };
    }

    // All other cases are allowed
    return {
        type: requestedType,
        reason: 'allowed',
        blocked: false,
    };
}

// =============================================================================
// MANDATORY EDGE NORMALIZATION - Runs BEFORE rendering!
// =============================================================================

const ALIGNMENT_THRESHOLD_NORM = 30; // pixels (reduced from 80 for precision)

export interface NormalizedEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    type: 'straight' | 'smoothstep' | 'step' | 'smart';
    markerEnd?: unknown;
    markerStart?: unknown;
    style?: Record<string, unknown>;
    animated?: boolean;
    label?: string;
    // Data for custom edges (e.g., waypoints for smart routing)
    data?: {
        waypoints?: Array<{ x: number; y: number }>;
        [key: string]: unknown;
    };
    // Flag indicating normalization was applied
    _normalized?: boolean;
    _normalizationReason?: string;
}

/**
 * HANDLE-ONLY NORMALIZATION - Adjusts handles based on node positions
 * This function runs for EVERY edge BEFORE rendering!
 * 
 * CRITICAL: This function does NOT change the edge TYPE!
 * The user's selection (straight/smoothstep/bezier) is ALWAYS respected.
 * We ONLY adjust handles for optimal routing.
 */
export function normalizeEdge(
    edge: NormalizedEdge,
    sourceNode: Node | undefined,
    targetNode: Node | undefined
): NormalizedEdge {
    // If nodes not found, return as-is
    if (!sourceNode || !targetNode) {
        console.log(`[NormalizeEdge] Edge ${edge.id}: SKIPPED - nodes not found`);
        return edge;
    }

    // Calculate alignment
    const sourceCenter = getNodeCenter(sourceNode);
    const targetCenter = getNodeCenter(targetNode);

    const deltaX = Math.abs(targetCenter.x - sourceCenter.x);
    const deltaY = Math.abs(targetCenter.y - sourceCenter.y);

    // CRITICAL: Calculate OPTIMAL HANDLES based on node positions
    // Horizontal: right → left or left → right
    // Vertical: bottom → top or top → bottom
    const isHorizontalDominant = deltaX > deltaY;
    let optimalSourceHandle: string;
    let optimalTargetHandle: string;

    if (isHorizontalDominant) {
        // Horizontal connection
        if (targetCenter.x > sourceCenter.x) {
            // Target is to the RIGHT of source
            optimalSourceHandle = 'r';
            optimalTargetHandle = 'l';
        } else {
            // Target is to the LEFT of source
            optimalSourceHandle = 'l';
            optimalTargetHandle = 'r';
        }
    } else {
        // Vertical connection
        if (targetCenter.y > sourceCenter.y) {
            // Target is BELOW source
            optimalSourceHandle = 'b';
            optimalTargetHandle = 't';
        } else {
            // Target is ABOVE source
            optimalSourceHandle = 't';
            optimalTargetHandle = 'b';
        }
    }

    console.log(`[NormalizeEdge] Edge ${edge.id}:`, {
        deltaX: deltaX.toFixed(0),
        deltaY: deltaY.toFixed(0),
        type: edge.type, // PRESERVED - never changed!
        optimalHandles: `${optimalSourceHandle} → ${optimalTargetHandle}`,
    });

    // ONLY adjust handles - TYPE IS NEVER CHANGED
    return {
        ...edge,
        sourceHandle: optimalSourceHandle,
        targetHandle: optimalTargetHandle,
        _normalized: true,
        _normalizationReason: 'handles_optimized',
    };
}

/**
 * Normalize ALL edges in a diagram
 * This is called during diagram loading, BEFORE rendering!
 * 
 * CRITICAL: This function NEVER deletes edges or changes types!
 * Multiple edges from same handle to different targets are ALLOWED.
 * User's edge type selection is ALWAYS respected.
 */
export function normalizeAllEdges(
    edges: NormalizedEdge[],
    nodes: Node[]
): NormalizedEdge[] {
    console.log(`[NormalizeAllEdges] Processing ${edges.length} edges (types preserved)...`);

    // Simply normalize each edge (handle optimization only)
    return edges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);

        // normalizeEdge only adjusts handles, never changes type
        return normalizeEdge(edge, sourceNode, targetNode);
    });
}

// =============================================================================
// SMART EDGE ROUTING - Collision detection and handle optimization
// =============================================================================

type ValidHandle = 't' | 'b' | 'l' | 'r';
const VALID_HANDLES: ValidHandle[] = ['t', 'b', 'l', 'r'];

// All possible handle combinations for routing
const HANDLE_COMBINATIONS: Array<{ source: ValidHandle; target: ValidHandle }> = [
    { source: 'r', target: 'l' },
    { source: 'l', target: 'r' },
    { source: 'b', target: 't' },
    { source: 't', target: 'b' },
    { source: 'r', target: 't' },
    { source: 'r', target: 'b' },
    { source: 'l', target: 't' },
    { source: 'l', target: 'b' },
    { source: 'b', target: 'l' },
    { source: 'b', target: 'r' },
    { source: 't', target: 'l' },
    { source: 't', target: 'r' },
];

/**
 * Get the position of a handle on a node
 */
function getHandlePosition(node: Node, handle: ValidHandle): XYPosition {
    const width = node.measured?.width ?? node.width ?? 150;
    const height = node.measured?.height ?? node.height ?? 80;

    switch (handle) {
        case 't': return { x: node.position.x + width / 2, y: node.position.y };
        case 'b': return { x: node.position.x + width / 2, y: node.position.y + height };
        case 'l': return { x: node.position.x, y: node.position.y + height / 2 };
        case 'r': return { x: node.position.x + width, y: node.position.y + height / 2 };
    }
}

/**
 * Detect if an edge path collides with any node (except source/target)
 * WITH DETAILED DEBUG LOGGING
 */
function detectEdgeCollision(
    sourcePos: XYPosition,
    targetPos: XYPosition,
    nodes: Node[],
    excludeIds: string[]
): Node | null {
    console.group(`[COLLISION] Checking path (${sourcePos.x.toFixed(0)},${sourcePos.y.toFixed(0)}) → (${targetPos.x.toFixed(0)},${targetPos.y.toFixed(0)})`);
    console.log(`Excluding nodes: ${excludeIds.join(', ')}`);
    console.log(`Checking ${nodes.length - excludeIds.length} potential obstacles`);

    let collisionFound: Node | null = null;

    for (const node of nodes) {
        if (excludeIds.includes(node.id)) {
            console.log(`  ⏭️ Skipping ${node.id} (source/target)`);
            continue;
        }

        const bounds = getNodeBounds(node, 5); // 5px padding
        const intersects = lineIntersectsBounds(sourcePos, targetPos, bounds);

        console.log(`  📦 Node ${node.id}:`, {
            position: `(${node.position.x.toFixed(0)}, ${node.position.y.toFixed(0)})`,
            size: `${node.measured?.width ?? node.width ?? 150}x${node.measured?.height ?? node.height ?? 80}`,
            bounds: `L:${bounds.left.toFixed(0)} R:${bounds.right.toFixed(0)} T:${bounds.top.toFixed(0)} B:${bounds.bottom.toFixed(0)}`,
            intersects: intersects ? '⚠️ COLLISION!' : '✅ Clear',
        });

        if (intersects && !collisionFound) {
            collisionFound = node;
            console.warn(`  ⚠️ COLLISION DETECTED with node ${node.id}!`);
        }
    }

    if (collisionFound) {
        console.warn(`[COLLISION] Result: HIT node ${collisionFound.id}`);
    } else {
        console.log(`[COLLISION] Result: No collision`);
    }
    console.groupEnd();

    return collisionFound;
}

/**
 * Calculate path length for a given handle combination
 */
function calculatePathLength(
    sourceNode: Node,
    targetNode: Node,
    sourceHandle: ValidHandle,
    targetHandle: ValidHandle
): number {
    const sourcePos = getHandlePosition(sourceNode, sourceHandle);
    const targetPos = getHandlePosition(targetNode, targetHandle);
    return distance(sourcePos, targetPos);
}

/**
 * Find optimal handles that avoid collisions
 * Returns the shortest collision-free path, or fallback if none found
 */
function findOptimalHandles(
    sourceNode: Node,
    targetNode: Node,
    nodes: Node[],
    excludeIds: string[]
): { sourceHandle: ValidHandle; targetHandle: ValidHandle } {
    // Calculate direction to prioritize certain combinations
    const sourceCenter = getNodeCenter(sourceNode);
    const targetCenter = getNodeCenter(targetNode);
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;
    const isHorizontalDominant = Math.abs(dx) > Math.abs(dy);

    // Sort combinations by preference (direction-based)
    const sortedCombinations = [...HANDLE_COMBINATIONS].sort((a, b) => {
        // Prefer combinations that match the dominant direction
        const aScore = getDirectionScore(a, dx, dy, isHorizontalDominant);
        const bScore = getDirectionScore(b, dx, dy, isHorizontalDominant);
        return bScore - aScore;
    });

    // Find first collision-free combination
    for (const combo of sortedCombinations) {
        const sourcePos = getHandlePosition(sourceNode, combo.source);
        const targetPos = getHandlePosition(targetNode, combo.target);

        const collision = detectEdgeCollision(sourcePos, targetPos, nodes, excludeIds);

        if (!collision) {
            console.log(`[SmartRouting] Found collision-free path: ${combo.source} -> ${combo.target}`);
            return { sourceHandle: combo.source, targetHandle: combo.target };
        }
    }

    // No collision-free path found - use fallback based on direction
    console.warn('[SmartRouting] No collision-free path found, using direction fallback');
    if (isHorizontalDominant) {
        return dx > 0
            ? { sourceHandle: 'r', targetHandle: 'l' }
            : { sourceHandle: 'l', targetHandle: 'r' };
    } else {
        return dy > 0
            ? { sourceHandle: 'b', targetHandle: 't' }
            : { sourceHandle: 't', targetHandle: 'b' };
    }
}

/**
 * Score a handle combination based on how well it matches the direction
 */
function getDirectionScore(
    combo: { source: ValidHandle; target: ValidHandle },
    dx: number,
    dy: number,
    isHorizontalDominant: boolean
): number {
    let score = 0;

    if (isHorizontalDominant) {
        // Prefer horizontal handles
        if (dx > 0 && combo.source === 'r' && combo.target === 'l') score += 10;
        if (dx < 0 && combo.source === 'l' && combo.target === 'r') score += 10;
        if (combo.source === 'r' || combo.source === 'l') score += 3;
        if (combo.target === 'r' || combo.target === 'l') score += 3;
    } else {
        // Prefer vertical handles
        if (dy > 0 && combo.source === 'b' && combo.target === 't') score += 10;
        if (dy < 0 && combo.source === 't' && combo.target === 'b') score += 10;
        if (combo.source === 't' || combo.source === 'b') score += 3;
        if (combo.target === 't' || combo.target === 'b') score += 3;
    }

    return score;
}

/**
 * Calculate waypoints to route around obstacles
 * Tries multiple strategies and picks the first collision-free path
 */
function calculateWaypoints(
    sourcePos: XYPosition,
    targetPos: XYPosition,
    nodes: Node[],
    excludeIds: string[]
): XYPosition[] {
    const obstacleNodes = nodes.filter(n => !excludeIds.includes(n.id));

    // If no collision on direct path, return empty (no waypoints needed)
    if (!detectEdgeCollision(sourcePos, targetPos, nodes, excludeIds)) {
        return [];
    }

    console.log(`[Waypoints] Calculating route from (${sourcePos.x.toFixed(0)},${sourcePos.y.toFixed(0)}) to (${targetPos.x.toFixed(0)},${targetPos.y.toFixed(0)})`);

    // Calculate margins for routing around obstacles
    const margin = 60; // Distance to route around nodes

    // Find bounding box of all obstacles
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    obstacleNodes.forEach(node => {
        const bounds = getNodeBounds(node, margin);
        minX = Math.min(minX, bounds.left);
        maxX = Math.max(maxX, bounds.right);
        minY = Math.min(minY, bounds.top);
        maxY = Math.max(maxY, bounds.bottom);
    });

    // Define routing strategies (in order of preference)
    const strategies: (() => XYPosition[])[] = [
        // Strategy 1: Go right around obstacles, then to target
        () => {
            const rightX = maxX + margin;
            return [
                { x: rightX, y: sourcePos.y },
                { x: rightX, y: targetPos.y },
            ];
        },

        // Strategy 2: Go left around obstacles
        () => {
            const leftX = minX - margin;
            return [
                { x: leftX, y: sourcePos.y },
                { x: leftX, y: targetPos.y },
            ];
        },

        // Strategy 3: Go down under obstacles
        () => {
            const bottomY = maxY + margin;
            return [
                { x: sourcePos.x, y: bottomY },
                { x: targetPos.x, y: bottomY },
            ];
        },

        // Strategy 4: Go up over obstacles
        () => {
            const topY = minY - margin;
            return [
                { x: sourcePos.x, y: topY },
                { x: targetPos.x, y: topY },
            ];
        },

        // Strategy 5: L-shape right then down/up
        () => {
            const rightX = maxX + margin;
            return [
                { x: rightX, y: sourcePos.y },
                { x: rightX, y: targetPos.y },
            ];
        },

        // Strategy 6: L-shape down then right/left
        () => {
            const bottomY = maxY + margin;
            return [
                { x: sourcePos.x, y: bottomY },
                { x: targetPos.x, y: bottomY },
            ];
        },
    ];

    // Test each strategy
    for (let i = 0; i < strategies.length; i++) {
        const waypoints = strategies[i]();
        const fullPath = [sourcePos, ...waypoints, targetPos];

        // Check if this path has any collisions
        let hasCollision = false;
        for (let j = 0; j < fullPath.length - 1; j++) {
            if (detectEdgeCollision(fullPath[j], fullPath[j + 1], nodes, excludeIds)) {
                hasCollision = true;
                break;
            }
        }

        if (!hasCollision) {
            console.log(`[Waypoints] Strategy ${i + 1} succeeded: ${waypoints.length} waypoints`);
            return waypoints;
        }
    }

    // Fallback: use the right-side route (most common useful case)
    console.warn('[Waypoints] All strategies failed, using fallback');
    const rightX = Math.max(sourcePos.x, targetPos.x) + margin + 50;
    return [
        { x: rightX, y: sourcePos.y },
        { x: rightX, y: targetPos.y },
    ];
}

/**
 * SMART EDGE ROUTING - Full pathfinding with waypoints
 * 
 * This function:
 * 1. Detects if edge path crosses any node (collision)
 * 2. If collision, calculates waypoints to route around obstacles
 * 3. Sets edge type to 'smart' for CustomSmartEdge to render
 * 4. Stores waypoints in edge.data.waypoints
 * 
 * CRITICAL: Only uses valid handles (t/b/l/r)
 */
export function validateEdgeSpacing(
    edges: NormalizedEdge[],
    nodes: Node[]
): NormalizedEdge[] {
    console.log(`[ValidateEdgeSpacing] Processing ${edges.length} edges with pathfinding...`);

    return edges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);

        if (!sourceNode || !targetNode) {
            return edge;
        }

        // Get current handle positions
        const currentSourceHandle = (edge.sourceHandle || 'b') as ValidHandle;
        const currentTargetHandle = (edge.targetHandle || 't') as ValidHandle;

        // Ensure handles are valid
        const validSourceHandle = VALID_HANDLES.includes(currentSourceHandle) ? currentSourceHandle : 'b';
        const validTargetHandle = VALID_HANDLES.includes(currentTargetHandle) ? currentTargetHandle : 't';

        // Get handle positions
        const sourcePos = getHandlePosition(sourceNode, validSourceHandle);
        const targetPos = getHandlePosition(targetNode, validTargetHandle);

        // Check for collision
        const collision = detectEdgeCollision(sourcePos, targetPos, nodes, [edge.source, edge.target]);

        if (!collision) {
            // No collision - keep current path, no waypoints needed
            return {
                ...edge,
                sourceHandle: validSourceHandle,
                targetHandle: validTargetHandle,
                type: edge.type || 'smoothstep', // Keep original type
            };
        }

        // Collision detected - calculate waypoints
        console.log(`[ValidateEdgeSpacing] Edge ${edge.id} collides with node ${collision.id}, calculating waypoints...`);

        // First try to find better handles
        const optimal = findOptimalHandles(sourceNode, targetNode, nodes, [edge.source, edge.target]);

        // Get new positions with optimal handles
        const newSourcePos = getHandlePosition(sourceNode, optimal.sourceHandle);
        const newTargetPos = getHandlePosition(targetNode, optimal.targetHandle);

        // Check if optimal handles solve the collision
        const stillCollides = detectEdgeCollision(newSourcePos, newTargetPos, nodes, [edge.source, edge.target]);

        if (!stillCollides) {
            // Optimal handles solved it - no waypoints needed
            console.log(`[ValidateEdgeSpacing] Edge ${edge.id}: handles ${optimal.sourceHandle}->${optimal.targetHandle} solve collision`);
            return {
                ...edge,
                sourceHandle: optimal.sourceHandle,
                targetHandle: optimal.targetHandle,
                type: edge.type || 'smoothstep',
            };
        }

        // Still collides - need waypoints
        const waypoints = calculateWaypoints(newSourcePos, newTargetPos, nodes, [edge.source, edge.target]);

        console.log(`[ValidateEdgeSpacing] Edge ${edge.id}: using ${waypoints.length} waypoints`);

        return {
            ...edge,
            sourceHandle: optimal.sourceHandle,
            targetHandle: optimal.targetHandle,
            type: 'smart', // Use CustomSmartEdge
            data: {
                ...(edge.data || {}),
                waypoints: waypoints,
            },
        } as NormalizedEdge;
    });
}

/**
 * Remove edges that reference non-existent nodes (orphans)
 * Called during normalization pipeline
 */
export function validateAndCleanEdges(
    edges: NormalizedEdge[],
    nodes: Node[]
): NormalizedEdge[] {
    const nodeIds = new Set(nodes.map(n => n.id));
    const validEdges = edges.filter(edge => {
        const sourceExists = nodeIds.has(edge.source);
        const targetExists = nodeIds.has(edge.target);

        if (!sourceExists || !targetExists) {
            console.warn(`[ValidateEdges] Removing orphan edge ${edge.id}: source=${edge.source}(${sourceExists}), target=${edge.target}(${targetExists})`);
            return false;
        }
        return true;
    });

    if (edges.length !== validEdges.length) {
        console.log(`[ValidateEdges] ${edges.length} edges → ${validEdges.length} valid (${edges.length - validEdges.length} orphans removed)`);
    }
    return validEdges;
}

/**
 * Full diagram normalization pipeline
 * Run this BEFORE rendering any diagram!
 * 
 * Pipeline:
 * 1. Remove orphan edges (non-existent source/target)
 * 2. Normalize handles based on geometry
 * 3. Smart routing with collision detection (uses ONLY valid handles t/b/l/r)
 */
export function normalizeDiagram(
    edges: NormalizedEdge[],
    nodes: Node[]
): NormalizedEdge[] {
    console.log(`[NormalizeDiagram] Starting normalization pipeline...`);

    // Step 0: Remove orphan edges (edges with non-existent source/target)
    const cleanedEdges = validateAndCleanEdges(edges, nodes);

    // Step 1: Normalize handles based on alignment (ONLY uses t/b/l/r)
    const geometryNormalized = normalizeAllEdges(cleanedEdges, nodes);

    // Step 2: Smart routing - detect collisions and find optimal paths
    // REIMPLEMENTED: Now only uses valid handles (t/b/l/r), never generates invalid IDs
    const spacingValidated = validateEdgeSpacing(geometryNormalized, nodes);

    console.log(`[NormalizeDiagram] Pipeline complete. ${spacingValidated.length} edges processed.`);

    return spacingValidated;
}

// =============================================================================
// SNAP-TO-ALIGNMENT - Automatic position correction when dropping cards
// =============================================================================

const SNAP_THRESHOLD = 15; // pixels - VERY precise, almost millimetric

export interface SnapAlignment {
    axis: 'x' | 'y';
    targetValue: number;
    alignedWithNodeId: string;
}

/**
 * Detect if a dragged node is "almost" aligned with other nodes
 * Returns the alignment target if within SNAP_THRESHOLD
 */
export function detectNearAlignment(
    draggedNode: Node,
    otherNodes: Node[]
): SnapAlignment | null {
    console.log(`[SnapDetect] Checking alignment for node ${draggedNode.id}...`);

    // Check vertical alignment (same X position)
    for (const node of otherNodes) {
        if (node.id === draggedNode.id) continue;

        const deltaX = Math.abs(node.position.x - draggedNode.position.x);

        if (deltaX < SNAP_THRESHOLD && deltaX > 0) {
            console.log(`[SnapDetect] Node ${draggedNode.id} is ${deltaX.toFixed(0)}px from vertical alignment with ${node.id}`);
            return {
                axis: 'x',
                targetValue: node.position.x,
                alignedWithNodeId: node.id,
            };
        }
    }

    // Check horizontal alignment (same Y position)
    for (const node of otherNodes) {
        if (node.id === draggedNode.id) continue;

        const deltaY = Math.abs(node.position.y - draggedNode.position.y);

        if (deltaY < SNAP_THRESHOLD && deltaY > 0) {
            console.log(`[SnapDetect] Node ${draggedNode.id} is ${deltaY.toFixed(0)}px from horizontal alignment with ${node.id}`);
            return {
                axis: 'y',
                targetValue: node.position.y,
                alignedWithNodeId: node.id,
            };
        }
    }

    console.log(`[SnapDetect] No alignment opportunity for node ${draggedNode.id}`);
    return null;
}

/**
 * Apply snap correction to a node's position
 */
export function applySnapCorrection(
    node: Node,
    alignment: SnapAlignment
): Node {
    const newPosition = {
        x: alignment.axis === 'x' ? alignment.targetValue : node.position.x,
        y: alignment.axis === 'y' ? alignment.targetValue : node.position.y,
    };

    console.log(`[SnapApply] ${node.id}: ${alignment.axis}=${node.position[alignment.axis].toFixed(0)} -> ${alignment.targetValue.toFixed(0)}`);

    return {
        ...node,
        position: newPosition,
    };
}

/**
 * Normalize edges connected to a specific node
 * Called after node position is corrected
 */
export function normalizeEdgesForNode(
    nodeId: string,
    edges: NormalizedEdge[],
    nodes: Node[]
): NormalizedEdge[] {
    console.log(`[NormalizeForNode] Recalculating edges connected to ${nodeId}...`);

    return edges.map(edge => {
        // Only normalize edges connected to the moved node
        if (edge.source !== nodeId && edge.target !== nodeId) {
            return edge;
        }

        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);

        return normalizeEdge(edge, sourceNode, targetNode);
    });
}
