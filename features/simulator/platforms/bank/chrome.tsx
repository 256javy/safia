"use client";

import type { PlatformChrome } from "@/features/simulator/engine/types";

const BANK_FONT = '"Georgia", "Times New Roman", serif';

const BankLogo = () => (
  <span
    className="flex items-center gap-2 select-none text-[22px] font-semibold tracking-tight text-white"
    aria-label="SecureBank"
    style={{ fontFamily: BANK_FONT }}
  >
    <span aria-hidden>🛡</span>
    <span>SecureBank</span>
  </span>
);

export const BankChrome: PlatformChrome = ({ children }) => (
  <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col px-4 pt-20 pb-12 sm:px-6">
    <div
      className="overflow-hidden rounded-2xl border border-[#0a2540]/15 bg-white shadow-sm"
      style={
        {
          fontFamily: BANK_FONT,
          color: "#0a2540",
          ["--flow-primary-bg" as string]: "#0a2540",
          ["--flow-primary-text" as string]: "#fff",
          ["--flow-secondary-text" as string]: "#0a2540",
        } as React.CSSProperties
      }
    >
      <div
        className="flex h-12 items-center px-6"
        style={{ background: "#0a2540" }}
      >
        <BankLogo />
      </div>
      <div className="p-6 sm:p-10">{children}</div>
    </div>
    <p className="mt-6 text-center text-[11px] text-text-muted">Simulación pedagógica · Safia</p>
  </main>
);
