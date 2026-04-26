import { useAccountsStore } from "@/stores/accounts-store";
import type { FlowSpec } from "@/features/simulator/engine/types";
import { codeField, emailField } from "@/features/simulator/engine/fields";

const RECOVERY_TTL_MS = 10 * 60 * 1000;

export function buildRecoverFlow(redirectAfter: (accountId: string) => string): FlowSpec {
  return {
    kind: "recover",
    platform: "google",
    screens: [
      {
        id: "email",
        title: "recover.email.title",
        subtitle: "recover.email.subtitle",
        fields: [emailField()],
        cta: { primary: "cta.next" },
        next: (data, ctx) => {
          if (!ctx.account) throw new Error("account.notFound");
          const expected = (ctx.account.identity.email ?? "").toLowerCase();
          if (expected !== (data.email ?? "").toLowerCase()) throw new Error("account.notFound");
          // Push a 6-digit recovery code to the inbox.
          const code = String(Math.floor(100000 + Math.random() * 900000));
          useAccountsStore.getState().pushInbox(ctx.account.id, {
            kind: "email",
            subject: "Recupera tu cuenta de Google",
            code,
            body: `Tu código de recuperación es ${code}. Caduca en 10 minutos.`,
          });
          return "code";
        },
        tip: "recover.email.tip",
      },
      {
        id: "code",
        title: "recover.code.title",
        subtitle: "recover.code.subtitle",
        fields: [codeField("recoveryCode")],
        cta: { primary: "cta.verify" },
        next: async (data, ctx) => {
          if (!ctx.account) throw new Error("account.notFound");
          const store = useAccountsStore.getState();
          const account = store.getById(ctx.account.id);
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
      // Surface the code-verified target via redirectAfter, handled in route.
      // We rely on the runner's doneHref param to redirect to change-password?via=forgot.
      void redirectAfter;
    },
  };
}
