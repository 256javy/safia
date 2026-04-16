import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LessonProgress {
  completed: boolean;
  score: number;
  completedAt: string;
}

export interface ModuleProgress {
  lessons: Record<string, LessonProgress>;
  completedAt?: string;
}

export interface ProgressState {
  xp: number;
  level: number;
  modules: Record<string, ModuleProgress>;
  badges: string[];
  streak: number;
  lastActivityDate: string;
  completeLesson: (
    moduleSlug: string,
    lessonSlug: string,
    xpEarned: number,
  ) => void;
  earnBadge: (badgeId: string) => void;
  updateStreak: () => void;
  syncFromServer: (data: Partial<ProgressState>) => void;
  reset: () => void;
}

function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      xp: 0,
      level: 1,
      modules: {},
      badges: [],
      streak: 0,
      lastActivityDate: "",

      completeLesson(moduleSlug, lessonSlug, xpEarned) {
        set((state) => {
          const newXp = state.xp + xpEarned;
          const mod = state.modules[moduleSlug] ?? { lessons: {} };
          return {
            xp: newXp,
            level: calculateLevel(newXp),
            modules: {
              ...state.modules,
              [moduleSlug]: {
                ...mod,
                lessons: {
                  ...mod.lessons,
                  [lessonSlug]: {
                    completed: true,
                    score: xpEarned,
                    completedAt: new Date().toISOString(),
                  },
                },
              },
            },
          };
        });
      },

      earnBadge(badgeId) {
        set((state) => {
          if (state.badges.includes(badgeId)) return state;
          return { badges: [...state.badges, badgeId] };
        });
      },

      updateStreak() {
        set((state) => {
          const today = todayISO();
          if (state.lastActivityDate === today) return state;

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const wasYesterday =
            state.lastActivityDate === yesterday.toISOString().slice(0, 10);

          return {
            streak: wasYesterday ? state.streak + 1 : 1,
            lastActivityDate: today,
          };
        });
      },

      syncFromServer(data) {
        set((state) => ({ ...state, ...data }));
      },

      reset() {
        set({
          xp: 0,
          level: 1,
          modules: {},
          badges: [],
          streak: 0,
          lastActivityDate: "",
        });
      },
    }),
    {
      name: "safia-progress",
      partialize: (state) => ({
        modules: state.modules,
        xp: state.xp,
        badges: state.badges,
        streak: state.streak,
        lastActivityDate: state.lastActivityDate,
      }),
    },
  ),
);
