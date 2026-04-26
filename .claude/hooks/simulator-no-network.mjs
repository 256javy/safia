#!/usr/bin/env node
// PreToolUse hook: blocks Edit/Write/MultiEdit on features/simulator/** if the new content
// would introduce a network call. Hard-coded security rule from CLAUDE.md.
//
// Receives a JSON blob on stdin from Claude Code with shape:
//   { tool_name, tool_input: { file_path, content?, new_string? } }
// Exit 2 with stderr message blocks the tool call.

import { readFileSync } from "node:fs";

const BANNED = [
  /\bfetch\s*\(/,
  /\baxios\b/,
  /\bnew\s+XMLHttpRequest\b/,
  /\bnew\s+WebSocket\b/,
  /\bnavigator\.sendBeacon\b/,
  /\baction\s*=\s*["']https?:/i,
];

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0); // No payload — allow.
}

const filePath = payload?.tool_input?.file_path ?? "";
if (!filePath.includes("features/simulator/")) {
  process.exit(0);
}

// Engine itself is allowed to ship higher-order code (we trust it). Lock down only
// the surfaces where a teammate could slip a request: platforms/* and FlowRoute.
const guarded = filePath.includes("features/simulator/platforms/") || filePath.includes("FlowRoute");
if (!guarded) {
  process.exit(0);
}

const candidate =
  payload?.tool_input?.content ??
  payload?.tool_input?.new_string ??
  payload?.tool_input?.edits?.map((e) => e.new_string).join("\n") ??
  "";

for (const re of BANNED) {
  if (re.test(candidate)) {
    process.stderr.write(
      `BLOCKED: ${filePath} would introduce a network call (matched ${re}). ` +
        `Simulator code is offline by hard rule (CLAUDE.md > simulator security). ` +
        `If this is a false positive (e.g. inside a comment teaching what NOT to do), ` +
        `wrap the example as a string literal: const example = "fetch(...)" — the regex won't match.\n`,
    );
    process.exit(2);
  }
}

process.exit(0);
