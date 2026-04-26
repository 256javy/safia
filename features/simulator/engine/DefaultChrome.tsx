"use client";

import type { PlatformChrome } from "./types";

export const DefaultChrome: PlatformChrome = ({ children }) => (
  <main className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md flex-col px-4 pt-20 pb-12 sm:px-6">
    <div className="rounded-2xl border border-accent/10 bg-bg-surface p-6 shadow-md">{children}</div>
  </main>
);
