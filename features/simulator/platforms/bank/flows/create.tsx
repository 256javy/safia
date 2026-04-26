"use client";

import { useAccountsStore } from "@/stores/accounts-store";
import { generateSecret, otpauthUri, verifyTotp } from "@/lib/totp";
import type { FlowSpec, ScreenRenderArgs } from "@/features/simulator/engine/types";
import { QrCanvas } from "@/features/simulator/engine/QrCanvas";
import {
  codeField,
  emailField,
  passwordField,
  phoneField,
} from "@/features/simulator/engine/fields";

const SECRET_KEY = "_totpDraftSecret";

export function buildCreateFlow(): FlowSpec {
  return {
    kind: "create",
    platform: "bank",
    screens: [
      {
        id: "nationalId",
        title: "create.nationalId.title",
        subtitle: "create.nationalId.subtitle",
        fields: [
          {
            name: "nationalId",
            type: "text",
            required: true,
            autoComplete: "off",
            inputMode: "text",
            i18n: {
              label: "fields.nationalId.label",
              placeholder: "fields.nationalId.placeholder",
              help: "fields.nationalId.help",
            },
            validate: (v) => {
              const trimmed = v.trim();
              if (!trimmed) return "required";
              if (!/^[A-Z0-9-]{5,20}$/i.test(trimmed)) return "required";
              return null;
            },
          },
        ],
        cta: { primary: "cta.next" },
        next: () => "name",
        tip: "create.nationalId.tip",
      },
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
            required: true,
            autoComplete: "family-name",
            i18n: { label: "fields.lastName.label", placeholder: "fields.lastName.placeholder" },
          },
        ],
        cta: { primary: "cta.next" },
        next: () => "email",
        tip: "create.name.tip",
      },
      {
        id: "email",
        title: "create.email.title",
        subtitle: "create.email.subtitle",
        fields: [
          {
            ...emailField(),
            validate: (value) => {
              if (!value) return "required";
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "email.invalid";
              if (useAccountsStore.getState().isEmailTaken("bank", value)) return "email.taken";
              return null;
            },
          },
        ],
        cta: { primary: "cta.next" },
        next: () => "phone",
        tip: "create.email.tip",
      },
      {
        id: "phone",
        title: "create.phone.title",
        subtitle: "create.phone.subtitle",
        fields: [phoneField("phone", { required: true, help: "fields.phone.help" })],
        cta: { primary: "cta.next" },
        next: () => "password",
        tip: "create.phone.tip",
      },
      {
        id: "password",
        title: "create.password.title",
        subtitle: "create.password.subtitle",
        fields: [
          passwordField("password", { meter: true, minLength: 12, minStrength: 3 }),
          passwordField("passwordConfirm", { confirm: true }),
        ],
        cta: { primary: "cta.next" },
        next: () => "totpScan",
        tip: "create.password.tip",
      },
      {
        id: "totpScan",
        title: "create.totpScan.title",
        subtitle: "create.totpScan.subtitle",
        cta: { primary: "cta.next" },
        customLayout: true,
        enter: (ctx) => {
          if (!ctx.data[SECRET_KEY]) {
            ctx.patch({ [SECRET_KEY]: generateSecret() });
          }
        },
        next: () => "totpVerify",
        render: ({ ctx, advance }: ScreenRenderArgs) => (
          <CreateTotpScan ctx={ctx} onContinue={() => advance()} />
        ),
        tip: "create.totpScan.tip",
      },
      {
        id: "totpVerify",
        title: "create.totpVerify.title",
        subtitle: "create.totpVerify.subtitle",
        fields: [codeField("mfa")],
        cta: { primary: "cta.activate" },
        next: (data) => {
          const secret = data[SECRET_KEY];
          if (!secret) throw new Error("mfa.invalid");
          if (!verifyTotp(secret, data.mfa ?? "")) throw new Error("mfa.invalid");
          return "done";
        },
        tip: "create.totpVerify.tip",
      },
    ],
    buildAccount: (data) => ({
      platform: "bank",
      profile: {
        firstName: data.firstName ?? "",
        lastName: data.lastName,
      },
      identity: { email: data.email, phone: data.phone },
      passwordPlaintext: data.password ?? "",
      totpSecret: data[SECRET_KEY],
    }),
    onComplete: async (data) => {
      const store = useAccountsStore.getState();
      await store.create({
        platform: "bank",
        profile: {
          firstName: data.firstName ?? "",
          lastName: data.lastName,
        },
        identity: { email: data.email, phone: data.phone },
        passwordPlaintext: data.password ?? "",
        totpSecret: data[SECRET_KEY],
      });
    },
  };
}

function CreateTotpScan({ ctx, onContinue }: { ctx: ScreenRenderArgs["ctx"]; onContinue: () => void }) {
  const secret = ctx.data[SECRET_KEY] ?? "";
  const label = ctx.data.email ?? "user";
  const uri = secret ? otpauthUri({ secret, label, issuer: "SecureBank (Safia)" }) : "";
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-current/80">{ctx.tp("create.totpScan.body")}</p>
      {uri && <QrCanvas value={uri} size={196} />}
      <div className="w-full rounded-md border border-current/15 bg-current/5 p-3 text-center">
        <p className="text-[11px] uppercase tracking-wider text-current/60">
          {ctx.tp("create.totpScan.secretLabel")}
        </p>
        <p className="mt-1 break-all font-mono text-xs text-current">
          {secret.match(/.{1,4}/g)?.join(" ")}
        </p>
      </div>
      <button
        type="button"
        onClick={onContinue}
        style={{ background: "var(--flow-primary-bg, #0a2540)", color: "var(--flow-primary-text, #fff)" }}
        className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold"
      >
        {ctx.tp("cta.next")}
      </button>
    </div>
  );
}
