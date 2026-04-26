#!/usr/bin/env node
// PostToolUse hook: when messages/<locale>.json or any per-platform i18n.<locale>.json
// is edited, validates JSON well-formedness and reports key-tree drift across locales.
// Non-blocking: emits warnings on stdout (which Claude reads as context).

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

let payload;
try {
  payload = JSON.parse(readFileSync(0, "utf8"));
} catch {
  process.exit(0);
}

const filePath = payload?.tool_input?.file_path ?? "";
const isMessages = /messages\/(es|en|pt)\.json$/.test(filePath);
const isPlatformI18n = /features\/simulator\/platforms\/[^/]+\/i18n\.(es|en|pt)\.json$/.test(filePath);

if (!isMessages && !isPlatformI18n) process.exit(0);

const root = process.cwd();
const locales = ["es", "en", "pt"];

function loadJson(p) {
  if (!existsSync(p)) return null;
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch (e) {
    process.stdout.write(`i18n-validate: ${p} is not valid JSON: ${e.message}\n`);
    return null;
  }
}

function flatKeys(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...flatKeys(v, key));
    else out.push(key);
  }
  return out;
}

const trees = Object.fromEntries(
  locales.map((l) => [l, loadJson(resolve(root, "messages", `${l}.json`))]),
);
if (locales.some((l) => trees[l] === null)) process.exit(0);

const keys = Object.fromEntries(locales.map((l) => [l, new Set(flatKeys(trees[l]))]));
const reference = keys.es;
const drift = [];
for (const l of ["en", "pt"]) {
  const missing = [...reference].filter((k) => !keys[l].has(k));
  const extra = [...keys[l]].filter((k) => !reference.has(k));
  if (missing.length || extra.length) {
    drift.push(`  ${l}: -${missing.length} missing, +${extra.length} extra`);
    if (missing.length <= 8) drift.push(...missing.map((k) => `      missing: ${k}`));
    if (extra.length <= 8) drift.push(...extra.map((k) => `      extra:   ${k}`));
  }
}

if (drift.length) {
  process.stdout.write(`i18n-validate: locale key drift detected\n${drift.join("\n")}\n`);
}
process.exit(0);
