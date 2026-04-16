"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { Link } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { Header } from "@/components/layout/Header";
import Footer from "@/features/landing/Footer";

const localeLabels: Record<string, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
};

const themeValues = ["dark", "light", "system"] as const;


function DeleteAccountDialog({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const t = useTranslations("settings");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-bg-surface p-8 shadow-xl">
        <h3 className="text-xl font-bold text-text-primary mb-2">
          {t("deleteTitle")}
        </h3>
        <p className="text-text-secondary text-sm mb-6">
          {t("deleteDesc")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-accent/20 px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary disabled:opacity-50"
          >
            {t("deleteCancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-xl bg-destructive px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-destructive/90 disabled:opacity-50"
          >
            {loading ? t("deleting") : t("deleteConfirm")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleLocaleChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  async function handleDeleteAccount() {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/me", { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar la cuenta");
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error inesperado");
      setDeleteLoading(false);
    }
  }

  // Detect provider name — session.user only exposes `id` in this app
  const providerName = session ? "OAuth" : null;

  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary">
      <Header />

      {showDeleteDialog && (
        <DeleteAccountDialog
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteDialog(false)}
          loading={deleteLoading}
        />
      )}

      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold mb-12">{t("title")}</h1>

        <div className="space-y-6">

          {/* Idioma */}
          <section className="rounded-xl border border-accent/10 bg-bg-surface p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-1">
              {t("languageTitle")}
            </h2>
            <p className="text-sm text-text-muted mb-4">
              {t("languageDesc")}
            </p>
            <div className="flex flex-wrap gap-2">
              {routing.locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    loc === locale
                      ? "bg-accent text-white"
                      : "border border-accent/20 text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  }`}
                >
                  {localeLabels[loc]}
                </button>
              ))}
            </div>
          </section>

          {/* Apariencia */}
          <section className="rounded-xl border border-accent/10 bg-bg-surface p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-1">
              {t("appearanceTitle")}
            </h2>
            <p className="text-sm text-text-muted mb-4">
              {t("appearanceDesc")}
            </p>
            <div className="flex flex-wrap gap-2">
              {themeValues.map((value) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    theme === value
                      ? "bg-accent text-white"
                      : "border border-accent/20 text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                  }`}
                >
                  {t(value === "dark" ? "themeDark" : value === "light" ? "themeLight" : "themeSystem")}
                </button>
              ))}
            </div>
          </section>

          {/* Cuenta (solo si hay sesión) */}
          {session && (
            <section className="rounded-xl border border-accent/10 bg-bg-surface p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-1">
                {t("accountTitle")}
              </h2>
              <p className="text-sm text-text-muted mb-4">
                {t("accountConnected", { provider: providerName ?? "OAuth" })}
              </p>

              {deleteError && (
                <p className="mb-4 text-sm text-destructive">{deleteError}</p>
              )}

              <button
                onClick={() => setShowDeleteDialog(true)}
                className="rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                {t("deleteAccount")}
              </button>
            </section>
          )}

          {/* Simuladores */}
          <section className="rounded-xl border border-accent/10 bg-bg-surface p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-1">
              {t("simulatorsTitle")}
            </h2>
            <p className="text-sm text-text-muted mb-4">
              {t("simulatorsDesc")}
            </p>
            <Link
              href="/simulator"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
            >
              {t("goToSimulators")}
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </section>

          {/* Privacidad */}
          <section className="rounded-xl border border-accent/10 bg-bg-surface p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-1">
              {t("privacyTitle")}
            </h2>
            <p className="text-sm text-text-muted mb-4">
              {t("privacyDesc")}
            </p>
            <Link
              href="/legal/privacy"
              className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent-hover transition-colors"
            >
              {t("viewPrivacy")}
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
