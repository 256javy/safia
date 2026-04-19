# Safia — Style Guide

Voice, tone, pedagogy, and editorial discipline for everything users read on Safia. This document is binding for contributors and reviewers: a lesson, simulator, or UI string that violates this guide does not ship, regardless of how accurate its content is.

This document is an extension of `VISION.md §6` — specifically *Dignity under duress*, *Task-first surfacing*, *Radically accessible*, *Author humility*, and *Freshness as editorial promise*.

---

## 1. The reader

Before any stylistic rule: know who is on the other end of the page.

The person reading a Safia lesson is, by default, assumed to be:

- Not a technologist. Their technology life is social media, spreadsheets, and a work email.
- In an unknown emotional state. They might be calm, they might be in crisis, they might be embarrassed. The writing cannot assume which.
- Reading on a mid-range phone on a slow network. Every kilobyte and every extra word is a tax.
- Interrupted. They have three minutes, not thirty.
- Fluent in the register they speak in, not in the register a textbook speaks in.

If your writing loses any of these people, it is not more "precise." It is a worse lesson.

## 2. Voice

Safia sounds like a trusted friend who happens to know this stuff — **calm, specific, and never condescending.** Not a teacher. Not a security consultant. Not a chirpy app.

Practical rules:

- **Second person, present tense.** *"Abres el correo y ves un mensaje que parece urgente."* Not *"El usuario abrirá el correo."*
- **Short sentences by default.** If a sentence runs past three lines, split it. Clauses are cheaper than commas in this context.
- **Concrete nouns.** *"el enlace del mensaje"*, not *"el vector de entrada"*.
- **No jargon on first use without a gloss.** If the word cannot be replaced by plain Spanish, it is defined inline the first time it appears. The gloss is one sentence.
- **Analogies before mechanisms.** Readers build models from what they already know. A firewall is *"un portero en la puerta del edificio"* before it is *"un filtro de red."*
- **The word "simple" is banned.** If something were simple to the reader, they would not need the lesson. Calling it simple is either a lie or an insult.
- **Spanish orthography is non-negotiable.** Accents, *ñ*, *¿*, *¡*. Missing them is not a casual choice; it is a signal that the author did not proofread.

## 3. Dignity under duress

The reader may have just been attacked. Everything they read passes through shame, fear, or anger. The writing must never amplify any of those.

Rules:

- **Never imply the reader was careless, naive, or stupid.** Not in the lesson, not in the quiz feedback, not in the error messages. *"You should have known"* — and every polite disguise of it — does not exist.
- **Blame the attacker, not the victim.** Phishing works because it is engineered to work, not because the user failed. Every lesson describing an attack names this explicitly at least once.
- **Name the emotion if relevant.** *"Si acabas de enviar los datos y te das cuenta ahora, lo que sientes es normal. Sigue leyendo — hay cosas que puedes hacer ahora mismo."*
- **Give the fix before the theory.** A person in crisis needs *"cambia tu contraseña ahora, aquí está el botón"* before they need the history of authentication systems.
- **No sarcasm. No jokes at the reader's expense.** Humor about attackers is fine in moderation. Humor about users is not.

## 4. Task-first naming (enforced)

`VISION.md §6` mandates that tools are named by the problem they solve. This is not a soft preference — it is blocking.

- **Every user-facing tool, lesson, quiz, and simulator has a task-first public name.** Its internal slug, file name, and URL may use the taxonomy; its public label does not.
- **Compliance test:** a person who has never heard the concept must be able to read the name and recognize the problem. If they cannot, the name fails.

| Don't | Do |
|---|---|
| Multi-Factor Authentication Module | Protege tu cuenta aunque te roben la contraseña |
| Introducción a la criptografía simétrica | Qué significa que un mensaje esté "cifrado" |
| Cybersecurity 101 | Lo primero que necesitas saber para estar seguro en internet |
| Phishing Awareness | Cómo reconocer un mensaje que quiere engañarte |
| Account Recovery Flow | Recupera una cuenta hackeada |

A reviewer who sees a taxonomy-style public name blocks the PR.

## 5. Dual-use content test

`VISION.md §9` declares that Safia does not host content that teaches attackers. The operational test applies to every lesson, simulator, and writeup that touches offensive technique:

> **Content passes if an attacker holding the material in hand gains no capability beyond what is already available in mainstream public writing.**

Checklist:

- Does the material include a working artifact (template, payload, ready-to-run script) an attacker could use directly? → **blocked.**
- Does the material describe attacker technique at a level that a motivated non-expert could operationalize after a weekend of effort? → **blocked.**
- Does the material describe attacker technique at the level of *pattern recognition* — enough to defend, not enough to execute? → **permitted.**
- Is the information already one search query away in reputable blogs or academic papers, and does the framing serve defense? → **permitted.**

Borderline cases go to RFC (`GOVERNANCE.md §5`). The author carries the burden of proof; a reviewer who is unsure votes block.

## 6. Freshness

`VISION.md §6` promises every content piece a visible last-reviewed date. Here is how that promise is operationalized.

- Every lesson's MDX frontmatter includes `last_reviewed: YYYY-MM-DD`.
- The rendered page shows that date in the lesson footer, human-readable: *"Revisado por última vez el 14 de marzo de 2026."*
- Once the date is older than 12 months, the page shows a yellow banner at the top: *"Este contenido está pendiente de revisión. Sigue siendo útil, pero puede no reflejar cambios recientes."* The banner links to the open review issue.
- Once the date is older than 18 months without a new review, the page is moved to `archive/` and a redirect is installed. The lesson is not deleted — it is marked stale.
- Reviews are triggered automatically: a monthly CI job opens a GitHub issue for every lesson hitting 11 months, assigned to the lesson's named steward (`GOVERNANCE.md §6`).

Freshness is not a nice-to-have. Stale content on a trust-critical site is a silent liability.

## 7. Bias checklist

Run this against every new lesson before submitting for review. Append the completed checklist to the PR description.

- **Audience.** Does the lesson address the reader described in §1, or does it drift toward a more technical reader?
- **Names and pronouns.** Are examples gender-balanced, or do all *"el usuario"* references default to one gender?
- **Cultural defaults.** Are examples rooted in Spanish-speaking contexts (banking, common apps, social norms) rather than translated American defaults?
- **Regional diversity.** Do examples cite places, currencies, and institutions from across the Spanish-speaking world, not only one country?
- **Ability and age.** Does the lesson work for readers who are older, who use screen readers, who have lower literacy, or who have never used the device described?
- **Socioeconomic defaults.** Does the lesson assume a paid service the reader might not afford? Does it mention free alternatives?
- **Tone re-read.** Re-read the lesson as if the reader had been attacked this morning. Does any sentence make them feel worse?

Checklist items truly not applicable are marked N/A with a one-sentence reason. Blank checkboxes block review.

## 8. Accessibility baselines

A lesson that excludes readers is a failed lesson. Non-negotiable minimums:

- **Reading level.** Target B1 (CEFR) Spanish. A dense paragraph is not a badge — it is a bug.
- **Word count.** 400–600 words per lesson, hard ceiling 800. Beyond that, split the lesson.
- **WCAG 2.2 AA** compliance for rendered pages. Automated checks run in CI; a manual screen-reader pass is required for any page with custom interactive elements.
- **Performance.** Total page weight under 200 KB on a cold load, excluding images. Interactive elements functional without JavaScript where technically possible.
- **Network.** Lesson reads end to end on a throttled 3G profile in under ten seconds.
- **Device.** Lesson is usable on a 360-pixel-wide viewport and on a five-year-old mid-range Android.

Pages that fail any minimum do not merge.

## 9. Frontmatter schema

Every lesson MDX file begins with:

```yaml
---
title: string                 # user-facing, task-first (§4)
description: string           # 1-2 sentences, shown in listings and OpenGraph
module: string                # slug of the parent module
order: integer                # order within the module
locale: "es" | "en" | ...
xp_reward: integer | null     # Range only; null for atlas lessons
last_reviewed: YYYY-MM-DD     # see §6
steward: string               # GitHub handle responsible for freshness
author: string                # real name or durable pseudonym; see §11
assumes:                      # declared prerequisites, if any
  - slug-of-prerequisite
audience:                     # which states from VISION.md §4 this serves
  - crisis | obligation | care | curiosity
quiz:                         # exactly 3 questions
  - question: string
    options: [string, string, string, string]
    correct: integer
    explanation: string
---
```

Fields outside the schema are not permitted. CI enforces this.

## 10. "This content assumes…" block

Every lesson whose `assumes` field is non-empty renders a visible block at the top of the lesson:

> **Este contenido asume que ya:**
> - Sabes qué es una cuenta en internet. Si no, empieza aquí: [*¿Qué es una cuenta?*](…)
> - Has creado al menos una contraseña. Si no, empieza aquí: [*Cómo funcionan las contraseñas*](…)

The block is always clickable and always offers a path in. A lesson that assumes prior knowledge without providing an entry point for a reader who lacks it is a broken lesson.

## 11. Author humility

`VISION.md §6` mandates visible authorship. In practice:

- Every lesson has a named author in frontmatter and footer. A real name or a durable pseudonym; never *"the team"* or *"Safia."*
- Every lesson ends with a short **"Cómo se escribió esta lección"** block linking to: primary sources, the reviewer(s), the date of last substantive change, and the open issue for reader feedback.
- Author disagreement is handled in public. If two authors hold different positions, the lesson names the disagreement rather than laundering it into a neutral tone.

The goal is a guide that invites contribution, not one that imposes a uniform corporate voice. Plurality is a feature, within the guardrails above.

## 12. How this document changes

Sections §3 (dignity), §4 (task-first naming), §5 (dual-use), §6 (freshness), and §8 (accessibility) change only through the RFC process in `GOVERNANCE.md §5`. They enforce `VISION.md` obligations and are load-bearing.

Everything else — concrete examples, schema fields, reading-level tooling — evolves as the project learns.

When in doubt: re-read `VISION.md §6` and §1 of this document. The reader is the arbiter; the guide serves the reader.
