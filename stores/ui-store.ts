import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UIState {
  sidebarOpen: boolean;
  reducedMotion: boolean;
  hasSeenCoachMark: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  markCoachMarkSeen: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      reducedMotion: false,
      hasSeenCoachMark: false,

      toggleSidebar() {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen(open) {
        set({ sidebarOpen: open });
      },

      setReducedMotion(reduced) {
        set({ reducedMotion: reduced });
      },

      markCoachMarkSeen() {
        set({ hasSeenCoachMark: true });
      },
    }),
    {
      name: "safia-ui",
      partialize: (state) => ({
        hasSeenCoachMark: state.hasSeenCoachMark,
      }),
    },
  ),
);
