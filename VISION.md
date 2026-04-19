# Safia — Vision & Foundations

> *Aprende a protegerte.*

This document is the north star for Safia. It is deliberately abstract: it describes **why** Safia exists, **who** it serves, and **what it must always be**, without prescribing how. When you are asked to add a feature, fix a bug, or reshape the product, check your proposal against this document first. If a change contradicts any section here, the change is wrong — not the document.

Implementation details live in `AGENTS.md` and `CLAUDE.md`. This file rarely changes.

---

## 1. Purpose

Most people lose money, dignity, or safety online not because they are careless, but because nobody ever showed them how attacks actually look. The internet assumes digital literacy that schools never taught and that platforms actively obscure. The cost of that gap is paid disproportionately by the people who can least afford it: older adults, non-technical workers, first-generation internet users, low-income families.

Safia exists to close that gap. It is a place where anyone — with no prior knowledge, no money, no account, no risk — can learn how to protect themselves online, and, if they want, keep going until they have the foundations of a cybersecurity career.

## 2. Mission

**Build the safest, freest place on the internet to practice being unsafe.**

A hands-on, zero-risk playground where people face realistic threats (phishing pages, social-engineering scripts, weak passwords, hostile networks) in a controlled environment, and walk away with reflexes, not just knowledge.

## 3. Vision

Ten years from now, when a parent asks *"how do I know if this email is real?"* and a teenager asks *"how do I start a career in cybersecurity?"*, the answer in Spanish-speaking homes — and eventually beyond — is the same: **"empieza por Safia."**

Safia is to online security what Wikipedia is to general knowledge: a public good, free forever, community-built, trusted because it is transparent.

## 4. The learner journey

Safia is a ladder. Every rung stands on its own, but they connect.

1. **Survive.** Basics anyone should know before their next login: what a password is, why phishing works, why "free WiFi" can hurt you. Target: a 65-year-old who has never heard the word *malware*.
2. **Defend.** Protective habits for daily life: password managers, two-factor authentication, recognizing scams on social media, securing personal devices, reclaiming a hacked account.
3. **Understand.** How attacks and defenses actually work underneath: authentication flows, DNS, certificates, sessions, common web vulnerabilities. Target: a curious teenager or a junior dev who wants depth.
4. **Practice.** Guided hands-on exercises in safe simulators: spotting phishing kits, breaking weak auth flows, reading packet captures, reasoning about threat models.
5. **Launch.** Foundations for a career in cybersecurity: how the industry is structured, what roles exist, what certifications mean, what a CTF is, how to build a portfolio, how to get a first job.

No rung is gated behind payment, registration, or nationality. A learner can enter at any rung, skip any rung, and leave at any rung.

## 5. Non-negotiable principles

These are the axes on which trade-offs are **not** available. If a decision forces a choice against one of them, the decision is wrong — not the principle.

### 5.1 Secure by default
Every feature ships in its safest configuration. The burden of security is on us, never on the learner. A user who clicks through the defaults without reading anything must still end up safe.

### 5.2 Private by default
We collect the minimum data technically required to make the product work, and not one byte more. We never sell, broker, or enrich user data. Identifiers are unlinkable from behavior wherever feasible. When in doubt: collect less.

### 5.3 Free forever
No paywall. No premium tier. No ads. No affiliate kickbacks that steer recommendations. If a feature requires money to run, we fundraise for it transparently or we don't build it. "Freemium" is not on the table.

### 5.4 Open source forever
The full source — content, code, design system, infrastructure — stays public under a copyleft license. If a fork improves Safia, the community benefits. If a fork weaponizes it, the license forces the weaponizer's code back open.

### 5.5 Guest-first
Login is a convenience, never a condition. Every lesson, every simulator, every practice exercise must work for a visitor who has not authenticated and never will. Progress sync is the only reason an account exists.

### 5.6 Harm-proof simulators
Any code in Safia that imitates a real attack surface must be structurally incapable of causing real harm: no outbound network, no credential exfiltration path, no embedding in third-party contexts, no confusion with the real service being imitated. This is a hard constraint of the product, not a policy.

### 5.7 Dignified pedagogy
We teach to the learner in front of us, not to an imagined expert. Jargon is a failure of the writer, not the reader. Analogies come before terminology. A 60-year-old who has never used a password manager is not a sub-par student; the sub-par material is the material that loses them.

### 5.8 Radically accessible
Accessible language, accessible reading levels, accessible WCAG compliance, accessible on low-end phones and slow networks. Spanish is the first class locale; other locales are first-class when they ship, not second-class translations.

## 6. Who we serve (in order)

1. **People who have never been taught** — the primary audience. If a feature makes them feel stupid, the feature is broken.
2. **People who want to go deeper** — curious learners climbing the ladder toward a career.
3. **People who teach others** — parents, teachers, volunteers, NGOs using Safia as a resource.
4. **Practitioners and researchers** — who extend content, contribute simulators, and keep us honest.

When these groups' needs conflict, earlier groups win.

## 7. What Safia is not

- Not a certification body.
- Not a pentesting product.
- Not a consumer-facing antivirus or password manager.
- Not an aggregator of third-party courses.
- Not a lead-gen funnel for a commercial offering. There is no commercial offering.
- Not neutral about attacks on learners: we will never host content that helps someone harm another person, even framed as education.

## 8. How to use this document as an agent

Before making a non-trivial product decision, run it past four questions:

1. **Mission fit.** Does this help someone practice being unsafe in a safe place, or learn to protect themselves?
2. **Ladder fit.** Which rung (§4) does this serve? Is the rung underserved?
3. **Principle check.** Does it violate any of §5? If yes, stop. Redesign or reject.
4. **Audience check.** Who in §6 benefits? Who in §6 pays a cost? Does the ranking hold?

If all four pass, you are probably on-mission. If any fail, escalate or rework before writing code.

## 9. How this document changes

The **mission** (§2) and **non-negotiables** (§5) change only by explicit, deliberate decision documented in a spec. Everything else can be edited freely as understanding deepens.

When in doubt: re-read §2. Everything else should serve it.
