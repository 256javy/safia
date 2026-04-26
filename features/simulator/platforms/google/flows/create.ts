import { useAccountsStore } from "@/stores/accounts-store";
import type { FlowSpec } from "@/features/simulator/engine/types";
import {
  birthdateField,
  emailField,
  genderField,
  passwordField,
  phoneField,
} from "@/features/simulator/engine/fields";
import { suggestEmailFromName } from "./shared";

export function buildCreateFlow(): FlowSpec {
  return {
    kind: "create",
    platform: "google",
    screens: [
      {
        id: "name",
        title: "create.name.title",
        subtitle: "create.name.subtitle",
        fields: [
          {
            name: "firstName",
            type: "text",
            required: true,
            autoComplete: "given-name",
            i18n: { label: "fields.firstName.label", placeholder: "fields.firstName.placeholder" },
          },
          {
            name: "lastName",
            type: "text",
            required: false,
            autoComplete: "family-name",
            i18n: { label: "fields.lastName.label", placeholder: "fields.lastName.placeholder" },
          },
        ],
        cta: { primary: "cta.next" },
        next: () => "birthday",
        tip: "create.name.tip",
      },
      {
        id: "birthday",
        title: "create.birthday.title",
        subtitle: "create.birthday.subtitle",
        fields: [birthdateField(), genderField()],
        cta: { primary: "cta.next" },
        next: () => "email",
        tip: "create.birthday.tip",
      },
      {
        id: "email",
        title: "create.email.title",
        subtitle: "create.email.subtitle",
        fields: [
          {
            ...emailField(),
            suggest: suggestEmailFromName,
            validate: (value) => {
              const m = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
              if (!m) return "email.invalid";
              if (useAccountsStore.getState().isEmailTaken("google", value)) return "email.taken";
              return null;
            },
          },
        ],
        cta: { primary: "cta.next" },
        next: () => "password",
        tip: "create.email.tip",
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
        next: () => "phone",
        tip: "create.password.tip",
      },
      {
        id: "phone",
        title: "create.phone.title",
        subtitle: "create.phone.subtitle",
        fields: [phoneField("phone", { required: false, help: "create.phone.help" })],
        cta: { primary: "cta.next", secondary: "cta.skip" },
        next: () => "review",
        tip: "create.phone.tip",
      },
      {
        id: "review",
        title: "create.review.title",
        subtitle: "create.review.subtitle",
        cta: { primary: "cta.create" },
        next: () => "done",
        tip: "create.review.tip",
      },
    ],
    buildAccount: (data) => ({
      platform: "google",
      profile: {
        firstName: data.firstName ?? "",
        lastName: data.lastName,
        birthdate: data.birthdate,
        gender: data.gender as "female" | "male" | "other" | "prefer_not" | undefined,
      },
      identity: { email: data.email },
      passwordPlaintext: data.password ?? "",
      recovery: { phone: data.phone || undefined },
    }),
    onComplete: async (data) => {
      const store = useAccountsStore.getState();
      await store.create({
        platform: "google",
        profile: {
          firstName: data.firstName ?? "",
          lastName: data.lastName,
          birthdate: data.birthdate,
          gender: data.gender as "female" | "male" | "other" | "prefer_not" | undefined,
        },
        identity: { email: data.email },
        passwordPlaintext: data.password ?? "",
        recovery: { phone: data.phone || undefined },
      });
    },
  };
}
