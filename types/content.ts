export interface ModuleFrontmatter {
  slug: string;
  title: string;
  description: string;
  order: number;
  icon?: string;
  lessons: LessonMeta[];
}

export interface LessonMeta {
  slug: string;
  title: string;
  order: number;
}

export interface ModuleManifest {
  modules: ModuleFrontmatter[];
  generatedAt: string;
}
