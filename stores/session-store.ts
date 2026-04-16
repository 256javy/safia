import { create } from "zustand";

export interface SessionState {
  currentModuleSlug: string | null;
  currentLessonSlug: string | null;
  simulatorActive: boolean;
  score: number;
  hintsUsed: number;
  pendingCelebration: string | null;
  startLesson: (moduleSlug: string, lessonSlug: string) => void;
  startSimulator: () => void;
  stopSimulator: () => void;
  addScore: (points: number) => void;
  useHint: () => void;
  setCelebration: (celebration: string | null) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  currentModuleSlug: null,
  currentLessonSlug: null,
  simulatorActive: false,
  score: 0,
  hintsUsed: 0,
  pendingCelebration: null,

  startLesson(moduleSlug, lessonSlug) {
    set({
      currentModuleSlug: moduleSlug,
      currentLessonSlug: lessonSlug,
      score: 0,
      hintsUsed: 0,
    });
  },

  startSimulator() {
    set({ simulatorActive: true, score: 0, hintsUsed: 0 });
  },

  stopSimulator() {
    set({ simulatorActive: false });
  },

  addScore(points) {
    set((state) => ({ score: state.score + points }));
  },

  useHint() {
    set((state) => ({ hintsUsed: state.hintsUsed + 1 }));
  },

  setCelebration(celebration) {
    set({ pendingCelebration: celebration });
  },

  resetSession() {
    set({
      currentModuleSlug: null,
      currentLessonSlug: null,
      simulatorActive: false,
      score: 0,
      hintsUsed: 0,
      pendingCelebration: null,
    });
  },
}));
