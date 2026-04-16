"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useProgressStore } from "@/stores/progress-store";
import { BADGES } from "./badges";

export function BadgeGrid() {
  const t = useTranslations("gamification");
  const earnedBadges = useProgressStore((s) => s.badges);

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-text-primary">
        {t("badges")}
      </h3>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {BADGES.map((badge, i) => {
          const earned = earnedBadges.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                earned
                  ? "border-badge-gold/40 bg-badge-gold/10"
                  : "border-accent/5 bg-bg-elevated/30 opacity-40 grayscale"
              }`}
              title={t(`badges_list.${badge.descriptionKey}`)}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: earned ? 1 : 0.4, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              whileHover={earned ? { scale: 1.08 } : undefined}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-[10px] leading-tight text-text-secondary font-medium">
                {t(`badges_list.${badge.nameKey}`)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
