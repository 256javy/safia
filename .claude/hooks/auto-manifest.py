#!/usr/bin/env python3
"""PostToolUse hook: regenerate content manifest after MDX lesson edits.

Runs `pnpm generate-manifest` in the background so Claude isn't blocked
waiting for the script. Idempotent — running multiple times is cheap.

Only triggers when an MDX file under content/modules/ was written.

Exit 0 always (non-blocking — this is a convenience, not enforcement).
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    tool_input = payload.get("tool_input", {}) or {}
    file_path = tool_input.get("file_path", "") or ""

    if "content/modules/" not in file_path or not file_path.endswith(".mdx"):
        return 0

    log_file = PROJECT_ROOT / ".claude" / "hooks" / "auto-manifest.log"
    log_file.parent.mkdir(parents=True, exist_ok=True)

    try:
        with open(log_file, "ab") as log_fd:
            subprocess.Popen(
                ["pnpm", "generate-manifest"],
                cwd=str(PROJECT_ROOT),
                stdout=log_fd,
                stderr=log_fd,
                stdin=subprocess.DEVNULL,
                start_new_session=True,
                env={**os.environ, "CI": "1"},
            )
    except Exception as exc:
        print(f"auto-manifest: failed to spawn: {exc}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
