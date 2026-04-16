import { notFound } from "next/navigation";
import { getLesson, getModule } from "@/lib/content/loader";
import { LessonViewer } from "@/features/lesson/LessonViewer";
import type { QuizQuestion } from "@/features/lesson/Quiz";

interface Props {
  params: Promise<{ locale: string; slug: string; lesson: string }>;
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

  // Prev/next from manifest
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
    />
  );
}
