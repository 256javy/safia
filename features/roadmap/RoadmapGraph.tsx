"use client";

import { useProgressStore } from "@/stores/progress-store";
import { ROADMAP_NODES, ROADMAP_EDGES } from "./roadmap-data";
import { MOCK_MODULES } from "@/features/courses/mock-modules";
import { getModuleStatus } from "@/features/courses/module-status";
import type { ModuleStatus } from "@/types/module";
import { RoadmapNode } from "./RoadmapNode";
import { RoadmapEdge } from "./RoadmapEdge";

function getNodeStatus(slug: string, progress: ReturnType<typeof useProgressStore.getState>): ModuleStatus {
  const mod = MOCK_MODULES.find((m) => m.slug === slug);
  if (!mod) return "available";
  return getModuleStatus(mod, progress, MOCK_MODULES);
}

function getNodeProgress(slug: string, progress: ReturnType<typeof useProgressStore.getState>): number {
  const mod = MOCK_MODULES.find((m) => m.slug === slug);
  const moduleProgress = progress.modules[slug];
  if (!mod || !moduleProgress) return 0;
  const completed = Object.values(moduleProgress.lessons).filter((l) => l.completed).length;
  return completed / mod.lessons.length;
}

export function RoadmapGraph() {
  const progress = useProgressStore();

  const nodeMap = new Map(ROADMAP_NODES.map((n) => [n.slug, n]));

  return (
    <svg
      viewBox="0 0 900 420"
      className="w-full max-w-4xl"
      role="img"
      aria-label="Learning roadmap"
    >
      {/* Edges */}
      {ROADMAP_EDGES.map((edge, i) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;
        return (
          <RoadmapEdge
            key={`${edge.from}-${edge.to}`}
            from={from}
            to={to}
            index={i}
            nodeCount={ROADMAP_NODES.length}
          />
        );
      })}

      {/* Nodes */}
      {ROADMAP_NODES.map((node, i) => (
        <RoadmapNode
          key={node.slug}
          node={node}
          status={getNodeStatus(node.slug, progress)}
          progress={getNodeProgress(node.slug, progress)}
          index={i}
        />
      ))}
    </svg>
  );
}
