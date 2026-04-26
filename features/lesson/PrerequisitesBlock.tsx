"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

interface Prereq {
  /** Slug of a prerequisite lesson (matches the `assumes` frontmatter). */
  slug: string;
  /** Human title; falls back to slug when not available. */
  title?: string;
  /** Module slug the prerequisite lives in, so we can link correctly. */
  moduleSlug?: string;
}

interface Props {
  prereqs: Prereq[];
}

/**
 * Renders the "Este contenido asume que ya…" block from STYLE §10.
 * If `prereqs` is empty, renders nothing — this is how a standalone
 * lesson declares itself as such.
 */
export function PrerequisitesBlock({ prereqs }: Props) {
  const t = useTranslations("lesson");
  if (!prereqs.length) return null;

  return (
    <aside
      aria-label={t("prereqsHeading")}
      className="mb-8 rounded-xl border border-accent/20 bg-accent/5 p-4"
    >
      <p className="mb-2 text-sm font-semibold text-text-primary">
        {t("prereqsHeading")}
      </p>
      <ul className="space-y-1 text-sm text-text-secondary">
        {prereqs.map((p) => {
          const label = p.title ?? p.slug;
          const href =
            p.moduleSlug
              ? `/courses/${p.moduleSlug}/${p.slug}`
              : `/courses/${p.slug}`;
          return (
            <li key={`${p.moduleSlug ?? ""}/${p.slug}`} className="flex items-baseline gap-2">
              <span aria-hidden className="text-accent">↳</span>
              <Link
                href={href}
                className="underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
