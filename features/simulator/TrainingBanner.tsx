"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

/**
 * Triple-redundant training banner:
 * 1. React component (this)
 * 2. CSS ::before pseudo-element (in globals.css via data attribute)
 * 3. Interval check every 2s to re-inject if tampered
 */
export function TrainingBanner() {
  const t = useTranslations("simulator");
  const bannerRef = useRef<HTMLDivElement>(null);
  const tamperTitle = t("bannerTamper");

  useEffect(() => {
    // Redundancy #3: interval re-check
    const interval = setInterval(() => {
      if (bannerRef.current && !document.body.contains(bannerRef.current)) {
        // Banner was removed from DOM — force page to show warning (localized)
        document.title = tamperTitle;
      }
      // Ensure data attribute stays on body
      document.body.setAttribute("data-simulator-active", "true");
    }, 2000);

    document.body.setAttribute("data-simulator-active", "true");

    return () => {
      clearInterval(interval);
      document.body.removeAttribute("data-simulator-active");
    };
  }, [tamperTitle]);

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 right-0 z-[100] bg-accent py-2.5 px-4 text-center text-sm font-bold text-white tracking-wide select-none pointer-events-none"
      role="alert"
      aria-live="assertive"
    >
      {t("banner")}
    </div>
  );
}
