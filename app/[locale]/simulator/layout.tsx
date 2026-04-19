import type { Metadata } from "next";
import type { ReactNode } from "react";

// Simulator pages replicate real login flows for educational purposes.
// They must never be indexed (CLAUDE.md > simulator security; SECURITY.md).
// A single layout covers the index page and every platform-specific page.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SimulatorLayout({ children }: { children: ReactNode }) {
  return children;
}
