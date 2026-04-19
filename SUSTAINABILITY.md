# Safia — Sustainability & Stewardship

How Safia stays alive without betraying `VISION.md §6`. This file describes the funding posture, the staged path from "one person's weekend project" to "durable public good," and the boundary conditions for every dollar that enters the project.

This document is an extension of `VISION.md` — specifically of the principle *Sustained, not monetized.*

---

## 1. Funding principles (non-negotiable)

These are derived from `VISION.md §6` and restated here so funding decisions have a standalone checklist.

1. **No venture capital. Ever.** Capital with a return clock eventually demands paywalls, data monetization, or an exit. Both outcomes kill Safia.
2. **No paywalls.** Not on content, not on certificates, not on simulators, not on the Range. Free forever means free forever.
3. **No advertising.** No display ads, no sponsored content, no affiliate links that steer recommendations.
4. **No sale, broker, or enrichment of user data.** Full stop. This principle has no exceptions disguised as "analytics partnerships."
5. **No sponsorship in exchange for editorial influence.** A sponsor buys gratitude, infrastructure credits, or brand association. A sponsor does not buy track topics, product decisions, or soft placement.
6. **No single funding source exceeds a declared share.** From Stage 2 onward, no single sponsor, foundation, grant, or government contract provides more than a publicly declared share of total funding (default: 25%). This makes Safia structurally incapable of being captured by any one funder. The cap is part of the public ledger, not an internal guideline. If a funding offer would push any source past the cap, the excess is declined or phased across years until the cap is respected.
7. **Transparent finances.** Once any funding flows, inflows and outflows are public. Annual reports once amounts justify them.
8. **Every dollar traceable to a stated use.** Infrastructure, content stipends, contributor recognition, legal, incident response — each funding source has a declared destination. No "general pool" that blurs accountability.
9. **Legal capacity is a line item, not a contingency.** Trademark registration and defense (`VISION.md §6`, *Defended trademark, free code*) and incident response capacity (`GOVERNANCE.md §7`) are budgeted explicitly from the first year funding exists, not deferred until problems occur. A project that cannot afford to defend its promise has already broken it.

If a funding opportunity requires violating any of these, the answer is no. The opportunity is never worth the erosion.

## 2. The sponsor-alignment thesis

Charity is fragile. Alignment is durable. Safia's long-term funding is not "please help us" — it is **"helping Safia reduces your costs or advances your mission."**

The question that identifies aligned sponsors:

> *Who saves money or gains reputation if ordinary people are less vulnerable online?*

Candidate sponsors whose business case coincides with the mission:

- **Banks and fintechs** — phishing and social-engineering fraud cost the industry billions yearly. Less-vulnerable users are a direct ROI, not charity.
- **Privacy-forward email and productivity providers** (Proton, Fastmail, Tuta) — mission-aligned on purpose.
- **Password managers** (Bitwarden, 1Password, Proton Pass) — a user who understands why they need one is a future customer; interests overlap with Safia's 100%.
- **Telcos and DNS operators** — SIM-swap and DNS-spoofing attacks burn support budgets.
- **Identity providers** (Okta, Auth0, Clerk) — educated users lower onboarding friction for MFA and SSO.
- **OAuth platforms** (GitHub, Google, Microsoft) — safer accounts mean fewer support escalations.
- **Cyber-insurance underwriters** — less-vulnerable policyholders mean fewer claims.
- **Governments and NGOs** running digital-literacy programs (national ministries, BID, CAF, AECID, EU Commission, Knight Foundation, Mozilla Foundation, Open Society).

This list is illustrative, not a prospect list. The criterion is structural alignment, not logos.

## 3. Money we do not accept

Safia will not accept funding from:

- Ad-tech, data brokers, or surveillance-based business models.
- Commercial spyware vendors or "lawful intercept" companies.
- Entities whose core product exploits the vulnerable population Safia serves — predatory lenders, MLM schemes, unregulated crypto products targeting retail, gambling platforms marketed to low-income users.
- Political parties, political campaigns, or PACs. Safia is apolitical as a matter of trust.
- Entities under active regulatory action for user harm in their operating jurisdiction.
- Any entity whose funding would create the *appearance* of editorial influence, even if no influence is exercised. Appearance matters as much as reality.

A "money we do not accept" list is published and versioned. Refusals are documented publicly in aggregate (no naming), so the principle is visible.

## 4. Staged sustainability path

Safia does not need to solve sustainability today. It needs to not paint itself into a corner on the way.

### Stage 0 — Today
- **Scale:** one maintainer, early content, near-zero traffic.
- **Costs:** a domain (~$15/year) and free-tier hosting + database. Currently implemented on Vercel and Supabase, but those are implementation conveniences, not commitments — any equivalent free tier works.
- **Funding source:** maintainer's pocket.
- **What to do:** keep costs at zero; ship content; publish everything openly.

### Stage 1 — Early traction (first few thousand users)
- **Costs start appearing:** hosting bandwidth, database rows, maybe a small email flow for cert verification.
- **Funding sources, in preference order:**
  1. **Open-source infrastructure programs** — see §5.
  2. **Individual recurring donations** via GitHub Sponsors and Open Collective. No rewards tiers. No perks. Just a "thank you" page with named donors who opt in.
  3. **One-off grants** from small OSS-friendly foundations if opportunity arises.
- **What to do:** apply to infra programs; open GitHub Sponsors and Open Collective; publish monthly cost vs. income.

### Stage 2 — Meaningful traffic (tens of thousands)
- **Costs:** hosting serious, possibly first paid contributor stipends.
- **Funding sources:**
  1. All of Stage 1.
  2. **Fiscal sponsorship** — join a fiscal sponsor (Open Collective Foundation, Software Freedom Conservancy, or a regional equivalent) rather than incorporating a new nonprofit. This unlocks tax-deductible donations in some jurisdictions and gives Safia legal personhood without the overhead of running a 501(c)(3).
  3. **First aligned corporate sponsors** — vetted against §1 and §3. Logos visible on a "Supporters" page; zero editorial involvement.
- **What to do:** secure fiscal sponsor; draft sponsor agreement template with strict no-strings language; publish the first annual transparency report.

### Stage 3 — Regional reach (hundreds of thousands)
- **Costs:** small team, infrastructure scale, legal, possibly translations.
- **Funding sources:**
  1. All of Stage 2.
  2. **Dedicated nonprofit entity** if jurisdiction and scale warrant it. Board of directors, conflict-of-interest policy, annual audit.
  3. **Institutional grants** from major foundations (Knight, Ford, Mozilla, Open Society, regional development banks).
  4. **Government contracts** for digital-literacy programs — only where the contract leaves editorial control with Safia.
- **What to do:** formalize governance; hire deliberately; resist scope creep.

### Stage 4 — Durable institution
- **Funding sources:** mix of individual donations, corporate sponsorship, foundation grants, and potentially a small endowment.
- **What to do:** protect the mission from founder succession; entrench the principles in the bylaws.

Each stage has a **next-stage trigger**: a specific cost or traction number that says "it is time to prepare for the next stage." The trigger is declared before it arrives, so the move is planned, not reactive.

## 5. Programs to explore (when applicable)

Shortlist of open-source support programs that Safia likely qualifies for given the AGPL license and public repo. Conditions change; verify each when applying.

- **GitHub for Open Source** — free Pro-tier features on OSS repos.
- **Vercel Open Source Program** — hosting credits and Pro features for qualifying OSS projects.
- **Supabase** — case-by-case OSS support.
- **Cloudflare for Startups / Open Source** — infrastructure credits.
- **Sentry for Open Source** — error tracking.
- **Algolia Open Source** — search.
- **Plausible / Fathom** — privacy-respecting analytics with OSS terms (priority over tracking-heavy alternatives).
- **Linode / DigitalOcean / Fly.io** — compute credits for OSS projects.
- **Mozilla Foundation, Knight Foundation, Shuttleworth, Prototype Fund** — small-to-medium grants for aligned public-interest projects.

Applying to these is a Stage 1 activity, not Stage 0.

## 6. Transparency practices

From the first dollar:

- **Public ledger.** Every inflow and every outflow recorded in a public document. Open Collective provides this natively.
- **Supporters page.** Named supporters (individuals and sponsors) who opt into visibility, with the date and type of support. No tiered perks that commodify recognition.
- **Annual transparency report** once inflows exceed a published threshold. Covers income, spending, decisions made with the money, mistakes, next year's plan.
- **Refusal log.** Aggregate, anonymized log of funding declined and why. No naming; the principle is what matters.

## 7. Failure modes to avoid

Learned from projects that did not navigate this well.

- **Taking VC.** Non-negotiable. Already covered.
- **Single-funder dependency.** Mozilla's Google problem. The structural protection is in §1 (no source exceeds a declared share). This failure mode exists here as the reason the principle exists: once a single funder is load-bearing, every editorial decision is quietly shaped by what keeps that funder happy, whether anyone names it or not.
- **Donation fatigue through over-asking.** Wikipedia's banners work but abrade the brand. At most one annual campaign. Donation prompts are opt-in surfaces, never forced.
- **Scope creep to please funders.** A grant that nudges Safia into "adjacent work" is worse than no grant. Criteria from §1 hold.
- **Maintainer burnout as subsidy.** If the project only survives because one person is unpaid and overworked, that is not sustainability — it is a delayed failure. Budgeting maintainer time is part of the cost model.
- **Sponsorship optics.** A perfectly legal sponsorship that *looks* compromising is a brand loss. When in doubt, decline and explain why publicly.

## 8. How this document changes

The **funding principles** in §1 and the **non-accepted sources** in §3 change only through the process described in `GOVERNANCE.md`, with explicit documentation of the reason.

Everything else — stage definitions, program lists, transparency practices — evolves as the project learns.

When in doubt: re-read `VISION.md §2` and `VISION.md §6`. If a funding path cannot be justified against both, it is the wrong path.
