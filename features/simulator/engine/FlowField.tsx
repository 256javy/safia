"use client";

import { useState, type ChangeEvent } from "react";
import type { FieldSpec, FlowCtx, Translator } from "./types";
import { StrengthBar } from "./StrengthBar";

interface FlowFieldProps {
  field: FieldSpec;
  value: string;
  onChange: (next: string) => void;
  ctx: FlowCtx;
  /** flow-scoped translator (`simulator.<platform>.<kind>`) */
  tp: Translator;
  error?: string | null;
  /** Resolves the field's screen-relative i18n key. */
  resolve: (relative: string) => string;
}

export function FlowField({ field, value, onChange, error, tp, resolve, ctx }: FlowFieldProps) {
  const [reveal, setReveal] = useState(false);
  const isPasswordKind =
    field.type === "password" || field.type === "newPassword" || field.type === "confirmPassword";
  const showReveal = field.reveal && isPasswordKind;
  const inputType = resolveInputType(field.type, isPasswordKind, reveal);

  const id = `flow-field-${field.name}`;
  const labelText = tp(resolve(field.i18n.label));
  const placeholderText = field.i18n.placeholder ? tp(resolve(field.i18n.placeholder)) : undefined;
  const helpText = field.i18n.help ? tp(resolve(field.i18n.help)) : undefined;

  const handle = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => onChange(e.target.value);

  if (field.type === "select" || field.type === "country") {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-current">
          {labelText}
        </label>
        <select
          id={id}
          name={field.name}
          value={value}
          onChange={handle}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {tp(resolve(o.labelKey))}
            </option>
          ))}
        </select>
        {error && <ErrorMsg msgKey={error} ctx={ctx} />}
        {helpText && <p className="text-[11px] text-text-muted">{helpText}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-current">
        {labelText}
      </label>
      <div className="relative">
        <input
          id={id}
          name={field.name}
          type={inputType}
          inputMode={field.inputMode}
          value={value}
          onChange={handle}
          placeholder={placeholderText}
          autoComplete={field.autoComplete ?? "off"}
          autoCapitalize={field.type === "email" || field.type === "username" ? "none" : undefined}
          spellCheck={field.type === "email" || field.type === "username" ? false : undefined}
          maxLength={field.maxLength}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {showReveal && (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            className="absolute inset-y-0 right-2 my-auto h-7 rounded px-2 text-[11px] text-text-muted hover:text-text-primary"
            aria-label={reveal ? "Hide" : "Show"}
            tabIndex={-1}
          >
            {reveal ? "🙈" : "👁"}
          </button>
        )}
      </div>
      {field.meter && <StrengthBar value={value} />}
      {error && <ErrorMsg msgKey={error} ctx={ctx} />}
      {helpText && !error && <p className="text-[11px] text-text-muted">{helpText}</p>}
    </div>
  );
}

function ErrorMsg({ msgKey, ctx }: { msgKey: string; ctx: FlowCtx }) {
  return <p className="text-[11px] font-medium text-red-500">{ctx.tv(msgKey)}</p>;
}

function resolveInputType(type: FieldSpec["type"], isPasswordKind: boolean, reveal: boolean): string {
  if (isPasswordKind) return reveal ? "text" : "password";
  switch (type) {
    case "email":
      return "email";
    case "date":
      return "date";
    case "phone":
      return "tel";
    default:
      return "text";
  }
}
