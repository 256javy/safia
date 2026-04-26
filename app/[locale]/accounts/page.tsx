import type { Metadata } from "next";
import { AccountsHub } from "@/features/accounts/AccountsHub";

export const metadata: Metadata = {
  title: "Mis cuentas — Safia",
  robots: { index: false, follow: false },
};

export default function AccountsPage() {
  return <AccountsHub />;
}
