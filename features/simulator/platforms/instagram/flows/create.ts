import { useAccountsStore } from "@/stores/accounts-store";
import type { FlowCtx, FlowSpec } from "@/features/simulator/engine/types";
import {
  birthdateField,
  emailField,
  passwordField,
  textField,
  usernameField,
} from "@/features/simulator/engine/fields";

function suggestUsername(ctx: FlowCtx): string {
  const raw = (ctx.data.fullName ?? "").trim().toLowerCase();
  if (!raw) return "";
  const parts = raw.split(/\s+/).filter(Boolean);
  const stem = parts.join(".").replace(/[^a-z0-9._]/g, "");
  if (!stem) return "";
  const store = useAccountsStore.getState();
  const candidates = [
    stem,
    `${stem}1`,
    `${stem}.${new Date().getFullYear() % 100}`,
    `${stem}_${Math.floor(Math.random() * 1000)}`,
  ];
  for (const c of candidates) {
    if (c.length >= 3 && c.length <= 30 && !store.isUsernameTaken("instagram", c)) return c;
  }
  return `${stem}.${Date.now() % 10000}`.slice(0, 30);
}

function splitName(full: string): { firstName: string; lastName?: string } {
  const trimmed = (full ?? "").trim().replace(/\s+/g, " ");
  if (!trimmed) return { firstName: "" };
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { firstName: trimmed };
  return { firstName: trimmed.slice(0, idx), lastName: trimmed.slice(idx + 1) };
}

export function buildCreateFlow(): FlowSpec {
  return {
    kind: "create",
    platform: "instagram",
    screens: [
      {
        id: "contact",
        title: "create.contact.title",
        subtitle: "create.contact.subtitle",
        fields: [
          {
            ...emailField({ required: true }),
            validate: (value) => {
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email.invalid";
              if (useAccountsStore.getState().isEmailTaken("instagram", value)) return "email.taken";
              return null;
            },
          },
        ],
        cta: { primary: "cta.next" },
        next: () => "name",
        tip: "create.contact.tip",
      },
      {
        id: "name",
        title: "create.name.title",
        subtitle: "create.name.subtitle",
        fields: [textField("fullName", { autoComplete: "name" })],
        cta: { primary: "cta.next" },
        next: () => "username",
        tip: "create.name.tip",
      },
      {
        id: "username",
        title: "create.username.title",
        subtitle: "create.username.subtitle",
        fields: [
          {
            ...usernameField("instagram", { help: "fields.username.help" }),
            suggest: suggestUsername,
          },
        ],
        cta: { primary: "cta.next" },
        next: () => "password",
        tip: "create.username.tip",
      },
      {
        id: "password",
        title: "create.password.title",
        subtitle: "create.password.subtitle",
        fields: [
          passwordField("password", { meter: true, minLength: 8, minStrength: 2 }),
          passwordField("passwordConfirm", { confirm: true }),
        ],
        cta: { primary: "cta.next" },
        next: () => "birthday",
        tip: "create.password.tip",
      },
      {
        id: "birthday",
        title: "create.birthday.title",
        subtitle: "create.birthday.subtitle",
        fields: [birthdateField()],
        cta: { primary: "cta.create" },
        next: () => "done",
        tip: "create.birthday.tip",
      },
    ],
    buildAccount: (data) => {
      const { firstName, lastName } = splitName(data.fullName ?? "");
      return {
        platform: "instagram",
        profile: {
          firstName,
          lastName,
          birthdate: data.birthdate,
        },
        identity: { email: data.email, username: data.username },
        passwordPlaintext: data.password ?? "",
      };
    },
    onComplete: async (data) => {
      const { firstName, lastName } = splitName(data.fullName ?? "");
      await useAccountsStore.getState().create({
        platform: "instagram",
        profile: {
          firstName,
          lastName,
          birthdate: data.birthdate,
        },
        identity: { email: data.email, username: data.username },
        passwordPlaintext: data.password ?? "",
      });
    },
  };
}
