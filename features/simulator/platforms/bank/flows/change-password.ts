import { useAccountsStore } from "@/stores/accounts-store";
import { verifyTotp } from "@/lib/totp";
import type { FlowSpec } from "@/features/simulator/engine/types";
import { codeField, currentPasswordField, passwordField } from "@/features/simulator/engine/fields";

import type { ChangePasswordVia } from "@/features/simulator/engine/types";

const PWD_OPTS = { meter: true, minLength: 12, minStrength: 3 as const };

export function buildChangePasswordFlow(via: ChangePasswordVia): FlowSpec {
  const screens: FlowSpec["screens"] = [];

  if (via === "auth") {
    screens.push({
      id: "current",
      title: "change.current.title",
      subtitle: "change.current.subtitle",
      fields: [currentPasswordField()],
      cta: { primary: "cta.next" },
      next: async (data, ctx) => {
        if (!ctx.account) throw new Error("account.notFound");
        const store = useAccountsStore.getState();
        const ok = await store.verifyPasswordFor(ctx.account.id, data.currentPassword ?? "");
        if (!ok) throw new Error("password.wrong");
        return "mfa";
      },
      tip: "change.current.tip",
    });

    screens.push({
      id: "mfa",
      title: "change.mfa.title",
      subtitle: "change.mfa.subtitle",
      fields: [codeField("mfa")],
      cta: { primary: "cta.next" },
      next: (data, ctx) => {
        const secret = ctx.account?.totp.secret;
        if (!secret) throw new Error("mfa.invalid");
        if (!verifyTotp(secret, data.mfa ?? "")) throw new Error("mfa.invalid");
        return "new";
      },
      tip: "change.mfa.tip",
    });
  }

  screens.push({
    id: "new",
    title: "change.new.title",
    subtitle: "change.new.subtitle",
    fields: [
      passwordField("password", PWD_OPTS),
      passwordField("passwordConfirm", { confirm: true }),
    ],
    cta: { primary: "cta.save" },
    next: () => "done",
    tip: "change.new.tip",
  });

  return {
    kind: "change-password",
    platform: "bank",
    screens,
    onComplete: async (data, ctx) => {
      if (!ctx.account) throw new Error("account.notFound");
      const store = useAccountsStore.getState();
      const r = await store.changePassword(ctx.account.id, data.password ?? "");
      if (!r.ok) throw new Error("password.reused");
    },
  };
}
