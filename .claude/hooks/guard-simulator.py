#!/usr/bin/env python3
"""PreToolUse hook: block changes that weaponize the auth simulator.

Blocks Write/Edit on files under features/simulator/ when the new content
introduces forbidden network-call patterns. The simulator must remain a
pure client-side practice environment with zero network activity.

Exit codes:
  0 — allow (not a simulator file, or content is clean)
  2 — block (stderr shown to Claude as block reason)
  any other — non-blocking error (hook itself failed)

Input: JSON on stdin following Claude Code PreToolUse schema.
"""
from __future__ import annotations

import json
import re
import sys

FORBIDDEN_PATTERNS = [
    (re.compile(r"\bfetch\s*\("), "fetch("),
    (re.compile(r"\baxios\b"), "axios"),
    (re.compile(r"\bXMLHttpRequest\b"), "XMLHttpRequest"),
    (re.compile(r"['\"]node-fetch['\"]"), "node-fetch import"),
    (re.compile(r"navigator\.sendBeacon"), "navigator.sendBeacon"),
    (re.compile(r"new\s+WebSocket\s*\("), "new WebSocket("),
    (re.compile(r"new\s+EventSource\s*\("), "new EventSource("),
]

SIMULATOR_MARKER = "features/simulator/"


def extract_new_content(tool_name: str, tool_input: dict) -> str | None:
    if tool_name == "Write":
        return tool_input.get("content")
    if tool_name == "Edit":
        return tool_input.get("new_string")
    return None


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception as exc:
        print(f"guard-simulator: could not parse hook input: {exc}", file=sys.stderr)
        return 0  # fail-open — don't break the dev loop on a hook bug

    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "") or ""

    if SIMULATOR_MARKER not in file_path:
        return 0

    new_content = extract_new_content(tool_name, tool_input)
    if not new_content:
        return 0

    hits: list[str] = []
    for pattern, label in FORBIDDEN_PATTERNS:
        if pattern.search(new_content):
            hits.append(label)

    if hits:
        msg = (
            "🚨 Simulator security violation blocked.\n"
            f"File: {file_path}\n"
            f"Forbidden patterns introduced: {', '.join(hits)}\n\n"
            "The auth simulators MUST have zero network calls — they are "
            "pixel-accurate phishing replicas and any network activity "
            "would turn them into weapons.\n\n"
            "See CLAUDE.md §Simulator Security. If this is a legitimate "
            "exception, lift the rule via `.claude/settings.json` — do NOT "
            "work around the hook."
        )
        print(msg, file=sys.stderr)
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
