#!/usr/bin/env python3
"""PreToolUse hook: block SUPABASE_SERVICE_ROLE_KEY from leaking outside safe files.

The service role key bypasses RLS and must never appear in client-shipped code.
Safe locations are:
  - lib/supabase/server.ts              (the only legitimate consumer)
  - .env.local.example                  (placeholder documentation)
  - .claude/hooks/guard-service-key.py  (this file — defines the rule)
  - CLAUDE.md, SECURITY.md, README.md   (docs describing the rule)
  - supabase/migrations/*.sql           (DB comments may reference it)

Exit codes:
  0 — allow
  2 — block
"""
from __future__ import annotations

import json
import re
import sys

SERVICE_KEY_PATTERN = re.compile(r"SUPABASE_SERVICE_ROLE_KEY")

SAFE_PATHS = (
    "lib/supabase/server.ts",
    ".env.local.example",
    ".claude/hooks/guard-service-key.py",
    "CLAUDE.md",
    "SECURITY.md",
    "README.md",
    "CONTRIBUTING.md",
)

SAFE_PREFIXES = (
    "supabase/migrations/",
    "docs/",
    ".github/",
)


def is_safe(file_path: str) -> bool:
    for safe in SAFE_PATHS:
        if file_path.endswith(safe):
            return True
    for prefix in SAFE_PREFIXES:
        if prefix in file_path:
            return True
    return False


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
        print(f"guard-service-key: could not parse hook input: {exc}", file=sys.stderr)
        return 0

    tool_name = payload.get("tool_name", "")
    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "") or ""

    new_content = extract_new_content(tool_name, tool_input)
    if not new_content:
        return 0

    if not SERVICE_KEY_PATTERN.search(new_content):
        return 0

    if is_safe(file_path):
        return 0

    msg = (
        "🚨 Service role key leak blocked.\n"
        f"File: {file_path}\n\n"
        "`SUPABASE_SERVICE_ROLE_KEY` bypasses RLS and must never appear in "
        "client code or anywhere outside `lib/supabase/server.ts`.\n\n"
        "If this is a new legitimate server-only consumer, first add its path "
        "to SAFE_PATHS in `.claude/hooks/guard-service-key.py`."
    )
    print(msg, file=sys.stderr)
    return 2


if __name__ == "__main__":
    sys.exit(main())
