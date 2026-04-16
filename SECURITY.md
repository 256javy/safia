# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| latest  | ✅        |

## Reporting a Vulnerability

**Please do NOT report security vulnerabilities via public GitHub issues.**

Email: **security@safia.dev**  
Response SLA: **48 hours** acknowledgement, resolution timeline communicated within 5 business days.

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

We will acknowledge receipt, investigate, and keep you informed of the resolution.

## ⚠️ Special Note: Simulator Security

Safia includes pixel-accurate replicas of real authentication flows (Google, Facebook, Instagram, X, TikTok, banking) for educational purposes.

These simulators are protected by multiple layers:
- **Training banner** — triple-redundant (CSS, React component, JS interval) — cannot be dismissed
- **Zero network calls** — all form submissions call `e.preventDefault()`, no `fetch` or `axios`
- **No indexing** — `robots: noindex` on all simulator pages
- **ESLint rule** — blocks `fetch`/`axios` imports inside `/features/simulator/`

If you discover a way to bypass these protections or weaponize the simulators for actual phishing, **this is a critical vulnerability** — please report immediately.

## Scope

| In scope | Out of scope |
|---|---|
| Authentication bypass | Clickjacking on non-simulator pages |
| XSS leading to session theft | Self-XSS |
| Progress data manipulation | Brute force (no login form) |
| Simulator security bypass | Social engineering of maintainers |
| PII leakage | Issues in third-party dependencies (report upstream) |

## Responsible Disclosure

We follow coordinated disclosure. We ask that you:
1. Give us reasonable time to fix before public disclosure
2. Not access or modify other users' data
3. Not perform DoS attacks

We commit to not pursuing legal action against researchers acting in good faith.
