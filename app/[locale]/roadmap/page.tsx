"use client";

import { useTranslations } from "next-intl";
import { RoadmapGraph } from "@/features/roadmap/RoadmapGraph";

export default function RoadmapPage() {
  const t = useTranslations("roadmap");

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-text-secondary">{t("subtitle")}</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-destructive" /> {t("mandatory")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-warning" /> {t("recommended")}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full bg-success" /> {t("optional")}
        </span>
      </div>

      <div className="flex justify-center">
        <RoadmapGraph />
      </div>
    </main>
  );
}
