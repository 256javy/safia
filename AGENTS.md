# Safia

Free, open-source security learning platform for non-technical users (office workers, older adults). Tagline: *Aprende a protegerte.*

- **Repo:** https://github.com/256javy/safia
- **License:** AGPL-3.0
- **Primary locale:** Spanish (`es`). English (`en`) is a secondary target; not all copy is translated yet.
- **North star:** `VISION.md` — mission, principles, audience ranking, and the four-question decision filter. **Read before any non-trivial product decision.**
- **Spec (source of truth for scope):** `docs/superpowers/specs/2026-04-15-safia-platform-design.md`

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 App Router (Turbopack), React 19, TypeScript strict |
| Styling | Tailwind v4 (CSS-first), Framer Motion |
| Auth | Auth.js v5 — OAuth only (GitHub/Google), own JWT signing |
| DB | Supabase (Postgres) |
| i18n | next-intl (`messages/es.json`, `messages/en.json`) |
| State | Zustand |
| Content | MDX under `content/modules/<module>/lessons/` + generated `content/manifest.json` |
| Package mgr | pnpm |

## Commands

```bash
pnpm dev                  # Next.js 16 dev server
pnpm build                # Production build
pnpm lint                 # ESLint (Next 16 flat-native)
pnpm generate-manifest    # Regenerate content/manifest.json after MDX edits
```

## Repository layout

```
app/[locale]/            Next.js pages (locale-prefixed routes)
features/                Feature-scoped components (simulator/, lessons/, quiz/, …)
components/              Shared UI primitives
content/modules/         MDX lessons, one dir per module
  └── <module>/lessons/<slug>.<locale>.mdx
content/manifest.json    Generated; regenerate with `pnpm generate-manifest`
messages/                i18n strings
lib/auth/                Auth.js v5 config + JWT signing
lib/supabase/            Server-only Supabase clients
stores/                  Zustand stores
supabase/migrations/     SQL migrations
scripts/                 Build tooling
docs/superpowers/specs/  Product specs
```

## Product rules that constrain implementation

### Simulator security (hard rule)
The auth simulators under `features/simulator/` and `app/[locale]/simulator/` are pixel-accurate replicas of real login flows, used to teach users to recognize phishing. They must:

1. Call `e.preventDefault()` on every form submit — hardcoded.
2. Make **zero** network calls. No `fetch`, `axios`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon`, no form `action` attribute that posts anywhere.
3. Display a training-mode banner that cannot be removed via DOM injection (use CSS watermark + React component + integrity check).
4. Export `robots: { index: false, follow: false }` in page metadata.
5. Be covered by CSP `frame-ancestors 'none'`.

Any change that weakens these is a regression.

### Privacy
- No email is stored. OAuth gives us only a provider user id (`oauth_id` column); the email scope is not requested or persisted.
- JWT payload is `{ userId: <uuid> }` only — no name, no email, no avatar URL.
- No foreign key between `users` and `newsletter` tables. Identity must remain unlinkable to subscription state.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only. It is read exclusively by `lib/supabase/server.ts`. Never prefix any env var containing secrets with `NEXT_PUBLIC_`.

### RLS posture
Supabase RLS is **DENY ALL** on every table. Auth.js signs its own JWT (not Supabase Auth), so `auth.uid()` is always `null` in policies. All DB access runs through the service role key on the server, which bypasses RLS. RLS exists as a defense-in-depth deny-all layer.

### Guest-first UX
Every feature must work for unauthenticated visitors. Login is optional and exists only to sync progress across devices. Do not gate lessons, simulators, or quizzes behind auth.

### Content tone
Target audience is people who don't know what a browser is. Zero jargon. Analogy-driven. 400–600 words per lesson. Spanish orthography (accents, ñ, ¿¡) must be correct.

## Content model

Eight modules, 45 lessons total. Each lesson:
- Filename: `<slug>.<locale>.mdx` under `content/modules/<module>/lessons/`.
- Frontmatter: `title`, `description`, `xp_reward`, `order`, and a `quiz` array with exactly 3 questions.
- Body (400–600 words): opening analogy → explanation → practical steps → `<TipBox>` → `<PromptButton>`.
- Must exist for both `es` and `en`.

After MDX changes, run `pnpm generate-manifest`.

> Known bug: `scripts/generate-manifest.ts` counts `lesson-1.es.mdx` and `lesson-1.en.mdx` as two separate lessons (no dedup by stripped slug). Don't reconcile reported lesson counts without fixing the generator first.
