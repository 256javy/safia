"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";

const localeLabels: Record<string, string> = {
  es: "ES",
  en: "EN",
  pt: "PT",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1 text-xs">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="text-text-muted/40 mx-1">|</span>}
          <button
            onClick={() => handleChange(loc)}
            className={`transition-colors ${
              loc === locale
                ? "text-text-primary font-semibold"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {localeLabels[loc]}
          </button>
        </span>
      ))}
    </div>
  );
}
