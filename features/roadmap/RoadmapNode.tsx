"use client";

import { motion } from "framer-motion";
import type { ModuleStatus } from "@/types/module";
import type { RoadmapNodeDef } from "./roadmap-data";
import { categoryColors } from "./roadmap-data";

interface RoadmapNodeProps {
  node: RoadmapNodeDef;
  status: ModuleStatus;
  progress: number;
  index: number;
}

export function RoadmapNode({ node, status, progress, index }: RoadmapNodeProps) {
  const catColor = categoryColors[node.category];

  const statusStyles: Record<ModuleStatus, { ring: string; bg: string; opacity: string }> = {
    locked: { ring: "stroke-text-muted", bg: "fill-bg-elevated", opacity: "opacity-50" },
    available: { ring: `stroke-[${catColor}]`, bg: "fill-bg-surface", opacity: "opacity-100" },
    "in-progress": { ring: `stroke-[${catColor}]`, bg: "fill-bg-surface", opacity: "opacity-100" },
    completed: { ring: "stroke-badge-gold", bg: "fill-bg-surface", opacity: "opacity-100" },
  };

  const s = statusStyles[status];

  return (
    <motion.g
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" as const }}
      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
    >
      {/* Background circle */}
      <circle
        cx={node.x}
        cy={node.y}
        r={36}
        className={`${s.bg} ${s.opacity}`}
        stroke={catColor}
        strokeWidth={status === "locked" ? 1 : 2.5}
        strokeOpacity={status === "locked" ? 0.3 : 1}
      />

      {/* Progress ring for in-progress */}
      {status === "in-progress" && (
        <circle
          cx={node.x}
          cy={node.y}
          r={36}
          fill="none"
          stroke={catColor}
          strokeWidth={3}
          strokeDasharray={`${progress * 226} 226`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(-90 ${node.x} ${node.y})`}
          opacity={0.8}
        />
      )}

      {/* Pulsing glow for available */}
      {status === "available" && (
        <motion.circle
          cx={node.x}
          cy={node.y}
          r={40}
          fill="none"
          stroke={catColor}
          strokeWidth={1.5}
          animate={{ opacity: [0.2, 0.6, 0.2], r: [40, 44, 40] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Icon */}
      <text
        x={node.x}
        y={node.y + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={22}
        className={s.opacity}
      >
        {status === "locked" ? "🔒" : status === "completed" ? "✅" : node.icon}
      </text>

      {/* Label */}
      <text
        x={node.x}
        y={node.y + 54}
        textAnchor="middle"
        className={`fill-text-secondary text-xs ${s.opacity}`}
        fontSize={11}
        fontWeight={500}
      >
        {node.titleKey}
      </text>

      {/* Category dot */}
      <circle
        cx={node.x + 28}
        cy={node.y - 28}
        r={4}
        fill={catColor}
        className={s.opacity}
      />
    </motion.g>
  );
}
