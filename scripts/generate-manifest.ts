/**
 * Walk content/modules/, validate each lesson's frontmatter against the
 * STYLE §9 schema, and emit content/manifest.json.
 *
 * Enforcement: a lesson or module that does not parse is a build-blocking
 * error. STYLE §9 requires title, order, last_reviewed, author, steward,
 * audience, assumes, and a 3-question quiz. Freshness (VISION §6) depends
 * on last_reviewed being present.
 *
 * Deduplication: locale variants of the same lesson (lesson-1.es.mdx and
 * lesson-1.en.mdx) emit a single entry per stripped slug, sourced from
 * the Spanish file when present (Spanish is the primary locale per
 * VISION §6). Fixes the bug noted in CLAUDE.md.
 *
 * Usage: pnpm generate-manifest
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import type { ModuleFrontmatter, LessonMeta, ModuleManifest } from "../types/content";

const MODULES_DIR = path.resolve(__dirname, "../content/modules");
const MANIFEST_PATH = path.resolve(__dirname, "../content/manifest.json");

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const quizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(6),
  correct: z.number().int().nonnegative(),
  explanation: z.string().min(1),
});

const lessonFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().positive(),
  module: z.string().min(1).optional(),
  locale: z.enum(["es", "en", "pt"]).optional(),
  last_reviewed: z.string().regex(ISO_DATE, "last_reviewed must be YYYY-MM-DD"),
  author: z.string().min(1),
  steward: z.string().min(1),
  audience: z
    .array(z.enum(["crisis", "obligation", "care", "curiosity"]))
    .min(1),
  assumes: z.array(z.string()).default([]),
  quiz: z.array(quizQuestionSchema).length(3, "every lesson has exactly 3 quiz questions"),
});

const moduleFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().nonnegative(),
  icon: z.string().optional(),
});

function stripLessonSlug(file: string): string {
  return file.replace(/\.(es|en|pt)\.mdx$/, "").replace(/\.mdx$/, "");
}

function readLessons(moduleDir: string, moduleSlug: string): LessonMeta[] {
  const lessonsDir = path.join(moduleDir, "lessons");
  if (!fs.existsSync(lessonsDir)) return [];

  // Group files by stripped slug; keep the best locale (es > en > pt > bare).
  const byStripped = new Map<string, { file: string; locale: number }>();
  const localeRank: Record<string, number> = { es: 0, en: 1, pt: 2 };

  for (const file of fs.readdirSync(lessonsDir)) {
    if (!file.endsWith(".mdx")) continue;
    const stripped = stripLessonSlug(file);
    const m = file.match(/\.(es|en|pt)\.mdx$/);
    const rank = m ? localeRank[m[1]] : 99;
    const prior = byStripped.get(stripped);
    if (!prior || rank < prior.locale) {
      byStripped.set(stripped, { file, locale: rank });
    }
  }

  const lessons: LessonMeta[] = [];
  for (const [slug, { file }] of byStripped) {
    const full = path.join(lessonsDir, file);
    const { data } = matter(fs.readFileSync(full, "utf-8"));
    const parsed = lessonFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n");
      throw new Error(
        `Invalid frontmatter in ${path.relative(process.cwd(), full)}:\n${issues}`,
      );
    }
    const fm = parsed.data;
    lessons.push({
      slug,
      title: fm.title,
      description: fm.description,
      order: fm.order,
      locale: fm.locale,
      last_reviewed: fm.last_reviewed,
      author: fm.author,
      steward: fm.steward,
      audience: fm.audience,
      assumes: fm.assumes,
    });
  }

  return lessons.sort((a, b) => a.order - b.order);
}

function main() {
  if (!fs.existsSync(MODULES_DIR)) {
    console.log("No content/modules/ directory found. Creating empty manifest.");
    fs.writeFileSync(
      MANIFEST_PATH,
      JSON.stringify({ modules: [], generatedAt: new Date().toISOString() }, null, 2),
    );
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
    const parsed = moduleFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
        .join("\n");
      throw new Error(
        `Invalid module frontmatter in ${path.relative(process.cwd(), indexPath)}:\n${issues}`,
      );
    }

    modules.push({
      slug: dir,
      title: parsed.data.title,
      description: parsed.data.description,
      order: parsed.data.order,
      icon: parsed.data.icon,
      lessons: readLessons(moduleDir, dir),
    });
  }

  modules.sort((a, b) => a.order - b.order);

  const manifest: ModuleManifest = {
    modules,
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  const totalLessons = modules.reduce((a, m) => a + m.lessons.length, 0);
  console.log(`Manifest generated: ${modules.length} modules, ${totalLessons} lessons`);
}

main();
