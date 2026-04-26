import { useAccountsStore } from "@/stores/accounts-store";
import type { FlowSpec } from "@/features/simulator/engine/types";
import {
  birthdateField,
  emailField,
  genderField,
  passwordField,
  textField,
} from "@/features/simulator/engine/fields";

export function buildCreateFlow(): FlowSpec {
  return {
    kind: "create",
    platform: "facebook",
    screens: [
      {
        id: "name",
        title: "create.name.title",
        subtitle: "create.name.subtitle",
        fields: [
          textField("firstName", { autoComplete: "given-name" }),
          textField("lastName", { autoComplete: "family-name" }),
        ],
        cta: { primary: "cta.next" },
        next: () => "contact",
        tip: "create.name.tip",
      },
      {
        id: "contact",
        title: "create.contact.title",
        subtitle: "create.contact.subtitle",
        fields: [
          {
            ...emailField(),
            validate: (value) => {
              const m = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
              if (!m) return "email.invalid";
              if (useAccountsStore.getState().isEmailTaken("facebook", value)) return "email.taken";
              return null;
            },
          },
        ],
        cta: { primary: "cta.next" },
        next: () => "password",
        tip: "create.contact.tip",
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
        cta: { primary: "cta.next" },
        next: () => "gender",
        tip: "create.birthday.tip",
      },
      {
        id: "gender",
        title: "create.gender.title",
        subtitle: "create.gender.subtitle",
        fields: [genderField({ required: true })],
        cta: { primary: "cta.create" },
        next: () => "done",
        tip: "create.gender.tip",
      },
    ],
    buildAccount: (data) => ({
      platform: "facebook",
      profile: {
        firstName: data.firstName ?? "",
        lastName: data.lastName,
        birthdate: data.birthdate,
        gender: data.gender as "female" | "male" | "other" | "prefer_not" | undefined,
      },
      identity: { email: data.email },
      passwordPlaintext: data.password ?? "",
    }),
    onComplete: async (data) => {
      const store = useAccountsStore.getState();
      await store.create({
        platform: "facebook",
        profile: {
          firstName: data.firstName ?? "",
          lastName: data.lastName,
          birthdate: data.birthdate,
          gender: data.gender as "female" | "male" | "other" | "prefer_not" | undefined,
        },
        identity: { email: data.email },
        passwordPlaintext: data.password ?? "",
      });
    },
  };
}
