#!/usr/bin/env python3
"""SessionStart hook: inject current Safia sprint status into context.

Reads content/manifest.json and compares actual lesson counts against the
targets declared in CLAUDE.md. Prints a compact progress table that Claude
can use to plan without re-reading the full spec.

Output format (Claude Code SessionStart hook):
  stdout = JSON with hookSpecificOutput.additionalContext

Exit 0 always — never block session startup.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
MANIFEST = PROJECT_ROOT / "content" / "manifest.json"

TARGETS = {
    "passwords": 6,
    "phishing": 7,
    "mfa": 5,
    "simulators": 5,
    "wifi": 5,
    "social-media": 6,
    "pass-manager": 6,
    "device-security": 5,
}


def build_context() -> str:
    if not MANIFEST.exists():
        return "Safia sprint context: no manifest.json yet (run `pnpm generate-manifest`)."

    try:
        data = json.loads(MANIFEST.read_text())
    except Exception as exc:
        return f"Safia sprint context: manifest.json unreadable ({exc})."

    modules = data.get("modules", [])
    by_slug = {m.get("slug"): m for m in modules}

    lines = ["Safia lesson progress (actual / target):"]
    total_done = 0
    total_target = 0
    for slug, target in TARGETS.items():
        done = len(by_slug.get(slug, {}).get("lessons", []))
        total_done += done
        total_target += target
        bar = "●" * done + "○" * (target - done)
        lines.append(f"  {slug:<16} {done}/{target}  {bar}")
    lines.append(f"  {'TOTAL':<16} {total_done}/{total_target}")
    lines.append("")
    lines.append(
        "Tip: use `/new-lesson <module> <order> <locale>` to scaffold, "
        "`/qa-pass` after content edits, `/ship-ready` before committing."
    )
    return "\n".join(lines)


def main() -> int:
    try:
        additional_context = build_context()
    except Exception as exc:
        additional_context = f"Safia sprint context: error ({exc})."

    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "SessionStart",
                    "additionalContext": additional_context,
                }
            }
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
