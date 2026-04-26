import { useAccountsStore } from "@/stores/accounts-store";
import { verifyTotp } from "@/lib/totp";
import type { FlowSpec } from "@/features/simulator/engine/types";
import { codeField, currentPasswordField, emailField } from "@/features/simulator/engine/fields";

export function buildLoginFlow(): FlowSpec {
  return {
    kind: "login",
    platform: "google",
    screens: [
      {
        id: "email",
        title: "login.email.title",
        fields: [emailField()],
        cta: { primary: "cta.next" },
        next: (data, ctx) => {
          if (!ctx.account) throw new Error("account.notFound");
          if ((ctx.account.identity.email ?? "").toLowerCase() !== (data.email ?? "").toLowerCase()) {
            throw new Error("account.notFound");
          }
          return "password";
        },
        tip: "login.email.tip",
      },
      {
        id: "password",
        title: "login.password.title",
        subtitle: "login.password.subtitle",
        fields: [currentPasswordField()],
        cta: { primary: "cta.signIn", secondary: "cta.forgot" },
        next: async (data, ctx) => {
          if (!ctx.account) throw new Error("account.notFound");
          const store = useAccountsStore.getState();
          const ok = await store.verifyPasswordFor(ctx.account.id, data.currentPassword ?? "");
          if (!ok) {
            store.recordLogin(ctx.account.id, { success: false, reason: "wrong_password" });
            throw new Error("password.wrong");
          }
          const suspicious = Math.random() < 0.25;
          if (suspicious && !ctx.account.totp.enabled) {
            // Push a fake recovery SMS for the suspicious challenge.
            store.pushInbox(ctx.account.id, {
              kind: "sms",
              code: String(Math.floor(100000 + Math.random() * 900000)),
              body: "Google: alguien intentó iniciar sesión. Si fuiste tú, este es tu código.",
            });
            return "suspicious";
          }
          if (ctx.account.totp.enabled) return "mfa";
          return "verify";
        },
        tip: "login.password.tip",
      },
      {
        id: "suspicious",
        title: "login.suspicious.title",
        subtitle: "login.suspicious.subtitle",
        fields: [codeField("recoveryCode")],
        cta: { primary: "cta.verify" },
        next: async (data, ctx) => {
          if (!ctx.account) throw new Error("account.notFound");
          const store = useAccountsStore.getState();
          const account = store.getById(ctx.account.id);
          const lastSms = account?.inbox.find((m) => m.kind === "sms" && m.code);
          if (!lastSms || (data.recoveryCode ?? "").trim() !== lastSms.code) {
            throw new Error("code.invalid");
          }
          if (account?.totp.enabled) return "mfa";
          return "verify";
        },
        tip: "login.suspicious.tip",
      },
      {
        id: "mfa",
        title: "login.mfa.title",
        subtitle: "login.mfa.subtitle",
        fields: [codeField("mfa")],
        cta: { primary: "cta.verify" },
        next: (data, ctx) => {
          const secret = ctx.account?.totp.secret;
          if (!secret) throw new Error("mfa.invalid");
          if (!verifyTotp(secret, data.mfa ?? "")) throw new Error("mfa.invalid");
          return "verify";
        },
        tip: "login.mfa.tip",
      },
      {
        id: "verify",
        title: "login.verify.title",
        subtitle: "login.verify.subtitle",
        cta: { primary: "cta.done" },
        next: () => "done",
        tip: "login.verify.tip",
      },
    ],
    onComplete: async (data, ctx) => {
      if (!ctx.account) return;
      const store = useAccountsStore.getState();
      store.recordLogin(ctx.account.id, {
        success: true,
        reason: ctx.account.totp.enabled ? "mfa_passed" : undefined,
        suspicious: !!data.recoveryCode,
      });
    },
  };
}
