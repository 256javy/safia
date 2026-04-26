"use client";

import { useNow, useTranslations } from "next-intl";

interface Props {
  lastReviewed: string; // ISO YYYY-MM-DD
}

const STALE_AFTER_MS = 365 * 24 * 60 * 60 * 1000; // 12 months
const ARCHIVED_AFTER_MS = 547 * 24 * 60 * 60 * 1000; // ~18 months

/**
 * Renders a yellow banner when `last_reviewed` is older than 12 months,
 * per STYLE §6. The banner is self-contained — it shows nothing while
 * the content is within the freshness window.
 *
 * At 18 months STYLE §6 specifies archive + redirect; that redirect is
 * expected to happen at the routing layer, not inside the renderer.
 * This component renders a stronger warning for that edge case so the
 * user is not silently served stale material if a redirect is missed.
 */
export function FreshnessBanner({ lastReviewed }: Props) {
  const t = useTranslations("lesson");
  const now = useNow();

  const parsed = new Date(`${lastReviewed}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;

  const age = now.getTime() - parsed.getTime();
  if (age < STALE_AFTER_MS) return null;

  const archived = age >= ARCHIVED_AFTER_MS;

  return (
    <div
      role="status"
      className={`mb-6 rounded-xl border px-4 py-3 text-sm ${
        archived
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-warning/40 bg-warning/10 text-warning"
      }`}
    >
      {archived ? t("freshnessArchived") : t("freshnessStale")}
    </div>
  );
}
