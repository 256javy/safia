# Safia — Agent Context

This file gives AI agents (including GStack specialists) the minimum context they need to work on this repo productively. It's the portable sibling of `CLAUDE.md` — any agent that reads `AGENTS.md` gets the Safia non-negotiables without having to dig through the codebase first.

> **Branch note:** This file was added on the `experiment/gstack` branch as part of replacing the previous set of custom Safia subagents (backend-architect, frontend-architect, ux-designer, security-reviewer, qa-reviewer, content-writer) with GStack's generalist specialist skills. If you find yourself needing behaviors that used to live in those agents, the equivalent is usually a GStack skill (see § GStack mapping below).

---

## 1. Project snapshot

- **Name:** Safia — free, open-source security learning platform for non-technical users (office workers, older adults).
- **Tagline:** *Aprende a protegerte.*
- **Repo:** https://github.com/256javy/safia
- **License:** AGPL-3.0 (chosen to prevent commercial phishing-as-a-service forks of the simulator code).
- **Primary locale:** Spanish (`es`). English (`en`) is a secondary target but not all copy is translated yet.
- **Spec:** `docs/superpowers/specs/2026-04-15-safia-platform-design.md` — source of truth for product scope and decisions.

## 2. Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 App Router (Turbopack by default), React 19, TypeScript strict |
| Styling | Tailwind v4 (CSS-first config), Framer Motion |
| Auth | Auth.js v5 (OAuth only — GitHub/Google), own JWT signing, **no passwords, no email stored** |
| DB | Supabase (Postgres). All access through server-side service-role key. |
| i18n | next-intl (`messages/es.json`, `messages/en.json`) |
| State | Zustand |
| Content | MDX under `content/modules/<module>/lessons/` + generated `content/manifest.json` |
| Package mgr | pnpm |

## 3. Non-negotiable rules

These are enforced by hooks in `.claude/hooks/` and must never be weakened. Any PR that breaks them is rejected.

### 3.1 Working directory
Always work in `/home/javy/projects/safia/`. Never touch other repos on this machine (notably `/home/javy/projects/protonpass-training/`) unless the user explicitly asks.

### 3.2 Simulator security (CRITICAL)
The auth simulators under `features/simulator/` and `app/[locale]/simulator/` are pixel-accurate replicas of real login flows used to teach users to spot phishing. They MUST:

1. Have `e.preventDefault()` hardcoded on every form submit.
2. Have **zero** network calls — no `fetch`, `axios`, `XMLHttpRequest`, `WebSocket`, `navigator.sendBeacon`, no form `action` attribute that posts anywhere.
3. Show a triple-redundant training banner (CSS watermark + React component + `setInterval` 2s integrity check).
4. Export `robots: { index: false, follow: false }` in page metadata.
5. Be covered by CSP `frame-ancestors 'none'` so they can't be iframed into a phishing kit.

The hook `.claude/hooks/guard-simulator.py` blocks edits that introduce `fetch`/`axios`/`WebSocket` inside `features/simulator/`. **Do not bypass the hook.** If the rule genuinely needs an exception, edit the hook's `SAFE_PATHS` and commit that change with justification.

Canonical audit: `./.claude/skills/simulator-security-audit/audit.sh` (also invocable via the `simulator-security-audit` skill or the `/sim-check` command).

### 3.3 Privacy by design
- **No email stored.** OAuth gives us only a provider user id (`oauth_id` column). We never request or persist the email scope.
- **No PII in JWT.** Payload is `{ userId: <uuid> }` only — no name, no email, no avatar URL.
- **Unlinkable newsletter.** There is no foreign key between `users` and `newsletter` tables. Identity must never be linkable to subscription state even with full DB access.
- **`SUPABASE_SERVICE_ROLE_KEY` is server-only.** Never import it in client code, never prefix any env var with `NEXT_PUBLIC_` that contains secrets. The hook `.claude/hooks/guard-service-key.py` enforces this.

### 3.4 RLS posture
Supabase RLS is **DENY ALL** on every table. We don't use Supabase Auth, so `auth.uid()` is always `null` in policies. All DB access is through the service role key on the server, which bypasses RLS. RLS exists purely as a defense-in-depth deny-all layer in case the service key ever leaks or is misconfigured.

### 3.5 Guest-first UX
Every feature must work for unauthenticated visitors. Login is optional, used only to sync progress across devices. Never gate a lesson, simulator, or quiz behind auth.

### 3.6 Tone and audience
Content is for people who don't know what a browser is. Zero jargon. Analogy-driven. 400–600 words per lesson. Spanish accents matter — run the `spanish-accent-check` skill or the `/qa-pass` command before committing content.

## 4. Repository layout

```
app/[locale]/            — Next.js pages (locale-prefixed routes)
features/                — feature-scoped components (simulator/, lessons/, quiz/, …)
components/              — shared UI primitives
content/modules/         — MDX lessons, one dir per module
  └── <module>/lessons/<slug>.<locale>.mdx
content/manifest.json    — generated; regenerate with `pnpm generate-manifest`
messages/                — i18n strings (es.json, en.json)
lib/auth/                — Auth.js v5 config + JWT signing
lib/supabase/            — server-only Supabase clients
stores/                  — Zustand stores
supabase/migrations/     — SQL migrations
scripts/                 — build tooling (manifest generator, etc.)
.claude/                 — Claude Code automations (hooks, commands, skills, settings)
docs/superpowers/specs/  — product specs
```

## 5. Content model

Eight modules, 45 lessons total (all shipped as of 2026-04-19):

| Module | Lessons |
|---|---|
| passwords | 6 |
| phishing | 7 |
| mfa | 5 |
| simulators | 5 |
| wifi | 5 |
| social-media | 6 |
| pass-manager | 6 |
| device-security | 5 |

Each lesson has frontmatter (`title`, `description`, `xp_reward`, `order`, `quiz` with exactly 3 questions), a body of 400–600 words structured as opening analogy → explanation → practical steps → `<TipBox>` → `<PromptButton>`, and must exist for both `es` and `en` (filename pattern `<slug>.<locale>.mdx`). The `mdx-lesson-scaffold` skill / `/new-lesson` command has the canonical template.

After any MDX change, run `pnpm generate-manifest` to update `content/manifest.json`. The old `auto-manifest.py` hook did this automatically after edits under `content/`; it still ships in `.claude/hooks/`.

> ⚠️ **Known manifest bug:** `scripts/generate-manifest.ts` currently counts `lesson-1.es.mdx` and `lesson-1.en.mdx` as two separate lessons because it doesn't dedup by stripped slug. Don't "fix" the lesson counts shown in sprint tooling without fixing the generator first.

## 6. Commands

```bash
pnpm dev                  # Next.js 16 dev server (Turbopack)
pnpm build                # Production build
pnpm lint                 # ESLint flat-native config (Next 16 native)
pnpm generate-manifest    # Regenerate content/manifest.json
```

Project-specific slash commands (defined in `.claude/commands/`):

| Command | What it does |
|---|---|
| `/new-lesson <module> <order> <locale>` | Scaffold a new MDX lesson |
| `/sim-check` | Full simulator security audit |
| `/qa-pass` | QA review of files changed since HEAD |
| `/sprint-status` | Lesson-progress table |
| `/ship-ready` | Full pre-ship gate (lint + manifest + build + security audit) |

## 7. Hooks (do not disable)

| File | Type | What it blocks |
|---|---|---|
| `.claude/hooks/guard-simulator.py` | PreToolUse | `fetch`/`axios`/`WebSocket` inside `features/simulator/` |
| `.claude/hooks/guard-service-key.py` | PreToolUse | Service role key outside safe server paths |
| `.claude/hooks/auto-manifest.py` | PostToolUse | Auto-runs `pnpm generate-manifest` after MDX edits |
| `.claude/hooks/sprint-context.py` | SessionStart | Injects the lesson-progress table into session context |

If a hook blocks you, **do not bypass it**. Either the rule genuinely applies, or the hook's `SAFE_PATHS` needs an update with justification.

## 8. GStack mapping (for agents used to the old Safia subagents)

The previous custom agents under `.claude/agents/` were removed on this branch. GStack skills cover the same territory with a generalist vocabulary:

| Old Safia agent | GStack equivalent |
|---|---|
| `backend-architect` | `/plan-eng-review` for architecture, `/investigate` for root-cause digs |
| `frontend-architect` | `/plan-eng-review` + `/design-review` |
| `ux-designer` | `/design-consultation`, `/design-shotgun`, `/design-review` |
| `security-reviewer` | `/cso` + project-specific `/sim-check` (keep using `/sim-check` for simulator audits — it's Safia-specific and gstack's CSO doesn't know our simulator contract) |
| `qa-reviewer` | `/qa`, `/qa-only` + project-specific `/qa-pass` (keep `/qa-pass` for Spanish accent checks) |
| `content-writer` | No direct equivalent. Use plain Claude with the `mdx-lesson-scaffold` skill and `/new-lesson` command. |

**Keep using Safia-specific commands** (`/sim-check`, `/qa-pass`, `/ship-ready`, `/new-lesson`) — they encode rules gstack's generalist skills don't know about. GStack planning/design skills (`/plan-eng-review`, `/design-shotgun`, `/design-review`) are the main added value.

## 9. When in doubt

- Read the spec in `docs/superpowers/specs/2026-04-15-safia-platform-design.md`.
- Read `CLAUDE.md` at repo root — it's the long-form version of this file.
- Check `~/.klaude/projects/-home-javy-projects-safia/memory/MEMORY.md` for cross-session context and known bugs.
- If a GStack skill suggests an action that conflicts with § 3 (non-negotiables), § 3 wins. Full stop.
