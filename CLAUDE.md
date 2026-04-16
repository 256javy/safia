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

Always work with the full team for non-trivial features. Use agent teams (TeamCreate + Agent tool) — never solo implementation for features that span backend, frontend, and UX.

### Agents (defined in `.claude/agents/`)
| Agent | Role | When to use |
|---|---|---|
| `backend-architect` | API routes, DB, Auth.js, Supabase, MDX pipeline | Backend changes |
| `frontend-architect` | Pages, components, Zustand, i18n, TypeScript | Frontend changes |
| `ux-designer` | Visual design, animations, UX flows, Product Owner | UI/UX + product decisions |
| `security-reviewer` | Security audit, threat model verification | After EVERY feature |
| `content-writer` | MDX lessons, quiz content, i18n copy | Educational content |
| `qa-reviewer` | Spelling, accents, tone, i18n completeness | After any content/UI text changes |

### Team Workflow
1. **Sprint planning** — create TaskList with all tasks, assign to agents
2. **Parallel work** — backend + frontend work concurrently, UX unblocked after scaffolding
3. **Security review** — security-reviewer runs after every feature, blocks if issues found
4. **Build verification** — `pnpm build` must pass before marking sprint complete
5. **Alignment meetings** — Scrum Master (Claude) coordinates blockers via SendMessage

### Agent Coordination Rules
- Agents read team config from `~/.klaude/teams/[team-name]/config.json`
- Task ownership via TaskUpdate `owner` field
- Communicate via SendMessage — never assume teammates see your output
- `ux-designer` must always verify their working directory before writing files (past incident: wrote to wrong repo)
- `security-reviewer` runs last and has veto power on any feature

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
