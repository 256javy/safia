# Contributing to Safia

Thank you for helping make security education more accessible. Safia is a free, open-source platform and every contribution matters.

Before writing code or content, read these three documents in order — they are short:

1. [`VISION.md`](./VISION.md) — why Safia exists, who it serves, what it must always be.
2. [`STYLE.md`](./STYLE.md) — how we write for the reader. Binding for any content or user-facing string.
3. [`GOVERNANCE.md`](./GOVERNANCE.md) — how decisions are made. Relevant the moment a change feels non-trivial.

## Before your first contribution

### Sign your commits (DCO)

Every commit to Safia must carry a `Signed-off-by` line:

```
git commit -s -m "feat: add lesson on recognizing fake bank emails"
```

By signing, you assert the [Developer Certificate of Origin](https://developercertificate.org/) **and** you grant Safia's maintainers explicit permission to relicense your contribution to any future version of the AGPL or a compatible copyleft license. This keeps Safia's copyleft spirit intact and prevents the project from being trapped if the licensing ecosystem shifts. See `VISION.md §6` (*Relicensing possible, relicensing deliberate*).

PRs with unsigned commits are asked to rebase with `-s`. No exceptions.

### Pick the right process

| Change | Process |
|---|---|
| Typo, small copy tweak, bug fix, dependency bump | Open a PR directly |
| New lesson, new simulator, new UX flow | Open a PR; expect reviewer input on voice and pedagogy |
| New track, new certificate tier, new Range season format, architectural shift | Open an RFC first (`GOVERNANCE.md §5`) |
| Anything touching `VISION.md §2/§6/§8/§9` or `SUSTAINABILITY.md §1/§3` | Amendment RFC (`GOVERNANCE.md §4`) |

When in doubt, ask in a GitHub Discussion before opening the PR. Escalating is cheap; un-escalating is not.

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

1. **Pick a task-first slug.** The slug names the problem, not the taxonomy. *"recupera-cuenta-hackeada"*, not *"account-recovery-module-3"*. See `STYLE.md §4`.
2. Create `content/modules/[module]/lessons/[lesson-slug].es.mdx`. Spanish first — always.
3. Add English and Portuguese versions once the Spanish is reviewed: `lesson-slug.en.mdx`, `lesson-slug.pt.mdx`. A translation that ships before the source is approved is a bug.
4. **Fill the full frontmatter schema** from `STYLE.md §9`. Required fields include `last_reviewed`, `steward`, `author`, `audience`, and `assumes`. CI enforces the schema.
5. **Write for the reader.** Read `STYLE.md §1-§3` before drafting a single sentence. The reader is non-technical, possibly in crisis, on a slow phone, with three minutes.
6. **Run the bias checklist** in `STYLE.md §7` and paste the completed checklist into the PR description. Blank items block review.
7. **Check the word count.** 400–600 words, hard ceiling 800. Longer means split.
8. **Run `pnpm generate-manifest`.**
9. Test in dev at `/es/courses/[module]/[lesson-slug]` on a narrow viewport (360-375px) and on a throttled 3G profile in DevTools. If either fails, fix before opening the PR.

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

## ⚠️ Offensive content — dual-use test

Any lesson, simulator, or writeup that describes attacker technique must pass the dual-use test in `STYLE.md §5`:

> **Content passes if an attacker holding the material in hand gains no capability beyond what is already available in mainstream public writing.**

In practical terms:

- Showing what a phishing page looks like so a user can recognize it → **permitted.**
- Handing out a working, ready-to-personalize phishing template → **blocked.**
- Explaining the *pattern* of a social-engineering call script → **permitted.**
- Providing a fill-in-the-blanks script for someone to make such a call → **blocked.**

When you open a PR with offensive content, state explicitly in the description which side of the line the material sits on and why. Reviewers who are unsure vote block; the burden of proof is on the author.

Borderline cases go to RFC (`GOVERNANCE.md §5`).

## Freshness commitment

Every lesson has a named `steward` in its frontmatter. By adding yourself as a steward, you commit to reviewing that lesson at least once every twelve months (`STYLE.md §6`). A CI job will open an issue on your behalf once a lesson hits eleven months; you close it by updating `last_reviewed` with reasoning (even if the reasoning is "still accurate, no changes needed"). Unreviewed content is silently untrustworthy — and trustworthy is the one thing Safia cannot afford to lose.

If you cannot commit to stewardship, propose another maintainer as steward in the PR description.

## Pull Request Process

1. Fork the repo and create a branch: `feat/your-feature` or `fix/your-fix`.
2. Make your changes with clear, focused commits, each signed off (`git commit -s`). See "Sign your commits (DCO)" above.
3. Ensure `pnpm build`, `pnpm lint`, and `pnpm generate-manifest` all pass with no errors.
4. Open a PR with a clear description of what and why. For content PRs, paste the completed bias checklist (`STYLE.md §7`). For offensive content, state the dual-use position (§ above).
5. A maintainer will review within seven days (`GOVERNANCE.md §3` working definition). If you have not heard back, ping the PR — maintainers are human and miss things.
6. Address review comments in follow-up commits, not force-pushes, until the PR is approved. Squash-merge is the default on merge.

## Translations

Translations are in `messages/es.json`, `messages/en.json`, `messages/pt.json`. Spanish is the primary language — if you're adding new features, add ES keys first, then EN and PT.

## Questions?

- **Setup or "how do I do X in the codebase?"** — open a [GitHub Discussion](https://github.com/256javy/safia/discussions) or file an issue.
- **Editorial or pedagogical** — re-read `STYLE.md`; if it still is not answered, open a Discussion.
- **Product direction, scope, governance** — open an RFC draft under `docs/rfcs/` (`GOVERNANCE.md §5`) and mention maintainers. Half-formed RFCs are welcome; they get shaped in public.
- **Security report** — do not open a public issue. See [`SECURITY.md`](./SECURITY.md) for the disclosure process. (If `SECURITY.md` does not yet exist, email the maintainer listed in the repo metadata.)

## See also

- [`VISION.md`](./VISION.md) — the project's north star.
- [`STYLE.md`](./STYLE.md) — writing and pedagogy (binding).
- [`GOVERNANCE.md`](./GOVERNANCE.md) — how decisions are made.
- [`SUSTAINABILITY.md`](./SUSTAINABILITY.md) — funding principles.
- [`CLAUDE.md`](./CLAUDE.md) / [`AGENTS.md`](./AGENTS.md) — implementation constraints.
