import { create } from "zustand";
import { persist } from "zustand/middleware";
import { hashPassword, verifyPassword, strength, type PasswordStrength } from "@/lib/password";

export type Platform = "google" | "instagram" | "facebook" | "bank";

export interface AccountProfile {
  firstName: string;
  lastName?: string;
  birthdate?: string;
  gender?: "female" | "male" | "other" | "prefer_not";
  country?: string;
}

export interface AccountIdentity {
  email?: string;
  username?: string;
  phone?: string;
}

export interface PasswordRecord {
  hash: string;
  salt: string;
  strength: PasswordStrength;
  createdAt: number;
  history: { hash: string; salt: string; at: number }[];
}

export interface TotpRecord {
  enabled: boolean;
  secret?: string;
  enabledAt?: number;
}

export interface InboxMessage {
  id: string;
  kind: "sms" | "email";
  subject?: string;
  code?: string;
  body?: string;
  at: number;
  read: boolean;
}

export interface LoginAttempt {
  at: number;
  success: boolean;
  reason?: "wrong_password" | "unknown_account" | "mfa_failed" | "mfa_passed";
  suspicious?: boolean;
}

export interface Account {
  id: string;
  platform: Platform;
  createdAt: number;
  updatedAt: number;
  profile: AccountProfile;
  identity: AccountIdentity;
  password: PasswordRecord;
  recovery: { email?: string; phone?: string };
  totp: TotpRecord;
  loginHistory: LoginAttempt[];
  inbox: InboxMessage[];
}

export interface NewAccountInput {
  platform: Platform;
  profile: AccountProfile;
  identity: AccountIdentity;
  passwordPlaintext: string;
  recovery?: { email?: string; phone?: string };
  totpSecret?: string; // si viene, totp.enabled = true
}

interface AccountsState {
  accounts: Account[];
  // selectors
  byPlatform: (p: Platform) => Account[];
  getById: (id: string) => Account | undefined;
  isEmailTaken: (platform: Platform, email: string, excludeId?: string) => boolean;
  isUsernameTaken: (platform: Platform, username: string, excludeId?: string) => boolean;
  // mutations
  create: (input: NewAccountInput) => Promise<Account>;
  update: (id: string, patch: Partial<Account>) => void;
  changePassword: (id: string, newPlaintext: string) => Promise<{ ok: true } | { ok: false; reason: "reused" }>;
  verifyPasswordFor: (id: string, plaintext: string) => Promise<boolean>;
  enableTotp: (id: string, secret: string) => void;
  disableTotp: (id: string) => { ok: true } | { ok: false; reason: "forbidden" };
  pushInbox: (id: string, msg: Omit<InboxMessage, "id" | "at" | "read">) => InboxMessage;
  markInboxRead: (accountId: string, msgId: string) => void;
  recordLogin: (id: string, entry: Omit<LoginAttempt, "at">) => void;
  remove: (id: string) => void;
  reset: () => void;
}

const STORAGE_KEY = "safia.accounts.v1";
const HISTORY_LIMIT = 5;

export const useAccountsStore = create<AccountsState>()(
  persist(
    (set, get) => ({
      accounts: [],

      byPlatform: (p) => get().accounts.filter((a) => a.platform === p),
      getById: (id) => get().accounts.find((a) => a.id === id),

      isEmailTaken: (platform, email, excludeId) => {
        const norm = email.trim().toLowerCase();
        return get().accounts.some(
          (a) => a.platform === platform && a.identity.email?.toLowerCase() === norm && a.id !== excludeId,
        );
      },

      isUsernameTaken: (platform, username, excludeId) => {
        const norm = username.trim().toLowerCase();
        return get().accounts.some(
          (a) => a.platform === platform && a.identity.username?.toLowerCase() === norm && a.id !== excludeId,
        );
      },

      create: async (input) => {
        const { hash, salt } = await hashPassword(input.passwordPlaintext);
        const now = Date.now();
        const account: Account = {
          id: crypto.randomUUID(),
          platform: input.platform,
          createdAt: now,
          updatedAt: now,
          profile: input.profile,
          identity: {
            email: input.identity.email?.trim().toLowerCase(),
            username: input.identity.username?.trim(),
            phone: input.identity.phone?.trim(),
          },
          password: {
            hash,
            salt,
            strength: strength(input.passwordPlaintext),
            createdAt: now,
            history: [],
          },
          recovery: input.recovery ?? {},
          totp: input.totpSecret
            ? { enabled: true, secret: input.totpSecret, enabledAt: now }
            : { enabled: input.platform === "bank", secret: input.platform === "bank" ? undefined : undefined },
          loginHistory: [],
          inbox: [],
        };
        set((s) => ({ accounts: [...s.accounts, account] }));
        return account;
      },

      update: (id, patch) =>
        set((s) => ({
          accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...patch, updatedAt: Date.now() } : a)),
        })),

      changePassword: async (id, newPlaintext) => {
        const acc = get().getById(id);
        if (!acc) return { ok: false, reason: "reused" };

        // check reuse against history + current
        for (const past of [acc.password, ...acc.password.history]) {
          if (await verifyPassword(newPlaintext, past.hash, past.salt)) {
            return { ok: false, reason: "reused" };
          }
        }

        const { hash, salt } = await hashPassword(newPlaintext);
        const now = Date.now();
        const newHistory = [
          { hash: acc.password.hash, salt: acc.password.salt, at: acc.password.createdAt },
          ...acc.password.history,
        ].slice(0, HISTORY_LIMIT);

        set((s) => ({
          accounts: s.accounts.map((a) =>
            a.id === id
              ? {
                  ...a,
                  updatedAt: now,
                  password: {
                    hash,
                    salt,
                    strength: strength(newPlaintext),
                    createdAt: now,
                    history: newHistory,
                  },
                }
              : a,
          ),
        }));
        return { ok: true };
      },

      verifyPasswordFor: async (id, plaintext) => {
        const acc = get().getById(id);
        if (!acc) return false;
        return verifyPassword(plaintext, acc.password.hash, acc.password.salt);
      },

      enableTotp: (id, secret) =>
        set((s) => ({
          accounts: s.accounts.map((a) =>
            a.id === id ? { ...a, totp: { enabled: true, secret, enabledAt: Date.now() }, updatedAt: Date.now() } : a,
          ),
        })),

      disableTotp: (id) => {
        const acc = get().getById(id);
        if (!acc) return { ok: false, reason: "forbidden" };
        if (acc.platform === "bank") return { ok: false, reason: "forbidden" };
        set((s) => ({
          accounts: s.accounts.map((a) =>
            a.id === id ? { ...a, totp: { enabled: false }, updatedAt: Date.now() } : a,
          ),
        }));
        return { ok: true };
      },

      pushInbox: (id, msg) => {
        const full: InboxMessage = { ...msg, id: crypto.randomUUID(), at: Date.now(), read: false };
        set((s) => ({
          accounts: s.accounts.map((a) =>
            a.id === id ? { ...a, inbox: [full, ...a.inbox].slice(0, 20), updatedAt: Date.now() } : a,
          ),
        }));
        return full;
      },

      markInboxRead: (accountId, msgId) =>
        set((s) => ({
          accounts: s.accounts.map((a) =>
            a.id === accountId
              ? { ...a, inbox: a.inbox.map((m) => (m.id === msgId ? { ...m, read: true } : m)) }
              : a,
          ),
        })),

      recordLogin: (id, entry) =>
        set((s) => ({
          accounts: s.accounts.map((a) =>
            a.id === id
              ? {
                  ...a,
                  loginHistory: [{ ...entry, at: Date.now() }, ...a.loginHistory].slice(0, 10),
                  updatedAt: Date.now(),
                }
              : a,
          ),
        })),

      remove: (id) => set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) })),

      reset: () => set({ accounts: [] }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (s) => ({ accounts: s.accounts }),
      version: 1,
    },
  ),
);

// Cleanup of legacy practice-accounts store (silent best-effort).
if (typeof window !== "undefined") {
  try {
    if (localStorage.getItem("safia-practice-accounts")) {
      localStorage.removeItem("safia-practice-accounts");
    }
  } catch {
    /* ignore */
  }
}
