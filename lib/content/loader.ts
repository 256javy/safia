import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ModuleManifest, ModuleFrontmatter } from "@/types/content";
import { TipBox } from "@/features/lesson/TipBox";
import { PromptButton } from "@/features/lesson/PromptButton";

const mdxComponents = { TipBox, PromptButton };

const CONTENT_DIR = path.resolve(process.cwd(), "content");
const MODULES_DIR = path.join(CONTENT_DIR, "modules");
const MANIFEST_PATH = path.join(CONTENT_DIR, "manifest.json");

export function getManifest(): ModuleManifest {
  const raw = fs.readFileSync(MANIFEST_PATH, "utf-8");
  return JSON.parse(raw) as ModuleManifest;
}

export function getModule(slug: string): ModuleFrontmatter | undefined {
  const manifest = getManifest();
  return manifest.modules.find((m) => m.slug === slug);
}

export async function getLesson(moduleSlug: string, lessonSlug: string, locale = "es") {
  // Fallback chain: requested locale → Spanish → bare .mdx
  const candidates = [
    path.join(MODULES_DIR, moduleSlug, "lessons", `${lessonSlug}.${locale}.mdx`),
    path.join(MODULES_DIR, moduleSlug, "lessons", `${lessonSlug}.es.mdx`),
    path.join(MODULES_DIR, moduleSlug, "lessons", `${lessonSlug}.mdx`),
  ];

  const filePath = candidates.find((p) => fs.existsSync(p));
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: { parseFrontmatter: false },
    components: mdxComponents,
  });

  return { frontmatter: data, content: mdxContent };
}

export async function getModuleIndex(moduleSlug: string) {
  const filePath = path.join(MODULES_DIR, moduleSlug, "index.mdx");

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: { parseFrontmatter: false },
    components: mdxComponents,
  });

  return { frontmatter: data, content: mdxContent };
}
