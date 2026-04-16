"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function Footer() {
  const t = useTranslations("landing.footer");

  return (
    <footer className="py-12 px-6 border-t border-accent/10">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary text-lg">Safia</span>
          <span className="text-text-muted text-sm">— {t("tagline")}</span>
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
