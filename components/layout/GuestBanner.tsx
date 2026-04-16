"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export function GuestBanner() {
  const t = useTranslations("auth");

  return (
    <div className="rounded-xl border border-warning/20 bg-warning/5 p-4 text-center">
      <p className="text-sm text-text-secondary mb-2">
        {t("guestBanner")}
      </p>
      <Link
        href="/auth/signin"
        className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
        style={{ background: "var(--gradient-accent)" }}
      >
        {t("signIn")}
      </Link>
    </div>
  );
}
