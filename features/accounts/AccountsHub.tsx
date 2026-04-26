"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { useAccountsStore, type Platform } from "@/stores/accounts-store";
import { PLATFORM_IDS, PLATFORMS } from "@/features/simulator/platforms/registry";
import { AccountCard } from "./AccountCard";
import { PlatformPicker } from "./PlatformPicker";
import { PlatformLogo } from "./PlatformLogo";

type SortMode = "recent" | "platform" | "weakest";

function EmptyStateIllustration() {
  // Inline SVG: subtle constellation hinting at 4 platforms (4 dots + connecting curves).
  // Decorative — uses currentColor for theme awareness.
  return (
    <svg
      width="220"
      height="120"
      viewBox="0 0 220 120"
      fill="none"
      aria-hidden="true"
      className="mx-auto text-accent/30"
    >
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="110" cy="60" rx="100" ry="40" fill="url(#halo)" />
      <path
        d="M30 60 Q70 20 110 60 T190 60"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 4"
        fill="none"
      />
      <circle cx="30" cy="60" r="4" fill="currentColor" />
      <circle cx="83" cy="40" r="4" fill="currentColor" />
      <circle cx="137" cy="80" r="4" fill="currentColor" />
      <circle cx="190" cy="60" r="4" fill="currentColor" />
    </svg>
  );
}

export function AccountsHub() {
  const t = useTranslations("accounts");
  const tp = useTranslations("simulator.platforms");
  const accounts = useAccountsStore((s) => s.accounts);
  const [hydrated, setHydrated] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [filter, setFilter] = useState<Platform | "all">("all");
  const [sort, setSort] = useState<SortMode>("recent");

  useEffect(() => {
    // Hydration gate to avoid rendering persisted state before client mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  const visible = useMemo(() => {
    let arr = filter === "all" ? accounts : accounts.filter((a) => a.platform === filter);
    arr = [...arr];
    if (sort === "recent") arr.sort((a, b) => b.updatedAt - a.updatedAt);
    if (sort === "platform") arr.sort((a, b) => a.platform.localeCompare(b.platform));
    if (sort === "weakest") arr.sort((a, b) => a.password.strength - b.password.strength);
    return arr;
  }, [accounts, filter, sort]);

  if (!hydrated) {
    return <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" />;
  }

  if (accounts.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <EmptyStateIllustration />
          <h1
            className="mt-6 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {t("emptyTitle")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-text-secondary">
            {t("emptySubtitle")}
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
          }}
        >
          {PLATFORM_IDS.map((id) => (
            <motion.button
              key={id}
              onClick={() => (window.location.href = `/simulator/${id}/create`)}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border-subtle/70 bg-bg-surface p-5 text-center transition-colors duration-200 hover:border-accent/50 hover:bg-bg-elevated/60"
            >
              <PlatformLogo platform={id} size={44} />
              <span className="text-sm font-semibold text-text-primary">
                {tp(PLATFORMS[id].nameKey)}
              </span>
              <span className="text-[11px] text-text-muted transition-colors group-hover:text-accent-text">
                {t("createCta")}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {t("countLabel", { n: accounts.length })}
          </p>
        </div>
        <button
          onClick={() => setPickerOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:shadow-glow-strong"
          style={{ background: "var(--gradient-accent)" }}
        >
          <span aria-hidden="true" className="text-base leading-none">+</span>
          {t("newAccount")}
        </button>
      </div>

      {/* Filters / sort */}
      <div className="mt-7 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-accent text-white"
              : "border border-border-subtle/70 text-text-secondary hover:border-accent/40 hover:text-text-primary"
          }`}
        >
          {t("filterAll")}
        </button>
        {PLATFORM_IDS.map((id) =>
          accounts.some((a) => a.platform === id) ? (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === id
                  ? "bg-accent text-white"
                  : "border border-border-subtle/70 text-text-secondary hover:border-accent/40 hover:text-text-primary"
              }`}
            >
              {tp(PLATFORMS[id].nameKey)}
            </button>
          ) : null,
        )}

        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="rounded-md border border-border-subtle/70 bg-bg-surface px-2 py-1 text-xs text-text-secondary transition-colors hover:border-accent/40"
          >
            <option value="recent">{t("sortRecent")}</option>
            <option value="platform">{t("sortPlatform")}</option>
            <option value="weakest">{t("sortWeakest")}</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <AnimatePresence>
          {visible.map((acc) => (
            <AccountCard key={acc.id} account={acc} />
          ))}
        </AnimatePresence>
      </div>

      <PlatformPicker open={pickerOpen} onClose={() => setPickerOpen(false)} />
    </main>
  );
}
