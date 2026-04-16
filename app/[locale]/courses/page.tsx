"use client";

import { useTranslations } from "next-intl";
import { MOCK_MODULES } from "@/features/courses/mock-modules";
import { ModuleCard } from "@/features/courses/ModuleCard";
import { CoachMarks } from "@/features/courses/CoachMarks";

export default function CoursesPage() {
  const t = useTranslations("courses");

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-text-secondary">{t("explore")}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_MODULES.map((mod) => (
          <div
            key={mod.slug}
            data-coach={mod.slug === "passwords" ? "passwords-card" : undefined}
          >
            <ModuleCard module={mod} />
          </div>
        ))}
      </div>

      <CoachMarks />
    </main>
  );
}
