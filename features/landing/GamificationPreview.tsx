"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const badgeKeys = [
  { icon: "\u{1F511}", key: "badge1" },
  { icon: "\u{1F3A3}", key: "badge2" },
  { icon: "\u{1F6E1}\uFE0F", key: "badge3" },
  { icon: "\u2B50", key: "badge4" },
] as const;

export default function GamificationPreview() {
  const t = useTranslations("landing.gamification");

  return (
    <section className="py-24 px-6 bg-bg-surface/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">{t("heading")}</h2>
          <p className="mt-4 text-text-secondary text-lg">{t("subheading")}</p>
        </motion.div>

        <motion.div
          className="bg-bg-surface rounded-2xl p-8 border border-accent/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                3
              </div>
              <div>
                <p className="text-text-primary font-semibold text-sm">{t("level", { level: 3 })}</p>
                <p className="text-text-muted text-xs">{t("rank")}</p>
              </div>
            </div>
            <span className="text-xp font-bold text-lg">370 XP</span>
          </div>

          <div className="w-full h-3 rounded-full bg-bg-base overflow-hidden mb-8">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-xp-bar)" }}
              initial={{ width: 0 }}
              whileInView={{ width: "62%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badgeKeys.map((badge, i) => (
              <motion.div
                key={badge.key}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-bg-base/50 border border-accent/10"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
              >
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-xs text-text-secondary text-center font-medium">{t(badge.key)}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
