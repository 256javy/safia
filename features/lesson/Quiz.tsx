"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const t = useTranslations("courses.quiz");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  function handleSelect(idx: number) {
    if (showFeedback) return;
    setSelected(idx);
    setShowFeedback(true);
    if (idx === q.correct) {
      setCorrectCount((c) => c + 1);
    }
  }

  function handleNext() {
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      const finalScore = correctCount + (selected === q.correct ? 1 : 0);
      // Recalculate since last answer might not have been counted yet
      const score = Math.round((finalScore / questions.length) * 100);
      setFinished(true);
      onComplete(score);
    }
  }

  if (finished) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="my-8 rounded-xl border border-white/10 bg-bg-surface p-6 text-center">
        <div className="mb-2 text-4xl">{finalScore >= 70 ? "🎉" : "📚"}</div>
        <h3 className="text-xl font-bold text-text-primary">
          {finalScore >= 70 ? t("excellent") : t("keepPracticing")}
        </h3>
        <p className="mt-2 text-text-secondary">
          {t("score", { correct: correctCount, total: questions.length, percent: finalScore })}
        </p>
      </div>
    );
  }

  return (
    <div className="my-8 rounded-xl border border-white/10 bg-bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted">
          {t("question", { current: current + 1, total: questions.length })}
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full ${
                i < current ? "bg-accent" : i === current ? "bg-accent/50" : "bg-bg-elevated"
              }`}
            />
          ))}
        </div>
      </div>

      <h4 className="mb-4 text-lg font-semibold text-text-primary">{q.question}</h4>

      <div className="flex flex-col gap-2">
        {q.options.map((opt, idx) => {
          let style = "border-white/10 hover:border-accent/40";
          if (showFeedback) {
            if (idx === q.correct) style = "border-success bg-success/10";
            else if (idx === selected) style = "border-destructive bg-destructive/10";
            else style = "border-white/5 opacity-50";
          } else if (idx === selected) {
            style = "border-accent";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={showFeedback}
              className={`rounded-lg border px-4 py-3 text-left text-sm text-text-primary transition-all ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-4">
          <p
            className={`text-sm font-medium ${
              selected === q.correct ? "text-success" : "text-destructive"
            }`}
          >
            {selected === q.correct ? t("correct") : t("incorrect")}
          </p>
          <p className="mt-1 text-sm text-text-secondary">{q.explanation}</p>
          <button
            onClick={handleNext}
            className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {current + 1 < questions.length ? t("next") : t("seeResult")}
          </button>
        </div>
      )}
    </div>
  );
}
