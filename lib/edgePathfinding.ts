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
 * Uses simplified rectangle intersection check
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

    // Check if line passes through box using parametric intersection
    const dx = end.x - start.x;
    const dy = end.y - start.y;

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

const ALIGNMENT_THRESHOLD_NORM = 50; // pixels

export interface NormalizedEdge {
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
    type: 'straight' | 'smoothstep' | 'step';
    markerEnd?: unknown;
    markerStart?: unknown;
    style?: Record<string, unknown>;
    animated?: boolean;
    label?: string;
    // Flag indicating normalization was applied
    _normalized?: boolean;
    _normalizationReason?: string;
}

/**
 * MANDATORY NORMALIZATION - Forces correct geometry based on node positions
 * This function runs for EVERY edge BEFORE rendering!
 * 
 * Rules:
 * - deltaX < 50px (vertically aligned) → FORCE straight
 * - deltaY < 50px (horizontally aligned) → FORCE straight
 * - Both > 50px (diagonal) → FORCE smoothstep if type was straight
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

    const isVerticallyAligned = deltaX < ALIGNMENT_THRESHOLD_NORM;
    const isHorizontallyAligned = deltaY < ALIGNMENT_THRESHOLD_NORM;
    const shouldBeStraight = isVerticallyAligned || isHorizontallyAligned;

    // Current type (default to straight if missing)
    const currentType = edge.type || 'straight';

    console.log(`[NormalizeEdge] Edge ${edge.id}:`, {
        deltaX: deltaX.toFixed(0),
        deltaY: deltaY.toFixed(0),
        currentType,
        isVerticallyAligned,
        isHorizontallyAligned,
        shouldBeStraight,
    });

    // CASE 1: Aligned cards should use STRAIGHT
    if (shouldBeStraight && currentType !== 'straight') {
        console.log(`[NormalizeEdge] Edge ${edge.id}: FORCING straight (was ${currentType})`);
        return {
            ...edge,
            type: 'straight',
            _normalized: true,
            _normalizationReason: isVerticallyAligned ? 'vertically_aligned' : 'horizontally_aligned',
        };
    }

    // CASE 2: Diagonal should NOT use straight
    if (!shouldBeStraight && currentType === 'straight') {
        console.log(`[NormalizeEdge] Edge ${edge.id}: FORCING smoothstep (straight on diagonal)`);
        return {
            ...edge,
            type: 'smoothstep',
            _normalized: true,
            _normalizationReason: 'diagonal_requires_curve',
        };
    }

    // CASE 3: Already correct
    console.log(`[NormalizeEdge] Edge ${edge.id}: OK (no change needed)`);
    return {
        ...edge,
        _normalized: true,
        _normalizationReason: 'already_correct',
    };
}

/**
 * Normalize ALL edges in a diagram
 * This is called during diagram loading, BEFORE rendering!
 */
export function normalizeAllEdges(
    edges: NormalizedEdge[],
    nodes: Node[]
): NormalizedEdge[] {
    console.log(`[NormalizeAllEdges] Processing ${edges.length} edges...`);

    return edges.map(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        return normalizeEdge(edge, sourceNode, targetNode);
    });
}

// =============================================================================
// EDGE SPACING - Prevents arrow overlap on same target
// =============================================================================

const HANDLE_OFFSETS = [-30, -15, 0, 15, 30]; // 5 possible positions

/**
 * Validate edge spacing and assign handles to prevent arrow overlap
 * When multiple edges connect to the same target, they get different handles
 */
export function validateEdgeSpacing(
    edges: NormalizedEdge[],
    nodes: Node[]
): NormalizedEdge[] {
    console.log(`[ValidateEdgeSpacing] Processing ${edges.length} edges...`);

    // Group edges by target node
    const edgesByTarget: Record<string, NormalizedEdge[]> = {};
    edges.forEach(edge => {
        if (!edgesByTarget[edge.target]) {
            edgesByTarget[edge.target] = [];
        }
        edgesByTarget[edge.target].push(edge);
    });

    // Also group by source for outgoing edges
    const edgesBySource: Record<string, NormalizedEdge[]> = {};
    edges.forEach(edge => {
        if (!edgesBySource[edge.source]) {
            edgesBySource[edge.source] = [];
        }
        edgesBySource[edge.source].push(edge);
    });

    return edges.map(edge => {
        const targetEdges = edgesByTarget[edge.target] || [];
        const sourceEdges = edgesBySource[edge.source] || [];

        let newTargetHandle = edge.targetHandle;
        let newSourceHandle = edge.sourceHandle;

        // If multiple edges arrive at same target, distribute handles
        if (targetEdges.length > 1) {
            const index = targetEdges.indexOf(edge);
            const offset = HANDLE_OFFSETS[index % HANDLE_OFFSETS.length];

            // Generate handle based on current target direction
            const currentHandle = edge.targetHandle || 't';
            const baseHandle = currentHandle.replace(/-?\d+$/, ''); // Remove any existing offset
            newTargetHandle = offset === 0 ? baseHandle : `${baseHandle}${offset}`;

            console.log(`[ValidateEdgeSpacing] Edge ${edge.id}: target handle ${edge.targetHandle} -> ${newTargetHandle} (${targetEdges.length} edges on same target)`);
        }

        // If multiple edges leave same source, distribute handles
        if (sourceEdges.length > 1) {
            const index = sourceEdges.indexOf(edge);
            const offset = HANDLE_OFFSETS[index % HANDLE_OFFSETS.length];

            const currentHandle = edge.sourceHandle || 'b';
            const baseHandle = currentHandle.replace(/-?\d+$/, '');
            newSourceHandle = offset === 0 ? baseHandle : `${baseHandle}${offset}`;

            console.log(`[ValidateEdgeSpacing] Edge ${edge.id}: source handle ${edge.sourceHandle} -> ${newSourceHandle} (${sourceEdges.length} edges from same source)`);
        }

        return {
            ...edge,
            sourceHandle: newSourceHandle,
            targetHandle: newTargetHandle,
        };
    });
}

/**
 * Full diagram normalization pipeline
 * Run this BEFORE rendering any diagram!
 */
export function normalizeDiagram(
    edges: NormalizedEdge[],
    nodes: Node[]
): NormalizedEdge[] {
    console.log(`[NormalizeDiagram] Starting normalization pipeline...`);

    // Step 1: Normalize geometry based on alignment
    const geometryNormalized = normalizeAllEdges(edges, nodes);

    // Step 2: Validate spacing to prevent overlaps
    const spacingValidated = validateEdgeSpacing(geometryNormalized, nodes);

    console.log(`[NormalizeDiagram] Pipeline complete. ${spacingValidated.length} edges processed.`);

    return spacingValidated;
}
