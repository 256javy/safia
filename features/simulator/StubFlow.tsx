"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { TrainingBanner } from "./TrainingBanner";

export function StubFlow({ flow }: { flow: string }) {
  const t = useTranslations("simulator.stub");
  return (
    <>
      <TrainingBanner />
      <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl">🚧</div>
        <h1 className="mt-4 text-2xl font-bold text-text-primary">{t("title")}</h1>
        <p className="mt-2 text-sm text-text-secondary">{t("subtitle")}</p>
        <p className="mt-1 text-xs text-text-muted">Flujo: {flow}</p>
        <Link
          href="/accounts"
          className="mt-6 rounded-xl border border-accent/20 px-5 py-2 text-sm text-text-secondary hover:border-accent/40 hover:text-text-primary"
        >
          {t("back")}
        </Link>
      </main>
    </>
  );
}
