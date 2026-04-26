#!/usr/bin/env node
// PostToolUse hook: regenerates content/manifest.json when an MDX lesson file is edited.
// Non-blocking: skips silently if pnpm or generator missing.

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const filePath = payload?.tool_input?.file_path ?? "";
if (!/content\/modules\/.*\.mdx$/.test(filePath)) process.exit(0);

if (!existsSync("scripts/generate-manifest.ts")) process.exit(0);

const r = spawnSync("pnpm", ["generate-manifest"], { stdio: "pipe", encoding: "utf8" });
if (r.status === 0) {
  process.stdout.write("manifest-regen: content/manifest.json regenerated.\n");
} else {
  process.stdout.write(`manifest-regen: failed (status ${r.status})\n${r.stderr ?? ""}\n`);
}
process.exit(0);
