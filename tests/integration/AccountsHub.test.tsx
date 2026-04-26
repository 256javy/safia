import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AccountsHub } from "@/features/accounts/AccountsHub";
import { useAccountsStore } from "@/stores/accounts-store";

beforeEach(() => {
  useAccountsStore.getState().reset();
  localStorage.clear();
});

afterEach(() => {
  useAccountsStore.getState().reset();
});

async function flushHydration() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe("AccountsHub", () => {
  it("empty state shows 4 platform cards", async () => {
    render(<AccountsHub />);
    await flushHydration();
    expect(screen.getByText("emptyTitle")).toBeInTheDocument();
    // 4 platforms: google, instagram, facebook, bank
    expect(screen.getByText("google")).toBeInTheDocument();
    expect(screen.getByText("instagram")).toBeInTheDocument();
    expect(screen.getByText("facebook")).toBeInTheDocument();
    expect(screen.getByText("bank")).toBeInTheDocument();
  });

  it("with persisted accounts: renders cards", async () => {
    await useAccountsStore.getState().create({
      platform: "google",
      profile: { firstName: "Ada" },
      identity: { email: "ada@example.com" },
      passwordPlaintext: "correct-purple-elephant-bicycle-7421-zebra",
    });
    render(<AccountsHub />);
    await flushHydration();
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
  });

  it("renders 2FA badge when totp.enabled", async () => {
    await useAccountsStore.getState().create({
      platform: "bank",
      profile: { firstName: "Ada" },
      identity: { email: "bank-ada@example.com" },
      passwordPlaintext: "long-passphrase-pattern-violet-87-mountain",
    });
    render(<AccountsHub />);
    await flushHydration();
    expect(screen.getByText("2FA")).toBeInTheDocument();
  });
});
