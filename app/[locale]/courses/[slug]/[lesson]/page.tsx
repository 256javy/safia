import { notFound } from "next/navigation";
import { getLesson, getModule, getManifest } from "@/lib/content/loader";
import { LessonViewer } from "@/features/lesson/LessonViewer";
import type { QuizQuestion } from "@/features/lesson/Quiz";

interface Props {
  params: Promise<{ locale: string; slug: string; lesson: string }>;
}

interface ResolvedPrereq {
  slug: string;
  title?: string;
  moduleSlug?: string;
}

/**
 * Resolve each prerequisite slug in a lesson's `assumes` frontmatter
 * against the manifest so `<PrerequisitesBlock>` can render a working
 * deep link. An unresolved prereq still renders, just without a module
 * prefix — the link falls back to /courses/<slug>.
 */
function resolvePrereqs(assumes: string[]): ResolvedPrereq[] {
  if (!assumes.length) return [];
  const manifest = getManifest();
  return assumes.map((slug) => {
    for (const mod of manifest.modules) {
      const found = mod.lessons.find((l) => l.slug === slug);
      if (found) {
        return { slug, title: found.title, moduleSlug: mod.slug };
      }
    }
    return { slug };
  });
}

export default async function LessonPage({ params }: Props) {
  const { locale, slug, lesson: lessonSlug } = await params;

  const [lessonData, mod] = await Promise.all([
    getLesson(slug, lessonSlug, locale),
    Promise.resolve(getModule(slug)),
  ]);

  if (!lessonData) return notFound();

  const { frontmatter, content } = lessonData;

  const moduleTitle = mod?.title ?? slug;
  const lessonTitle = (frontmatter.title as string) ?? lessonSlug;
  const lastReviewed = (frontmatter.last_reviewed as string | undefined) ?? undefined;
  const assumes = Array.isArray(frontmatter.assumes)
    ? (frontmatter.assumes as string[])
    : [];
  const prereqs = resolvePrereqs(assumes);

  const lessons = mod?.lessons ?? [];
  const currentIdx = lessons.findIndex((l) => l.slug === lessonSlug);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx >= 0 && currentIdx < lessons.length - 1
      ? lessons[currentIdx + 1]
      : null;

  const quiz = (frontmatter.quiz as QuizQuestion[] | undefined) ?? [];

  return (
    <LessonViewer
      moduleSlug={slug}
      lessonSlug={lessonSlug}
      moduleTitle={moduleTitle}
      lessonTitle={lessonTitle}
      content={content}
      quiz={quiz}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      lastReviewed={lastReviewed}
      prereqs={prereqs}
    />
  );
}
