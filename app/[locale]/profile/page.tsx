"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useProgressStore } from "@/stores/progress-store";
import { XPCounter } from "@/features/gamification/XPCounter";
import { LevelBadge } from "@/features/gamification/LevelBadge";
import { StreakCounter } from "@/features/gamification/StreakCounter";
import { BadgeGrid } from "@/features/gamification/BadgeGrid";
import { GuestBanner } from "@/features/auth/GuestBanner";
import { DeleteAccountModal } from "@/features/auth/DeleteAccountModal";
import { MOCK_MODULES } from "@/features/courses/mock-modules";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function ModuleProgressCards() {
  const t = useTranslations("profile");
  const modules = useProgressStore((s) => s.modules);

  const started = MOCK_MODULES.filter((mod) => {
    const mp = modules[mod.slug];
    return mp && Object.values(mp.lessons).some((l) => l.completed);
  });

  if (started.length === 0) return null;

  return (
    <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.3 }}>
      <h3 className="mb-4 text-lg font-semibold text-text-primary">
        {t("moduleProgress")}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {started.map((mod) => {
          const mp = modules[mod.slug]!;
          const completed = Object.values(mp.lessons).filter((l) => l.completed).length;
          const total = mod.lessons.length;
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
          const xpEarned = Object.values(mp.lessons).reduce((sum, l) => sum + l.score, 0);

          return (
            <motion.div
              key={mod.slug}
              className="rounded-xl border border-accent/10 bg-bg-surface p-4 transition-all hover:border-accent/20"
              whileHover={{ scale: 1.01 }}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">{mod.icon}</span>
                <span className="font-medium text-text-primary">{mod.title}</span>
              </div>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-bg-base">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: percent === 100 ? "var(--color-success)" : "var(--gradient-xp-bar)",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-text-muted">
                <span>
                  {completed}/{total} {t("lessonsLabel")}
                </span>
                <span className="text-xp font-medium">{xpEarned} XP</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const { data: session, status } = useSession();
  const syncFromServer = useProgressStore((s) => s.syncFromServer);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/progress")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.progress_json) {
          syncFromServer(data.progress_json);
        }
      })
      .catch(() => {});
  }, [status, syncFromServer]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.h1
        className="mb-8 text-3xl font-bold text-text-primary sm:text-4xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {t("title")}
      </motion.h1>

      {status === "unauthenticated" && (
        <motion.div className="mb-8" variants={fadeIn} initial="hidden" animate="visible">
          <GuestBanner />
        </motion.div>
      )}

      {/* Hero stats */}
      <motion.div
        className="mb-8 grid gap-4 sm:grid-cols-3"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <XPCounter />
        <LevelBadge />
        <StreakCounter />
      </motion.div>

      {/* Badges */}
      <motion.div
        className="mb-8"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <BadgeGrid />
      </motion.div>

      {/* Module progress */}
      <div className="mb-8">
        <ModuleProgressCards />
      </div>

      {/* Delete account (auth only) */}
      {session && (
        <motion.div
          className="border-t border-accent/10 pt-8"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => setDeleteOpen(true)}
            className="text-sm text-destructive hover:underline"
          >
            {t("deleteAccount")}
          </button>
          <DeleteAccountModal
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
          />
        </motion.div>
      )}
    </main>
  );
}
