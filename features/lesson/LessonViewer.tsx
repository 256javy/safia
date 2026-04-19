"use client";

import type { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { useProgressStore } from "@/stores/progress-store";
import { Quiz, type QuizQuestion } from "./Quiz";

interface LessonViewerProps {
  moduleSlug: string;
  lessonSlug: string;
  moduleTitle: string;
  lessonTitle: string;
  content: ReactNode;
  quiz?: QuizQuestion[];
  prevLesson?: { slug: string; title: string } | null;
  nextLesson?: { slug: string; title: string } | null;
}

export function LessonViewer({
  moduleSlug,
  lessonSlug,
  moduleTitle,
  lessonTitle,
  content,
  quiz,
  prevLesson,
  nextLesson,
}: LessonViewerProps) {
  const t = useTranslations("courses");
  const { completeLesson, modules } = useProgressStore();

  const isCompleted =
    modules[moduleSlug]?.lessons[lessonSlug]?.completed ?? false;

  function handleQuizComplete(score: number) {
    completeLesson(moduleSlug, lessonSlug, score);

    // Sync completion to server for cross-device continuity (authenticated users
    // only — guests live in localStorage). No XP, no streaks — see VISION §6/§7.
    fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        [moduleSlug]: {
          completed_lessons: Object.entries(modules[moduleSlug]?.lessons ?? {})
            .filter(([, l]) => l.completed)
            .map(([slug]) => slug)
            .concat(lessonSlug),
          quiz_scores: {
            ...Object.fromEntries(
              Object.entries(modules[moduleSlug]?.lessons ?? {}).map(
                ([slug, l]) => [slug, l.lastScore],
              ),
            ),
            [lessonSlug]: score,
          },
          started_at: new Date().toISOString(),
        },
      }),
    }).catch(console.error);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted">
        <Link href="/" className="hover:text-text-secondary">
          {t("home")}
        </Link>
        <span>/</span>
        <Link href="/courses" className="hover:text-text-secondary">
          {t("title")}
        </Link>
        <span>/</span>
        <Link
          href={`/courses/${moduleSlug}`}
          className="hover:text-text-secondary"
        >
          {moduleTitle}
        </Link>
        <span>/</span>
        <span className="text-text-primary">{lessonTitle}</span>
      </nav>

      {/* Lesson title */}
      <h1 className="mb-8 text-3xl font-bold text-text-primary">
        {lessonTitle}
      </h1>

      {/* MDX content */}
      <article className="prose-safia">{content}</article>

      {/* Quiz */}
      {quiz && quiz.length > 0 && !isCompleted && (
        <div className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-text-primary">
            {t("quizHeading")}
          </h2>
          <Quiz questions={quiz} onComplete={handleQuizComplete} />
        </div>
      )}

      {isCompleted && (
        <div className="mt-10 rounded-xl border border-success/30 bg-success/10 p-4 text-center">
          <span className="text-2xl">✓</span>
          <p className="mt-1 text-sm font-medium text-success">
            {t("lessonCompleted")}
          </p>
        </div>
      )}

      {/* Navigation prev/next */}
      <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
        {prevLesson ? (
          <Link
            href={`/courses/${moduleSlug}/${prevLesson.slug}`}
            className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <span>←</span>
            <span>{prevLesson.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/courses/${moduleSlug}/${nextLesson.slug}`}
            className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <span>{nextLesson.title}</span>
            <span>→</span>
          </Link>
        ) : (
          <Link
            href={`/courses/${moduleSlug}`}
            className="flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent"
          >
            <span>{t("backToModule")}</span>
            <span>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
