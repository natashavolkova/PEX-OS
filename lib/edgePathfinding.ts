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
 * Calculate Manhattan distance (sum of horizontal + vertical)
 */
function manhattanDistance(p1: XYPosition, p2: XYPosition): number {
    return Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
}

/**
 * Count expected direction changes for a handle pair
 */
function countDirectionChanges(
    sourcePos: XYPosition,
    targetPos: XYPosition,
    sourceHandle: ValidHandle,
    targetHandle: ValidHandle
): number {
    // Direct alignment = 0 or 1 change
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;

    const isHorizontalExit = sourceHandle === 'l' || sourceHandle === 'r';
    const isHorizontalEntry = targetHandle === 'l' || targetHandle === 'r';

    // If exit and entry are same orientation and aligned, minimal changes
    if (isHorizontalExit && isHorizontalEntry) {
        // Horizontal-horizontal: needs 2 turns unless perfectly aligned
        return Math.abs(dy) < 10 ? 0 : 2;
    }
    if (!isHorizontalExit && !isHorizontalEntry) {
        // Vertical-vertical: needs 2 turns unless perfectly aligned
        return Math.abs(dx) < 10 ? 0 : 2;
    }

    // Mixed orientation: 1 turn for L-shape
    return 1;
}

/**
 * Calculate flow hierarchy penalty for anchor pair
 * Respects natural visual flow: top-down, left-right
 * LOWER score = better flow (penalty-based)
 */
function calculateFlowPenalty(
    sourceNode: Node,
    targetNode: Node,
    sourceHandle: ValidHandle,
    targetHandle: ValidHandle
): number {
    const sourceCenter = getNodeCenter(sourceNode);
    const targetCenter = getNodeCenter(targetNode);

    const isTargetBelow = targetCenter.y > sourceCenter.y + 50;
    const isTargetAbove = targetCenter.y < sourceCenter.y - 50;
    const isTargetLeft = targetCenter.x < sourceCenter.x - 50;
    const isTargetRight = targetCenter.x > sourceCenter.x + 50;

    // Target is below AND to the left: prefer left → top (hierarchical diagonal)
    if (isTargetBelow && isTargetLeft) {
        if (sourceHandle === 'l' && targetHandle === 't') return 0;   // Best
        if (sourceHandle === 'b' && targetHandle === 'r') return 100; // Acceptable
        return 300; // Heavy penalty for other combinations
    }

    // Target is below AND to the right: prefer right → top or bottom → top
    if (isTargetBelow && isTargetRight) {
        if (sourceHandle === 'r' && targetHandle === 't') return 0;
        if (sourceHandle === 'b' && targetHandle === 'l') return 50;
        if (sourceHandle === 'b' && targetHandle === 't') return 50;
        return 250;
    }

    // Target is directly below: prefer bottom → top (natural top-down flow)
    if (isTargetBelow) {
        if (sourceHandle === 'b' && targetHandle === 't') return 0;
        if (sourceHandle === 'r' && targetHandle === 'l') return 80;
        if (sourceHandle === 'l' && targetHandle === 'r') return 80;
        return 200;
    }

    // Target is directly above: prefer top → bottom
    if (isTargetAbove) {
        if (sourceHandle === 't' && targetHandle === 'b') return 0;
        return 200;
    }

    // Target is to the right: prefer right → left
    if (isTargetRight) {
        if (sourceHandle === 'r' && targetHandle === 'l') return 0;
        return 150;
    }

    // Target is to the left: prefer left → right
    if (isTargetLeft) {
        if (sourceHandle === 'l' && targetHandle === 'r') return 0;
        return 150;
    }

    // Default for nearly aligned cards
    return 50;
}

/**
 * Check if handle pair makes geometric sense
 * Higher score = better geometry
 */
function getGeometryBonus(
    dx: number,
    dy: number,
    sourceHandle: ValidHandle,
    targetHandle: ValidHandle
): number {
    let bonus = 0;

    // RIGHT to LEFT is ideal when target is to the right
    if (dx > 50 && sourceHandle === 'r' && targetHandle === 'l') bonus += 200;
    // LEFT to RIGHT is ideal when target is to the left
    if (dx < -50 && sourceHandle === 'l' && targetHandle === 'r') bonus += 200;
    // BOTTOM to TOP is ideal when target is below
    if (dy > 50 && sourceHandle === 'b' && targetHandle === 't') bonus += 200;
    // TOP to BOTTOM is ideal when target is above
    if (dy < -50 && sourceHandle === 't' && targetHandle === 'b') bonus += 200;

    // Penalize going backwards
    if (dx > 50 && sourceHandle === 'l') bonus -= 100;
    if (dx < -50 && sourceHandle === 'r') bonus -= 100;
    if (dy > 50 && sourceHandle === 't') bonus -= 100;
    if (dy < -50 && sourceHandle === 'b') bonus -= 100;

    return bonus;
}

interface AnchorScore {
    sourceHandle: ValidHandle;
    targetHandle: ValidHandle;
    score: number;
    hasCollision: boolean;
}

/**
 * Score an anchor pair - LOWER is better
 */
function scoreAnchorPair(
    sourceNode: Node,
    targetNode: Node,
    sourceHandle: ValidHandle,
    targetHandle: ValidHandle,
    nodes: Node[],
    excludeIds: string[]
): AnchorScore {
    const sourcePos = getHandlePosition(sourceNode, sourceHandle);
    const targetPos = getHandlePosition(targetNode, targetHandle);

    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;

    // Base: Manhattan distance
    const distanceScore = manhattanDistance(sourcePos, targetPos) * 0.5;

    // Penalty for direction changes
    const turns = countDirectionChanges(sourcePos, targetPos, sourceHandle, targetHandle);
    const turnPenalty = turns * 80;

    // Geometry bonus (makes visually sensible routes)
    const geoBonus = getGeometryBonus(dx, dy, sourceHandle, targetHandle);

    // Flow hierarchy penalty (respects top-down, left-right visual flow)
    const flowPenalty = calculateFlowPenalty(sourceNode, targetNode, sourceHandle, targetHandle);

    // Check for collision
    const collision = detectEdgeCollision(sourcePos, targetPos, nodes, excludeIds);
    const collisionPenalty = collision ? 1000 : 0;

    // Final score: distance + turns + flow penalty - geometry bonus + collision penalty
    const finalScore = distanceScore + turnPenalty + flowPenalty - geoBonus + collisionPenalty;

    return {
        sourceHandle,
        targetHandle,
        score: finalScore,
        hasCollision: !!collision,
    };
}

// All 16 possible anchor combinations
const ALL_ANCHOR_PAIRS: Array<{ source: ValidHandle; target: ValidHandle }> = [];
for (const source of VALID_HANDLES) {
    for (const target of VALID_HANDLES) {
        ALL_ANCHOR_PAIRS.push({ source, target });
    }
}

/**
 * Find OPTIMAL handles by testing ALL 16 combinations and scoring each
 * Picks the combination with minimum score
 */
function findOptimalHandles(
    sourceNode: Node,
    targetNode: Node,
    nodes: Node[],
    excludeIds: string[]
): { sourceHandle: ValidHandle; targetHandle: ValidHandle } {
    console.group(`[AnchorSelection] Testing all 16 anchor combinations`);

    const scores: AnchorScore[] = [];

    // Test ALL 16 combinations
    for (const pair of ALL_ANCHOR_PAIRS) {
        const result = scoreAnchorPair(
            sourceNode,
            targetNode,
            pair.source,
            pair.target,
            nodes,
            excludeIds
        );
        scores.push(result);
    }

    // Sort by score (lower is better), prioritize no-collision
    scores.sort((a, b) => {
        // First: prefer no collision
        if (a.hasCollision && !b.hasCollision) return 1;
        if (!a.hasCollision && b.hasCollision) return -1;
        // Then: by score
        return a.score - b.score;
    });

    // Log top 3 options
    console.log('Top 3 anchor pairs:');
    for (let i = 0; i < Math.min(3, scores.length); i++) {
        const s = scores[i];
        console.log(`  ${i + 1}. ${s.sourceHandle}→${s.targetHandle}: score=${s.score.toFixed(0)}${s.hasCollision ? ' ⚠️COLLISION' : ''}`);
    }

    const best = scores[0];
    console.log(`[AnchorSelection] Best: ${best.sourceHandle}→${best.targetHandle} (score=${best.score.toFixed(0)})`);
    console.groupEnd();

    return { sourceHandle: best.sourceHandle, targetHandle: best.targetHandle };
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

// =============================================================================
// INTELLIGENT ROUTE SCORING - Chooses best route, not just first valid one
// =============================================================================

interface RouteCandidate {
    waypoints: XYPosition[];
    score: number;
    description: string;
}

/**
 * Score a route - LOWER is better
 */
function scoreRoute(route: XYPosition[], nodes: Node[], excludeIds: string[]): number {
    let score = 0;

    // 1. Path length penalty (shorter is better)
    let totalLength = 0;
    for (let i = 1; i < route.length; i++) {
        totalLength += distance(route[i - 1], route[i]);
    }
    score += totalLength * 0.3;

    // 2. Direction changes penalty (fewer turns is better)
    let directionChanges = 0;
    for (let i = 1; i < route.length - 1; i++) {
        const prevDx = route[i].x - route[i - 1].x;
        const prevDy = route[i].y - route[i - 1].y;
        const nextDx = route[i + 1].x - route[i].x;
        const nextDy = route[i + 1].y - route[i].y;

        // Check if direction changed
        const prevHorizontal = Math.abs(prevDx) > Math.abs(prevDy);
        const nextHorizontal = Math.abs(nextDx) > Math.abs(nextDy);

        if (prevHorizontal !== nextHorizontal) {
            directionChanges++;
        }
    }
    score += directionChanges * 80;

    // 3. Alignment bonus (orthogonal segments are better than diagonal)
    let orthogonalBonus = 0;
    for (let i = 1; i < route.length; i++) {
        const dx = Math.abs(route[i].x - route[i - 1].x);
        const dy = Math.abs(route[i].y - route[i - 1].y);

        // Perfectly horizontal or vertical
        if (dx < 5 || dy < 5) {
            orthogonalBonus += 50;
        }
    }
    score -= orthogonalBonus;

    // 4. Proximity to obstacles penalty
    const obstacleNodes = nodes.filter(n => !excludeIds.includes(n.id));
    for (const point of route) {
        for (const node of obstacleNodes) {
            const center = getNodeCenter(node);
            const dist = distance(point, center);
            if (dist < 100) {
                score += (100 - dist) * 0.5; // Closer = worse
            }
        }
    }

    return score;
}

/**
 * Check if a route has any collisions
 */
function routeHasCollision(route: XYPosition[], nodes: Node[], excludeIds: string[]): boolean {
    for (let i = 0; i < route.length - 1; i++) {
        if (detectEdgeCollision(route[i], route[i + 1], nodes, excludeIds)) {
            return true;
        }
    }
    return false;
}

/**
 * Generate Manhattan-style route (horizontal first, then vertical)
 */
function generateManhattanHV(source: XYPosition, target: XYPosition, offset: number = 0): XYPosition[] {
    const midX = target.x + offset;
    return [
        source,
        { x: midX, y: source.y }, // Go horizontal
        { x: midX, y: target.y }, // Then vertical
        target,
    ];
}

/**
 * Generate Manhattan-style route (vertical first, then horizontal)
 */
function generateManhattanVH(source: XYPosition, target: XYPosition, offset: number = 0): XYPosition[] {
    const midY = target.y + offset;
    return [
        source,
        { x: source.x, y: midY }, // Go vertical
        { x: target.x, y: midY }, // Then horizontal
        target,
    ];
}

/**
 * Generate detour route (go around to one side)
 */
function generateDetourRoute(
    source: XYPosition,
    target: XYPosition,
    direction: 'left' | 'right' | 'up' | 'down',
    margin: number
): XYPosition[] {
    switch (direction) {
        case 'right':
            const rightX = Math.max(source.x, target.x) + margin;
            return [
                source,
                { x: rightX, y: source.y },
                { x: rightX, y: target.y },
                target,
            ];
        case 'left':
            const leftX = Math.min(source.x, target.x) - margin;
            return [
                source,
                { x: leftX, y: source.y },
                { x: leftX, y: target.y },
                target,
            ];
        case 'down':
            const bottomY = Math.max(source.y, target.y) + margin;
            return [
                source,
                { x: source.x, y: bottomY },
                { x: target.x, y: bottomY },
                target,
            ];
        case 'up':
            const topY = Math.min(source.y, target.y) - margin;
            return [
                source,
                { x: source.x, y: topY },
                { x: target.x, y: topY },
                target,
            ];
    }
}

// =============================================================================
// WAYPOINT OPTIMIZATION - Clean geometry with grid snap
// =============================================================================

const WAYPOINT_GRID_SIZE = 8; // 8px grid for clean alignment

/**
 * Snap a point to the grid
 */
function snapToGrid(point: XYPosition): XYPosition {
    return {
        x: Math.round(point.x / WAYPOINT_GRID_SIZE) * WAYPOINT_GRID_SIZE,
        y: Math.round(point.y / WAYPOINT_GRID_SIZE) * WAYPOINT_GRID_SIZE,
    };
}

/**
 * Collapse redundant colinear points in path
 * More aggressive than simple optimization - removes any point on a straight line
 */
export function collapseRedundantPoints(points: XYPosition[]): XYPosition[] {
    if (points.length < 3) return points;

    const simplified: XYPosition[] = [points[0]];

    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        // Remove if on same horizontal or vertical line (tolerance: 2px)
        const isColinear =
            (Math.abs(prev.x - curr.x) < 2 && Math.abs(curr.x - next.x) < 2) ||
            (Math.abs(prev.y - curr.y) < 2 && Math.abs(curr.y - next.y) < 2);

        if (!isColinear) {
            simplified.push(curr);
        }
    }

    simplified.push(points[points.length - 1]);
    return simplified;
}

/**
 * Optimize waypoints by removing redundant points and snapping to grid
 */
function optimizeWaypoints(waypoints: XYPosition[]): XYPosition[] {
    if (waypoints.length <= 2) return waypoints;

    // First: snap intermediate waypoints to grid (keep source/target exact)
    const snapped = waypoints.map((wp, i) =>
        (i === 0 || i === waypoints.length - 1) ? wp : snapToGrid(wp)
    );

    // Then: collapse colinear points
    return collapseRedundantPoints(snapped);
}

/**
 * Calculate optimal waypoints using intelligent routing
 * Generates multiple candidates, scores each, picks the best
 */
function calculateWaypoints(
    sourcePos: XYPosition,
    targetPos: XYPosition,
    nodes: Node[],
    excludeIds: string[]
): XYPosition[] {
    // If no collision on direct path, return empty (no waypoints needed)
    if (!detectEdgeCollision(sourcePos, targetPos, nodes, excludeIds)) {
        return [];
    }

    console.group(`[SmartRouting] Finding optimal route`);
    console.log(`Source: (${sourcePos.x.toFixed(0)}, ${sourcePos.y.toFixed(0)})`);
    console.log(`Target: (${targetPos.x.toFixed(0)}, ${targetPos.y.toFixed(0)})`);

    const margin = 80; // Distance to route around obstacles
    const candidates: RouteCandidate[] = [];

    // Generate candidate routes
    const routeGenerators: Array<{ gen: () => XYPosition[]; desc: string }> = [
        // Manhattan routes (H then V, V then H)
        { gen: () => generateManhattanHV(sourcePos, targetPos, 0), desc: 'Manhattan H→V' },
        { gen: () => generateManhattanVH(sourcePos, targetPos, 0), desc: 'Manhattan V→H' },

        // Detour routes
        { gen: () => generateDetourRoute(sourcePos, targetPos, 'right', margin), desc: 'Detour Right' },
        { gen: () => generateDetourRoute(sourcePos, targetPos, 'left', margin), desc: 'Detour Left' },
        { gen: () => generateDetourRoute(sourcePos, targetPos, 'down', margin), desc: 'Detour Down' },
        { gen: () => generateDetourRoute(sourcePos, targetPos, 'up', margin), desc: 'Detour Up' },

        // Manhattan with offsets
        { gen: () => generateManhattanHV(sourcePos, targetPos, margin), desc: 'Manhattan H→V +offset' },
        { gen: () => generateManhattanHV(sourcePos, targetPos, -margin), desc: 'Manhattan H→V -offset' },
        { gen: () => generateManhattanVH(sourcePos, targetPos, margin), desc: 'Manhattan V→H +offset' },
        { gen: () => generateManhattanVH(sourcePos, targetPos, -margin), desc: 'Manhattan V→H -offset' },
    ];

    // Evaluate each candidate
    for (const { gen, desc } of routeGenerators) {
        const route = gen();

        if (!routeHasCollision(route, nodes, excludeIds)) {
            const score = scoreRoute(route, nodes, excludeIds);
            candidates.push({ waypoints: route, score, description: desc });
            console.log(`  ✓ ${desc}: score=${score.toFixed(0)}`);
        } else {
            console.log(`  ✗ ${desc}: has collision`);
        }
    }

    // Sort by score (lower is better)
    candidates.sort((a, b) => a.score - b.score);

    if (candidates.length > 0) {
        const best = candidates[0];
        console.log(`[SmartRouting] Best route: ${best.description} (score=${best.score.toFixed(0)})`);
        console.groupEnd();

        // Extract intermediate waypoints (remove source and target which React Flow provides)
        const intermediateWaypoints = optimizeWaypoints(best.waypoints).slice(1, -1);
        return intermediateWaypoints;
    }

    // Fallback: simple right-side detour (always works)
    console.warn('[SmartRouting] All strategies failed, using fallback');
    console.groupEnd();

    const fallbackX = Math.max(sourcePos.x, targetPos.x) + margin + 50;
    return [
        { x: fallbackX, y: sourcePos.y },
        { x: fallbackX, y: targetPos.y },
    ];
}

/**
 * SMART EDGE ROUTING - Full pathfinding with optimal anchors
 * 
 * This function:
 * 1. ALWAYS tests all 16 anchor combinations to find optimal handles
 * 2. Uses scoreAnchorPair to pick best geometry
 * 3. If still collision, calculates waypoints
 * 4. Sets edge type to 'smart' for CustomSmartEdge if waypoints needed
 * 
 * CRITICAL: Only uses valid handles (t/b/l/r)
 */
export function validateEdgeSpacing(
    edges: NormalizedEdge[],
    nodes: Node[]
): NormalizedEdge[] {
    console.log(`[ValidateEdgeSpacing] Processing ${edges.length} edges with optimal anchor selection...`);

    return edges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);

        if (!sourceNode || !targetNode) {
            return edge;
        }

        // ALWAYS find optimal handles - test all 16 combinations
        const optimal = findOptimalHandles(sourceNode, targetNode, nodes, [edge.source, edge.target]);

        // Get positions with optimal handles
        const sourcePos = getHandlePosition(sourceNode, optimal.sourceHandle);
        const targetPos = getHandlePosition(targetNode, optimal.targetHandle);

        // Check for collision with optimal handles
        const collision = detectEdgeCollision(sourcePos, targetPos, nodes, [edge.source, edge.target]);

        if (!collision) {
            // No collision with optimal handles - use them directly
            return {
                ...edge,
                sourceHandle: optimal.sourceHandle,
                targetHandle: optimal.targetHandle,
                type: edge.type || 'smoothstep',
            };
        }

        // Still collides - need waypoints
        console.log(`[ValidateEdgeSpacing] Edge ${edge.id} still collides, calculating waypoints...`);

        const waypoints = calculateWaypoints(sourcePos, targetPos, nodes, [edge.source, edge.target]);

        console.log(`[ValidateEdgeSpacing] Edge ${edge.id}: ${optimal.sourceHandle}→${optimal.targetHandle} with ${waypoints.length} waypoints`);

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
