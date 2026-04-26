"use client";

import type { PlatformChrome } from "@/features/simulator/engine/types";

const FacebookLogo = () => (
  <span
    className="select-none text-[34px] font-extrabold tracking-tight"
    style={{
      color: "#1877f2",
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      letterSpacing: "-0.03em",
    }}
    aria-label="facebook"
  >
    facebook
  </span>
);

export const FacebookChrome: PlatformChrome = ({ children }) => (
  <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col px-4 pt-20 pb-12 sm:px-6">
    <div
      className="rounded-lg border border-[#dddfe2] bg-white p-6 shadow-md sm:p-8"
      style={
        {
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          color: "#1c1e21",
          ["--flow-primary-bg" as string]: "#1877f2",
          ["--flow-primary-text" as string]: "#fff",
          ["--flow-secondary-text" as string]: "#1877f2",
        } as React.CSSProperties
      }
    >
      <div className="mb-4 flex justify-center">
        <FacebookLogo />
      </div>
      {children}
    </div>
    <p className="mt-6 text-center text-[11px] text-text-muted">Simulación pedagógica · Safia</p>
  </main>
);
