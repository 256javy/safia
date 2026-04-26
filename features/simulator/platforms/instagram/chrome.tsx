"use client";

import type { PlatformChrome } from "@/features/simulator/engine/types";

const InstagramLogo = () => (
  <span
    className="select-none text-[34px] leading-none"
    aria-label="Instagram"
    style={{
      fontFamily: '"Billabong", "Brush Script MT", "Lucida Handwriting", cursive',
      fontStyle: "italic",
      fontWeight: 500,
      backgroundImage:
        "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      WebkitTextFillColor: "transparent",
      color: "transparent",
    }}
  >
    Instagram
  </span>
);

export const InstagramChrome: PlatformChrome = ({ children }) => (
  <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col px-4 pt-20 pb-12 sm:px-6">
    <div
      className="rounded-2xl border border-[#dbdbdb] bg-white p-6 shadow-sm sm:p-10"
      style={
        {
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          color: "#262626",
          ["--flow-primary-bg" as string]: "#0095F6",
          ["--flow-primary-text" as string]: "#fff",
          ["--flow-secondary-text" as string]: "#0095F6",
        } as React.CSSProperties
      }
    >
      <div className="mb-6 flex justify-center">
        <InstagramLogo />
      </div>
      {children}
    </div>
    <p className="mt-6 text-center text-[11px] text-text-muted">Simulación pedagógica · Safia</p>
  </main>
);
