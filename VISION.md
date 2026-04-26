# Safia — Vision & Foundations

> *Aprende a protegerte.*

This document is the north star for Safia. It is deliberately abstract: it describes **why** Safia exists, **who** it serves, and **what it must always be**, without prescribing how. Before making any non-trivial product decision — a new feature, a copy change, a track, a partnership — check your proposal against this document. If a change contradicts any section here, the change is wrong, not the document.

`AGENTS.md` and `CLAUDE.md` cover implementation detail. `SUSTAINABILITY.md` covers how Safia pays its bills. This file changes rarely.

---

## 1. Purpose

Most people lose money, dignity, or safety online not because they are careless, but because nobody ever showed them how attacks actually look. The internet assumes digital literacy that schools never taught and that platforms actively obscure. The cost of that gap is paid disproportionately by the people who can least afford it: older adults, non-technical workers, first-generation internet users, low-income families.

Safia exists to close that gap. It is a place where anyone — with no prior knowledge, no money, no account, no risk — can learn how to protect themselves online, and, if they want, keep going until they have the foundations of a cybersecurity career.

The gap has two layers: **not knowing** and **knowing but not doing**. People know they shouldn't reuse passwords and reuse them anyway; they know a suspicious link shouldn't be clicked and click it because it arrived in a rushed moment. Safia is designed for both layers: it explains what nobody explained, and it builds reflexes through repeated practice in an environment where being wrong is free. Teaching is not enough; people have to be allowed to make the mistake without paying for it.

The audience is not the curious technologist with time to spare. It is the person whose entire technological life is social media, a spreadsheet, and a work email — and who nevertheless is the target of the same attacks that hit companies. Every design decision in Safia answers first to that person.

## 2. Mission

**Build the safest, freest place on the internet to practice being unsafe.**

The specific gap Safia fills is covered by nobody else: **content in Spanish, designed to be entered in crisis, built for people without prior technical grounding**. English-language resources exist for academic learners; deep labs exist for career aspirants. What does not exist is a place where a mother scammed yesterday can arrive at midnight and get real help without signing up, in her language, without being treated as stupid.

A hands-on, zero-risk environment where people face realistic threats (phishing pages, social-engineering scripts, weak passwords, hostile networks, account takeovers) in a controlled setting, and walk away with reflexes, not just knowledge.

## 3. Vision

Ten years from now, when a parent asks *"how do I know if this email is real?"* and a teenager asks *"how do I start a career in cybersecurity?"*, the answer in Spanish-speaking homes — and eventually beyond — is the same: **"empieza por Safia."**

Safia is to online security what Wikipedia is to general knowledge: a public good, free forever, community-built, trusted because it is transparent.

### Intermediate horizons

Ten years is the north star; a north star alone does not navigate. As an operational compass:

- **Year 1:** the *crisis* and *obligation* states (§4) are served in Spanish with editorially verifiable content.
- **Year 3:** *care for others* and *curiosity/career* have complete routes; the catalogue covers the mainstream attacks faced by non-technical users.
- **Year 5:** Safia Range (§7) operates as a real pipeline into security employment, with certificates recognized by at least one serious employer.
- **Year 10:** when someone asks how to start, the default answer in Spanish-speaking homes is Safia.

These horizons are recalibratable. What is not recalibratable is that each year must close with a real person Safia helped at the right moment.

### Distribution

A public good nobody finds is not a public good. Safia solves a problem people cannot name (*"no sé si este mensaje es phishing"*) in a language the dominant search algorithm under-serves. This makes distribution a first-order problem, not a post-launch one: product architecture — task-first URLs, indexable content, deep-linkability to any tool, shareable without an account, deliberate OpenGraph — is part of the design from day one. A tool that cannot be pasted into a WhatsApp from mother to daughter, linked in a work group chat, or found by googling *"me hackearon la cuenta de Instagram"* does not fulfill the mission, no matter how pedagogically correct its content is.

## 4. How people arrive

People do not arrive at Safia in one mental state. They arrive in at least four, and the product must recognize each as first-class. **This distinction is architectural, not cosmetic**: the atlas (§5), the security posture (§6), and the audience ranking (§8) all derive from accepting that these states coexist in the same product at the same time.

- **Crisis.** *"Me acaba de estafar alguien. Me hackearon la cuenta. Creo que este mensaje es phishing y no sé qué hacer."* Minutes matter. The person wants the bleeding to stop, not to learn.
- **Obligation.** *"Arranqué un trabajo nuevo y me piden activar 2FA / hacer un curso. Quiero cumplir sin sentirme tonto."* Time-boxed, low panic, outcome-focused.
- **Care for others.** *"Mi madre / mis alumnos / mi equipo navegan y quiero protegerlos."* Arrives looking for tools to pass forward.
- **Curiosity or career.** *"Me interesa esto. Quiero ver hasta dónde llega y si puedo hacer carrera."* Time-abundant, process-focused.

Two metrics coexist without conflict: **time-to-relief** (for crisis and obligation) and **time-to-depth** (for curiosity and care). A composable product can serve both; a linear one cannot.

## 5. The atlas

Safia is not a ladder. Safia is an **atlas of interconnected learning tools**, each independently usable, each categorizable along two axes:

| | Theoretical | Practical |
|---|---|---|
| **Learn** | Lessons, explanations, analogies | Guided simulators, quizzes with feedback |
| **Test / practice** | Checklists, habit audits | Free playgrounds (password-manager range, 2FA tester, phishing range, etc.) |

A person who already understands everything and just wants a sandbox to test their password manager **must be able to land there directly**, skip onboarding, and leave when done. A person who does not know what a password is **must be able to start from the simplest lesson without seeing anything else**.

**Curated routes** sit on top of the atlas as opt-in playlists — not as the atlas's structure. Examples of curated routes Safia may offer:
- *Survive → Defend → Understand → Practice → Launch* — the classic ladder, for someone entering at the bottom and climbing to a career.
- *Just happened to me* — a short path for someone in crisis.
- *Starting a security job* — a crash course for onboarding.
- *Protecting someone I love* — a parent/caregiver path.

Routes are recommendations, not architecture. The architecture is the atlas.

## 6. Non-negotiable principles

These are the axes on which trade-offs are **not** available. If a decision forces a choice against one of them, the decision is wrong — not the principle. They are grouped by posture.

### Security & privacy posture

- **Secure by default.** Every feature ships in its safest configuration. A user who clicks through defaults without reading anything must still end up safe.
- **Private by default.** We collect the minimum data technically required and not one byte more. We never sell, broker, or enrich user data. Identifiers are unlinkable from behavior wherever feasible. When in doubt: collect less.
- **Guest-first as protection.** Login is a convenience, never a condition. Every lesson, simulator, and playground works for a visitor who has not authenticated and never will. For crisis users this is not UX nicety — it is protection against re-victimization: a person already in a vulnerable state must not be asked to hand over identity to receive help.
- **Harm-proof simulators.** Any code that imitates a real attack surface must be structurally incapable of causing real harm: no outbound network, no credential exfiltration path, no embedding in third-party contexts, no confusion with the real service being imitated. This is a product constraint, not a policy.

### Access posture

- **Free forever.** No paywall, no premium tier, no ads, no affiliate kickbacks that steer recommendations. If a feature needs money, we fund it transparently or we don't build it. "Freemium" is not on the table.
- **Open source forever.** The full source — content, code, design system, infrastructure — stays public under a copyleft license. If a fork improves Safia, the community benefits. If a fork weaponizes it, the license forces the weaponizer's code back open.
- **Defended trademark, free code.** The code is copyleft; the *Safia* name and visual identity are not. A fork that improves the product is welcome; a fork that impersonates Safia to attack the very users who arrived trusting the name is not. The trademark is registered and defended precisely to protect people who come in crisis looking for something familiar.
- **Relicensing possible, relicensing deliberate.** Every contributor signs a DCO that includes explicit permission to relicense to future AGPL versions or compatible copyleft licenses. This preserves the copyleft spirit and keeps Safia from being trapped if, five years from now, a serious educational ecosystem requires a license that does not yet exist.
- **Radically accessible.** Accessible language, accessible reading levels, WCAG compliance, performant on low-end phones and slow networks. Spanish is a first-class locale; every other locale is first-class when it ships, not a second-class translation.

### Pedagogy posture

- **Dignity under duress.** A person in crisis is not a learner first — they are a person in a bad moment. Copy, pace, and next-step suggestions must respect that. Shame is the silent enemy: **nobody is stupid for having been attacked**, and the product must say this explicitly where it matters. Teaching to the learner in front of us, not to an imagined expert — jargon is a failure of the writer, not the reader.
- **Task-first surfacing.** Tools are named by the problem they solve, not by the concept they teach. *"Recupera una cuenta hackeada"* beats *"Lesson 3: Account Recovery"*. Someone who does not know the concept still recognizes the problem. The anti-pattern to avoid: *"Multi-Factor Authentication Module"*, *"Introducción a la criptografía simétrica"*, *"Cybersecurity 101"* — names that teach the taxonomy to the expert and hide the utility from everyone else.
- **Composable by design.** Every tool stands alone. Pre-requisites are suggestions, never gates. Deep links to any tool work without context.
- **Motivation by accomplishment, not by engagement.** Safia motivates via transferable artifacts the learner keeps — certificates, portfolio items, CTF writeups — never via FOMO mechanics (streaks, global leaderboards that shame, "come back, you're losing your streak" notifications). Gamification exists only in explicitly opt-in competitive spaces (see §7), never transversally. If a learner does not return for a month, we have succeeded. If they return because they want to, better.
- **Freshness as editorial promise.** Attacks mutate. A phishing lesson written today is partially obsolete in twelve months. Every piece of content carries a last-reviewed date visible to the user; once a threshold is crossed (default: 12 months) it enters a review queue and is flagged as such until revalidated. Unreviewed content is not trustworthy content — and trustworthy is the one thing Safia cannot afford to lose.

### Stewardship posture

- **Sustained, not monetized.** The funding model is part of the mission. Any revenue path that compromises the principles above kills the project. **Diversity of funding sources is principle, not operational detail**: Safia never depends on a single foundation, a single sponsor, a single government. One failed cycle in one source cannot turn the servers off. Details in `SUSTAINABILITY.md`.
- **Incident response as part of the promise.** Safia is a brand whose core promise is *here you are safe*. A single incident — a simulator that leaks data, a credible accusation of having served as a real phishing template, a malicious fork impersonating the brand — can collapse it. For that reason the incident response plan (public disclosure, signed post-mortem, direct communication to those affected within declared timelines) is part of the design, not an operational annex. Details live in `GOVERNANCE.md`; the obligation to have them lives here.
- **Transparent decisions.** Every "does this belong in Safia?" call is justified against published criteria. Power that is not accountable to a written standard is power that drifts.
- **Author humility.** Authors are visible by name. Assumptions are declared per piece. Reviews are public. Safia does not hide behind a corporate voice.
- **Contribution over canonization.** The goal is many aligned authors, not a single pristine voice. Plurality is a feature. The style guide holds the line, not any one author.

## 7. Motivation, credentials, and the competitive wing

Safia recognizes accomplishment through **certificates**, not points. Completing a track emits a verifiable credential the learner keeps forever, in two formats:

- **Share card** — visual, with strong OpenGraph metadata, meant for social platforms and messaging apps.
- **Portfolio-grade PDF** — sober, signed, with a public verification URL; suitable alongside a CV. Open Badges compatible when feasible.

Certificates are **rigorous** (earned through demonstrated practice, not reading), **multi-level** (completion → applied → mastery), and **privacy-safe** (user-chosen display name, no identifiable data on the public verification page, dates granular to the month — never to the second —, no IP logging of verifiers). A weak certificate is worse than no certificate: it erodes the signal for the strong ones.

**Gamification is not platform-wide.** It lives exclusively in **Safia Range / Labs**, an opt-in competitive area aimed at curiosity-driven and career-oriented learners — the fourth and fifth rungs of the ladder route. There, CTFs, seasons, scoreboards, category badges, and hall-of-fame dynamics are appropriate because users opted into them. Those mechanics never leak into the main atlas. Crisis users never see a streak counter.

**The line between healthy motivation and FOMO is operational, not aesthetic:** a mechanic crosses the line when it worsens the emotional state of the non-user who sees it — streak-loss notifications, rankings visible to those not competing, public shaming for inactivity, re-engagement emails that manufacture anxiety. If a proposed feature would fail that test run against a mother who was just scammed and is arriving at Safia for the first time, it is not built, even if it lives only inside Range.

The Range is also the natural pipeline from Safia learner to cybersecurity practitioner.

## 8. Who we serve (two dimensions, no hierarchy)

The audience is a plane, not a list. Two axes matter, and neither ranks people:

- **Relation to the knowledge:** never-taught ↔ building foundations ↔ practitioner-level.
- **Motivation for arrival:** crisis · obligation · care for others · curiosity/career.

Every feature should name who it serves along **both axes**. A feature that serves "curious never-taught" is legitimate; a feature that serves "practitioner in crisis" is legitimate; a feature that serves nobody in particular is not.

When competing audiences collide, two tiebreakers apply, in order:
1. **The more vulnerable wins.** A person in crisis beats a person exploring. Operationally, *vulnerable* means in an active crisis state, or at imminent risk of material or psychological harm if the product does not respond correctly on the next interaction. It is not a demographic property — it is a situational one. The retired tech executive who just wired money to a scammer is vulnerable; the same person reading a lesson the following week is not.
2. **The person who paid a higher cost to arrive wins.** A learner who overcame embarrassment to come asking beats a learner browsing casually.

## 9. What Safia is not

- Not a certification body for industry compliance (ISO, PCI, etc.).
- Not a pentesting product.
- Not a consumer-facing antivirus, password manager, or VPN.
- Not an aggregator of third-party courses.
- Not a lead-generation funnel for a commercial offering. There is no commercial offering.
- Not "free temporarily until we find a business model." Safia is free permanently by design; the sustainability model is aligned philanthropy, not monetization.
- Not Duolingo. We do not engineer addiction.
- Not neutral about attacks on learners: we will never host content that helps someone harm another person, even framed as "education." Operational test: **content passes if an attacker holding the material in hand gains no capability beyond what is already available in mainstream public writing**. Showing what a phishing page looks like so it can be recognized: yes. Handing out a working, ready-to-personalize phishing template: no. Editorial details live in `STYLE.md`; the obligation to apply the test lives here.

## 10. Decision filter

Before committing to a non-trivial product decision, run it through five questions:

1. **Mission fit.** Does this help someone practice being unsafe safely, or learn to protect themselves?
2. **Atlas fit.** Which cell of the atlas (§5) does it serve? Is that cell underserved?
3. **Principle check.** Does it violate any principle in §6? If yes, stop. Redesign or reject.
4. **Audience check.** Who on the §8 plane benefits? Who pays a cost? Do the tiebreakers hold?
5. **Emotional-state check.** In what state does the person arrive at this piece (§4), and is the piece designed for that state?

If all five pass, the decision is probably on-mission. If any fail, escalate or rework before writing code.

## 11. How this document changes

The **mission** (§2), the **non-negotiable principles** (§6), the **audience tiebreakers** (§8), and **what Safia is not** (§9) change only by explicit, deliberate decision documented in a spec and merged through the governance process described in `GOVERNANCE.md`. §9 is protected because it is the product's anti-drift clause: the day someone silently deletes *"not a lead-gen funnel"* or *"not Duolingo"* in a three-line PR, Safia is no longer Safia.

Everything else — the atlas categories, the curated routes, the certificate tiers, what counts as "the competitive wing", the intermediate horizons in §3 — can be edited freely as understanding deepens.

When in doubt: re-read §2. Everything else should serve it.

---

## Cross-references

Three layers of documentation, each independent:

**Layer 1 — Why (this layer).** Idea and stewardship. Survives any reimplementation.
- `VISION.md` — this document.
- `SUSTAINABILITY.md` — how §6's *sustained, not monetized* becomes concrete.
- `GOVERNANCE.md` — how decisions are made.
- `STYLE.md` — voice, tone, bias checklist, pedagogical standards.

**Layer 2 — What.** Product specification, stack-agnostic. Lives in `atlas/`. Describes tools, tracks, routes, certificates, Range, threat model, brand — the product Safia *is*, independent of how it is built.

**Layer 3 — How.** This implementation.
- `AGENTS.md` / `CLAUDE.md` — stack, repo layout, technical constraints.
- `CONTRIBUTING.md` — how to work on this codebase.
