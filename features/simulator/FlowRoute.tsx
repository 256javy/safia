"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { useAccountsStore, type Platform } from "@/stores/accounts-store";
import { getPlatform } from "@/features/simulator/platforms/index";
import { PLATFORM_IDS } from "@/features/simulator/platforms/registry";
import { FlowRunner } from "./engine/FlowRunner";
import { TrainingBanner } from "./TrainingBanner";
import type { ChangePasswordVia, FlowKind, TotpAction } from "./engine/types";

interface FlowRouteProps {
  platform: string;
  kind: FlowKind;
  accountId?: string;
  via?: string;
  action?: string;
}

export function FlowRoute({ platform, kind, accountId, via, action }: FlowRouteProps) {
  const router = useRouter();
  const tShared = useTranslations("simulator.runner");
  const account = useAccountsStore((s) => (accountId ? s.getById(accountId) : undefined));
  const accounts = useAccountsStore((s) => s.accounts);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  const valid = PLATFORM_IDS.includes(platform as Platform);
  const def = valid ? getPlatform(platform as Platform) : null;

  const flow = useMemo(() => {
    if (!def) return null;
    return def.buildFlow(kind, {
      account,
      via: (via as ChangePasswordVia | undefined) ?? "auth",
      action: (action as TotpAction | undefined) ?? "enable",
    });
  }, [def, kind, account, via, action]);

  // Hydration gate
  if (!hydrated) {
    return (
      <>
        <TrainingBanner />
        <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center justify-center px-4 pt-20" />
      </>
    );
  }

  if (!valid || !def) {
    return (
      <CenteredError
        title="Plataforma no disponible"
        body="Esta plataforma todavía no tiene simulador. Vuelve a tu centro de cuentas."
        ctaLabel={tShared("exit")}
        onCta={() => router.push("/accounts")}
      />
    );
  }

  // Validate that account requirement is met for kinds that need one.
  const needsAccount = kind !== "create";
  if (needsAccount && !account) {
    return (
      <CenteredError
        title="Cuenta no encontrada"
        body="La cuenta seleccionada ya no existe. Vuelve al hub de la plataforma para empezar de nuevo."
        ctaLabel={tShared("exit")}
        onCta={() => router.push(`/simulator/${platform}`)}
      />
    );
  }

  // Bank: cannot disable totp.
  if (kind === "totp" && action === "disable" && account?.platform === "bank") {
    return (
      <CenteredError
        title="Tu banco no permite desactivar 2FA"
        body="Por seguridad, los bancos suelen exigir verificación en dos pasos siempre. Esta es una buena política — protege tu dinero."
        ctaLabel={tShared("exit")}
        onCta={() => router.push(`/simulator/${platform}`)}
      />
    );
  }

  if (!flow) return null;

  // For recover, on done we redirect to change-password?via=forgot.
  const doneHref =
    kind === "recover" && account
      ? `/simulator/${platform}/change-password?account=${account.id}&via=forgot`
      : kind === "create"
      ? `/accounts`
      : `/simulator/${platform}`;

  // Account count is just to invalidate flow if accounts change (e.g. after create).
  void accounts;

  return <FlowRunner flow={flow} chrome={def.chrome} account={account ?? undefined} doneHref={doneHref} />;
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col items-center justify-center px-4 pt-20 pb-12 text-center sm:px-6">
      <div className="rounded-2xl border border-accent/10 bg-bg-surface p-8">{children}</div>
    </main>
  );
}

interface CenteredErrorProps {
  title: string;
  body: string;
  ctaLabel: string;
  onCta: () => void;
}

function CenteredError({ title, body, ctaLabel, onCta }: CenteredErrorProps) {
  return (
    <>
      <TrainingBanner />
      <Centered>
        <h1 className="text-xl font-semibold text-text-primary">{title}</h1>
        <p className="mt-2 text-sm text-text-secondary">{body}</p>
        <button
          onClick={onCta}
          className="mt-6 rounded-lg border border-accent/15 px-4 py-2 text-sm text-text-secondary hover:border-accent/40"
        >
          {ctaLabel}
        </button>
      </Centered>
    </>
  );
}
