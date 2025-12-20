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

    // Build path with waypoints using line segments with rounded corners
    const pathSegments: string[] = [];

    // Start at source
    pathSegments.push(`M ${sourceX},${sourceY}`);

    // Add each waypoint
    waypoints.forEach((point, index) => {
        if (index === 0) {
            // First segment: curve from source to first waypoint
            const midY = (sourceY + point.y) / 2;
            pathSegments.push(`C ${sourceX},${midY} ${point.x},${midY} ${point.x},${point.y}`);
        } else {
            // Subsequent segments: lines with rounded corners
            const prevPoint = waypoints[index - 1];
            const cornerRadius = 8;

            // Determine corner direction
            const dx = point.x - prevPoint.x;
            const dy = point.y - prevPoint.y;

            if (Math.abs(dx) > 1 && Math.abs(dy) > 1) {
                // Diagonal - use curve
                pathSegments.push(`Q ${prevPoint.x},${point.y} ${point.x},${point.y}`);
            } else {
                // Straight line
                pathSegments.push(`L ${point.x},${point.y}`);
            }
        }
    });

    // Final segment to target
    const lastWaypoint = waypoints[waypoints.length - 1];
    const midY = (lastWaypoint.y + targetY) / 2;
    pathSegments.push(`C ${lastWaypoint.x},${midY} ${targetX},${midY} ${targetX},${targetY}`);

    const fullPath = pathSegments.join(' ');

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
