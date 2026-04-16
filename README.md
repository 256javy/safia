# Safia — Security Learning Platform

> **"Aprende a protegerte."**

Safia is a free, open-source security learning playground for non-technical users — office workers, everyday people who use phones and computers daily but feel intimidated by security tools.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-purple)](https://github.com/256javy/safia)

---

## What is Safia?

Safia teaches real-world digital security skills through:

- **Interactive lessons** — MDX content with no jargon, written for people who've never heard the word "phishing"
- **Auth simulators** — pixel-accurate replicas of real login flows (with a mandatory training banner) so you can practice safely
- **Gamification** — XP, levels, badges, and streaks to keep you motivated
- **Guest-first** — 100% of the experience works without creating an account

**Not** a security tool. **Not** a credential manager. **Not** a CTF platform.

---

## Features

| Feature | Status |
|---|---|
| Module catalog (passwords, phishing, MFA, simulators, WiFi, social media) | ✅ MVP |
| MDX lesson viewer with in-lesson quizzes | ✅ MVP |
| Auth simulators — Google, Facebook, Instagram, X, TikTok, Banking | ✅ MVP |
| XP system, 10 levels, 16 badges, streaks | ✅ MVP |
| Visual learning roadmap | ✅ MVP |
| Guest mode — full progress in localStorage | ✅ MVP |
| OAuth sync — Google, GitHub, Apple | ✅ MVP |
| i18n — Spanish, English, Portuguese | ✅ MVP |
| "Ask AI" prompts inline in lessons | ✅ MVP |
| Coach marks for first-time visitors | ✅ MVP |

---

## Tech Stack

| Package | Role |
|---|---|
| Next.js 16 (App Router) | Framework |
| React 19 + TypeScript 5 | UI runtime + type safety |
| Tailwind CSS v4 | Styling (CSS-first `@theme`) |
| next-intl | i18n — ES/EN/PT |
| Auth.js v5 | OAuth only — no passwords stored |
| Supabase (PostgreSQL) | DB for authenticated users |
| Zustand | Client state + guest progress |
| Framer Motion | Animations |
| next-mdx-remote | MDX lesson rendering |

**Hosting:** Vercel · **DB:** Supabase free tier

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/256javy/safia.git
cd safia

# 2. Install (este proyecto usa pnpm)
# Si no lo tienes: npm install -g pnpm
pnpm install

# 3. Environment variables
cp .env.local.example .env.local
# Fill in Supabase and OAuth credentials (see .env.local.example)

# 4. Generate content manifest
pnpm generate-manifest

# 5. Run
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/es` (Spanish default).

### Environment variables

See `.env.local.example` for all required variables. You need:

- A [Supabase](https://supabase.com) project (free tier is enough)
- At least one OAuth app (Google, GitHub, or Apple)
- Run the SQL migrations in `supabase/migrations/` in your Supabase SQL editor

---

## Project Structure

```
app/              Next.js App Router — pages and API routes
features/         Feature components (courses, simulator, gamification, landing...)
components/       Shared UI (layout, shadcn/ui primitives)
lib/              Core utilities (auth, supabase, content loader, i18n)
stores/           Zustand stores (progress, session, ui)
content/modules/  MDX lesson content, organized by module
messages/         i18n strings (es.json, en.json, pt.json)
scripts/          Build tools (generate-manifest.ts)
supabase/         SQL migrations
```

---

## Privacy by Design

- **No email stored** — OAuth gives us only a provider user ID
- **No passwords** — OAuth only, no email/password auth
- **No cookie banner** — one strictly-necessary session cookie
- **No analytics** — no tracking, no ads, no data selling
- **Right to erasure** — `DELETE /api/me` wipes your account completely
- **Guest mode** — zero server data; progress lives in your browser only

---

## Simulator Security

The auth simulators are pixel-accurate replicas of real login flows. They exist for education only and are protected by multiple layers — see [SECURITY.md](SECURITY.md) for details.

**If you find a way to bypass simulator protections, please report it immediately via the security policy.**

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, code conventions, and how to add lessons or modules.

All contributions welcome — especially:
- New lesson content (any of the 8 modules)
- Translations (EN and PT need love)
- Accessibility improvements
- New simulator platforms

---

## License

[AGPL-3.0](LICENSE) — free to use, modify, and distribute. If you run a modified version as a service, you must open-source your changes.

The AGPL license was chosen intentionally: it prevents the simulator code from being repurposed into actual phishing tools behind a commercial wrapper.
