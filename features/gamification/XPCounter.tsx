"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useProgressStore } from "@/stores/progress-store";
import { getLevelForXp, getXpForNextLevel } from "./levels";

export function XPCounter() {
  const t = useTranslations("gamification");
  const xp = useProgressStore((s) => s.xp);
  const level = getLevelForXp(xp);
  const nextLevel = getXpForNextLevel(xp);
  const percent = nextLevel ? (nextLevel.current / nextLevel.needed) * 100 : 100;

  return (
    <div className="rounded-xl border border-accent/10 bg-bg-surface p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: "var(--gradient-accent)" }}
          >
            {level.level}
          </div>
          <div>
            <p className="font-semibold text-sm text-text-primary">
              {t(`levels.${level.nameKey}`)}
            </p>
            <p className="text-xs text-text-muted">
              {t("level")} {level.level}
            </p>
          </div>
        </div>
        <span className="text-xp font-bold text-lg">{xp} {t("xp")}</span>
      </div>

      {nextLevel && (
        <>
          <div className="h-2.5 overflow-hidden rounded-full bg-bg-base">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-xp-bar)" }}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
          <p className="mt-1.5 text-xs text-text-muted text-right">
            {nextLevel.current} / {nextLevel.needed} {t("xp")}
          </p>
        </>
      )}
    </div>
  );
}
