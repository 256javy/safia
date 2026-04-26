"use client";

import type { PlatformChrome } from "@/features/simulator/engine/types";

const GoogleLogo = () => (
  <span className="flex select-none gap-px text-[28px] font-medium tracking-tight" aria-label="Google">
    <span style={{ color: "#4285F4" }}>G</span>
    <span style={{ color: "#EA4335" }}>o</span>
    <span style={{ color: "#FBBC05" }}>o</span>
    <span style={{ color: "#4285F4" }}>g</span>
    <span style={{ color: "#34A853" }}>l</span>
    <span style={{ color: "#EA4335" }}>e</span>
  </span>
);

export const GoogleChrome: PlatformChrome = ({ children }) => (
  <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col px-4 pt-20 pb-12 sm:px-6">
    <div
      className="rounded-2xl border border-[#dadce0] bg-white p-6 shadow-sm sm:p-10"
      style={
        {
          fontFamily: '"Google Sans", "Roboto", system-ui, sans-serif',
          color: "#202124",
          ["--flow-primary-bg" as string]: "#1a73e8",
          ["--flow-primary-text" as string]: "#fff",
          ["--flow-secondary-text" as string]: "#1a73e8",
        } as React.CSSProperties
      }
    >
      <div className="mb-4 flex justify-center">
        <GoogleLogo />
      </div>
      {children}
    </div>
    <p className="mt-6 text-center text-[11px] text-text-muted">Simulación pedagógica · Safia</p>
  </main>
);
