/**
 * Walk content/modules/, read frontmatter from each module's index.mdx
 * and each lesson .mdx, then generate content/manifest.json.
 *
 * Usage: npx tsx scripts/generate-manifest.ts
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { ModuleFrontmatter, LessonMeta, ModuleManifest } from "../types/content";

const MODULES_DIR = path.resolve(__dirname, "../content/modules");
const MANIFEST_PATH = path.resolve(__dirname, "../content/manifest.json");

function readLessons(moduleDir: string): LessonMeta[] {
  const lessonsDir = path.join(moduleDir, "lessons");
  if (!fs.existsSync(lessonsDir)) return [];

  return fs
    .readdirSync(lessonsDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(lessonsDir, file), "utf-8");
      const { data } = matter(raw);
      return {
        // Strip locale suffix and .mdx: "lesson-1.es.mdx" → "lesson-1"
        slug: file.replace(/\.(es|en|pt)\.mdx$/, "").replace(/\.mdx$/, ""),
        title: data.title ?? file.replace(/\.mdx$/, ""),
        order: data.order ?? 0,
      } satisfies LessonMeta;
    })
    .sort((a, b) => a.order - b.order);
}

function main() {
  if (!fs.existsSync(MODULES_DIR)) {
    console.log("No content/modules/ directory found. Creating empty manifest.");
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify({ modules: [], generatedAt: new Date().toISOString() }, null, 2));
    return;
  }

  const moduleDirs = fs
    .readdirSync(MODULES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const modules: ModuleFrontmatter[] = [];

  for (const dir of moduleDirs) {
    const moduleDir = path.join(MODULES_DIR, dir);
    const indexPath = path.join(moduleDir, "index.mdx");

    if (!fs.existsSync(indexPath)) {
      console.warn(`Skipping ${dir}: no index.mdx`);
      continue;
    }

    const raw = fs.readFileSync(indexPath, "utf-8");
    const { data } = matter(raw);

    modules.push({
      slug: dir,
      title: data.title ?? dir,
      description: data.description ?? "",
      order: data.order ?? 0,
      icon: data.icon,
      lessons: readLessons(moduleDir),
    });
  }

  modules.sort((a, b) => a.order - b.order);

  const manifest: ModuleManifest = {
    modules,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`Manifest generated: ${modules.length} modules, ${modules.reduce((a, m) => a + m.lessons.length, 0)} lessons`);
}

main();
