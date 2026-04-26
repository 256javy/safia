import { useAccountsStore } from "@/stores/accounts-store";
import type { FlowSpec } from "@/features/simulator/engine/types";
import { codeField } from "@/features/simulator/engine/fields";

const RECOVERY_TTL_MS = 10 * 60 * 1000;

export function buildRecoverFlow(redirectAfter: (accountId: string) => string): FlowSpec {
  return {
    kind: "recover",
    platform: "instagram",
    screens: [
      {
        id: "identity",
        title: "recover.identity.title",
        subtitle: "recover.identity.subtitle",
        fields: [
          {
            name: "identity",
            type: "text",
            required: true,
            autoComplete: "username",
            i18n: {
              label: "fields.identity.label",
              placeholder: "fields.identity.placeholder",
            },
          },
        ],
        cta: { primary: "cta.next" },
        next: (data, ctx) => {
          if (!ctx.account) throw new Error("account.notFound");
          const v = (data.identity ?? "").trim().toLowerCase();
          const email = (ctx.account.identity.email ?? "").toLowerCase();
          const username = (ctx.account.identity.username ?? "").toLowerCase();
          if (v !== email && v !== username) throw new Error("account.notFound");
          const code = String(Math.floor(100000 + Math.random() * 900000));
          useAccountsStore.getState().pushInbox(ctx.account.id, {
            kind: "email",
            subject: "Recuperar tu cuenta de Instagram",
            code,
            body: `Tu código de recuperación es ${code}. Caduca en 10 minutos.`,
          });
          return "code";
        },
        tip: "recover.identity.tip",
      },
      {
        id: "code",
        title: "recover.code.title",
        subtitle: "recover.code.subtitle",
        fields: [codeField("recoveryCode")],
        cta: { primary: "cta.verify" },
        next: async (data, ctx) => {
          if (!ctx.account) throw new Error("account.notFound");
          const account = useAccountsStore.getState().getById(ctx.account.id);
          const fresh = account?.inbox.find(
            (m) => m.kind === "email" && m.code && Date.now() - m.at < RECOVERY_TTL_MS,
          );
          if (!fresh) throw new Error("code.expired");
          if ((data.recoveryCode ?? "").trim() !== fresh.code) throw new Error("code.invalid");
          return "done";
        },
        tip: "recover.code.tip",
      },
    ],
    onComplete: async (_data, ctx) => {
      if (!ctx.account) return;
      void redirectAfter;
    },
  };
}
