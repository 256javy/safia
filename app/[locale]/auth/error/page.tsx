"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function AuthErrorPage() {
  const t = useTranslations("auth.errorPage");

  return (
    <main
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12"
      style={{ background: "var(--gradient-hero)" }}
    >
      <motion.div
        className="w-full max-w-sm text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
          <span className="text-3xl">&#x26A0;&#xFE0F;</span>
        </div>

        <h1 className="text-2xl font-bold text-text-primary">{t("title")}</h1>
        <p className="mt-2 text-text-secondary text-sm">{t("subtitle")}</p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white text-sm transition-all hover:scale-105"
            style={{ background: "var(--gradient-accent)" }}
          >
            {t("tryAgain")}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-accent/20 px-6 py-3 text-sm font-medium text-text-secondary transition-all hover:border-accent/40 hover:text-text-primary"
          >
            {t("backHome")}
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
