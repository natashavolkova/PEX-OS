'use client';

import { EdgeProps, BezierEdge, useNodes } from '@xyflow/react';
import { getSmartEdge } from '@jalez/react-flow-smart-edge';

/**
 * SmartPathEdge - Custom edge that uses A* pathfinding to route around nodes
 * 
 * This edge uses the getSmartEdge function from @jalez/react-flow-smart-edge
 * with custom configuration for better obstacle detection and avoidance.
 */
const SmartPathEdge = (props: EdgeProps) => {
    const {
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        style,
        markerEnd,
        markerStart,
    } = props;

    // Get all nodes for pathfinding collision detection
    const nodes = useNodes();

    // Call getSmartEdge with optimized pathfinding options
    const result = getSmartEdge({
        sourcePosition,
        targetPosition,
        sourceX,
        sourceY,
        targetX,
        targetY,
        nodes,
        options: {
            nodePadding: 25,  // Increased padding around nodes for better avoidance
            gridRatio: 5,     // Smaller grid cells for more accurate pathfinding
        }
    });

    // Fallback to BezierEdge if getSmartEdge fails to find a valid path
    if (result === null) {
        console.warn(`[SmartPathEdge] No valid path for edge ${id}, using fallback`);
        return <BezierEdge {...props} />;
    }

    const { svgPathString } = result;

    return (
        <path
            id={id}
            className="react-flow__edge-path"
            d={svgPathString}
            style={style}
            markerEnd={markerEnd as string | undefined}
            markerStart={markerStart as string | undefined}
        />
    );
};

export default SmartPathEdge;
