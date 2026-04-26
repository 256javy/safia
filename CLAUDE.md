# Safia

Free, open-source security learning platform for non-technical users. Tagline: **"Aprende a protegerte."**

- **Repo:** https://github.com/256javy/safia
- **License:** AGPL-3.0 — chosen because the simulator code could be repurposed into actual phishing tools; AGPL forces any modified service to be open-sourced.
- **North star:** `VISION.md` — mission, principles, audience ranking, decision filter. Read before any non-trivial product decision.
- **Spec (source of truth for scope):** `docs/superpowers/specs/2026-04-15-safia-platform-design.md`

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind v4 · Framer Motion · Auth.js v5 (OAuth only) · Supabase (Postgres) · next-intl · Zustand · pnpm.

## Development

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
content/modules/         MDX lessons: <module>/lessons/<slug>.<locale>.mdx
content/manifest.json    Generated
messages/                i18n strings (es.json, en.json)
lib/auth/                Auth.js v5 config + JWT signing
lib/supabase/            Server-only Supabase clients
stores/                  Zustand stores
supabase/migrations/     SQL migrations
scripts/                 Build tooling
docs/superpowers/specs/  Product specs
```

## Product rules that constrain implementation

### Simulator security (hard rule)
The auth simulators under `features/simulator/` and `app/[locale]/simulator/` are pixel-accurate replicas of real login flows used to teach users to recognize phishing. Any change to these files must preserve:

1. `e.preventDefault()` on every form submit — hardcoded.
2. **Zero** network calls. No `fetch`, `axios`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon`, no form `action` attribute that posts anywhere.
3. A training-mode banner that cannot be removed via DOM injection (CSS watermark + React component + integrity check).
4. `robots: { index: false, follow: false }` in page metadata.
5. CSP `frame-ancestors 'none'`.

### Privacy
- No email stored. OAuth gives us only a provider user id (`oauth_id`). The email scope is not requested or persisted.
- JWT payload is `{ userId: <uuid> }` only — no name, no email, no avatar URL.
- No foreign key between `users` and `newsletter`. Identity must remain unlinkable to subscription state.
- `SUPABASE_SERVICE_ROLE_KEY` is read exclusively by `lib/supabase/server.ts`. Never prefix secrets with `NEXT_PUBLIC_`.

### RLS is DENY ALL
Auth.js signs its own JWT (not Supabase Auth), so `auth.uid()` is always `null` in policies. All DB access goes through the service role key on the server. RLS exists as a defense-in-depth deny-all layer.

### Guest-first UX
Every feature works for unauthenticated visitors. Login is optional, used only to sync progress across devices. Do not gate lessons, simulators, or quizzes behind auth.

### Progress storage
JSONB, not normalized tables. Progress is always read/written per-user as a whole blob (max ~5KB), so JSONB avoids N+1 queries and is still indexable for future analytics.

### Content tone
Audience is people who don't know what a browser is. Zero jargon. Analogy-driven. 400–600 words per lesson. Spanish orthography (accents, ñ, ¿¡) must be correct.

## Content model

Eight modules, 45 lessons total. Each lesson:
- Filename: `<slug>.<locale>.mdx` under `content/modules/<module>/lessons/`.
- Frontmatter: `title`, `description`, `xp_reward`, `order`, and a `quiz` array with exactly 3 questions.
- Body (400–600 words): opening analogy → explanation → practical steps → `<TipBox>` → `<PromptButton>`.
- Must exist in both `es` and `en`.

After MDX changes, run `pnpm generate-manifest`.

> Known bug: `scripts/generate-manifest.ts` counts `lesson-1.es.mdx` and `lesson-1.en.mdx` as two separate lessons (no dedup by stripped slug). Don't reconcile reported counts without fixing the generator first.

## Claude Code automation (AI-native dev)

Esta app es ai-dev nativa. Para mantener autonomía y proactividad de los agentes:

### Hooks activos (`.claude/settings.json`)

- **`simulator-no-network`** (PreToolUse) — bloquea Edit/Write/MultiEdit en `features/simulator/platforms/**` o `FlowRoute.tsx` si el contenido nuevo introduce `fetch(`, `axios`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` o `action="http`. Hard rule de seguridad. Falsos positivos: pon el ejemplo dentro de un string literal.
- **`i18n-validate`** (PostToolUse) — al editar `messages/*.json` o `i18n.<locale>.json` por plataforma, valida JSON y reporta drift de claves entre `es/en/pt`. Non-blocking; emite warnings.
- **`manifest-regen`** (PostToolUse) — regenera `content/manifest.json` cuando editas MDX bajo `content/modules/`.

### Subagents custom (`.claude/agents/`)

- **`simulator-security-auditor`** — audita cambios contra las reglas no negociables del simulador. Úsalo proactivamente antes de mergear PRs que tocan `features/simulator/`.
- **`flow-spec-author`** — andamia FlowSpecs nuevos para plataformas adicionales (TikTok, X, LinkedIn, etc.). Conoce el patrón de Google y los helpers de fields.
- **`i18n-keeper`** — mantiene paridad es/en/pt y detecta strings hardcodeados.

### Skills relevantes (gstack ya instaladas)

- `/qa` o `/qa-only` — QA de la web app (con test-fix-verify loop o solo report).
- `/design-review` — auditoría visual en vivo.
- `/plan-design-review` — review de plan en plan mode.
- `/codex` — segunda opinión vía OpenAI Codex CLI.
- `/health` — dashboard de calidad (typecheck/lint/test/dead-code).
- `/cso` — security audit (cuando toque infraestructura/CI).
- `/review` — pre-landing PR review.
- `/learn` — gestiona aprendizajes persistentes (úsalo proactivamente cuando aprendas un patrón nuevo).

### Tests

```bash
pnpm test                 # Vitest unit + integration (jsdom)
pnpm test:coverage        # Coverage v8
pnpm test:e2e             # Playwright E2E (requires dev server)
pnpm test:all             # All
```

## Working directory

Always work in `/home/javy/projects/safia/`. Do not touch other repos on this machine unless explicitly asked.
