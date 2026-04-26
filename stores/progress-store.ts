import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Progress store — atlas completion only.
 *
 * Per VISION.md §6 "Motivation by accomplishment, not by engagement" and §7
 * "Gamification is not platform-wide", this store tracks whether a lesson or
 * module has been completed. It does NOT track XP, streaks, levels, or
 * badges. Those mechanics belong only to Safia Range (opt-in) and live in
 * a separate store when Range is built.
 */

export interface LessonProgress {
  completed: boolean;
  /** Last quiz score in this lesson, 0..100. Used for local feedback only. */
  lastScore: number;
  completedAt: string;
}

export interface ModuleProgress {
  lessons: Record<string, LessonProgress>;
  completedAt?: string;
}

export interface ProgressState {
  modules: Record<string, ModuleProgress>;
  completeLesson: (
    moduleSlug: string,
    lessonSlug: string,
    lastScore: number,
  ) => void;
  syncFromServer: (data: Partial<ProgressState>) => void;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      modules: {},

      completeLesson(moduleSlug, lessonSlug, lastScore) {
        set((state) => {
          const mod = state.modules[moduleSlug] ?? { lessons: {} };
          return {
            modules: {
              ...state.modules,
              [moduleSlug]: {
                ...mod,
                lessons: {
                  ...mod.lessons,
                  [lessonSlug]: {
                    completed: true,
                    lastScore,
                    completedAt: new Date().toISOString(),
                  },
                },
              },
            },
          };
        });
      },

      syncFromServer(data) {
        set((state) => ({ ...state, ...data }));
      },

      reset() {
        set({ modules: {} });
      },
    }),
    {
      name: "safia-progress",
      partialize: (state) => ({ modules: state.modules }),
    },
  ),
);
