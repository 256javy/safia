export type NodeCategory = "mandatory" | "recommended" | "optional";

export interface RoadmapNodeDef {
  slug: string;
  titleKey: string;
  icon: string;
  category: NodeCategory;
  prerequisites: string[];
  x: number;
  y: number;
}

export interface RoadmapEdgeDef {
  from: string;
  to: string;
}

export const ROADMAP_NODES: RoadmapNodeDef[] = [
  // Entry points (no prerequisites)
  { slug: "passwords", titleKey: "passwords", icon: "🔑", category: "mandatory", prerequisites: [], x: 150, y: 60 },
  { slug: "phishing", titleKey: "phishing", icon: "🎣", category: "mandatory", prerequisites: [], x: 450, y: 60 },
  { slug: "wifi-security", titleKey: "wifiSecurity", icon: "📡", category: "recommended", prerequisites: [], x: 750, y: 60 },
  { slug: "social-media", titleKey: "socialMedia", icon: "📱", category: "optional", prerequisites: [], x: 150, y: 340 },
  { slug: "device-security", titleKey: "deviceSecurity", icon: "💻", category: "optional", prerequisites: [], x: 750, y: 340 },

  // Dependent nodes
  { slug: "mfa", titleKey: "mfa", icon: "🛡️", category: "mandatory", prerequisites: ["passwords"], x: 150, y: 200 },
  { slug: "pass-manager", titleKey: "passManager", icon: "🗄️", category: "recommended", prerequisites: ["passwords"], x: 300, y: 200 },
  { slug: "social-engineering", titleKey: "socialEngineering", icon: "🎭", category: "recommended", prerequisites: ["phishing"], x: 450, y: 200 },

  // Advanced
  { slug: "simulators", titleKey: "simulators", icon: "⚔️", category: "mandatory", prerequisites: ["mfa", "social-engineering"], x: 300, y: 340 },
];

export const ROADMAP_EDGES: RoadmapEdgeDef[] = ROADMAP_NODES.flatMap((node) =>
  node.prerequisites.map((prereq) => ({ from: prereq, to: node.slug })),
);

export const categoryColors: Record<NodeCategory, string> = {
  mandatory: "#ef4444",
  recommended: "#f59e0b",
  optional: "#22c55e",
};
