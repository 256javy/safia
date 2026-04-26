import { useAccountsStore } from "@/stores/accounts-store";
import type { FlowCtx } from "@/features/simulator/engine/types";

export function suggestEmailFromName(ctx: FlowCtx): string {
  const first = (ctx.data.firstName ?? "").trim().toLowerCase();
  const last = (ctx.data.lastName ?? "").trim().toLowerCase();
  if (!first && !last) return "";
  const stem = [first, last].filter(Boolean).join(".").replace(/[^a-z0-9.]/g, "");
  if (!stem) return "";
  const store = useAccountsStore.getState();
  const candidates = [stem, `${stem}1`, `${stem}.${new Date().getFullYear() % 100}`, `${stem}_${Math.floor(Math.random() * 1000)}`];
  for (const c of candidates) {
    const email = `${c}@gmail.com`;
    if (!store.isEmailTaken("google", email)) return email;
  }
  return `${stem}.${Date.now() % 10000}@gmail.com`;
}
