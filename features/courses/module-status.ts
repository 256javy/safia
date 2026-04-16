import type { ModuleMeta, ModuleStatus } from "@/types/module";
import type { ProgressState } from "@/stores/progress-store";

export function getModuleStatus(
  mod: ModuleMeta,
  progress: Pick<ProgressState, "modules">,
  allModules: ModuleMeta[],
): ModuleStatus {
  const moduleProgress = progress.modules[mod.slug];

  if (moduleProgress) {
    const completedCount = Object.values(moduleProgress.lessons).filter(
      (l) => l.completed,
    ).length;
    if (completedCount >= mod.lessons.length) return "completed";
    if (completedCount > 0) return "in-progress";
  }

  if (mod.prerequisites.length > 0) {
    const allPrereqsMet = mod.prerequisites.every((prereqSlug) => {
      const prereq = allModules.find((m) => m.slug === prereqSlug);
      if (!prereq) return false;
      const prereqProgress = progress.modules[prereqSlug];
      if (!prereqProgress) return false;
      const completedCount = Object.values(prereqProgress.lessons).filter(
        (l) => l.completed,
      ).length;
      return completedCount >= prereq.lessons.length;
    });
    if (!allPrereqsMet) return "locked";
  }

  return "available";
}
