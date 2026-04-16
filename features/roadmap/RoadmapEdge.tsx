"use client";

import { motion } from "framer-motion";
import type { RoadmapNodeDef } from "./roadmap-data";

interface RoadmapEdgeProps {
  from: RoadmapNodeDef;
  to: RoadmapNodeDef;
  index: number;
  nodeCount: number;
}

const NODE_RADIUS = 36;

export function RoadmapEdge({ from, to, index, nodeCount }: RoadmapEdgeProps) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / dist;
  const ny = dy / dist;

  const x1 = from.x + nx * NODE_RADIUS;
  const y1 = from.y + ny * NODE_RADIUS;
  const x2 = to.x - nx * NODE_RADIUS;
  const y2 = to.y - ny * NODE_RADIUS;

  const pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
  const pathLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return (
    <motion.path
      d={pathD}
      stroke="rgba(139, 92, 246, 0.3)"
      strokeWidth={2}
      fill="none"
      strokeDasharray={pathLength}
      strokeDashoffset={pathLength}
      animate={{ strokeDashoffset: 0 }}
      transition={{
        duration: 0.6,
        delay: nodeCount * 0.05 + index * 0.1,
        ease: "easeOut" as const,
      }}
    />
  );
}
