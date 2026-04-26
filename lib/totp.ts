import { Secret, TOTP } from "otpauth";

export function generateSecret(): string {
  return new Secret({ size: 20 }).base32;
}

export function otpauthUri(opts: { secret: string; label: string; issuer: string }): string {
  return new TOTP({
    secret: opts.secret,
    label: opts.label,
    issuer: opts.issuer,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
  }).toString();
}

export function currentCode(secret: string): string {
  return new TOTP({ secret, algorithm: "SHA1", digits: 6, period: 30 }).generate();
}

export function verifyTotp(secret: string, code: string, window = 1): boolean {
  const cleaned = code.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleaned)) return false;
  const totp = new TOTP({ secret, algorithm: "SHA1", digits: 6, period: 30 });
  const delta = totp.validate({ token: cleaned, window });
  return delta !== null;
}
