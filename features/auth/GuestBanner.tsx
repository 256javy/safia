"use client";

import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";

export function GuestBanner() {
  const t = useTranslations("auth");

  return (
    <div className="rounded-xl border border-warning/30 bg-warning/10 p-6 text-center">
      <p className="mb-4 text-lg font-semibold text-text-primary">
        {t("guestBanner")}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {["google", "github", "apple"].map((provider) => (
          <button
            key={provider}
            onClick={() => signIn(provider)}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {t("signInWith", { provider: provider.charAt(0).toUpperCase() + provider.slice(1) })}
          </button>
        ))}
      </div>
    </div>
  );
}
