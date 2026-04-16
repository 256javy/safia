"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { PLATFORMS } from "@/features/simulator/platforms";
import { PracticeAccountManager } from "@/features/simulator/PracticeAccountManager";

export default function SimulatorIndexPage() {
  const t = useTranslations("simulator");

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.h1
        className="mb-2 text-3xl font-bold text-text-primary sm:text-4xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {t("title")}
      </motion.h1>
      <motion.p
        className="mb-10 text-text-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {t("subtitle")}
      </motion.p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(PLATFORMS).map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link
              href={`/simulator/${p.id}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-accent/10 bg-bg-surface p-6 text-center transition-all hover:border-accent/30 hover:shadow-glow"
            >
              <span className="text-4xl">{p.icon}</span>
              <span className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                {t(`platforms.${p.id}`)}
              </span>
              <span className="text-xs text-text-muted">
                {t("steps", { count: p.steps.length })}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Practice accounts vault */}
      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-text-primary mb-6">{t("vault")}</h2>
        <PracticeAccountManager />
      </motion.div>
    </main>
  );
}
