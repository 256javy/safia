import { describe, expect, it } from "vitest";
import { generateSecret, otpauthUri, currentCode, verifyTotp } from "@/lib/totp";

describe("totp.generateSecret", () => {
  it("returns base32 string of expected length", () => {
    const secret = generateSecret();
    // 20 bytes → 32 base32 chars
    expect(secret).toMatch(/^[A-Z2-7]{32}$/);
  });

  it("each call returns different secrets", () => {
    expect(generateSecret()).not.toBe(generateSecret());
  });
});

describe("totp.otpauthUri", () => {
  it("formats otpauth URI with label, issuer, secret", () => {
    const secret = generateSecret();
    const uri = otpauthUri({ secret, label: "user@example", issuer: "Safia" });
    expect(uri).toMatch(/^otpauth:\/\/totp\//);
    expect(uri).toContain("issuer=Safia");
    expect(uri).toContain(`secret=${secret}`);
  });
});

describe("totp.verifyTotp", () => {
  it("roundtrips with currentCode → true", () => {
    const secret = generateSecret();
    const code = currentCode(secret);
    expect(verifyTotp(secret, code)).toBe(true);
  });

  it("rejects tampered code", () => {
    const secret = generateSecret();
    const code = currentCode(secret);
    const tampered = code === "000000" ? "111111" : "000000";
    expect(verifyTotp(secret, tampered)).toBe(false);
  });

  it("rejects non-6-digit input", () => {
    const secret = generateSecret();
    expect(verifyTotp(secret, "12345")).toBe(false);
    expect(verifyTotp(secret, "1234567")).toBe(false);
    expect(verifyTotp(secret, "abcdef")).toBe(false);
  });

  it("strips whitespace before validating", () => {
    const secret = generateSecret();
    const code = currentCode(secret);
    const spaced = `${code.slice(0, 3)} ${code.slice(3)}`;
    expect(verifyTotp(secret, spaced)).toBe(true);
  });
});
