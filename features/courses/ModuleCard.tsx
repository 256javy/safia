"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { ModuleMeta, ModuleStatus } from "@/types/module";
import { useProgressStore } from "@/stores/progress-store";
import { MOCK_MODULES } from "./mock-modules";
import { getModuleStatus } from "./module-status";

const difficultyColors: Record<string, string> = {
  basic: "bg-success/20 text-success",
  intermediate: "bg-warning/20 text-warning",
  advanced: "bg-destructive/20 text-destructive",
};


const statusStyles: Record<ModuleStatus, string> = {
  locked: "opacity-60 cursor-not-allowed",
  available: "hover:border-accent/50 hover:shadow-[var(--shadow-glow)] cursor-pointer",
  "in-progress": "border-accent/40 hover:border-accent/60 hover:shadow-[var(--shadow-glow)] cursor-pointer",
  completed: "border-success/40 cursor-pointer",
};

interface ModuleCardProps {
  module: ModuleMeta;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const t = useTranslations("courses");
  const progress = useProgressStore();
  const status = getModuleStatus(module, progress, MOCK_MODULES);

  const moduleProgress = progress.modules[module.slug];
  const completedLessons = moduleProgress
    ? Object.values(moduleProgress.lessons).filter((l) => l.completed).length
    : 0;

  const card = (
    <div
      className={`relative rounded-xl border border-white/10 bg-bg-surface p-6 transition-all duration-200 ${statusStyles[status]}`}
    >
      {status === "locked" && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-bg-base/60 backdrop-blur-sm">
          <span className="text-3xl">🔒</span>
        </div>
      )}

      <div className="mb-4 flex items-start justify-between">
        <span className="text-3xl">{module.icon}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[module.difficulty]}`}
        >
          {module.difficulty === "basic"
            ? t("difficultyBasic")
            : module.difficulty === "intermediate"
              ? t("difficultyIntermediate")
              : t("difficultyAdvanced")}
        </span>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-text-primary">
        {module.title}
      </h3>
      <p className="mb-4 text-sm text-text-secondary line-clamp-2">
        {module.description}
      </p>

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span>⏱ {module.estimatedMinutes} min</span>
        <span>⭐ {module.xpTotal} XP</span>
        <span>
          📖 {completedLessons}/{module.lessons.length} {t("lessons")}
        </span>
      </div>

      {status === "in-progress" && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-bg-elevated">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(completedLessons / module.lessons.length) * 100}%`,
              background: "var(--gradient-xp-bar)",
            }}
          />
        </div>
      )}

      {status === "completed" && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-success">
          <span>✓</span> {t("completed")}
        </div>
      )}
    </div>
  );

  if (status === "locked") return card;

  return (
    <Link href={`/courses/${module.slug}`} className="block">
      {card}
    </Link>
  );
}
