"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useProgressStore } from "@/stores/progress-store";

function getFlameSize(streak: number): string {
  if (streak >= 30) return "text-4xl";
  if (streak >= 7) return "text-3xl";
  return "text-xl";
}

interface StreakCounterProps {
  freezeTokens?: number;
}

export function StreakCounter({ freezeTokens = 0 }: StreakCounterProps) {
  const t = useTranslations("gamification");
  const streak = useProgressStore((s) => s.streak);
  const size = getFlameSize(streak);

  return (
    <div className="rounded-xl border border-accent/10 bg-bg-surface p-4">
      <div className="flex items-center gap-3">
        <motion.span
          className={`${size} inline-block`}
          animate={streak > 0 ? { scale: [1, 1.1, 1], rotate: [0, 3, -3, 0] } : undefined}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          {"\u{1F525}"}
        </motion.span>
        <div>
          <p className="font-bold text-lg text-text-primary">{streak}</p>
          <p className="text-xs text-text-muted">
            {t("streakDays", { count: streak })}
          </p>
        </div>
      </div>

      {freezeTokens > 0 && (
        <div className="mt-3 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`text-sm ${i < freezeTokens ? "opacity-100" : "opacity-25"}`}
              aria-hidden="true"
            >
              {"\u{2744}\uFE0F"}
            </span>
          ))}
          <span className="text-text-muted text-xs ml-1">
            {freezeTokens}/3
          </span>
        </div>
      )}
    </div>
  );
}
