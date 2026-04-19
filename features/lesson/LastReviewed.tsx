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

  const formatted = parsed.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <p className="mt-8 text-xs text-text-muted">
      {t("lastReviewed", { date: formatted })}
    </p>
  );
}
