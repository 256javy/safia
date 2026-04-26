# Safia — Design System

> Source of truth for visual design. If a component disagrees with this file, the file is right.
> Tagline: **"Aprende a protegerte."**
> Audience: people who don't know what a browser is. Calm, clear, confident — never alarming.

## 1. Brand voice

- **Calm, not alarmist.** We teach defense. Phishing already feels scary; our job is to make it feel learnable.
- **Plain language, zero jargon.** No "vector", "MFA", "exfiltration". A 12-year-old should understand every sentence.
- **Analogy-driven.** Passwords are house keys. 2FA is two locks. The simulator is a flight simulator.
- **Confident, not preachy.** We respect the reader's intelligence. We don't moralize about being "online safely".
- **Warm, but trustworthy.** Closer to Duolingo's encouragement + Stripe's clarity than Coursera's sterility or 1Password's intimidation.

## 2. Color

Safia is a **dark-first** product. Dark mode is default; light mode is an opt-in. The palette is
built around a single brand hue (violet) with neutral grays and three signals (success / warning /
danger). Each scale follows a Radix-style 12-step model:

| Step | Use                                  |
|------|--------------------------------------|
| 1    | App background                       |
| 2    | Subtle surface background            |
| 3    | Component surface (rest)             |
| 4    | Component surface (hover)            |
| 5    | Component surface (active / pressed) |
| 6    | Subtle border / separator            |
| 7    | UI border                            |
| 8    | Hover border / focus ring outer      |
| 9    | Solid fill (brand button)            |
| 10   | Solid fill (hover)                   |
| 11   | Low-contrast text                    |
| 12   | High-contrast text                   |

### 2.1 Dark theme (default)

```
/* Neutrals — slate cooled toward violet */
--neutral-1:  #0d0a1a   App background
--neutral-2:  #14102a   Subtle surface
--neutral-3:  #1b1340   Card / component surface
--neutral-4:  #241a52   Component hover
--neutral-5:  #2d2168   Component active
--neutral-6:  #3a2b86   Subtle border
--neutral-7:  #4d3aa8   UI border
--neutral-8:  #6a52c9   Hover border / focus ring
--neutral-11: #a8a3b8   Secondary text
--neutral-12: #f0eef6   Primary text
--neutral-muted: #6b6580  Muted / disabled text

/* Violet (brand) */
--violet-3:   rgba(139, 92, 246, 0.10)  Subtle accent fill
--violet-4:   rgba(139, 92, 246, 0.16)  Accent hover fill
--violet-6:   rgba(139, 92, 246, 0.30)  Accent border
--violet-9:   #8b5cf6                   Solid brand
--violet-10:  #7c3aed                   Solid brand hover
--violet-11:  #c4b5fd                   Brand text on dark
--violet-12:  #ede9fe                   High contrast brand text

/* Signals */
--success-9:  #22c55e   --success-3: rgba(34, 197, 94, 0.12)
--warning-9:  #f59e0b   --warning-3: rgba(245, 158, 11, 0.12)
--danger-9:   #ef4444   --danger-3:  rgba(239, 68, 68, 0.12)
```

### 2.2 Light theme

```
--neutral-1:  #ffffff
--neutral-2:  #faf9fc
--neutral-3:  #f4f2f9
--neutral-4:  #ece8f5
--neutral-5:  #e0d9ee
--neutral-6:  #d1c8e6
--neutral-7:  #b9aed5
--neutral-8:  #8b7cb8
--neutral-11: #5d5470
--neutral-12: #1a1530
--neutral-muted: #8a8398

--violet-9:   #7c3aed
--violet-10:  #6d28d9
--violet-11:  #5b21b6
```

### 2.3 Semantic aliases (the only names components should use)

```
--color-bg-base       = neutral-1
--color-bg-subtle     = neutral-2
--color-bg-surface    = neutral-3
--color-bg-elevated   = neutral-4
--color-bg-pressed    = neutral-5

--color-border-subtle = neutral-6
--color-border        = neutral-7
--color-border-strong = neutral-8

--color-text-primary  = neutral-12
--color-text-secondary= neutral-11
--color-text-muted    = neutral-muted

--color-accent        = violet-9
--color-accent-hover  = violet-10
--color-accent-muted  = violet-3
--color-accent-text   = violet-11

--color-success       = success-9
--color-success-muted = success-3
--color-warning       = warning-9
--color-warning-muted = warning-3
--color-danger        = danger-9
--color-danger-muted  = danger-3
```

**Why this layout:** components depend on the alias names, never the raw scale. Switching themes
is a re-mapping, not a rewrite. Existing utility classes (`bg-bg-base`, `text-text-primary`, etc.)
keep their old token names; we extend the palette instead of renaming it.

### 2.4 Gradients

Gradients are decoration, not signal. Use sparingly: hero, primary CTA, occasional headline accent.

```
--gradient-hero:    linear-gradient(135deg, #14102a 0%, #2d1b69 50%, #14102a 100%)
--gradient-accent:  linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)
--gradient-soft:    radial-gradient(circle at top, rgba(139,92,246,0.10), transparent 60%)
--gradient-text:    linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 50%, #c4b5fd 100%)
```

## 3. Typography

### 3.1 Stack

```
--font-sans:    "Inter Variable", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif
--font-display: "Inter Variable", "Inter", system-ui, -apple-system, sans-serif   /* same family, tighter tracking */
--font-mono:    ui-monospace, "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace
```

Inter is the workhorse. We do **not** ship a serif fallback for the hero — it adds a font request
for one heading and breaks visual consistency. The hero leans on size, weight, and gradient text
instead.

### 3.2 Modular scale

| Token | px  | Usage                              |
|-------|-----|------------------------------------|
| xs    | 12  | Captions, legal copy, eyebrows     |
| sm    | 14  | Secondary UI, table cells          |
| base  | 16  | Body text, default UI              |
| md    | 18  | Lead paragraphs, large body        |
| lg    | 20  | Section labels, large UI           |
| xl    | 24  | H4, large card titles              |
| 2xl   | 30  | H3                                 |
| 3xl   | 36  | H2                                 |
| 4xl   | 48  | H1 on inner pages                  |
| 5xl   | 60  | Hero secondary                     |
| 6xl   | 72  | Hero primary (desktop)             |

### 3.3 Line heights

- **Display** (4xl+): `1.05` — tight, dramatic.
- **Heading** (xl–3xl): `1.2`.
- **Body** (base, md): `1.6` for prose, `1.5` for UI.
- **Tight UI** (xs, sm): `1.4`.

### 3.4 Weights

We use four: **400** (regular), **500** (medium UI), **600** (semibold for buttons + section
labels), **700** (bold headings). No 800/900 — too shouty for our voice.

### 3.5 Tracking

- Display headings: `-0.02em` (visible only at 36px+).
- Body: `0`.
- Eyebrows / uppercase labels: `0.08em`.

## 4. Spacing

4px base. The scale is intentionally short — fewer choices, more consistency.

| Token | px  | Common use                              |
|-------|-----|-----------------------------------------|
| 1     | 4   | Hairline gaps inside dense UI           |
| 2     | 8   | Icon ↔ label                            |
| 3     | 12  | Tight stacking                          |
| 4     | 16  | Default gap                             |
| 6     | 24  | Card padding                            |
| 8     | 32  | Between sibling sections within a card  |
| 12    | 48  | Section padding (mobile)                |
| 16    | 64  | Section padding (desktop)               |
| 24    | 96  | Hero vertical breathing                 |
| 32    | 128 | Page-defining whitespace                |

## 5. Radii

| Token | px  | Use                                    |
|-------|-----|----------------------------------------|
| sm    | 6   | Inputs, small chips, pills             |
| md    | 10  | Buttons, list items, menu rows         |
| lg    | 14  | Cards (default)                        |
| xl    | 20  | Hero cards, modals                     |
| 2xl   | 28  | Marketing cards, large CTA blocks      |
| full  | 9999| Pills, avatars, dot indicators         |

## 6. Shadows

Shadows are **soft and violet-tinted on dark**, not gray. On light mode they go neutral.

```
/* Dark */
--shadow-sm:  0 1px 2px rgba(13, 10, 26, 0.4)
--shadow-md:  0 4px 12px rgba(13, 10, 26, 0.5), 0 0 0 1px rgba(255,255,255,0.04)
--shadow-lg:  0 16px 40px rgba(13, 10, 26, 0.6), 0 0 0 1px rgba(255,255,255,0.05)
--shadow-glow: 0 0 24px rgba(139, 92, 246, 0.28)
--shadow-glow-strong: 0 0 32px rgba(139, 92, 246, 0.45)

/* Light */
--shadow-sm:  0 1px 2px rgba(20, 16, 42, 0.06)
--shadow-md:  0 4px 12px rgba(20, 16, 42, 0.08), 0 0 0 1px rgba(20,16,42,0.04)
--shadow-lg:  0 16px 40px rgba(20, 16, 42, 0.12)
```

## 7. Motion

Reduced motion always wins (`@media (prefers-reduced-motion)` collapses durations to ~0ms).

```
--motion-duration-fast: 120ms   /* hover, micro-state */
--motion-duration-base: 220ms   /* standard enter/exit */
--motion-duration-slow: 360ms   /* hero, layout shift */

--motion-ease-out:    cubic-bezier(0.16, 1, 0.3, 1)   /* enter */
--motion-ease-in:     cubic-bezier(0.7, 0, 0.84, 0)   /* exit */
--motion-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) /* hover lift */
```

Rules:
- Enter: ease-out, opacity + small Y (8–16px).
- Exit: ease-in, faster (~150ms).
- Hover lift: spring, max 4px Y, never scale > 1.02 on cards.
- Never animate background-color on a primary action (causes paint flicker on slow GPUs).

## 8. Components

Anatomy is described in tokens; states cover what changes per state.

### 8.1 Button

**Variants:** `primary`, `secondary`, `ghost`, `danger`.

```
height:     40px (default), 32px (sm), 48px (lg)
padding:    0 16px (default)
radius:     md (10px), or xl (20px) for hero CTAs
font:       sm/semibold (default), base/semibold (lg)
gap (icon): 8px
```

| Variant     | Rest                              | Hover                            | Pressed         | Focus                          |
|-------------|-----------------------------------|----------------------------------|-----------------|--------------------------------|
| primary     | `--gradient-accent` text white    | shadow-glow + 1.02 scale         | scale 0.99      | 2px ring `--color-accent`      |
| secondary   | `bg-elevated` text-primary border | `border-strong`                  | `bg-pressed`    | 2px ring `--color-accent`      |
| ghost       | transparent text-secondary        | `bg-elevated/50` text-primary    | `bg-elevated`   | 2px ring `--color-accent`      |
| danger      | `--color-danger` text white       | brightened by ~6%                | scale 0.99      | 2px ring `--color-danger`      |

Disabled: `opacity 0.5`, no hover transforms.

### 8.2 Input

```
height: 44px         radius: md
border: 1px solid --color-border
bg:     --color-bg-subtle (dark) / white (light)
font:   base/regular
padding: 0 14px
```

States: focus → border `--color-accent` + 3px ring `--color-accent-muted`.
Error → border `--color-danger`, helper text in `--color-danger`.

### 8.3 Card

```
bg:      --color-bg-surface
border:  1px solid --color-border-subtle
radius:  lg (14px)
padding: 24px (default), 16px (compact)
shadow:  none at rest, --shadow-md on hover (when interactive)
```

Interactive cards: hover lifts 2px (spring), border → `--color-border`. Cards are not buttons —
if the whole thing is clickable, wrap once with `<button>` or `<a>` and skip nested click targets.

### 8.4 Chip / Pill

```
height: 24px         radius: full
padding: 0 10px
font:    xs/medium
```

Variants: `neutral` (border-subtle / text-secondary), `accent` (accent-muted / accent-text),
`success` / `warning` / `danger` (signal-muted / signal-9).

### 8.5 Badge (status)

Same anatomy as chip but always carries an icon at 12px. Use for "2FA enabled", "Strong",
"Beta" — semantic tags, not interactive.

### 8.6 Banner (info / warning / training)

```
radius:  lg
padding: 12px 16px
border:  1px solid signal-9 (alpha 0.3)
bg:      signal-muted
```

The simulator training banner is a special, non-removable variant — see CLAUDE.md security rules.

### 8.7 Strength meter

5 segments at full radius. Segment color escalates: `danger-9 → warning-9 → success-9`. Idle
segments use `--color-bg-elevated`. Always pair with a numeric or labeled score for screen readers.

## 9. Layout

```
--max-prose:   640px   /* lesson body */
--max-content: 1024px  /* most pages */
--max-page:    1280px  /* hero / marketing */

--section-y-mobile:  64px
--section-y-desktop: 96px

--page-x: clamp(16px, 5vw, 32px)
```

Grid: 12-column on desktop with 24px gutters; 4-column on mobile with 16px gutters. Default to
flex/auto-grid; reach for the 12-col only when alignment across siblings demands it.

## 10. Iconography

- **Library:** `lucide-react` (preferred), or hand-rolled SVG when a brand mark is required.
- **Default size:** 20px. Inline-with-text: 16px. Hero / illustrations: 24–32px.
- **Stroke:** 1.5 (default) — 2 only for very small icons (≤14px) to keep them legible.
- **Color:** inherit `currentColor`, never hard-code unless it's a brand mark (e.g. Google "G").
- **Spacing:** always 8px gap to adjacent text.

## 11. Tone — copy do/don't

| Don't                                              | Do                                                       |
|----------------------------------------------------|----------------------------------------------------------|
| "Authenticate with your credentials"               | "Inicia sesión con tu contraseña"                        |
| "Enable MFA to mitigate credential-stuffing risk"  | "Activa la verificación en dos pasos. Es como dos llaves." |
| "Your password strength is suboptimal"             | "Esta contraseña es fácil de adivinar. Probemos otra."   |
| "WARNING: Phishing detected!"                      | "Algo no cuadra en esta página. Mira la URL."            |
| "An error occurred"                                | "No pudimos guardar el cambio. Intenta de nuevo."        |
| "You will be redirected"                           | "Te llevamos a la siguiente pantalla."                   |

Rules:
- Spanish first; orthography is non-negotiable (¿ ¡ á ñ é í ó ú).
- Sentence case in UI ("Crear cuenta", not "Crear Cuenta"). Title case is reserved for proper nouns.
- Numbers in numerals (`5 minutos`, not `cinco minutos`) when scanning matters.
- Verbs in imperative for buttons: "Empezar", "Continuar", "Activar".
- Never use exclamation marks for errors. Save them for celebration.

## 12. Accessibility

- **Contrast targets:** AA for body (4.5:1), AAA preferred for primary text on `bg-base`.
  All neutral-12 / neutral-1 pairs meet AAA. Violet-11 on neutral-1 meets AA (small text).
- **Focus:** every interactive element has a visible 2px ring with 2px offset on `--color-accent`.
  Never `outline: none` without a replacement.
- **Motion:** `prefers-reduced-motion: reduce` collapses transitions and disables auto-playing
  particles / pulses.
- **Touch targets:** 44×44 minimum. Apply to icon-only buttons via padding, not size.
- **Localization:** every visible string lives in `messages/*.json`. Never hardcode user-facing
  Spanish or English in JSX.

## 13. Layering / z-index

```
--z-base:     0
--z-raised:   10    cards on hover, popovers
--z-overlay:  100   dropdowns, tooltips
--z-modal:    1000  dialogs, sheets
--z-toast:    1100  toasts
--z-sim-banner: 99  simulator training banner (intentionally below modals so confirms still work)
```

## 14. Agent style guide for design work

When iterating on visuals through agent skills, match prompt patterns to skill:

- **`/design-shotgun`** — give it 1-2 reference moods + a single goal ("Make the empty state feel
  like an invitation, not a void"). Keep variants under 4; more is paralysis.
- **`/plan-design-review`** — paste the plan or component spec; ask for ratings on **hierarchy,
  density, motion, tone**. Reject any review that scores >9/10 without naming a specific
  weakness — that means the review didn't actually look.
- **`/design-review`** (live audit) — point it at the running URL, not the source. Have it
  capture before/after on the same viewport. Reject "pixel perfect" claims without screenshots.
- **`frontend-design`** skill — best for net-new components from a written brief. Always pass
  this DESIGN.md as context; otherwise it'll re-invent tokens.

Anti-patterns to flag in any agent output:
- Bumping every heading by one weight class ("more contrast") — usually it's a spacing problem.
- Adding shadow-glow on more than one element per viewport.
- Replacing semantic aliases with raw hex in components — always token, never hex.
- Adding a new "subtle gradient overlay" to fix a flat-looking section. Real fix: hierarchy.
