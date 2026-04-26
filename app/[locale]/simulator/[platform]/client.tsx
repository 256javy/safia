"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useAccountsStore, type Platform } from "@/stores/accounts-store";
import { PLATFORMS } from "@/features/simulator/platforms/registry";
import { PlatformLogo } from "@/features/accounts/PlatformLogo";

const FLOWS: { id: "create" | "login" | "change-password" | "recover" | "totp"; href: (id: string | null) => string; needsAccount: boolean }[] = [
  { id: "create", href: () => "create", needsAccount: false },
  { id: "login", href: (id) => `login?account=${id}`, needsAccount: true },
  { id: "change-password", href: (id) => `change-password?account=${id}&via=auth`, needsAccount: true },
  { id: "recover", href: (id) => `recover?account=${id}`, needsAccount: true },
  { id: "totp", href: (id) => `totp?account=${id}&action=enable`, needsAccount: true },
];

export function PlatformHubClient({ platform }: { platform: Platform }) {
  const tp = useTranslations("simulator.platforms");
  // Subscribe to the raw accounts array (stable reference) and derive the
  // platform-scoped list with useMemo to avoid the infinite re-render that
  // s.byPlatform(platform) triggers (it returns a new array on every call).
  const allAccounts = useAccountsStore((s) => s.accounts);
  const accounts = useMemo(
    () => allAccounts.filter((a) => a.platform === platform),
    [allAccounts, platform],
  );
  const [hydrated, setHydrated] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated && accounts.length > 0 && !selected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(accounts[0].id);
    }
  }, [hydrated, accounts, selected]);

  const meta = PLATFORMS[platform];

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex items-center gap-3">
        <PlatformLogo platform={platform} size={48} />
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{tp(meta.nameKey)}</h1>
          <p className="text-sm text-text-secondary">Simulador de prácticas</p>
        </div>
      </div>

      {hydrated && accounts.length > 0 && (
        <div className="mt-8">
          <label className="text-xs font-medium text-text-muted">Cuenta:</label>
          <select
            value={selected ?? ""}
            onChange={(e) => setSelected(e.target.value)}
            className="mt-1 w-full rounded-lg border border-accent/15 bg-bg-surface px-3 py-2 text-sm text-text-primary"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.identity.email ?? a.identity.username}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-6 grid gap-3">
        {FLOWS.map((f) => {
          const disabled = f.needsAccount && !selected;
          const href = `/simulator/${platform}/${f.href(selected)}`;
          return disabled ? (
            <span
              key={f.id}
              className="cursor-not-allowed rounded-xl border border-accent/10 bg-bg-surface px-4 py-3 text-sm text-text-muted opacity-60"
            >
              {labelFor(f.id)} <span className="text-[11px]">— necesita una cuenta</span>
            </span>
          ) : (
            <Link
              key={f.id}
              href={href}
              className="rounded-xl border border-accent/15 bg-bg-surface px-4 py-3 text-sm text-text-primary transition-colors hover:border-accent/40"
            >
              {labelFor(f.id)}
            </Link>
          );
        })}
      </div>

      <Link href="/accounts" className="mt-8 inline-block text-xs text-text-muted hover:text-text-secondary">
        ← Volver a mis cuentas
      </Link>
    </main>
  );
}

function labelFor(id: string): string {
  switch (id) {
    case "create": return "Crear cuenta";
    case "login": return "Iniciar sesión";
    case "change-password": return "Cambiar contraseña";
    case "recover": return "Recuperar acceso";
    case "totp": return "Gestionar 2FA";
    default: return id;
  }
}
