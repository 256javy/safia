"use client";

import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { useProgressStore } from "@/stores/progress-store";
import { TrackCompletionDetector } from "@/features/certificates";
import type { ModuleMeta } from "@/types/module";

interface Props {
  module: ModuleMeta;
}

export function ModuleOverview({ module }: Props) {
  const t = useTranslations("courses");
  const progress = useProgressStore();
  const moduleProgress = progress.modules[module.slug];

  const difficultyColors: Record<string, string> = {
    basic: "bg-success/20 text-success",
    intermediate: "bg-warning/20 text-warning",
    advanced: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-secondary">
          {t("home")}
        </Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-text-secondary">
          {t("title")}
        </Link>
        <span>/</span>
        <span className="text-text-primary">{module.title}</span>
      </nav>

      {/* Module header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <span className="text-4xl">{module.icon}</span>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">
              {module.title}
            </h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-text-muted">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[module.difficulty]}`}
              >
                {module.difficulty === "basic"
                  ? t("difficultyBasic")
                  : module.difficulty === "intermediate"
                    ? t("difficultyIntermediate")
                    : t("difficultyAdvanced")}
              </span>
              <span>⏱ {module.estimatedMinutes} min</span>
            </div>
          </div>
        </div>
        <p className="text-text-secondary">{module.description}</p>
      </div>

      {/* Lessons list */}
      <div className="space-y-3">
        <h2 className="mb-4 text-xl font-semibold text-text-primary">
          {t("lessonsHeading")}
        </h2>
        {module.lessons.map((lesson, idx) => {
          const isCompleted =
            moduleProgress?.lessons[lesson.slug]?.completed ?? false;
          const prevCompleted =
            idx === 0 ||
            (moduleProgress?.lessons[module.lessons[idx - 1].slug]?.completed ?? false);
          const isAvailable = idx === 0 || prevCompleted;

          return (
            <div key={lesson.slug}>
              {isAvailable ? (
                <Link
                  href={`/courses/${module.slug}/${lesson.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-white/10 bg-bg-surface p-4 transition-all hover:border-accent/40 hover:shadow-[var(--shadow-glow)]"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      isCompleted
                        ? "bg-success/20 text-success"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    {isCompleted ? "✓" : idx + 1}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary">
                      {lesson.title}
                    </span>
                    {isCompleted && (
                      <span className="ml-2 text-xs text-success">
                        {t("lessonCompleted")}
                      </span>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-bg-surface/50 p-4 opacity-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-sm font-bold text-text-muted">
                    🔒
                  </div>
                  <span className="text-sm text-text-muted">{lesson.title}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <TrackCompletionDetector moduleSlug={module.slug} />
    </div>
  );
}
