# Safia — Project Instructions for Claude

## Project Overview
Safia is a free, open-source security learning platform for non-technical users. Tagline: **"Aprende a protegerte."**

**Repo:** https://github.com/256javy/safia  
**Stack:** Next.js 16, React 19, TypeScript strict, Tailwind v4, Auth.js v5, Supabase, next-intl, Zustand, Framer Motion  
**Spec:** `docs/superpowers/specs/2026-04-15-safia-platform-design.md`

---

## 🚨 Non-Negotiable Rules

### Working Directory
Always work in `/home/javy/projects/safia/`. NEVER touch `/home/javy/projects/protonpass-training/` or any other repo unless explicitly asked.

### Simulator Security (CRITICAL)
The auth simulators are pixel-accurate replicas of real login flows. They MUST:
- Have `e.preventDefault()` on every form submit — hardcoded, never removed
- Have zero network calls — no `fetch`, `axios`, `XMLHttpRequest`
- Have a triple-redundant training banner (CSS + React component + setInterval 2s)
- Have `robots: { index: false }` metadata on all simulator pages

Any PR that weakens simulator security is automatically blocked.

### Privacy by Design
- No email stored — OAuth gives us only a provider user ID (`oauth_id`)
- No PII in JWT — payload is `{ userId: uuid }` only
- No FK between `users` and `newsletter` tables — identity must never be linkable to subscriptions
- `SUPABASE_SERVICE_ROLE_KEY` — never in client code, never `NEXT_PUBLIC_` prefix

---

## Scrum Team

Always work with the full team for non-trivial features. Use agent teams (`TeamCreate` + `Agent` tool) — never solo implementation for features that span backend, frontend, and UX.

### Agents
Subagent **definitions** live in `.claude/agents/*.md` (versioned with the repo — shared across collaborators). Each agent has `model`, `color`, and tool scope configured.

| Agent | Model | Color | When to use |
|---|---|---|---|
| `backend-architect` | opus | cyan | `app/api/`, `lib/auth/`, `lib/supabase/`, `supabase/migrations/` |
| `frontend-architect` | sonnet | blue | `app/`, `features/`, `components/`, `stores/`, `messages/` |
| `ux-designer` | sonnet | purple | Landing, animations, visual design, PO decisions |
| `security-reviewer` | opus | red | AFTER every feature — has veto power |
| `content-writer` | sonnet | green | `content/modules/**/*.mdx`, educational copy |
| `qa-reviewer` | haiku | yellow | After any content/UI text change |

### Team Workflow
1. **Sprint planning** — create TaskList with all tasks, assign to agents via `owner`
2. **Parallel work** — backend + frontend concurrently, UX unblocked after scaffolding
3. **Security review** — security-reviewer runs after every feature, blocks if issues found
4. **Build verification** — `/ship-ready` must pass before marking sprint complete
5. **Alignment** — Scrum Master (Claude) coordinates via `SendMessage`

### Agent Coordination Rules
- **Subagent definitions**: `.claude/agents/*.md` (versioned — commit these)
- **Team runtime** (members, sessions): `~/.klaude/teams/safia/config.json` — created automatically by `TeamCreate`, user-level, NOT versioned
- Spawn a team once per session: `TeamCreate({team_name: "safia", description: "..."})`
- Task ownership via `TaskUpdate.owner`
- Communication via `SendMessage` — never assume teammates see your output
- `ux-designer` cannot write outside this repo — enforced by deny-rule in `.claude/settings.json`
- `security-reviewer` runs last and has veto power on any feature

---

## Automations (`.claude/`)

| Layer | Path | Purpose |
|---|---|---|
| **Hooks** | `.claude/hooks/guard-simulator.py` | PreToolUse — blocks `fetch`/`axios`/`WebSocket` in `features/simulator/` |
| | `.claude/hooks/guard-service-key.py` | PreToolUse — blocks `SUPABASE_SERVICE_ROLE_KEY` outside safe paths |
| | `.claude/hooks/auto-manifest.py` | PostToolUse — regenerates manifest after MDX edits |
| | `.claude/hooks/sprint-context.py` | SessionStart — injects lesson-progress table into context |
| **Settings** | `.claude/settings.json` | Permissions allowlist + hook wiring |
| **Commands** | `/new-lesson <module> <order> <locale>` | Scaffold a lesson via content-writer |
| | `/sim-check` | Run simulator security audit (delegates to skill) |
| | `/qa-pass` | Run qa-reviewer on files touched since HEAD |
| | `/sprint-status` | Print lesson-progress table |
| | `/ship-ready` | Full gate: lint + manifest + build + security-reviewer |
| **Skills** | `.claude/skills/simulator-security-audit/` | `audit.sh` — canonical security checks (also used by CI) |
| | `.claude/skills/spanish-accent-check/` | `scan.sh` — surface common missing-accent patterns |
| | `.claude/skills/mdx-lesson-scaffold/` | Lesson template + schema docs |

**Hooks enforce** the non-negotiable rules listed above. If a hook blocks an edit, do NOT bypass it — either the rule genuinely applies, or the rule needs a documented exception (edit `SAFE_PATHS` in the hook script + commit the change).

---

## Development Commands

```bash
pnpm dev              # Next.js 16 dev server (Turbopack by default)
pnpm build            # Production build
pnpm generate-manifest # Regenerate content/manifest.json after MDX changes
```

---

## Key Architecture Decisions

### Why DENY ALL RLS?
We use Auth.js v5 with our own JWT — NOT Supabase Auth. Therefore `auth.uid()` is always `null` in RLS policies. All DB access goes through the service role key on the server, which bypasses RLS anyway. RLS is defense-in-depth as a deny-all layer.

### Why AGPL-3.0?
The simulator code could be repurposed into actual phishing tools. AGPL requires any modified version run as a service to be open-sourced, preventing commercial phishing-as-a-service wrappers.

### Why no email/password auth?
Privacy by design. We never store passwords. OAuth gives us a unique ID without requiring email storage.

### Why JSONB for progress (not normalized tables)?
Progress is always read/written per-user as a whole blob. JSONB eliminates N+1 queries, a max user payload is under 5KB, and it's indexable if analytics are needed later.

---

## Content Structure

```
content/modules/
  passwords/        — 2/6 lessons done
  phishing/         — 2/7 lessons done
  mfa/              — 2/5 lessons done
  simulators/       — 0/5 lessons done
  wifi/             — 0/5 lessons done
  social-media/     — 0/6 lessons done
  pass-manager/     — 0/6 lessons done
  device-security/  — 0/5 lessons done
```

Run `pnpm generate-manifest` after any content changes.

---

## Next Steps (Sprint 3 Backlog)
- Complete lesson content for all 8 modules (6 modules need content)
- Legal pages (`/[locale]/legal/privacy` and `/[locale]/legal/terms`)
- Settings page (`/[locale]/settings`) — language, theme, account management
- `robots.txt` and `sitemap.xml`
- GitHub Actions CI (build + lint on PR)
- Vercel deployment configuration
- Initial git commit and push to https://github.com/256javy/safia
