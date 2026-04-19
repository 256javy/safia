# Safia — Governance

How decisions are made in Safia, who makes them, and how the load is distributed as the project grows. Governance exists to keep the mission intact while letting the product evolve; the goal is not process for its own sake but the fewest guardrails that prevent drift.

This document is an extension of `VISION.md` — specifically of the principles *Transparent decisions* and *Contribution over canonization* (§6), and the decision filter (§10).

---

## 1. Current state

Safia is, today, a single-maintainer project. This section is honest about that.

- **Decisions** are made by the maintainer, documented publicly where possible.
- **Reviews** happen through normal pull-request review on GitHub.
- **Accountability** is to `VISION.md`. The maintainer does not override `VISION.md`; the maintainer proposes amendments the same way anyone else does (§5 below).

The sections that follow describe the process Safia will adopt as it grows. They are written in advance because installing governance after trust has eroded is much harder than installing it while trust is intact.

Rule of thumb: **a process becomes binding the first time the condition it governs actually occurs.** The incident response plan in §7 is binding from the day this document is merged, even before the first incident. The contribution ladder in §3 becomes binding the first time a second regular contributor appears.

## 2. What governance does not decide

Governance sets process; it does not set content. These are explicitly out of scope:

- The voice, tone, and pedagogical standard of lessons (→ `STYLE.md`).
- The funding principles and sponsor criteria (→ `SUSTAINABILITY.md`).
- The non-negotiable principles of the product (→ `VISION.md §6`). Governance describes *how* to amend those; it does not pre-authorize any amendment.

## 3. Contribution ladder

Four roles, each a superset of the prior one:

- **Contributor.** Anyone who opens a PR, files an issue, or proposes a change. No credential required.
- **Reviewer.** Has demonstrated sustained, mission-aligned contribution (rough floor: five merged non-trivial PRs, or equivalent editorial work). Can approve PRs that touch the areas they work in. Invited by a maintainer; removal requires a maintainer decision with public reasoning.
- **Maintainer.** Can merge to main, cut releases, invite new reviewers, and sponsor RFCs. Invited by unanimous agreement of existing maintainers. Commits to being responsive (working definition: replies within seven days on average) and to publishing a yearly reflection on decisions made.
- **Steward.** A small council (minimum three, maximum seven) that votes on amendments to protected sections of `VISION.md` and `SUSTAINABILITY.md`. Stewards are drawn from maintainers after at least twelve months of maintainer service. A single steward cannot block an amendment; amendments require a two-thirds majority. Stewardship is an accountability ceiling, not a hierarchy.

Any role is revocable. Revocation is documented with a public reason. The reason can be a single sentence; opacity is the enemy.

## 4. Decision types

Not every decision needs the same weight of process.

| Type | Examples | Who decides | Record |
|---|---|---|---|
| Routine | Bug fix, typo, dependency bump, minor copy tweak | Any maintainer (reviewer if scoped to their area) | PR + merge |
| Substantive | New lesson, new simulator, new route in the atlas, UX flow changes | Maintainer with at least one reviewer approval | PR with rationale in description |
| Product RFC | New track, new certificate tier, new Range season format, architectural shift | Maintainer consensus after public RFC discussion (minimum 7 days open) | RFC merged into `docs/rfcs/` |
| Amendment | Changes to `VISION.md` §2/§6/§8/§9 or `SUSTAINABILITY.md` §1/§3 | Steward vote (two-thirds) after public RFC (minimum 21 days open) | RFC merged + `VISION.md`/`SUSTAINABILITY.md` diff linked |

When in doubt, escalate up one row. Governance is cheap; drift is expensive.

## 5. The RFC process

For any decision requiring an RFC:

1. **Draft.** Author opens a PR adding a Markdown file to `docs/rfcs/` numbered sequentially (`NNNN-short-slug.md`). Template lives in the same directory.
2. **Open period.** A public discussion window during which the RFC can be revised. Minimum length depends on decision type (§4).
3. **Reviewer input.** At least two reviewers or maintainers must leave substantive comments. Approvals that add no reasoning do not count.
4. **Resolution.** The sponsor (a maintainer) either merges the RFC with a decision, closes it with documented reasoning, or extends the open period once. Repeated extensions are a signal the RFC is not ready.
5. **Implementation.** A merged RFC is a commitment; if implementation does not happen within 90 days, the RFC is automatically reopened for re-scoping or abandonment.

RFCs are the product's public memory. A decision with no RFC is a decision nobody can learn from.

## 6. Track approval criteria

Before a new content track ships — not a single lesson, a whole track — it must satisfy:

1. **Mission fit.** The track's target audience is named along both axes of `VISION.md §8`.
2. **Non-overlap.** The track does not duplicate content already in another track; if overlap exists, the RFC explains why.
3. **Editorial depth.** At least one reviewer with domain expertise has signed off on factual accuracy.
4. **Bias checklist.** The `STYLE.md §7` bias checklist has been run and the output is attached to the PR.
5. **Accessibility baseline.** The track meets the baseline in `STYLE.md §8` (reading level, WCAG conformance, performance on low-end devices).
6. **Freshness commitment.** Each lesson has a named steward responsible for twelve-month review (`VISION.md §6`, `STYLE.md §6`).
7. **Dual-use test.** Every piece of offensive content passes the test in `STYLE.md §5`.

A track that fails any of these is not merged. "Almost there" is not a category.

## 7. Incident response

Safia is a trust-critical brand (`VISION.md §6`). A single incident can collapse it. This plan is binding from the date this document is merged, regardless of whether an incident has occurred.

### Classification

- **SEV-1** — user harm has occurred or is occurring. Examples: credential exfiltration, a simulator that made a real network request, a successful brand impersonation actively hitting real users, a vulnerability under active exploitation.
- **SEV-2** — user harm is plausible but not confirmed. Examples: a vulnerability exists but no exploitation observed; a fork is impersonating the brand but traffic is negligible; a privacy leak in a low-traffic surface.
- **SEV-3** — no user harm; reputational or accuracy issue. Examples: a lesson teaches something technically wrong; a simulator has a bug that breaks training mode but does not leak data.

### Timelines

Measured from the moment any maintainer learns of the incident.

| Severity | Triage starts | Public disclosure | Post-mortem published |
|---|---|---|---|
| SEV-1 | Immediately | Within 24 hours | Within 14 days |
| SEV-2 | Within 24 hours | Within 7 days | Within 30 days |
| SEV-3 | Within 7 days | Bundled with next release notes | Bundled |

### Disclosure content

At minimum: what happened, when, who is affected, what we did, what the user should do, what we will change so it does not happen again. No euphemism. No deferral of accountability to an unnamed team.

### Direct communication

When users are identifiable and reachable (rare, given `VISION.md §6` privacy posture), we contact them directly. When they are not, we post a prominent banner on the site for at least thirty days.

### Post-mortem

Signed by a maintainer, merged as a Markdown file in `docs/incidents/`. Blameless in tone, specific in fact. Names root cause, contributing factors, detection gap, and the concrete change that closes the gap. A post-mortem without a named change is incomplete.

### Budget

Incident response is funded from Stage 1 onward (`SUSTAINABILITY.md §1`). Deferring capacity until an incident happens is the same as not having a plan.

## 8. FOMO-line arbitration

`VISION.md §6` forbids engagement-harvesting mechanics transversally. `§7` permits gamification inside Safia Range, conditional on the mechanic not crossing into FOMO. The operational test lives in `VISION.md §7`; this section says who applies it.

For any Range feature that touches notifications, rankings, streaks, re-engagement flows, or public visibility of inactivity:

1. The author documents the test result in the PR description: *"Would a mother who was just scammed and landed on Safia for the first time feel worse for seeing this?"*
2. At least one reviewer explicitly signs off on the test result.
3. If any reviewer believes the test fails, the feature is blocked pending an RFC (§5).

The burden of proof rests on the feature author, not on the objector. Silence is not consent.

## 9. Conflict of interest

Anyone in a reviewer, maintainer, or steward role discloses:

- Employment by or equity in entities listed in `SUSTAINABILITY.md §2` (candidate sponsors) or §3 (non-accepted sources).
- Ongoing paid relationships that touch Safia's content areas (a paid curriculum author elsewhere, a paid pentester whose firm could benefit from Safia's pipeline).

Disclosure does not disqualify. Non-disclosure does. When a decision intersects a disclosed interest, the person recuses from that decision and says why in the PR.

Disclosures are collected in `docs/disclosures.md`, updated by the discloser, and reviewed yearly.

## 10. Succession

Single-maintainer projects die when the maintainer stops. Safia plans against that from day one.

- **Bus-factor contingency.** The maintainer keeps a private document naming at least two trusted individuals who can assume maintainership if the maintainer is incapacitated. The document includes access credentials in escrow (password manager share, domain access, sponsor contacts) and explicit permission to act. It is reviewed annually.
- **Planned handover.** When a maintainer steps down by choice, they propose a successor via RFC. The open period is at least thirty days.
- **Mission lock.** A successor inherits the obligation to `VISION.md`, not the authority to rewrite it. Amendments follow §4 and §5 regardless of who holds the pen.

## 11. How this document changes

Governance amendments are themselves RFC-gated. Changes to §3 (ladder), §4 (decision types), §5 (RFC process), §7 (incident response), §8 (FOMO arbitration), and §10 (succession) require a steward vote (two-thirds, per §4).

Everything else evolves as the project learns.

When in doubt: re-read `VISION.md §6` — specifically *Transparent decisions* and *Author humility*. Governance that hides decisions is governance that has failed its own purpose.
