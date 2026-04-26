import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword, strength } from "@/lib/password";

describe("password.hashPassword", () => {
  it("returns hash + salt of expected shape", async () => {
    const { hash, salt } = await hashPassword("hello-world");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(salt).toMatch(/^[0-9a-f]{32}$/);
  });

  it("different salts → different hashes for same plaintext", async () => {
    const a = await hashPassword("same");
    const b = await hashPassword("same");
    expect(a.salt).not.toBe(b.salt);
    expect(a.hash).not.toBe(b.hash);
  });
});

describe("password.verifyPassword", () => {
  it("verifies correctly with right plaintext", async () => {
    const { hash, salt } = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("correct horse battery staple", hash, salt)).toBe(true);
  });

  it("rejects wrong plaintext", async () => {
    const { hash, salt } = await hashPassword("correct horse battery staple");
    expect(await verifyPassword("wrong", hash, salt)).toBe(false);
  });

  it("same input + same salt → same hash (deterministic)", async () => {
    const { hash, salt } = await hashPassword("deterministic");
    // Re-verify by calling verifyPassword with the captured salt
    expect(await verifyPassword("deterministic", hash, salt)).toBe(true);
  });
});

describe("password.strength", () => {
  it("empty → 0", () => {
    expect(strength("")).toBe(0);
  });

  it("single char → 0", () => {
    expect(strength("a")).toBe(0);
  });

  it("returns a number in [0,4]", () => {
    const s = strength("Password123!");
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(4);
  });

  it("long unique passphrase scores high (>=3)", () => {
    const s = strength("correct-purple-elephant-bicycle-7421-zebra");
    expect(s).toBeGreaterThanOrEqual(3);
  });
});
