'use client';

// =============================================================================
// CUSTOM SMART EDGE - Renders paths with waypoints to avoid collisions
// React Flow doesn't do pathfinding natively - this component handles it
// =============================================================================

import { memo } from 'react';
import { BaseEdge, EdgeProps, getSmoothStepPath, Position } from '@xyflow/react';

interface Point {
    x: number;
    y: number;
}

interface SmartEdgeData {
    waypoints?: Point[];
    label?: string;
    [key: string]: unknown;
}

/**
 * Custom Edge that renders paths with waypoints
 * 
 * When waypoints are provided in edge.data.waypoints, the edge will
 * render a path that goes through each waypoint in order, effectively
 * routing around obstacles.
 * 
 * Usage:
 * {
 *   id: 'e1',
 *   source: 'node1',
 *   target: 'node2',
 *   type: 'smart',
 *   data: {
 *     waypoints: [
 *       { x: 300, y: 100 },
 *       { x: 300, y: 200 },
 *     ]
 *   }
 * }
 */
function CustomSmartEdge({
    id,
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
    const edgeData = data as SmartEdgeData | undefined;
    const waypoints = edgeData?.waypoints || [];

    // If no waypoints, use standard smoothstep path
    if (waypoints.length === 0) {
        const [edgePath] = getSmoothStepPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
            sourcePosition: sourcePosition || Position.Bottom,
            targetPosition: targetPosition || Position.Top,
            borderRadius: 8,
        });

        return (
            <BaseEdge
                id={id}
                path={edgePath}
                style={style}
                markerEnd={markerEnd}
                markerStart={markerStart}
            />
        );
    }

    // Build complete point list (source -> waypoints -> target)
    const allPoints: Point[] = [
        { x: sourceX, y: sourceY },
        ...waypoints,
        { x: targetX, y: targetY },
    ];

    const CORNER_RADIUS = 10; // Fixed corner radius
    const pathParts: string[] = [];

    // Start at first point
    pathParts.push(`M ${allPoints[0].x},${allPoints[0].y}`);

    // Draw orthogonal path with rounded corners ONLY at actual direction changes
    for (let i = 1; i < allPoints.length; i++) {
        const prev = allPoints[i - 1];
        const curr = allPoints[i];
        const next = allPoints[i + 1];

        if (!next) {
            // Last segment - just line to target
            pathParts.push(`L ${curr.x},${curr.y}`);
            continue;
        }

        // Detect if this is a corner (direction changes from H to V or V to H)
        const isHorizToPrev = Math.abs(prev.y - curr.y) < 2;
        const isHorizToNext = Math.abs(curr.y - next.y) < 2;
        const isCorner = isHorizToPrev !== isHorizToNext;

        if (isCorner) {
            // Calculate segment lengths for radius limiting
            const len1 = isHorizToPrev
                ? Math.abs(curr.x - prev.x)
                : Math.abs(curr.y - prev.y);
            const len2 = isHorizToNext
                ? Math.abs(next.x - curr.x)
                : Math.abs(next.y - curr.y);

            // Limit radius to half the shortest segment
            const r = Math.min(CORNER_RADIUS, len1 / 2, len2 / 2);

            if (r > 1 && len1 > 2 && len2 > 2) {
                // Calculate entry point (before corner)
                const enterX = isHorizToPrev
                    ? curr.x - Math.sign(curr.x - prev.x) * r
                    : curr.x;
                const enterY = !isHorizToPrev
                    ? curr.y - Math.sign(curr.y - prev.y) * r
                    : curr.y;

                // Calculate exit point (after corner)
                const exitX = isHorizToNext
                    ? curr.x + Math.sign(next.x - curr.x) * r
                    : curr.x;
                const exitY = !isHorizToNext
                    ? curr.y + Math.sign(next.y - curr.y) * r
                    : curr.y;

                // Line to corner entry, then quadratic curve to exit
                pathParts.push(`L ${enterX},${enterY}`);
                pathParts.push(`Q ${curr.x},${curr.y} ${exitX},${exitY}`);
            } else {
                // No room for corner, just line
                pathParts.push(`L ${curr.x},${curr.y}`);
            }
        } else {
            // Same direction, just continue with line
            pathParts.push(`L ${curr.x},${curr.y}`);
        }
    }

    const fullPath = pathParts.join(' ');

    return (
        <BaseEdge
            id={id}
            path={fullPath}
            style={style}
            markerEnd={markerEnd}
            markerStart={markerStart}
        />
    );
}

export default memo(CustomSmartEdge);
