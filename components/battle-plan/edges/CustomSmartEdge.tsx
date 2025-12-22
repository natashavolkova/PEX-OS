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

    const cornerRadius = 10;
    const pathParts: string[] = [];

    // Start at first point
    pathParts.push(`M ${allPoints[0].x},${allPoints[0].y}`);

    // Draw orthogonal path with rounded corners
    for (let i = 1; i < allPoints.length; i++) {
        const prev = allPoints[i - 1];
        const curr = allPoints[i];
        const next = allPoints[i + 1];

        if (!next) {
            // Last segment - just line to target
            pathParts.push(`L ${curr.x},${curr.y}`);
        } else {
            // Calculate corner
            const dx1 = curr.x - prev.x;
            const dy1 = curr.y - prev.y;
            const dx2 = next.x - curr.x;
            const dy2 = next.y - curr.y;

            // Distance to corner point
            const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
            const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            // Limit corner radius to half the segment length
            const r = Math.min(cornerRadius, len1 / 2, len2 / 2);

            if (r > 1 && len1 > 2 && len2 > 2) {
                // Calculate corner entry and exit points
                const enterX = curr.x - (dx1 / len1) * r;
                const enterY = curr.y - (dy1 / len1) * r;
                const exitX = curr.x + (dx2 / len2) * r;
                const exitY = curr.y + (dy2 / len2) * r;

                // Line to corner entry, then arc to exit
                pathParts.push(`L ${enterX},${enterY}`);
                pathParts.push(`Q ${curr.x},${curr.y} ${exitX},${exitY}`);
            } else {
                // No room for corner, just line
                pathParts.push(`L ${curr.x},${curr.y}`);
            }
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
