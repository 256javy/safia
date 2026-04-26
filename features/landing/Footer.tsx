"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

const SOCIALS = [
  {
    key: "instagram",
    label: "Instagram",
    href: "https://instagram.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: "tiktok",
    label: "TikTok",
    href: "https://tiktok.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16.5 3a4.5 4.5 0 0 0 4.5 4.5v3a7.4 7.4 0 0 1-4.5-1.5v6.4a6.1 6.1 0 1 1-6.1-6.1c.3 0 .6 0 .9.1V12a3.1 3.1 0 1 0 2.2 3V3h3Z" />
      </svg>
    ),
  },
  {
    key: "x",
    label: "X",
    href: "https://x.com/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.7 3h3.2l-7 8 8.2 10h-6.4l-5-6.5L4.9 21H1.7l7.5-8.6L1.3 3h6.5l4.6 6L17.7 3Zm-1.1 16.2h1.8L7.5 4.7H5.6l11 14.5Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const t = useTranslations("landing.footer");
  const tFollow = useTranslations("landing.follow");

  return (
    <footer className="py-12 px-6 border-t border-accent/10">
      <div className="max-w-5xl mx-auto flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary text-lg">Safia</span>
          <span className="text-text-muted text-sm">— {t("tagline")}</span>
        </div>

        <div className="flex items-center gap-3 text-text-secondary">
          {SOCIALS.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${tFollow("ctaFollow")} ${s.label}`}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-accent/15 bg-bg-surface hover:text-text-primary hover:border-accent/40 transition-colors"
            >
              <span className="w-4 h-4">{s.icon}</span>
            </a>
          ))}
        </div>

        <nav className="flex flex-wrap items-center gap-6 text-sm text-text-secondary">
          <a
            href="https://github.com/safia-platform/safia"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-primary transition-colors"
          >
            {t("github")}
          </a>
          <Link href="/legal/privacy" className="hover:text-text-primary transition-colors">
            {t("privacy")}
          </Link>
          <Link href="/legal/terms" className="hover:text-text-primary transition-colors">
            {t("terms")}
          </Link>
          <Link href="/settings" className="hover:text-text-primary transition-colors">
            {t("settings")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
