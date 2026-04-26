---
rfc: 0000
title: RFC template — replace with a short, task-first title
author: your-github-handle
sponsor: maintainer-github-handle
status: draft                  # draft | open | accepted | rejected | superseded | implemented
opened: YYYY-MM-DD
decision_type: product_rfc     # product_rfc | amendment   (see GOVERNANCE.md §4)
supersedes: null               # RFC number, if any
superseded_by: null
---

> **How to use this template.** Copy this file to `docs/rfcs/NNNN-short-slug.md` with the next sequential number. Fill every section; sections that genuinely do not apply are marked `N/A` with a one-sentence reason. Leave the frontmatter `status: draft` until you open the PR. Process: [`GOVERNANCE.md §5`](../../GOVERNANCE.md).

---

## 1. Summary

One paragraph, plain Spanish or English, that a non-maintainer can read in under a minute and understand the proposal. Task-first language: say what changes for the reader, the contributor, or the operator.

## 2. Motivation

What problem does this solve? Who is affected? Why now? Link concrete evidence where possible — an incident, a support question that keeps repeating, a blocker in a current contribution, a principle in `VISION.md` that is currently not operationalized.

If this RFC is a response to a cross-doc obligation (e.g. VISION §6 promises freshness, this RFC operationalizes it), say so explicitly with section references.

## 3. Proposal

What exactly is being proposed? Be concrete. Prose is fine; diagrams, pseudocode, or example UI snippets are welcome if they make the proposal clearer.

If the proposal has multiple moving parts, subsection them:

### 3.1 User-facing changes

What does the person who lands on the site see differently?

### 3.2 Content or editorial changes

What changes for authors, reviewers, stewards?

### 3.3 Technical changes

Schema changes, new routes, new background jobs, new data, new dependencies. If none, say so.

### 3.4 Operational changes

New dashboards, alerts, runbook entries, CI jobs, cron jobs.

## 4. Alternatives considered

List the two or three other approaches you considered, with one paragraph each and why they were not chosen. An RFC with no alternatives section is a proposal, not a decision record.

## 5. Impact on VISION, STYLE, GOVERNANCE, SUSTAINABILITY

Walk the layer-1 docs and call out any obligation this proposal creates, reinforces, or tensions with.

- `VISION.md`: does this touch a non-negotiable principle (§6), the audience ranking (§8), or "what Safia is not" (§9)? If yes, this is an **amendment**, not a product RFC — see `GOVERNANCE.md §4`.
- `STYLE.md`: does this change the reader's experience of voice, tone, naming, or accessibility?
- `GOVERNANCE.md`: does this change who decides what or how incidents are handled?
- `SUSTAINABILITY.md`: does this introduce a recurring cost, a new sponsor-alignment question, or a change in funding posture?

## 6. Scope expansion check

Does this RFC pull scope beyond what the motivation strictly requires? If yes, name the expansion and justify it. If the expansion is optional, split it into a separate RFC and mark it as a follow-up here.

## 7. Risks and failure modes

What could go wrong? Name the specific failure, the population affected, and the mitigation. Include at least:

- **Silent failure mode**: what breaks in a way the user would not notice?
- **Accessibility regression**: can this make the site worse for low-end phones, screen readers, or low-literacy readers?
- **Dignity regression**: can any part of this make a reader in crisis feel worse?
- **Privacy regression**: does this cause Safia to collect, store, or expose any data it currently does not?
- **Security surface**: does this add a new endpoint, form, or untrusted input path?

## 8. Rollout plan

- **Feature flag?** Yes / no and why.
- **Migration?** If the change touches data, what is the before/after and what happens to existing rows?
- **Deprecation?** If anything is being replaced, what is the deprecation window and the comms plan?
- **Rollback?** One paragraph on how to undo this if something goes wrong after merge.

## 9. Success criteria

How will we know this worked? State concrete signals (quantitative where possible, qualitative where not). Include a re-evaluation date.

## 10. Open questions

List the questions you want reviewers to weigh in on first. This is where to admit ignorance. A good RFC makes it obvious where input is most valuable.

## 11. Decision record

*Filled in by the sponsor at resolution time.*

- **Outcome**: accepted | rejected | superseded
- **Date**: YYYY-MM-DD
- **Reasoning**: one paragraph summarizing the decision, referencing the substantive reviewer comments.
- **Implementation target**: PR or issue link, with a 90-day reopen trigger per `GOVERNANCE.md §5`.

---

*When in doubt about the RFC process, re-read `GOVERNANCE.md §5`. When in doubt about whether to open one at all, open one — shaping an idea in public is cheaper than shaping it in private.*
