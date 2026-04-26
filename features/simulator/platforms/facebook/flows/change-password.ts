import { useAccountsStore } from "@/stores/accounts-store";
import type { FlowSpec } from "@/features/simulator/engine/types";
import { currentPasswordField, passwordField } from "@/features/simulator/engine/fields";

import type { ChangePasswordVia } from "@/features/simulator/engine/types";

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
        return "new";
      },
      tip: "change.current.tip",
    });
  }

  screens.push({
    id: "new",
    title: "change.new.title",
    subtitle: "change.new.subtitle",
    fields: [
      passwordField("password", { meter: true, minLength: 8, minStrength: 2 }),
      passwordField("passwordConfirm", { confirm: true }),
    ],
    cta: { primary: "cta.save" },
    next: () => "done",
    tip: "change.new.tip",
  });

  return {
    kind: "change-password",
    platform: "facebook",
    screens,
    onComplete: async (data, ctx) => {
      if (!ctx.account) throw new Error("account.notFound");
      const store = useAccountsStore.getState();
      const r = await store.changePassword(ctx.account.id, data.password ?? "");
      if (!r.ok) throw new Error("password.reused");
    },
  };
}
