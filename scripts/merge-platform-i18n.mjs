// Merges per-platform i18n.<locale>.json files into messages/<locale>.json
// under simulator.<platform>.
import fs from "node:fs";
import path from "node:path";

const PLATFORMS = ["google", "instagram", "facebook", "bank"];
const LOCALES = ["es", "en", "pt"];
const ROOT = process.cwd();

for (const loc of LOCALES) {
  const messagesPath = path.join(ROOT, "messages", `${loc}.json`);
  const messages = JSON.parse(fs.readFileSync(messagesPath, "utf8"));
  messages.simulator = messages.simulator ?? {};

  let merged = 0;
  for (const id of PLATFORMS) {
    const p = path.join(ROOT, "features/simulator/platforms", id, `i18n.${loc}.json`);
    if (!fs.existsSync(p)) continue;
    const content = JSON.parse(fs.readFileSync(p, "utf8"));
    messages.simulator[id] = content;
    merged++;
  }

  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2) + "\n");
  console.log(`merged ${merged} platforms into ${loc}.json`);
}
