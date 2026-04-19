# Safia — Atlas (product layer)

**Status: placeholder.** This directory is the home of Safia's **product specification** — the middle layer between *why* (`VISION.md`, `SUSTAINABILITY.md`) and *how* (`AGENTS.md`, `CLAUDE.md`, the source code).

## What lives here

Stack-agnostic specifications for each tool, track, and product subsystem in Safia. A document in this folder describes:

- **Purpose** — what problem the piece solves.
- **Users served** — where the piece lands on the audience plane (`VISION.md §8`) and the arrival states (`VISION.md §4`) it is designed for.
- **Contract** — inputs, outputs, completion criteria. What has to be true for the piece to be considered working.
- **Pedagogy** — if it teaches, how it teaches.
- **Privacy & safety constraints** — which `VISION.md §6` principles apply and how.
- **Open questions** — what is deliberately unresolved.

It does **not** describe:

- Frameworks, languages, libraries, file paths, or component names.
- Database schemas (unless the schema is a product-level contract, e.g., the public shape of a certificate verification page).
- Visual design beyond principles — specific typography, colors, and animation choices live in implementation docs.

## Why separate from the code

Safia's current implementation is Next.js 16 + React 19 + Supabase + Tailwind. That choice is **convenient, not essential**. The Safia *idea* and the Safia *product* must survive a full reimplementation in a different stack. Layer 1 (`VISION.md`) describes the idea; this layer describes the product; the codebase is one valid instantiation.

If Safia were forked into Svelte, Rails, or a static site tomorrow, `atlas/` would travel unchanged.

## How documents get added here

Rule: **every new tool, track, or product subsystem gets an `atlas/<name>.md` drafted before its implementation begins.** The atlas spec is the artifact that `/plan-eng-review` or similar planning skills work from. Code follows spec, not the other way around.

When the product layer matures, expect at minimum:

```
atlas/
  README.md                    this file
  catalogue.md                 canonical list of every tool/track with one-line summaries
  routes/                      curated routes on top of the atlas (the ladder, crisis path, …)
    ladder.md
    just-happened-to-me.md
    starting-a-security-job.md
    protecting-someone-i-love.md
  tools/                       individual tool specs (phishing range, 2FA tester, …)
  tracks/                      learning-track specs (passwords, phishing, mfa, …)
  certificates.md              certificate system — levels, contracts, verification
  range.md                     Safia Range / Labs (competitive wing)
  threat-model.md              which online threats Safia teaches against, and which it doesn't
  brand.md                     name, tagline, voice criteria (not implementations)
```

None of these files exist yet. They are drafted on demand, starting with whatever is designed first.

See also: `VISION.md`, `SUSTAINABILITY.md`, `GOVERNANCE.md`, `STYLE.md`.
