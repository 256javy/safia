import type { Account, NewAccountInput, Platform } from "@/stores/accounts-store";

export type FieldType =
  | "text"
  | "email"
  | "username"
  | "password"
  | "newPassword"
  | "confirmPassword"
  | "date"
  | "phone"
  | "country"
  | "select"
  | "mfa"
  | "recoveryCode"
  | "totpSetup";

export type FlowData = Record<string, string>;

export interface FlowCtx {
  platform: Platform;
  account?: Account;
  data: FlowData;
  // i18n + navigation provided by runner
  t: (key: string, values?: Record<string, string | number>) => string;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldSpec {
  name: string;
  type: FieldType;
  required?: boolean;
  /** Returns null when valid, or an i18n key for the error. */
  validate?: (value: string, ctx: FlowCtx) => string | null;
  /** i18n keys, resolved by runner with platform/flow/screen prefixes. */
  i18n: { label: string; placeholder?: string; help?: string };
  /** Auto-suggest based on prior screens (e.g. Google email from name). */
  suggest?: (ctx: FlowCtx) => string;
  /** select / country: option list (label keys translated by runner). */
  options?: FieldOption[];
  /** for password: minLength override */
  minLength?: number;
  /** for password: minStrength override */
  minStrength?: 0 | 1 | 2 | 3 | 4;
  /** show eye toggle for password fields */
  reveal?: boolean;
  /** show live strength meter */
  meter?: boolean;
}

export interface ScreenSpec {
  id: string;
  /** i18n keys, resolved with platform/flow prefix */
  title: string;
  subtitle?: string;
  fields: FieldSpec[];
  cta: { primary: string; secondary?: string };
  next: (data: FlowData, ctx: FlowCtx) => string | "done";
  tip?: string;
}

export type FlowKind = "create" | "login" | "change-password" | "recover" | "totp";

export interface FlowSpec {
  kind: FlowKind;
  platform: Platform;
  screens: ScreenSpec[];
  /** Build a NewAccountInput / mutate the store on completion. */
  onComplete: (data: FlowData, ctx: FlowCtx) => Promise<void> | void;
  /** Compose final NewAccountInput for create flow. */
  buildAccount?: (data: FlowData, ctx: FlowCtx) => NewAccountInput;
}
