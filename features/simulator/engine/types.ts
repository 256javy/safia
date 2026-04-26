import type { ComponentType, ReactNode } from "react";
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
  | "recoveryCode";

export type FlowData = Record<string, string>;

export type Translator = (key: string, values?: Record<string, string | number>) => string;

export interface FlowCtx {
  platform: Platform;
  account?: Account;
  data: FlowData;
  /** Translator scoped to root messages. Use full key paths. */
  t: Translator;
  /** Translator scoped to `simulator.<platform>`. */
  tp: Translator;
  /** Translator scoped to `validation`. */
  tv: Translator;
  /** Sets an extra value in flow data without advancing the screen (for special renders). */
  patch: (entries: FlowData) => void;
  /** Locale of the current request (es / en / pt). */
  locale: string;
  /** Goes back to the platform hub. */
  exit: () => void;
}

export interface FieldOption {
  value: string;
  /** i18n key relative to `simulator.<platform>.<kind>` (or full key starting with `~` for absolute). */
  labelKey: string;
}

export interface FieldSpec {
  name: string;
  type: FieldType;
  required?: boolean;
  /** Returns null when valid, or an i18n key (resolved via `tv`) for the error. */
  validate?: (value: string, ctx: FlowCtx) => string | null;
  /** i18n keys, resolved by runner with platform/flow/screen prefixes (relative to `simulator.<platform>.<kind>`). */
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
  /** confirmPassword: which sibling field name to match */
  matches?: string;
  /** maxLength for numeric/code fields */
  maxLength?: number;
  /** input mode hint */
  inputMode?: "text" | "email" | "tel" | "numeric" | "decimal" | "search" | "url";
  /** autocomplete attribute (off|email|new-password|current-password|one-time-code|tel|name|...) */
  autoComplete?: string;
}

export interface ScreenRenderArgs {
  ctx: FlowCtx;
  /** Submit handler — call with optional data patch to advance. */
  advance: (patch?: FlowData) => void;
  /** Per-screen error setter (for custom renders to set messages translated via `tv`). */
  setError: (errKey: string | null) => void;
  /** Current per-screen error i18n key (already includes the `validation.` prefix expected by `tv`). */
  error: string | null;
}

export interface ScreenSpec {
  id: string;
  /** i18n keys (relative to `simulator.<platform>.<kind>`). */
  title: string;
  subtitle?: string;
  fields?: FieldSpec[];
  cta: { primary: string; secondary?: string };
  /** Decide next screen id or 'done'. Receives latest data including current submit. */
  next: (data: FlowData, ctx: FlowCtx) => string | "done" | Promise<string | "done">;
  /** Optional side-effect when arriving at this screen (e.g. push an SMS code to inbox). */
  enter?: (ctx: FlowCtx) => void | Promise<void>;
  /** Optional pedagogical tip (i18n key). */
  tip?: string;
  /** Custom renderer overrides default form rendering. Useful for TOTP setup, inbox view, etc. */
  render?: (args: ScreenRenderArgs) => ReactNode;
  /** When true, the runner won't render fields; render must own the UI fully. */
  customLayout?: boolean;
}

export type FlowKind = "create" | "login" | "change-password" | "recover" | "totp";

export interface FlowSpec {
  kind: FlowKind;
  platform: Platform;
  /** First screen to render. Default: screens[0].id */
  initialScreen?: string;
  screens: ScreenSpec[];
  /** Hook fired when reaching 'done'. Mutates the store / redirects via ctx. */
  onComplete: (data: FlowData, ctx: FlowCtx) => Promise<void> | void;
  /** Compose final NewAccountInput for create flow. */
  buildAccount?: (data: FlowData, ctx: FlowCtx) => NewAccountInput;
}

export interface PlatformChromeProps {
  platform: Platform;
  flow: FlowSpec;
  screen: ScreenSpec;
  stepIndex: number;
  totalSteps: number;
  children: ReactNode;
}

export type PlatformChrome = ComponentType<PlatformChromeProps>;

export type ChangePasswordVia = "auth" | "forgot";
export type TotpAction = "enable" | "disable";

export interface FlowOpts {
  account?: Account;
  via?: ChangePasswordVia;
  action?: TotpAction;
}

export interface PlatformDefinition {
  chrome: PlatformChrome;
  buildFlow: (kind: FlowKind, opts: FlowOpts) => FlowSpec;
}
