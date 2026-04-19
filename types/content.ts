/**
 * Content model types.
 *
 * The frontmatter schema is enforced in `scripts/generate-manifest.ts`
 * (Zod). These types mirror the schema so consumers can read manifest
 * entries without re-validating.
 */

export type Audience = "crisis" | "obligation" | "care" | "curiosity";

export interface LessonMeta {
  slug: string;
  title: string;
  description?: string;
  order: number;
  locale?: string;
  last_reviewed: string;
  author: string;
  steward: string;
  audience: Audience[];
  assumes: string[];
}

export interface ModuleFrontmatter {
  slug: string;
  title: string;
  description: string;
  order: number;
  icon?: string;
  lessons: LessonMeta[];
}

export interface ModuleManifest {
  modules: ModuleFrontmatter[];
  generatedAt: string;
}
