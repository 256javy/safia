import { useAccountsStore, type Platform } from "@/stores/accounts-store";
import {
  validateEmail,
  validateBirthdate,
  validateCode,
  validatePasswordCreate,
  validateUsername,
} from "@/lib/validations";
import type { FieldSpec } from "./types";

export function emailField(opts: { name?: string; help?: string; required?: boolean } = {}): FieldSpec {
  return {
    name: opts.name ?? "email",
    type: "email",
    required: opts.required ?? true,
    inputMode: "email",
    autoComplete: "email",
    i18n: {
      label: `fields.${opts.name ?? "email"}.label`,
      placeholder: `fields.${opts.name ?? "email"}.placeholder`,
      help: opts.help,
    },
    validate: (v) => validateEmail(v),
  };
}

export function usernameField(platformId: Platform, opts: { help?: string } = {}): FieldSpec {
  return {
    name: "username",
    type: "username",
    required: true,
    inputMode: "text",
    autoComplete: "username",
    i18n: {
      label: "fields.username.label",
      placeholder: "fields.username.placeholder",
      help: opts.help,
    },
    validate: (v) => {
      const err = validateUsername(v);
      if (err) return err;
      if (useAccountsStore.getState().isUsernameTaken(platformId, v)) return "username.taken";
      return null;
    },
  };
}

export function passwordField(
  name: string,
  opts: { confirm?: boolean; minLength?: number; minStrength?: 0 | 1 | 2 | 3 | 4; meter?: boolean } = {},
): FieldSpec {
  return {
    name,
    type: opts.confirm ? "confirmPassword" : "newPassword",
    required: true,
    reveal: true,
    meter: opts.meter ?? !opts.confirm,
    minLength: opts.minLength,
    minStrength: opts.minStrength,
    autoComplete: "new-password",
    i18n: {
      label: `fields.${name}.label`,
      placeholder: `fields.${name}.placeholder`,
      help: opts.confirm ? undefined : `fields.${name}.help`,
    },
    matches: opts.confirm ? "password" : undefined,
    validate: opts.confirm
      ? undefined
      : (v) => validatePasswordCreate(v, { minLength: opts.minLength, minStrength: opts.minStrength }),
  };
}

export function currentPasswordField(): FieldSpec {
  return {
    name: "currentPassword",
    type: "password",
    required: true,
    reveal: true,
    autoComplete: "current-password",
    i18n: { label: "fields.currentPassword.label", placeholder: "fields.currentPassword.placeholder" },
  };
}

export function birthdateField(): FieldSpec {
  return {
    name: "birthdate",
    type: "date",
    required: true,
    autoComplete: "bday",
    i18n: { label: "fields.birthdate.label" },
    validate: (v) => validateBirthdate(v),
  };
}

export function genderField(opts: { required?: boolean } = {}): FieldSpec {
  return {
    name: "gender",
    type: "select",
    required: opts.required ?? false,
    options: [
      { value: "female", labelKey: "fields.gender.female" },
      { value: "male", labelKey: "fields.gender.male" },
      { value: "other", labelKey: "fields.gender.other" },
      { value: "prefer_not", labelKey: "fields.gender.prefer_not" },
    ],
    i18n: { label: "fields.gender.label" },
  };
}

export function phoneField(name = "phone", opts: { required?: boolean; help?: string } = {}): FieldSpec {
  return {
    name,
    type: "phone",
    required: opts.required ?? false,
    inputMode: "tel",
    autoComplete: "tel",
    i18n: {
      label: `fields.${name}.label`,
      placeholder: `fields.${name}.placeholder`,
      help: opts.help,
    },
  };
}

export function codeField(name = "code"): FieldSpec {
  return {
    name,
    type: name === "mfa" ? "mfa" : "recoveryCode",
    required: true,
    inputMode: "numeric",
    maxLength: 6,
    autoComplete: "one-time-code",
    i18n: {
      label: `fields.${name}.label`,
      placeholder: `fields.${name}.placeholder`,
    },
    validate: (v) => validateCode(v),
  };
}

export function textField(name: string, opts: { required?: boolean; autoComplete?: string; placeholder?: boolean } = {}): FieldSpec {
  return {
    name,
    type: "text",
    required: opts.required ?? true,
    autoComplete: opts.autoComplete,
    i18n: {
      label: `fields.${name}.label`,
      placeholder: opts.placeholder !== false ? `fields.${name}.placeholder` : undefined,
    },
  };
}
