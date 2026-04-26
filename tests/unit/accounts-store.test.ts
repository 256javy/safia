import { beforeEach, describe, expect, it } from "vitest";
import { useAccountsStore, type NewAccountInput } from "@/stores/accounts-store";
import { generateSecret } from "@/lib/totp";

const STORAGE_KEY = "safia.accounts.v1";

const baseInput = (overrides: Partial<NewAccountInput> = {}): NewAccountInput => ({
  platform: "google",
  profile: { firstName: "Ada", lastName: "Lovelace" },
  identity: { email: "ada@example.com" },
  passwordPlaintext: "correct-purple-elephant-bicycle-7421-zebra",
  ...overrides,
});

beforeEach(() => {
  useAccountsStore.getState().reset();
  localStorage.clear();
});

describe("create", () => {
  it("persists hash + salt and never plaintext", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    expect(acc.password.hash).toMatch(/^[0-9a-f]{64}$/);
    expect(acc.password.salt).toMatch(/^[0-9a-f]{32}$/);
    // localStorage payload should not contain plaintext or any field by that name.
    const raw = localStorage.getItem(STORAGE_KEY) ?? "";
    expect(raw).not.toContain("passwordPlaintext");
    expect(raw).not.toContain("correct-purple-elephant-bicycle-7421-zebra");
  });

  it("normalizes email to lowercase", async () => {
    const acc = await useAccountsStore.getState().create(
      baseInput({ identity: { email: "ADA@Example.com" } }),
    );
    expect(acc.identity.email).toBe("ada@example.com");
  });

  it("auto-enables totp for bank platform when no totpSecret given", async () => {
    const acc = await useAccountsStore.getState().create(
      baseInput({ platform: "bank", identity: { email: "ada@example.com" } }),
    );
    expect(acc.totp.enabled).toBe(true);
    expect(acc.totp.secret).toBeUndefined();
  });

  it("non-bank without totpSecret → totp disabled", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    expect(acc.totp.enabled).toBe(false);
  });

  it("totpSecret provided → totp enabled with secret", async () => {
    const secret = generateSecret();
    const acc = await useAccountsStore.getState().create(baseInput({ totpSecret: secret }));
    expect(acc.totp).toMatchObject({ enabled: true, secret });
  });
});

describe("changePassword", () => {
  it("rejects reuse of current password", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    const r = await useAccountsStore.getState().changePassword(acc.id, baseInput().passwordPlaintext);
    expect(r).toEqual({ ok: false, reason: "reused" });
  });

  it("accepts new password and appends old to history", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    const oldHash = acc.password.hash;
    const r = await useAccountsStore.getState().changePassword(acc.id, "second-passphrase-yellow-mountain-94");
    expect(r).toEqual({ ok: true });
    const updated = useAccountsStore.getState().getById(acc.id)!;
    expect(updated.password.hash).not.toBe(oldHash);
    expect(updated.password.history).toHaveLength(1);
    expect(updated.password.history[0].hash).toBe(oldHash);
  });

  it("rejects reuse of historical password", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    const original = baseInput().passwordPlaintext;
    await useAccountsStore.getState().changePassword(acc.id, "second-passphrase-yellow-mountain-94");
    const r = await useAccountsStore.getState().changePassword(acc.id, original);
    expect(r).toEqual({ ok: false, reason: "reused" });
  });

  it("trims history to 5 entries", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    const passphrases = [
      "second-passphrase-yellow-mountain-94",
      "third-passphrase-orange-lake-71",
      "fourth-passphrase-violet-forest-22",
      "fifth-passphrase-silver-ocean-57",
      "sixth-passphrase-bronze-canyon-12",
      "seventh-passphrase-emerald-river-08",
    ];
    for (const p of passphrases) {
      await useAccountsStore.getState().changePassword(acc.id, p);
    }
    const updated = useAccountsStore.getState().getById(acc.id)!;
    expect(updated.password.history.length).toBeLessThanOrEqual(5);
  });
});

describe("verifyPasswordFor", () => {
  it("returns true with right password", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    expect(await useAccountsStore.getState().verifyPasswordFor(acc.id, baseInput().passwordPlaintext)).toBe(true);
  });

  it("returns false with wrong password", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    expect(await useAccountsStore.getState().verifyPasswordFor(acc.id, "wrong")).toBe(false);
  });

  it("returns false for unknown account id", async () => {
    expect(await useAccountsStore.getState().verifyPasswordFor("nope", "x")).toBe(false);
  });
});

describe("totp enable/disable", () => {
  it("enableTotp sets secret + enabled", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    const secret = generateSecret();
    useAccountsStore.getState().enableTotp(acc.id, secret);
    const updated = useAccountsStore.getState().getById(acc.id)!;
    expect(updated.totp).toMatchObject({ enabled: true, secret });
  });

  it("disableTotp on bank → forbidden", async () => {
    const acc = await useAccountsStore.getState().create(baseInput({ platform: "bank" }));
    const r = useAccountsStore.getState().disableTotp(acc.id);
    expect(r).toEqual({ ok: false, reason: "forbidden" });
  });

  it("disableTotp on non-bank → ok", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    useAccountsStore.getState().enableTotp(acc.id, generateSecret());
    const r = useAccountsStore.getState().disableTotp(acc.id);
    expect(r).toEqual({ ok: true });
    const updated = useAccountsStore.getState().getById(acc.id)!;
    expect(updated.totp.enabled).toBe(false);
  });
});

describe("isEmailTaken / isUsernameTaken", () => {
  it("scoped to platform", async () => {
    await useAccountsStore.getState().create(baseInput({ identity: { email: "shared@example.com" } }));
    const store = useAccountsStore.getState();
    expect(store.isEmailTaken("google", "shared@example.com")).toBe(true);
    expect(store.isEmailTaken("instagram", "shared@example.com")).toBe(false);
  });

  it("excludeId lets you skip self", async () => {
    const acc = await useAccountsStore.getState().create(baseInput({ identity: { email: "self@example.com" } }));
    const store = useAccountsStore.getState();
    expect(store.isEmailTaken("google", "self@example.com", acc.id)).toBe(false);
  });

  it("isUsernameTaken case-insensitive", async () => {
    await useAccountsStore.getState().create(
      baseInput({ platform: "instagram", identity: { username: "Foo_Bar" } }),
    );
    expect(useAccountsStore.getState().isUsernameTaken("instagram", "foo_bar")).toBe(true);
  });
});

describe("pushInbox", () => {
  it("trims to 20 entries", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    for (let i = 0; i < 25; i++) {
      useAccountsStore.getState().pushInbox(acc.id, { kind: "sms", code: `${i}` });
    }
    const updated = useAccountsStore.getState().getById(acc.id)!;
    expect(updated.inbox.length).toBe(20);
  });

  it("returns the inserted message with id + at + read=false", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    const msg = useAccountsStore.getState().pushInbox(acc.id, { kind: "email", subject: "hi" });
    expect(msg.id).toBeDefined();
    expect(msg.at).toBeGreaterThan(0);
    expect(msg.read).toBe(false);
  });
});

describe("recordLogin", () => {
  it("trims to 10 entries", async () => {
    const acc = await useAccountsStore.getState().create(baseInput());
    for (let i = 0; i < 15; i++) {
      useAccountsStore.getState().recordLogin(acc.id, { success: i % 2 === 0 });
    }
    const updated = useAccountsStore.getState().getById(acc.id)!;
    expect(updated.loginHistory.length).toBe(10);
  });
});

describe("persistence + legacy cleanup", () => {
  it("uses safia.accounts.v1 storage key", async () => {
    await useAccountsStore.getState().create(baseInput());
    expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
  });
});
