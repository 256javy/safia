import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PracticeAccount {
  id: string;
  platform: string; // "google" | "facebook" | "x" | "tiktok" | "banking"
  email: string;
  password: string; // plaintext — these are fake training credentials only
  createdAt: string;
}

interface PracticeAccountsState {
  accounts: PracticeAccount[];
  addAccount: (platform: string, email: string, password: string) => void;
  removeAccount: (id: string) => void;
  clearAll: () => void;
  getAccountsForPlatform: (platform: string) => PracticeAccount[];
  validate: (platform: string, email: string, password: string) => boolean;
}

export const usePracticeAccountsStore = create<PracticeAccountsState>()(
  persist(
    (set, get) => ({
      accounts: [],
      addAccount: (platform, email, password) =>
        set((s) => ({
          accounts: [
            ...s.accounts,
            {
              id: crypto.randomUUID(),
              platform,
              email: email.trim().toLowerCase(),
              password,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      removeAccount: (id) =>
        set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) })),
      clearAll: () => set({ accounts: [] }),
      getAccountsForPlatform: (platform) =>
        get().accounts.filter((a) => a.platform === platform),
      validate: (platform, email, password) =>
        get().accounts.some(
          (a) =>
            a.platform === platform &&
            a.email === email.trim().toLowerCase() &&
            a.password === password
        ),
    }),
    {
      name: "safia-practice-accounts",
      partialize: (s) => ({ accounts: s.accounts }),
    }
  )
);
