import { isValidPhoneNumber } from "libphonenumber-js";
import { strength } from "./password";

export type ValidationKey =
  | "required"
  | "email.invalid"
  | "username.invalid"
  | "username.taken"
  | "phone.invalid"
  | "password.tooShort"
  | "password.tooWeak"
  | "password.reused"
  | "password.mismatch"
  | "birthdate.invalid"
  | "birthdate.tooYoung"
  | "code.invalid"
  | "code.expired"
  | "mfa.invalid";

export function validateEmail(value: string): ValidationKey | null {
  if (!value) return "required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email.invalid";
  return null;
}

export function validateUsername(value: string): ValidationKey | null {
  if (!value) return "required";
  if (!/^[a-z0-9._]{3,30}$/.test(value)) return "username.invalid";
  return null;
}

export function validatePhone(value: string, country?: string): ValidationKey | null {
  if (!value) return "required";
  // libphonenumber accepts country as undefined and infers from + prefix
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!isValidPhoneNumber(value, country as any)) return "phone.invalid";
  return null;
}

export function validatePasswordCreate(
  value: string,
  opts: { minLength?: number; minStrength?: 0 | 1 | 2 | 3 | 4 } = {},
): ValidationKey | null {
  const minLength = opts.minLength ?? 8;
  const minStrength = opts.minStrength ?? 2;
  if (!value) return "required";
  if (value.length < minLength) return "password.tooShort";
  if (strength(value) < minStrength) return "password.tooWeak";
  return null;
}

export function validateBirthdate(iso: string, minAge = 13): ValidationKey | null {
  if (!iso) return "required";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "birthdate.invalid";
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  if (age < 0 || age > 130) return "birthdate.invalid";
  if (age < minAge) return "birthdate.tooYoung";
  return null;
}

export function validateCode(value: string): ValidationKey | null {
  if (!value) return "required";
  if (!/^\d{6}$/.test(value.replace(/\s+/g, ""))) return "code.invalid";
  return null;
}
