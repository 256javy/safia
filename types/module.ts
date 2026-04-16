export type Difficulty = "basic" | "intermediate" | "advanced";

export interface ModuleLesson {
  slug: string;
  title: string;
  order: number;
}

export interface ModuleMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  xpTotal: number;
  prerequisites: string[];
  lessons: ModuleLesson[];
}

export type ModuleStatus = "locked" | "available" | "in-progress" | "completed";
