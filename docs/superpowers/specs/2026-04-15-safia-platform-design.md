# Safia — Security Learning Platform
## Master Design Spec
**Date:** 2026-04-15  
**Status:** Draft — Pending User Review  
**Repo:** https://github.com/256javy/safia  
**Team:** Product Owner + Backend Architect + Frontend Architect + UX Designer + Security Reviewer

---

## Table of Contents

1. [Vision & Principles](#1-vision--principles)
2. [Tech Stack](#2-tech-stack)
3. [Backend Architecture](#3-backend-architecture)
4. [Frontend Architecture](#4-frontend-architecture)
5. [UX & Learning Design](#5-ux--learning-design)
6. [Security & Privacy](#6-security--privacy)
7. [Roadmap (Features in Scope)](#7-roadmap-features-in-scope)
8. [Out of Scope (MVP)](#8-out-of-scope-mvp)

---

## 1. Vision & Principles

**Safia** is a free, open-source security learning playground for non-technical users — office workers, everyday people who use phones and computers daily but feel intimidated by security tools like Proton Pass or Google Authenticator.

**Tagline:** *"Safia te cuida."*

### Core Principles

| Principle | Implementation |
|---|---|
| **Guest-first** | 100% of the experience works without an account. Auth is optional — only needed to sync progress across devices. |
| **Privacy by design** | We teach security, so we practice it. No passwords stored. No emails unless opted in. No PII beyond what OAuth requires. |
| **Learn by doing** | Every concept has a practice step. Simulators replicate real platforms pixel-for-pixel (with a training banner). |
| **No jargon** | All user-facing copy is written for someone who has never heard the word "phishing". |
| **Free forever** | No paid tiers, no ads, no tracking. Sustained by open-source contributors. |
| **i18n from day one** | Spanish (primary), English, Portuguese. Code always in English. |

### What Safia Is Not

- Not a security tool (it doesn't protect you directly)
- Not a credential manager (that's Proton Pass — we teach you to use it)
- Not a CTF platform (no technical hacking challenges)
- Not a data collection service

---

## 2. Tech Stack

| Package | Version | Role |
|---|---|---|
| `next` | **16.2.3** | Framework (App Router) |
| `react` / `react-dom` | **19.x** | UI runtime |
| `typescript` | **5.x** | Type safety |
| `tailwindcss` | **4.2.2** | Styling (CSS-first config, `@theme`) |
| `next-intl` | **4.9.1** | i18n — ES/EN/PT, `/[locale]/` routing |
| `next-auth` (Auth.js) | **v5 RC** | OAuth only — Google, GitHub, Apple |
| `@supabase/supabase-js` | **2.103.2** | PostgreSQL DB (authenticated users only) |
| `@supabase/ssr` | latest | Supabase in Next.js App Router |
| `next-mdx-remote` | latest | MDX lesson content (RSC-compatible) |
| `gray-matter` | latest | MDX frontmatter parsing |
| `shadcn/ui` | latest | Base UI component primitives |
| `zustand` | latest | Client state (guest progress, session, UI) |
| `framer-motion` | latest | Animations (Apple-quality feel) |
| `zod` | latest | Input validation on all API routes |

**Hosting:** Vercel (Next.js + Edge Functions for i18n routing)  
**Database:** Supabase (PostgreSQL 15+, free tier — 500MB, generous limits for MVP)  
**Auth:** Auth.js v5 with OAuth-only providers. No email/password. No Auth.js DB adapter.

---

## 3. Backend Architecture

### 3.1 Database Schema

All tables in `public` schema, Supabase PostgreSQL 15+.

#### `users` table

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Internal ID, never exposed to client |
| `oauth_id` | `text` | `NOT NULL` | Provider user ID (Google `sub`, GitHub `id`, Apple `sub`) |
| `provider` | `text` | `NOT NULL CHECK (provider IN ('google','github','apple'))` | OAuth provider |
| `xp` | `integer` | `NOT NULL DEFAULT 0 CHECK (xp >= 0)` | Total accumulated XP |
| `progress_json` | `jsonb` | `NOT NULL DEFAULT '{}'::jsonb` | Per-module progress |
| `created_at` | `timestamptz` | `NOT NULL DEFAULT now()` | |

**UNIQUE constraint:** `(oauth_id, provider)` — cross-provider linking intentionally omitted (avoids needing to store email).  
**No email. No name. No avatar.** Display names come transiently from OAuth JWT — never persisted.

#### `newsletter` table

| Column | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `uuid` | `PRIMARY KEY DEFAULT gen_random_uuid()` | |
| `email` | `text` | `NOT NULL UNIQUE` | Only PII in the entire system |
| `confirmed` | `boolean` | `NOT NULL DEFAULT false` | Double opt-in flag |
| `created_at` | `timestamptz` | `NOT NULL DEFAULT now()` | |

**Critical:** No FK between `users` and `newsletter`. These are completely decoupled by design — a user's identity must never be linkable to their newsletter subscription.

#### `progress_json` Structure

```jsonc
{
  "phishing": {
    "completed_lessons": ["lesson-1", "lesson-2"],
    "quiz_scores": { "lesson-1": 80, "lesson-2": 100 },
    "xp_earned": 250,
    "started_at": "2026-04-10T14:30:00Z",
    "completed_at": null
  },
  "passwords": {
    "completed_lessons": ["lesson-1"],
    "quiz_scores": { "lesson-1": 90 },
    "xp_earned": 100,
    "started_at": "2026-04-12T09:00:00Z",
    "completed_at": null
  }
}
```

**Why JSONB (not normalized tables):** Progress is always read/written per-user as a whole blob. JSONB eliminates N+1 queries, a power-user payload is under 5KB, and JSONB is fully indexable if analytics are needed later.

#### SQL Migrations

```sql
-- 001_create_users.sql
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oauth_id text NOT NULL,
  provider text NOT NULL CHECK (provider IN ('google', 'github', 'apple')),
  xp integer NOT NULL DEFAULT 0 CHECK (xp >= 0),
  progress_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (oauth_id, provider)
);

-- 002_create_newsletter.sql
CREATE TABLE public.newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

---

### 3.2 API Routes

All routes: Next.js 16 App Router route handlers (`app/api/.../route.ts`).

| Route | Methods | Auth | Purpose |
|---|---|---|---|
| `app/api/auth/[...nextauth]/route.ts` | GET, POST | — | Auth.js v5 OAuth handler |
| `app/api/progress/route.ts` | GET, POST | Required | Fetch/sync user progress with DB |
| `app/api/newsletter/route.ts` | POST | None | Newsletter signup |
| `app/api/modules/route.ts` | GET | None | Serve `content/manifest.json` (ISR cached) |
| `app/api/me/route.ts` | DELETE | Required | Account deletion (GDPR right to erasure) |

**All routes validate input with Zod schemas.** Return 400 on `ZodError`, 401 on missing session.

---

### 3.3 Supabase RLS Policies

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;

-- Users: read/update own row only
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Newsletter: no client access (all ops via server/service-role)
CREATE POLICY "newsletter_deny_all" ON public.newsletter
  FOR ALL USING (false);
```

API routes use Supabase **service role key** (bypasses RLS). RLS is defense-in-depth only.

---

### 3.4 Guest-to-Auth Sync Flow

```
Guest plays → progress in localStorage (key: "safia-progress")
     ↓
User clicks "Save progress" → OAuth flow (Auth.js)
     ↓
signIn callback → upsert user in DB (no-op if exists)
     ↓
jwt callback → embed users.id in JWT
     ↓
Client detects session → POST /api/progress (localStorage payload)
     ↓
Server merge algorithm:
  - Module only in local → adopt local
  - Module only in DB → keep DB
  - Module in both → completed_lessons = UNION
                     quiz_scores = MAX per lesson
                     xp_earned = recalculated from quiz_scores
                     started_at = MIN timestamp
     ↓
DB updated with merged result → client localStorage replaced with merged result
     ↓
From now on: every progress update writes to BOTH localStorage AND DB
```

**Returning user on new device:** GET /api/progress after session → populate localStorage from DB.

**Anti-cheat:** Server recalculates `xp_earned` from `quiz_scores` using the known XP formula — a client cannot inflate XP by sending a modified payload.

---

### 3.5 MDX Content Pipeline

#### Folder Structure

```
content/
├── modules/
│   ├── passwords/
│   │   ├── lesson-1.es.mdx
│   │   ├── lesson-1.en.mdx
│   │   ├── lesson-1.pt.mdx
│   │   ├── lesson-2.es.mdx
│   │   └── _meta.json
│   ├── phishing/
│   ├── mfa/
│   ├── simulators/
│   ├── wifi/
│   ├── social-media/
│   ├── pass-manager/
│   └── device-security/
└── manifest.json           ← auto-generated at build time
```

**Naming:** `{lesson-slug}.{locale}.mdx` — flat within each module folder.

#### MDX Frontmatter Schema

```yaml
---
title: "Cómo identificar un correo de phishing"
description: "Aprende a reconocer señales de alerta en correos sospechosos"
xp_reward: 100
order: 1
quiz:
  - question: "¿Cuál es una señal de phishing?"
    options: ["URL sospechosa", "Logo oficial", "Firma del CEO"]
    correct: 0
---
```

Quizzes in frontmatter (not MDX body) to keep them machine-readable for server-side scoring.

#### Loading

`next-mdx-remote/rsc` (RSC-compatible) compiles MDX in Server Components at request time.  
`scripts/generate-manifest.ts` runs as `prebuild` — walks content directory, reads frontmatter + `_meta.json`, outputs `content/manifest.json` used by API routes and frontend.

---

### 3.6 Auth.js v5 Configuration

**Session strategy: JWT** (no DB adapter, no session tables, no PII stored).  
**What's in JWT:** Only `userId` (our internal UUID). No email, name, or avatar.

```typescript
// auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({ clientId: process.env.AUTH_GOOGLE_ID!, clientSecret: process.env.AUTH_GOOGLE_SECRET! }),
    GitHub({ clientId: process.env.AUTH_GITHUB_ID!, clientSecret: process.env.AUTH_GITHUB_SECRET! }),
    Apple({ clientId: process.env.AUTH_APPLE_ID!, clientSecret: process.env.AUTH_APPLE_SECRET! }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async signIn({ account }) {
      // Upsert user — ignoreDuplicates makes this idempotent
      await supabase.from("users").upsert(
        { oauth_id: account.providerAccountId, provider: account.provider },
        { onConflict: "oauth_id,provider", ignoreDuplicates: true }
      );
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data } = await supabase.from("users").select("id")
          .eq("oauth_id", account.providerAccountId).eq("provider", account.provider).single();
        if (data) token.userId = data.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = { id: token.userId as string } as any;
      return session;
    },
  },
  pages: { signIn: "/auth/signin", error: "/auth/error" },
});
```

**OAuth scopes — minimum required:**
- Google: `openid` only (no `email`, no `profile`)
- GitHub: default (no scope param)
- Apple: `openid` only (no `name`, no `email`)

This structurally prevents PII collection at the OAuth level.

---

### 3.7 Environment Variables

```bash
# Auth.js
AUTH_SECRET=                     # openssl rand -base64 32
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_APPLE_ID=
AUTH_APPLE_SECRET=

# Supabase
SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Safe to expose (RLS enforced)
SUPABASE_SERVICE_ROLE_KEY=       # NEVER expose client-side, no NEXT_PUBLIC_ prefix

# App
NEXT_PUBLIC_APP_URL=https://safia.dev
```

---

## 4. Frontend Architecture

### 4.1 Folder Structure

```
safia/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Landing
│   │   ├── courses/
│   │   │   ├── page.tsx                # Module catalog
│   │   │   └── [slug]/
│   │   │       ├── page.tsx            # Module overview
│   │   │       └── [lesson]/
│   │   │           └── page.tsx        # Lesson (MDX)
│   │   ├── simulator/
│   │   │   └── [platform]/
│   │   │       └── page.tsx            # Simulator
│   │   ├── roadmap/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   ├── auth/
│   │   │   ├── sign-in/page.tsx
│   │   │   └── callback/page.tsx
│   │   └── legal/
│   │       ├── privacy/page.tsx
│   │       └── terms/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── progress/route.ts
│   │   ├── newsletter/route.ts
│   │   ├── modules/route.ts
│   │   └── me/route.ts
│   ├── layout.tsx                      # Root layout (html, body, metadata)
│   └── globals.css                     # Tailwind v4 @theme tokens
├── features/
│   ├── courses/                        # ModuleCard, LessonCard, LessonRenderer, hooks
│   ├── simulator/                      # SimulatorFrame, GoogleLogin, FacebookLogin, etc.
│   ├── gamification/                   # XPCounter, BadgeGrid, XPCelebration, StreakCounter
│   ├── roadmap/                        # RoadmapGraph, RoadmapNode, RoadmapEdge
│   ├── auth/                           # SignInButton, UserMenu, GuestBanner
│   └── landing/                        # Hero, FeatureGrid, NewsletterForm, CTASection
├── components/
│   ├── ui/                             # shadcn/ui primitives
│   ├── layout/                         # Header, Footer, Sidebar, PageTransition
│   └── shared/                         # ProgressBar, TipBox, PromptButton, LanguageSwitcher
├── lib/
│   ├── supabase/                       # client.ts, server.ts
│   ├── auth/                           # auth.ts (Auth.js v5 config)
│   ├── content/                        # MDX loader, manifest reader
│   └── i18n/                           # next-intl config, routing, navigation
├── stores/
│   ├── progress-store.ts               # XP, modules, badges, streak (persisted to localStorage)
│   ├── session-store.ts                # Current lesson/simulator state (ephemeral)
│   └── ui-store.ts                     # Sidebar, reduced motion
├── content/                            # MDX lessons (see §3.5)
├── messages/
│   ├── es.json
│   ├── en.json
│   └── pt.json
├── public/
│   ├── images/ (logo, badges, modules, simulators)
│   └── fonts/ (Inter Variable)
├── middleware.ts                        # next-intl locale detection
├── next.config.ts
└── components.json                     # shadcn/ui config
```

---

### 4.2 Route Inventory

| Route | Purpose | Auth Req. |
|---|---|---|
| `/[locale]` | Landing page | Public |
| `/[locale]/courses` | Module catalog | Guest |
| `/[locale]/courses/[slug]` | Module overview + lesson list | Guest |
| `/[locale]/courses/[slug]/[lesson]` | Lesson content (MDX) | Guest |
| `/[locale]/simulator/[platform]` | Auth simulator | Guest |
| `/[locale]/roadmap` | Visual learning path | Guest |
| `/[locale]/profile` | XP, badges, progress | Guest* |
| `/[locale]/settings` | Language, theme, account | Guest* |
| `/[locale]/auth/sign-in` | OAuth provider selection | Public |
| `/[locale]/legal/privacy` | Privacy policy | Public |
| `/[locale]/legal/terms` | Terms of service | Public |

*Guest = fully functional; auth only enables cloud sync.  
**Simulator platform slugs:** `google`, `facebook`, `instagram`, `x`, `tiktok`, `banking`

---

### 4.3 Design System Tokens (Tailwind v4 `@theme`)

```css
@theme {
  --color-bg-base: #0d0a1a;
  --color-bg-surface: #1b1340;       /* Primary card/panel background */
  --color-bg-elevated: #241a52;      /* Hover, modals, dropdowns */
  --color-text-primary: #f0eef6;
  --color-text-secondary: #a8a3b8;
  --color-text-muted: #6b6580;
  --color-accent: #8b5cf6;           /* Primary purple */
  --color-accent-hover: #7c3aed;
  --color-accent-muted: rgba(139, 92, 246, 0.15);
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-destructive: #ef4444;
  --color-xp: #a78bfa;
  --color-badge-gold: #fbbf24;
  --gradient-hero: linear-gradient(135deg, #1b1340 0%, #2d1b69 50%, #1b1340 100%);
  --gradient-accent: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  --gradient-xp-bar: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%);
  --shadow-glow: 0 0 20px rgba(139, 92, 246, 0.3);
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --font-family-sans: "Inter Variable", system-ui, sans-serif;
}
```

---

### 4.4 Zustand Stores

#### `progress-store.ts` (persisted to localStorage)

```typescript
interface ProgressState {
  xp: number;
  level: number;
  modules: Record<string, ModuleProgress>;
  badges: string[];
  streak: number;
  lastActivityDate: string;
  completeLesson: (moduleSlug: string, lessonSlug: string, xpEarned: number) => void;
  earnBadge: (badgeId: string) => void;
  updateStreak: () => void;
  syncFromServer: (data: Partial<ProgressState>) => void;
  reset: () => void;
}
```

`partialize` only persists: `modules`, `xp`, `badges`, `streak`, `lastActivityDate`. No tokens, no IDs.

#### `session-store.ts` (ephemeral, no persistence)

Tracks current lesson/simulator state, simulator score, hints used, pending XP celebrations.

#### `ui-store.ts`

`sidebarOpen`, `reducedMotion`. Language via next-intl URL segment. Theme via `next-themes`.

---

### 4.5 i18n Structure

Locale routing: `/[locale]/` prefix. Default: `es`. Supported: `es`, `en`, `pt`.  
`middleware.ts` detects from: URL → cookie → `Accept-Language` → fallback `es`.

```
messages/
├── es.json     # Flat namespaced keys: "common.nav.courses", "landing.hero.title", etc.
├── en.json
└── pt.json
```

Namespaces: `common`, `landing`, `courses`, `simulator`, `gamification`, `auth`.  
MDX lesson content is NOT in message files — it lives in `/content/modules/[module]/lesson-N.[locale].mdx`.

---

### 4.6 Animation Strategy

All animations use Framer Motion, respect `prefers-reduced-motion`. When reduced motion: instant opacity fades.

| Trigger | Animation |
|---|---|
| Page transition | Fade + Y-8 translate, 250ms ease-out, `AnimatePresence mode="wait"` |
| XP gain | Counter counts up (spring), purple particle burst, auto-dismiss 2.5s |
| Module unlock | Card scales 0.95→1, border glows, lock morphs to unlock via `layoutId` |
| Badge earned | Scale bounce `[0, 1.2, 1]`, gold shine sweep, toast from top-right |
| Lesson complete | SVG checkmark draws, confetti burst (purple/violet palette) |
| Level up | Full-screen, new level title with glow, share button |
| Roadmap entrance | Nodes stagger 50ms, scale 0.8→1 spring, edges draw as SVG paths after nodes settle |
| Card hover | Y -2px, `shadow-glow`, CSS only (no Framer Motion) |

---

## 5. UX & Learning Design

### 5.1 Module Catalog

| Module ID | Title (ES) | Title (EN) | Lessons | Time | XP | Prerequisites | Difficulty |
|---|---|---|---|---|---|---|---|
| `passwords` | Contraseñas que sí protegen | Passwords That Actually Protect | 6 | 35 min | 180 | None | Beginner |
| `phishing` | Detecta el engaño antes de hacer clic | Spot the Trick Before You Click | 7 | 45 min | 230 | None | Beginner |
| `mfa` | Dos llaves son mejor que una | Two Keys Are Better Than One | 5 | 30 min | 170 | `passwords` | Intermediate |
| `simulators` | Practica sin miedo | Practice Without Fear | 5 | 40 min | 250 | `mfa` | Intermediate |
| `wifi` | No toda WiFi es tu amiga | Not Every WiFi Is Your Friend | 5 | 25 min | 150 | None | Beginner |
| `social-media` | Protege tu vida digital sin dejar de compartir | Stay Safe Without Going Silent | 6 | 35 min | 180 | None | Beginner |
| `pass-manager` | Un solo lugar seguro para todas tus contraseñas | One Safe Place for All Your Passwords | 6 | 35 min | 200 | `passwords` | Intermediate |
| `device-security` | Tu teléfono y tu computadora también necesitan cuidado | Your Phone and Computer Need Care Too | 5 | 25 min | 150 | None | Beginner |

**Total XP available (modules only):** 1,310 XP + lesson/quiz XP on top.

---

### 5.2 Gamification

#### XP per Activity

| Type | XP |
|---|---|
| Reading / Conceptual lesson | 10 |
| Quiz | 20 |
| Challenge (interactive scenario) | 30 |
| Simulator completion | 50 |
| Module completion bonus | 30 |

#### Level System (10 Levels)

| Level | ES | EN | PT | XP Threshold |
|---|---|---|---|---|
| 1 | Curioso Digital | Digital Curious | Curioso Digital | 0 |
| 2 | Consciente Digital | Digitally Aware | Consciente Digital | 100 |
| 3 | Navegante Cauteloso | Cautious Navigator | Navegante Cauteloso | 300 |
| 4 | Detective de Enlaces | Link Detective | Detetive de Links | 600 |
| 5 | Escudo Activo | Active Shield | Escudo Ativo | 1,000 |
| 6 | Vigía de Cuentas | Account Sentinel | Vigia de Contas | 1,500 |
| 7 | Guardián de Datos | Data Guardian | Guardião de Dados | 2,200 |
| 8 | Agente de Confianza | Trusted Agent | Agente de Confiança | 3,000 |
| 9 | Mentor de Seguridad | Security Mentor | Mentor de Segurança | 4,000 |
| 10 | Leyenda Digital | Digital Legend | Lenda Digital | 5,200 |

#### Badge Catalog (16 Badges)

| ID | Name (ES) | Trigger | Rarity |
|---|---|---|---|
| `first-step` | Primer Paso | Complete first lesson | Common |
| `steel-memory` | Memoria de Acero | Create a passphrase in passwords module | Common |
| `hawk-eye` | Ojo de Halcón | Score 100% on a phishing quiz | Common |
| `double-lock` | Doble Cerradura | Complete MFA module | Common |
| `hands-on` | Manos a la Obra | Complete first simulator | Common |
| `fire-streak-3` | Racha de Fuego | Reach 3-day streak | Common |
| `streak-7` | Quemando Etapas | Reach 7-day streak | Rare |
| `streak-30` | Imparable | Reach 30-day streak | Legendary |
| `total-simulator` | Simulador Total | Complete all 5 simulators | Rare |
| `five-stars` | Cinco Estrellas | Complete 5 modules | Rare |
| `zero-repeats` | Cero Repetidas | Complete password manager module | Rare |
| `safe-wifi` | WiFi Seguro | Complete WiFi module | Common |
| `armored-profile` | Perfil Blindado | Complete social media module | Common |
| `no-cracks` | Sin Grietas | 100% on all quizzes in any module | Rare |
| `graduate` | Graduado Safia | Complete all 8 modules | Legendary |
| `smart-question` | Pregunta Inteligente | Use "Let me prompt that for you" 5 times | Common |

#### Streak System

- Increment: 1+ lesson or quiz per calendar day (user's local timezone)
- Freeze tokens: 1 token per 7-day streak achieved, max 3 stored
- Break message: *"Las rachas se pueden reconstruir. Lo importante es que volviste."*
- Visual: flame icon grows (small 1-6, medium 7-29, large 30+), ice crystals for freeze tokens

---

### 5.3 Auth Simulator Scripts

All simulators share a **training banner** (fixed top, purple #8b5cf6, cannot be dismissed):  
*"Esto es una simulación de entrenamiento. Nada de lo que escribas aquí es real ni se guarda."*

| Platform | Steps | Key Learning |
|---|---|---|
| **Google Workspace** | 4 | Email → Password → 2FA SMS → Success. Tooltips on URL verification, never sharing codes, SMS codes are personal. |
| **Facebook / Instagram** | 4 | Single-page login → 2FA setup prompt → Code → Confirmation. SMS vs Authenticator app choice. |
| **X (Twitter)** | 4 | Username → Password → 2FA toggle (SMS/App/Key) → Code. Highlights password reuse risk. |
| **TikTok** | 3 | Login → Security settings → 2FA code. Notes that accounts with followers are targets. |
| **Online Banking** | 5 | Login → Device verification → Security question → Transaction confirmation → Summary. Covers fraud tactics, phishing calls, verification layers. |

Each simulator awards **50 XP** on completion. Each step has a contextual tooltip educating on the specific security concept at that step.

---

### 5.4 "Let Me Prompt That For You"

UI: Purple pill button `[Pregúntale a la IA]` inline in lesson content after complex concepts.  
On click: modal with "Abrir en ChatGPT" and "Abrir en Gemini" buttons with pre-filled prompt.

**Deep link formats:**
- ChatGPT: `https://chat.openai.com/?q={encoded-prompt}`
- Gemini: `https://gemini.google.com/app?q={encoded-prompt}`

**10 pre-written prompts covering:** encryption, phishing mechanics, VPNs, cookies, biometric auth, ransomware, app permissions, social engineering, password managers, and 2FA — each localized via `{locale}` injection.

---

### 5.5 Roadmap

| Module | Category | Color |
|---|---|---|
| `passwords` | Mandatory | Red `#ef4444` |
| `phishing` | Mandatory | Red `#ef4444` |
| `mfa` | Mandatory | Red `#ef4444` |
| `simulators` | Recommended | Amber `#f59e0b` |
| `wifi` | Recommended | Amber `#f59e0b` |
| `social-media` | Recommended | Amber `#f59e0b` |
| `pass-manager` | Recommended | Amber `#f59e0b` |
| `device-security` | Optional | Green `#22c55e` |

**Prerequisite graph:**
```
passwords ──┬──> mfa ──> simulators
            └──> pass-manager
phishing, wifi, social-media, device-security (standalone entry points)
```

**Node states:** locked (gray + padlock) → available (pulsing border glow) → in-progress (progress ring %) → completed (checkmark + gold border).

---

### 5.6 Contextual Help System

**Tip boxes:** Inline in MDX — purple left border, lightbulb icon, types: *Sabías que / Consejo rápido / Analogía / Mito vs Realidad.*

**Coach marks (4 steps, first visit):**
1. Roadmap → *"Empieza por los módulos en rojo."*
2. XP counter → *"Cada lección te da puntos. Sube de nivel."*
3. Auth area → *"No necesitas cuenta. Tu progreso se guarda aquí."*
4. Passwords card → *"Empieza aquí. Solo 35 minutos."*

**Celebration triggers:** lesson complete (subtle +XP), quiz passed (confetti), module complete (full-screen), level up (full-screen with new title), badge earned (toast 5s), streak milestones (flame animation), all modules complete (graduation screen).

---

## 6. Security & Privacy

### 6.1 Privacy by Design

- **No cookie banner needed** — only 1 httpOnly session cookie (strictly necessary, no analytics)
- **No cross-linking** — `users` and `newsletter` tables have no FK, impossible to correlate
- **GDPR:** Lawful basis (legitimate interest for progress sync, consent for newsletter), right to erasure via `DELETE /api/me`, right to access via `GET /api/me/export`
- **Data retention:** Users auto-deleted after 36 months inactivity; newsletter on unsubscribe (hard delete)
- **Account deletion cascade:**
  ```sql
  DELETE FROM auth.sessions WHERE user_id = $1;
  DELETE FROM auth.accounts WHERE user_id = $1;
  DELETE FROM public.users WHERE id = $1;
  -- Newsletter NOT touched (independent consent)
  ```

### 6.2 OAuth Security

- PKCE enabled by default in Auth.js v5 for all three providers
- Scopes: `openid` only for Google and Apple; default for GitHub — structurally prevents PII collection
- Cookie: `httpOnly: true, secure: true, sameSite: "lax"` (`lax` required for OAuth callback redirects)
- JWT sessions: no session tables, 30-day expiry, payload = `{ userId: uuid }` only

### 6.3 Guest Mode Security

- localStorage stores only: `modules`, `xp`, `badges`, `streak`, `lastActivityDate` — no credentials, no tokens, no IDs
- `partialize` in Zustand explicitly whitelists persisted keys
- Tokens MUST NOT be in localStorage — Auth.js session in httpOnly cookie only

### 6.4 Content Security Policy

```
default-src 'self'
script-src 'self' 'unsafe-inline'
style-src 'self' 'unsafe-inline'
img-src 'self' data: blob:
connect-src 'self' https://*.supabase.co
frame-src 'none'
frame-ancestors 'none'
object-src 'none'
```

`frame-ancestors 'none'` — Safia cannot be embedded in phishing pages.

### 6.5 Simulator Security

- **Zero network calls** — all form `onSubmit` call `e.preventDefault()`, no `fetch`, no action URLs
- **ESLint rule** — flags `fetch`/`axios` imports inside `/features/simulator/`
- **Training banner: triple-redundant** — CSS `::before` pseudo-element + React component + JS interval re-injection every 2s
- **No indexing:** `robots: noindex` on all simulator pages + `robots.txt: Disallow: /*/simulator/`
- **No iframes** — simulators are React components, not iframes

### 6.6 Threat Model

| Threat | Risk | Mitigation |
|---|---|---|
| Simulator weaponized for phishing | HIGH | Triple banner, `e.preventDefault()` hardcoded, LICENSE clause, ESLint rule, no network calls |
| XSS → session token theft | MEDIUM | httpOnly cookies (XSS can't read), MDX pre-compiled at build, strict CSP |
| Progress data tampering | LOW | Server recalculates XP from quiz_scores; XP is personal only in MVP |
| Newsletter email enumeration | MEDIUM | Always return 200 regardless; rate limit 3 req/hr/IP |
| Supply chain attack | MEDIUM | Dependabot, CodeQL, `npm audit` in CI, pinned lockfile |
| **T-UNIQUE: Security teacher paradox** | HIGH | Simulators are phishing-quality replicas. Mitigated by triple banner, hardcoded no-network, LICENSE restriction, code-level comments, monitoring |

### 6.7 Open Source Security

- `SECURITY.md` with responsible disclosure email: `security@safia.dev`, 48h acknowledgement SLA
- GitHub: Dependabot alerts + auto-updates, secret scanning + push protection, CodeQL on push
- Branch protection on `main`: PR reviews required, no force push, status checks required
- `SUPABASE_SERVICE_ROLE_KEY` and OAuth secrets: never `NEXT_PUBLIC_`, never committed

---

## 7. Roadmap (Features in Scope)

| # | Feature | Priority |
|---|---|---|
| 1 | Landing page (Proton Pass-inspired, dark navy/purple) | P0 |
| 2 | Auth system — OAuth only (Google, GitHub, Apple), guest mode | P0 |
| 3 | Module catalog + lesson viewer (MDX) | P0 |
| 4 | Auth simulators (Google, Facebook, Instagram, X, TikTok, Banking) | P0 |
| 5 | Gamification — XP, levels, badges, streaks | P1 |
| 6 | Roadmap visual (mandatory/recommended/optional) | P1 |
| 7 | "Let me prompt that for you" feature | P1 |
| 8 | Contextual tips (TipBox, coach marks) | P1 |
| 9 | i18n — ES/EN/PT | P0 |
| 10 | Guest-to-auth progress sync | P0 |

---

## 8. Out of Scope (MVP)

These features are documented for future consideration but will NOT be built in the initial release:

| Feature | Notes |
|---|---|
| **Scoreboard / community rankings** | Add when user base warrants social features |
| **AI chat for security learning** | Future — requires significant infrastructure and content moderation |
| **User-generated content** | Community-submitted lessons, solutions — future |
| **Mobile app** | Web-first, PWA capability sufficient for MVP |
| **Certificates / verifiable credentials** | Post-MVP, requires anti-cheat server-side verification |
| **Admin dashboard** | Manage users, content, analytics — post-MVP |

---

*Spec written collaboratively by the Safia scrum team: Product Owner, Backend Architect, Frontend Architect, UX Designer, Security Reviewer.*  
*Repo: https://github.com/256javy/safia*
