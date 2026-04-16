# Contributing to Safia

Thank you for helping make security education more accessible. Safia is a free, open-source platform and every contribution matters.

## Quick Start (Local Setup)

```bash
# 1. Clone the repo
git clone https://github.com/256javy/safia.git
cd safia

# 2. Install dependencies (requires pnpm: npm install -g pnpm)
pnpm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and OAuth credentials

# 4. Generate content manifest
pnpm generate-manifest

# 5. Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/           Next.js App Router pages and API routes
features/      Feature-specific components (courses, simulator, gamification...)
components/    Shared UI components (layout, shadcn/ui)
lib/           Utilities (auth, supabase, content, i18n)
stores/        Zustand state (progress, session, ui)
content/       MDX lesson content organized by module
messages/      i18n translations (es, en, pt)
scripts/       Build utilities (generate-manifest)
supabase/      Database migrations
```

## How to Contribute

### Adding a lesson

1. Create `content/modules/[module]/lessons/[lesson-slug].es.mdx`
2. Add English and Portuguese versions: `lesson-slug.en.mdx`, `lesson-slug.pt.mdx`
3. Follow the frontmatter schema (see existing lessons for examples)
4. Run `pnpm generate-manifest`
5. Test in dev: navigate to `/es/courses/[module]/[lesson-slug]`

### Adding a new module

1. Create `content/modules/[slug]/index.mdx` with module frontmatter
2. Add lessons in `content/modules/[slug]/lessons/`
3. Update `features/courses/mock-modules.ts` and `features/roadmap/roadmap-data.ts`
4. Add i18n keys for module name/description in `messages/*.json`

### UI contributions

- Use design tokens from `app/globals.css` (`--color-accent`, `--color-bg-surface`, etc.)
- Respect `prefers-reduced-motion` in all animations
- All user-facing text must be in `messages/*.json` — no hardcoded strings
- Mobile-first: test at 375px, 768px, and 1280px

### Code conventions

- TypeScript strict mode — no `any`, no `@ts-ignore`
- Components: named exports, no default export except pages
- Server components by default; add `"use client"` only when needed
- API routes: always validate with Zod, always check session for protected routes

## ⚠️ Simulator Security — Read This

The auth simulators are the most sensitive part of the project. They are pixel-accurate replicas of real login flows, built for educational purposes only.

**Non-negotiable rules for simulator code:**

1. **Zero network calls** — `fetch`, `axios`, or any HTTP client is FORBIDDEN inside `features/simulator/`. An ESLint rule enforces this.
2. **`e.preventDefault()` on every form** — hardcoded, never removed.
3. **Training banner must always be visible** — triple-redundant implementation. Do not remove or weaken any layer.
4. **No `action` attributes on forms** — forms must not point to any URL.

If your PR touches simulator code, it will receive extra scrutiny. This is not optional — it's how we prevent the platform from being misused for actual phishing.

## Pull Request Process

1. Fork the repo and create a branch: `feat/your-feature` or `fix/your-fix`
2. Make your changes with clear, focused commits
3. Ensure `pnpm build` passes with no errors
4. Open a PR with a clear description of what and why
5. A maintainer will review within 48 hours

## Translations

Translations are in `messages/es.json`, `messages/en.json`, `messages/pt.json`. Spanish is the primary language — if you're adding new features, add ES keys first, then EN and PT.

## Questions?

Open a [GitHub Discussion](https://github.com/256javy/safia/discussions) or file an issue.
