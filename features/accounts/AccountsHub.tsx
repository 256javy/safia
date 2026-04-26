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
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">{t("emptyTitle")}</h1>
          <p className="mt-3 text-text-secondary">{t("emptySubtitle")}</p>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PLATFORM_IDS.map((id) => (
            <motion.button
              key={id}
              onClick={() => (window.location.href = `/simulator/${id}/create`)}
              whileHover={{ y: -2 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-accent/10 bg-bg-surface p-5 text-center transition-colors hover:border-accent/40"
            >
              <PlatformLogo platform={id} size={48} />
              <span className="text-sm font-semibold text-text-primary">{tp(PLATFORMS[id].nameKey)}</span>
              <span className="text-[11px] text-text-muted">{t("createCta")}</span>
            </motion.button>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">{t("title")}</h1>
          <p className="text-sm text-text-secondary">{t("countLabel", { n: accounts.length })}</p>
        </div>
        <button
          onClick={() => setPickerOpen(true)}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-glow transition-all hover:scale-[1.02]"
          style={{ background: "var(--gradient-accent)" }}
        >
          + {t("newAccount")}
        </button>
      </div>

      {/* Filters / sort */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-accent text-white"
              : "border border-accent/15 text-text-secondary hover:border-accent/40"
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
                  : "border border-accent/15 text-text-secondary hover:border-accent/40"
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
            className="rounded-md border border-accent/15 bg-bg-surface px-2 py-1 text-xs text-text-secondary"
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
