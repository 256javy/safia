import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";
import { dictionary, adjacencyGraphs } from "@zxcvbn-ts/language-common";

zxcvbnOptions.setOptions({
  dictionary: { ...dictionary },
  graphs: adjacencyGraphs,
});

const SALT_BYTES = 16;

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

function randomSalt(): string {
  const bytes = new Uint8Array(SALT_BYTES);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

async function digest(saltHex: string, plaintext: string): Promise<string> {
  const salt = hexToBytes(saltHex);
  const pwd = new TextEncoder().encode(plaintext);
  const buf = new Uint8Array(salt.length + pwd.length);
  buf.set(salt, 0);
  buf.set(pwd, salt.length);
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  return bytesToHex(new Uint8Array(hashBuf));
}

export async function hashPassword(plaintext: string): Promise<{ hash: string; salt: string }> {
  const salt = randomSalt();
  const hash = await digest(salt, plaintext);
  return { hash, salt };
}

export async function verifyPassword(plaintext: string, hash: string, salt: string): Promise<boolean> {
  const computed = await digest(salt, plaintext);
  return computed === hash;
}

export type PasswordStrength = 0 | 1 | 2 | 3 | 4;

export function strength(plaintext: string): PasswordStrength {
  if (!plaintext) return 0;
  return zxcvbn(plaintext).score as PasswordStrength;
}

export function strengthFeedback(plaintext: string, locale = "es"): { score: PasswordStrength; warning?: string; suggestions: string[] } {
  void locale; // currently using common dictionary; per-locale dictionaries can be added later
  if (!plaintext) return { score: 0, suggestions: [] };
  const r = zxcvbn(plaintext);
  return {
    score: r.score as PasswordStrength,
    warning: r.feedback.warning ?? undefined,
    suggestions: r.feedback.suggestions ?? [],
  };
}
