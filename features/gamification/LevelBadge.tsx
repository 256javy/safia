"use client";

import { useTranslations } from "next-intl";
import { useProgressStore } from "@/stores/progress-store";
import { getLevelForXp } from "./levels";

export function LevelBadge() {
  const t = useTranslations("gamification");
  const xp = useProgressStore((s) => s.xp);
  const level = getLevelForXp(xp);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-bg-surface p-4">
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-white"
        style={{ background: "var(--gradient-accent)" }}
      >
        {level.level}
      </div>
      <div>
        <p className="text-sm text-text-muted">{t("level")}</p>
        <p className="font-semibold text-text-primary">
          {t(`levels.${level.nameKey}`)}
        </p>
      </div>
    </div>
  );
}
