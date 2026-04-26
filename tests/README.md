# Test suite

Vitest (unit + integration in jsdom) and Playwright (E2E against a built app).

## Layout

```
tests/
├── setup.ts                 # next-intl + next/navigation mocks, jest-dom matchers
├── unit/                    # pure logic; no DOM beyond jsdom
├── integration/             # React components rendered with @testing-library/react
└── e2e/                     # Playwright specs + playwright.config.ts
```

## Run

```bash
pnpm test           # vitest run (unit + integration)
pnpm test:watch     # vitest in watch mode
pnpm test:coverage  # v8 coverage report under coverage/

# E2E requires a running Next server. The dev server (`pnpm dev`) currently
# has a Next 16 + Turbopack hydration issue that breaks the simulator pages,
# so run E2E against a production build:
pnpm build
pnpm next start -p 3100 &
E2E_BASE_URL=http://localhost:3100 pnpm test:e2e
```

## Adding a test for a new platform

1. Mirror `features/simulator/platforms/<id>/` with a `definePlatform` builder.
2. Add a smoke test under `tests/integration/<id>-flow.test.tsx` modeled on
   `google-flow.test.tsx`: render `FlowRunner` with the platform's `buildFlow("create", {})`,
   walk every screen, assert the store ends with one persisted account and no plaintext
   in `localStorage`.
3. Optionally extend `tests/e2e/security.spec.ts` (already iterates the `PLATFORMS`
   constant — add the new id there) to assert TrainingBanner + robots.

## Mocks

`tests/setup.ts` mocks:

- `next-intl` — `useTranslations` returns an identity function with `{var}`
  interpolation and a `.has()` truth-stub.
- `next-intl/server` — async identity translator.
- `next/navigation` — `useRouter`, `usePathname`, `useSearchParams`, `redirect`.
- `@/lib/i18n/navigation` — `Link` becomes a passthrough `<a>`; `useRouter` is mocked.

## Notes / gotchas

- Always `useAccountsStore.getState().reset()` and `localStorage.clear()` in `beforeEach`.
- `FlowRunner` autosuggests dependent fields when the field is empty. In E2E,
  `pressSequentially("a")` first to trigger the suggestion, then `fill()` your value.
- `bank` simulator uses CTA label "Continuar" (not "Siguiente").
