"use client";

import { useAccountsStore } from "@/stores/accounts-store";
import { generateSecret, otpauthUri, verifyTotp } from "@/lib/totp";
import type { FlowSpec, ScreenRenderArgs } from "@/features/simulator/engine/types";
import { QrCanvas } from "@/features/simulator/engine/QrCanvas";
import { codeField } from "@/features/simulator/engine/fields";

import type { TotpAction } from "@/features/simulator/engine/types";

const SECRET_KEY = "_totpDraftSecret";

export function buildTotpFlow(action: TotpAction): FlowSpec {
  if (action === "disable") {
    return {
      kind: "totp",
      platform: "bank",
      screens: [
        {
          id: "blocked",
          title: "totp.disable.title",
          subtitle: "totp.disable.subtitle",
          cta: { primary: "cta.done" },
          next: () => {
            throw new Error("totp.forbidden");
          },
          tip: "totp.disable.tip",
        },
      ],
      onComplete: async () => {
        throw new Error("totp.forbidden");
      },
    };
  }

  return {
    kind: "totp",
    platform: "bank",
    screens: [
      {
        id: "scan",
        title: "totp.enable.scan.title",
        subtitle: "totp.enable.scan.subtitle",
        cta: { primary: "cta.next" },
        customLayout: true,
        enter: (ctx) => {
          if (!ctx.data[SECRET_KEY]) {
            ctx.patch({ [SECRET_KEY]: generateSecret() });
          }
        },
        next: () => "verify",
        render: ({ ctx, advance }: ScreenRenderArgs) => (
          <TotpScanScreen ctx={ctx} onContinue={() => advance()} />
        ),
        tip: "totp.enable.scan.tip",
      },
      {
        id: "verify",
        title: "totp.enable.verify.title",
        subtitle: "totp.enable.verify.subtitle",
        fields: [codeField("mfa")],
        cta: { primary: "cta.activate" },
        next: (data, ctx) => {
          const secret = ctx.data[SECRET_KEY];
          if (!secret) throw new Error("mfa.invalid");
          if (!verifyTotp(secret, data.mfa ?? "")) throw new Error("mfa.invalid");
          return "done";
        },
        tip: "totp.enable.verify.tip",
      },
    ],
    onComplete: async (data, ctx) => {
      if (!ctx.account) return;
      const secret = data[SECRET_KEY];
      if (!secret) return;
      useAccountsStore.getState().enableTotp(ctx.account.id, secret);
    },
  };
}

function TotpScanScreen({ ctx, onContinue }: { ctx: ScreenRenderArgs["ctx"]; onContinue: () => void }) {
  const secret = ctx.data[SECRET_KEY] ?? "";
  const label = ctx.account?.identity.email ?? "user";
  const uri = secret ? otpauthUri({ secret, label, issuer: "SecureBank (Safia)" }) : "";
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-current/80">{ctx.tp("totp.enable.scan.body")}</p>
      {uri && <QrCanvas value={uri} size={196} />}
      <div className="w-full rounded-md border border-current/15 bg-current/5 p-3 text-center">
        <p className="text-[11px] uppercase tracking-wider text-current/60">
          {ctx.tp("totp.enable.scan.secretLabel")}
        </p>
        <p className="mt-1 break-all font-mono text-xs text-current">
          {secret.match(/.{1,4}/g)?.join(" ")}
        </p>
      </div>
      <button
        type="button"
        onClick={onContinue}
        style={{ background: "var(--flow-primary-bg, #0a2540)", color: "var(--flow-primary-text, #fff)" }}
        className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold"
      >
        {ctx.tp("cta.next")}
      </button>
    </div>
  );
}
