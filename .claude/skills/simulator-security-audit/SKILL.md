---
name: simulator-security-audit
description: Runs the full simulator security audit for Safia — verifies zero network calls, preventDefault usage, triple-redundant training banner, noindex metadata, CSP frame-ancestors, and SUPABASE_SERVICE_ROLE_KEY isolation. Use before any commit that touches features/simulator/ or app/[locale]/simulator/, before merging any PR, and before deploying. Returns a structured pass/fail report.
allowed-tools: Bash, Grep, Read
---

# Simulator Security Audit

The Safia auth simulators are pixel-accurate replicas of real login flows. If weakened, they become phishing tools. This skill enforces the invariants.

## Run the audit

```bash
bash ${CLAUDE_SKILL_DIR}/audit.sh
```

The script exits `0` on PASS, `1` on any blocker. stdout contains the structured report.

## What it checks

| Check | Command (summary) | Blocker |
|---|---|---|
| No network APIs in simulator | `grep -rE 'fetch\(|axios|XMLHttpRequest|node-fetch' features/simulator/` | Yes |
| preventDefault on form handlers | Every `onSubmit`/`handleSubmit` has a `preventDefault()` above | Yes |
| TrainingBanner component used | `grep -r TrainingBanner features/simulator/` | Yes |
| noindex on all simulator pages | `grep -r robots app/[locale]/simulator/` | Yes |
| CSP frame-ancestors none | Present in `next.config.ts` | Yes |
| Service role key only in server.ts | No matches outside `lib/supabase/server.ts` | Yes |
| JWT payload = userId only | `lib/auth/auth.ts` session callback returns `{id}` only | Yes |

## Report format

```
## Simulator Security Audit — <date>
✅ network-calls        no matches
✅ preventDefault       12 matches across 6 files
✅ training-banner      present in SimulatorShell.tsx
...
### Verdict: APPROVED
```

## When to invoke

- Before merging any PR that touches `features/simulator/`
- After editing `lib/auth/auth.ts`
- As part of `/ship-ready`
- In CI (CI runs the same `audit.sh` — single source of truth)
