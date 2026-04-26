import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { vi } from "vitest";
import { webcrypto } from "node:crypto";

if (!globalThis.crypto) {
  // Node environments without WebCrypto on globalThis
  Object.defineProperty(globalThis, "crypto", { value: webcrypto });
}

// Stable identity translator for next-intl in tests.
type Translator = ((key: string, values?: Record<string, string | number>) => string) & {
  has: (key: string) => boolean;
  rich: (key: string, values?: Record<string, unknown>) => string;
};

const makeT = (): Translator => {
  const fn = ((key: string, values?: Record<string, string | number>) => {
    if (values && Object.keys(values).length > 0) {
      let out = key;
      for (const [k, v] of Object.entries(values)) {
        out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
      return out;
    }
    return key;
  }) as Translator;
  fn.has = () => true;
  fn.rich = (k: string) => k;
  return fn;
};

const identityT = makeT();

vi.mock("next-intl", () => ({
  useTranslations: () => identityT,
  useLocale: () => "es",
  useMessages: () => ({}),
  useNow: () => new Date(),
  useTimeZone: () => "UTC",
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("next-intl/server", () => ({
  getTranslations: async () => identityT,
  getLocale: async () => "es",
  getMessages: async () => ({}),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ locale: "es" }),
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock("@/lib/i18n/navigation", () => {
  return {
    Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) =>
      React.createElement("a", { href, ...rest }, children),
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    }),
    usePathname: () => "/",
    redirect: vi.fn(),
    getPathname: (p: { href: string }) => p.href,
  };
});
