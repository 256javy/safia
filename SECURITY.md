# Security Policy

Safia is a platform people use to learn how to protect themselves. A security issue on Safia is not an abstract bug — it is a broken promise. We take reports seriously and respond on published timelines.

This policy is the public-facing entry point for [`GOVERNANCE.md §7`](./GOVERNANCE.md) (incident response). The severity model and timelines below are the same ones maintainers are bound to internally.

---

## Reporting a vulnerability

**Do not open a public issue for security reports.** Use one of the private channels below.

- **GitHub private advisory** (preferred): open a draft advisory at [github.com/256javy/safia/security/advisories/new](https://github.com/256javy/safia/security/advisories/new).
- **Email**: `security@safia.dev` (while that mailbox is being provisioned, use the maintainer address in the repository metadata with subject prefix `[SECURITY]`).

When you report, include — to the extent you have it:

- A description of the issue and the impact you believe it has.
- Steps to reproduce, or a proof of concept.
- The affected URL, component, or commit.
- Your name or handle, if you want public credit in the post-mortem.

You do not need a polished write-up. A rough report today beats a perfect report next week.

## What counts as a security issue

### In scope

- Anything that could cause **real-world harm to a user** of Safia: credential exfiltration, account takeover, session hijacking, a simulator that makes a real network request, a page that could be weaponized as a real phishing lure, a privacy leak that exposes identifiable behavior.
- **Integrity of the simulator boundary** (see below): any path that lets a simulator contact the network, hides the training banner, allows embedding in a third-party origin, or otherwise weakens the hard rules documented in `CLAUDE.md` > *Simulator security*.
- **Identity and session** handling: JWT flaws, OAuth misconfigurations, authorization bypasses, CSRF on state-changing endpoints.
- **Data exposure**: any API response, log, or metric that leaks user identifiers, progress data, or information tied to a single user.
- **Privacy posture**: any path that causes Safia to store, transmit, or expose data that `VISION.md §6` and `CLAUDE.md` forbid (e.g. email addresses, names, avatar URLs).
- **Dependency vulnerabilities** actively exploitable in Safia's configuration.
- **Brand impersonation**: a third party hosting a near-identical Safia clone that phishes real users. This is a trademark/safety issue Safia treats as SEV-1.

### Out of scope

Reports are welcome, but these are not gated by this policy's timelines:

- Issues that require a victim to install malware, connect to an attacker-controlled network, or disable browser security features.
- Rate-limiting or brute-force reports against endpoints that are already rate-limited.
- Self-XSS, missing best-practice headers that do not map to a concrete attack, SPF/DKIM/DMARC configuration on mail domains not used by Safia.
- Theoretical issues without a demonstrable impact on a Safia user.
- Social-engineering attempts against maintainers.

If you are unsure, report it. "Unsure" is exactly what this channel is for.

## Simulator boundary — special emphasis

Safia's auth simulators are pixel-accurate replicas of real login flows (Google, Facebook, Instagram, X, TikTok, banking portals), built for educational use only. They are protected by layered defenses:

- **Training banner** — triple-redundant (CSS watermark, React component, runtime integrity check). Non-dismissable by design.
- **Zero network calls** — every form carries `e.preventDefault()`; `fetch`, `axios`, `XMLHttpRequest`, `WebSocket`, and `navigator.sendBeacon` are forbidden inside `features/simulator/` and `app/[locale]/simulator/`.
- **No action attributes** — forms never point at a URL.
- **Not indexable** — `robots: { index: false, follow: false }` on every simulator page.
- **Frame-ancestors none** — CSP blocks embedding.
- **ESLint rule** — blocks network-capable imports inside simulator paths.

**Any bypass of any of these layers is SEV-1.** Report immediately.

## Response timelines

Severity uses the model in [`GOVERNANCE.md §7`](./GOVERNANCE.md). Timelines are measured from the moment any maintainer acknowledges the report.

| Severity | Triage starts | Public disclosure | Post-mortem published |
|---|---|---|---|
| SEV-1 (active harm or simulator bypass) | Immediately | Within 24 hours | Within 14 days |
| SEV-2 (plausible harm, not confirmed) | Within 24 hours | Within 7 days | Within 30 days |
| SEV-3 (no user harm; accuracy or reputational) | Within 7 days | Next release notes | Bundled |

You will receive an initial acknowledgement within **72 hours** of your report. If you do not, re-send; assume the first message did not arrive.

## What happens after you report

1. **Acknowledgement.** Within 72 hours, a maintainer confirms receipt and assigns an internal tracking identifier.
2. **Triage.** We classify the issue against the severity levels above and share that classification with you. If we disagree on severity, we say so and explain why.
3. **Fix.** We develop and test a fix in a private branch.
4. **Coordinated disclosure.** We coordinate a disclosure date with you. Default: the fix lands in main and the public advisory is published on the same day.
5. **Post-mortem.** We publish a blameless post-mortem in `docs/incidents/` with root cause, contributing factors, the change that closes the gap, and — if you consent — your name or handle in the credits.

## Safe harbor

We will not pursue legal action, file complaints, or otherwise retaliate against security researchers who:

- Make a good-faith effort to avoid privacy violations, service disruption, or destruction of data.
- Report the issue through the private channels above before public disclosure.
- Give us a reasonable window to respond before going public (the timelines above are our commitment; we ask for your patience within them).
- Do not access, modify, or exfiltrate data beyond the minimum required to demonstrate the issue.
- Do not perform denial-of-service attacks as part of their testing.

If you follow the spirit of the above, you are welcome here.

## What we will not do

- We will not ask you to sign an NDA as a precondition for reviewing a report.
- We will not quietly patch and hope nobody notices. Every SEV-1 and SEV-2 becomes a public advisory and a signed post-mortem.
- We will not blame a reporter for finding an issue, regardless of how we learned about it.

---

Thank you for helping keep Safia safe for the people who need it most.
