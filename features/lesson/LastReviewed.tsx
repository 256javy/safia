"use client";

import { useTranslations, useLocale } from "next-intl";

interface Props {
  date: string; // ISO YYYY-MM-DD
}

/**
 * Renders "Revisado por última vez el X" in the lesson footer.
 * Required by VISION §6 (Freshness as editorial promise) and operationalized
 * in STYLE §6.
 */
export function LastReviewed({ date }: Props) {
  const t = useTranslations("lesson");
  const locale = useLocale();

  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;

  // Format in UTC so the rendered date matches the `last_reviewed` string
  // in frontmatter regardless of the reader's timezone. Without this, a
  // frontmatter date of 2026-04-19 renders as "18 de abril" for anyone
  // west of UTC — an off-by-one that erodes trust in the freshness label.
  const formatted = parsed.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <p className="mt-8 text-xs text-text-muted">
      {t("lastReviewed", { date: formatted })}
    </p>
  );
}
