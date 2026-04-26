"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/lib/i18n/navigation";
import type { Account } from "@/stores/accounts-store";
import { useAccountsStore } from "@/stores/accounts-store";
import { PLATFORMS } from "@/features/simulator/platforms/registry";
import { PlatformLogo } from "./PlatformLogo";
import { StrengthMeter } from "./StrengthMeter";

function timeAgo(at: number, t: ReturnType<typeof useTranslations>): string {
  const diff = Date.now() - at;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return t("justNow");
  if (min < 60) return t("minutesAgo", { count: min });
  const hr = Math.floor(min / 60);
  if (hr < 24) return t("hoursAgo", { count: hr });
  const days = Math.floor(hr / 24);
  return t("daysAgo", { count: days });
}

interface Props {
  account: Account;
}

export function AccountCard({ account }: Props) {
  const t = useTranslations("accounts.card");
  const tp = useTranslations("simulator.platforms");
  const remove = useAccountsStore((s) => s.remove);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const meta = PLATFORMS[account.platform];
  const identity = meta.identityField === "email" ? account.identity.email : account.identity.username;
  const lastLogin = account.loginHistory[0];

  const baseSimulator = `/simulator/${account.platform}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-xl border border-border-subtle/70 bg-bg-surface p-5 transition-colors duration-200 hover:border-accent/40 hover:bg-bg-elevated/40"
    >
      {/* Top row: identity + actions */}
      <div className="flex items-start gap-3">
        <PlatformLogo platform={account.platform} size={40} />

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium uppercase tracking-wide text-text-muted">
            {tp(meta.nameKey)}
          </div>
          <div className="mt-0.5 truncate text-sm font-semibold text-text-primary">
            {identity ?? "—"}
          </div>
        </div>

        <button
          aria-label="Account actions"
          onClick={() => setMenuOpen((v) => !v)}
          className="-mt-1 -mr-1 rounded-md p-1.5 text-text-muted opacity-60 transition-all hover:bg-bg-elevated hover:text-text-primary group-hover:opacity-100"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </div>

      {/* Bottom row: 2FA badge + strength + activity, quieter */}
      <div className="mt-4 flex items-center gap-3 border-t border-border-subtle/40 pt-3">
        {account.totp.enabled ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            2FA
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 3h.01M5 19h14a2 2 0 001.7-3L13.7 5a2 2 0 00-3.4 0L3.3 16A2 2 0 005 19z" />
            </svg>
            2FA
          </span>
        )}

        <StrengthMeter score={account.password.strength} />

        <span className="ml-auto truncate text-[11px] text-text-muted">
          {lastLogin
            ? lastLogin.success
              ? t("lastLogin", { ago: timeAgo(lastLogin.at, t) })
              : t("lastFailed", { ago: timeAgo(lastLogin.at, t) })
            : t("neverLoggedIn")}
        </span>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-3 top-12 z-10 w-56 overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated shadow-lg"
          >
            <Link
              href={`${baseSimulator}/login?account=${account.id}`}
              className="block px-3 py-2 text-sm text-text-secondary hover:bg-accent/10 hover:text-text-primary"
            >
              {t("actions.login")}
            </Link>
            <Link
              href={`${baseSimulator}/change-password?account=${account.id}&via=auth`}
              className="block px-3 py-2 text-sm text-text-secondary hover:bg-accent/10 hover:text-text-primary"
            >
              {t("actions.changePassword")}
            </Link>
            <Link
              href={`${baseSimulator}/recover?account=${account.id}`}
              className="block px-3 py-2 text-sm text-text-secondary hover:bg-accent/10 hover:text-text-primary"
            >
              {t("actions.recover")}
            </Link>
            <Link
              href={`${baseSimulator}/totp?account=${account.id}&action=${account.totp.enabled ? "disable" : "enable"}`}
              className="block px-3 py-2 text-sm text-text-secondary hover:bg-accent/10 hover:text-text-primary"
            >
              {account.totp.enabled ? t("actions.disableTotp") : t("actions.enableTotp")}
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                setConfirmDelete(true);
              }}
              className="block w-full px-3 py-2 text-left text-sm text-danger hover:bg-danger-muted"
            >
              {t("actions.delete")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-bg-base/95 p-4 text-center backdrop-blur-sm"
          >
            <div>
              <p className="text-sm text-text-primary">{t("confirmDelete")}</p>
              <div className="mt-3 flex justify-center gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-md border border-border-subtle px-3 py-1.5 text-xs text-text-secondary hover:border-accent/40 hover:text-text-primary"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => remove(account.id)}
                  className="rounded-md bg-danger px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                >
                  {t("confirm")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
