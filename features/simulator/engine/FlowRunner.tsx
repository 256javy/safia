"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "@/lib/i18n/navigation";
import { TrainingBanner } from "../TrainingBanner";
import type {
  FieldSpec,
  FlowCtx,
  FlowData,
  FlowSpec,
  PlatformChrome,
  Translator,
} from "./types";
import { FlowField } from "./FlowField";
import type { Account } from "@/stores/accounts-store";
import { strength as scoreStrength } from "@/lib/password";

interface FlowRunnerProps {
  flow: FlowSpec;
  chrome: PlatformChrome;
  account?: Account;
  /** Extra ctx values injected by route page (e.g. via=auth|forgot, action=enable|disable). */
  initial?: FlowData;
  /** Where to go on done. Default: `/simulator/<platform>` (platform hub). */
  doneHref?: string;
}

export function FlowRunner({ flow, chrome: Chrome, account, initial, doneHref }: FlowRunnerProps) {
  const router = useRouter();
  const locale = useLocale();
  const tRoot = asTranslator(useTranslations());
  const tp = asTranslator(useTranslations(`simulator.${flow.platform}`));
  const tv = asTranslator(useTranslations("validation"));
  const tShared = useTranslations("simulator.runner");

  const [data, setData] = useState<FlowData>(() => ({ ...(initial ?? {}) }));
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [screenError, setScreenError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const initialId = flow.initialScreen ?? flow.screens[0]?.id;
  const [screenId, setScreenId] = useState<string>(initialId);
  const screen = useMemo(() => flow.screens.find((s) => s.id === screenId) ?? flow.screens[0], [flow, screenId]);
  const stepIndex = flow.screens.findIndex((s) => s.id === screen.id);
  const totalSteps = flow.screens.length;

  const dirtyRef = useRef(false);

  const patch = useCallback((entries: FlowData) => setData((d) => ({ ...d, ...entries })), []);

  const [exitDialogOpen, setExitDialogOpen] = useState(false);

  const performExit = useCallback(() => {
    router.push(doneHref ?? `/simulator/${flow.platform}`);
  }, [doneHref, flow.platform, router]);

  const exit = useCallback(() => {
    if (dirtyRef.current) {
      setExitDialogOpen(true);
      return;
    }
    performExit();
  }, [performExit]);

  const ctx: FlowCtx = useMemo(
    () => ({
      platform: flow.platform,
      account,
      data,
      t: tRoot,
      tp,
      tv,
      patch,
      locale,
      exit,
    }),
    [flow.platform, account, data, tRoot, tp, tv, patch, locale, exit],
  );

  useEffect(() => {
    if (!screen.enter) return;
    void screen.enter({ ...ctx, exit: () => {} });
    // We intentionally only fire enter() when the screen id changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen.id]);

  const resolveKey = useCallback((relative: string) => relative, []);

  const validateField = useCallback(
    (field: FieldSpec, value: string, currentData: FlowData): string | null => {
      const v = value ?? "";
      if (field.required !== false && !v.trim()) return "required";
      if (field.type === "confirmPassword" && field.matches) {
        if (v !== (currentData[field.matches] ?? "")) return "password.mismatch";
      }
      if (field.validate) {
        const out = field.validate(v, { ...ctx, data: currentData });
        if (out) return out;
      }
      return null;
    },
    [ctx],
  );

  const advance = useCallback(
    async (patch?: FlowData) => {
      const merged = { ...data, ...(patch ?? {}) };

      // Validate fields if the screen has them.
      if (screen.fields && screen.fields.length > 0) {
        const fieldErrors: Record<string, string | null> = {};
        let hasErr = false;
        for (const f of screen.fields) {
          const value = merged[f.name] ?? "";
          const err = validateField(f, value, merged);
          fieldErrors[f.name] = err;
          if (err) hasErr = true;
        }
        setErrors(fieldErrors);
        if (hasErr) return;
      }

      setScreenError(null);
      setData(merged);

      let next: string | "done";
      try {
        next = await screen.next(merged, { ...ctx, data: merged });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "unknown";
        setScreenError(msg);
        return;
      }

      if (next === "done") {
        setBusy(true);
        try {
          await flow.onComplete(merged, { ...ctx, data: merged });
          dirtyRef.current = false;
          router.push(doneHref ?? `/simulator/${flow.platform}`);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "unknown";
          setScreenError(msg);
        } finally {
          setBusy(false);
        }
      } else {
        setScreenId(next);
      }
    },
    [data, screen, ctx, validateField, flow, doneHref, router],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    void advance();
  };

  const handleChange = useCallback(
    (name: string) => (value: string) => {
      dirtyRef.current = true;
      setData((d) => {
        const next = { ...d, [name]: value };
        // Auto-suggest dependent fields (only if user hasn't filled them yet).
        if (screen.fields) {
          for (const f of screen.fields) {
            if (f.suggest && !d[f.name]) {
              const suggestion = f.suggest({ ...ctx, data: next });
              if (suggestion) next[f.name] = suggestion;
            }
          }
        }
        return next;
      });
      setErrors((e) => ({ ...e, [name]: null }));
    },
    [screen, ctx],
  );

  const titleText = tp(screen.title);
  const subtitleText = screen.subtitle ? tp(screen.subtitle) : undefined;
  const tipText = screen.tip ? tp(screen.tip) : undefined;
  const primaryCta = tp(screen.cta.primary);
  const secondaryCta = screen.cta.secondary ? tp(screen.cta.secondary) : undefined;

  const customNode =
    screen.render?.({
      ctx: { ...ctx, data },
      advance: (p) => void advance(p),
      setError: setScreenError,
      error: screenError,
    }) ?? null;

  return (
    <>
      <TrainingBanner />
      <ExitButton onClick={exit} label={tShared("exit")} />
      <ExitDialog
        open={exitDialogOpen}
        onCancel={() => setExitDialogOpen(false)}
        onConfirm={() => {
          setExitDialogOpen(false);
          performExit();
        }}
        title={tShared("exitConfirm")}
        confirmLabel={tShared("exit")}
        cancelLabel={tShared("cancel")}
      />
      <Chrome platform={flow.platform} flow={flow} screen={screen} stepIndex={stepIndex} totalSteps={totalSteps}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen.id}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <header className="mb-6">
              <h1 className="text-2xl font-semibold text-current">{titleText}</h1>
              {subtitleText && <p className="mt-1 text-sm text-current/70">{subtitleText}</p>}
            </header>

            {screen.customLayout && customNode ? (
              customNode
            ) : (
              <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
                {screen.fields?.map((f) => (
                  <FlowField
                    key={f.name}
                    field={f}
                    value={data[f.name] ?? ""}
                    onChange={handleChange(f.name)}
                    error={errors[f.name]}
                    ctx={ctx}
                    tp={tp}
                    resolve={resolveKey}
                  />
                ))}

                {screenError && (
                  <p className="rounded-md border border-red-500/30 bg-red-500/5 px-3 py-2 text-xs text-red-500">
                    {tryTranslate(tv, screenError)}
                  </p>
                )}

                <div className="mt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={busy}
                    style={{
                      background: "var(--flow-primary-bg, #1a73e8)",
                      color: "var(--flow-primary-text, #fff)",
                    }}
                    className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {primaryCta}
                  </button>
                  {secondaryCta && (
                    <button
                      type="button"
                      onClick={() => void advance()}
                      style={{ color: "var(--flow-secondary-text, currentColor)" }}
                      className="w-full rounded-lg px-4 py-2 text-sm opacity-80 hover:opacity-100"
                    >
                      {secondaryCta}
                    </button>
                  )}
                </div>

                {customNode}
              </form>
            )}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-8 border-t border-current/10 pt-4 text-center">
          <p className="text-[11px] uppercase tracking-wide text-current/60">
            {tShared("step", { current: stepIndex + 1, total: totalSteps })}
          </p>
          {tipText && <TipBox text={tipText} label={tShared("tip")} />}
        </footer>
      </Chrome>
    </>
  );
}

function ExitButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed top-12 right-3 z-[90] rounded-full border border-accent/20 bg-bg-base/80 px-3 py-1.5 text-xs font-medium text-text-secondary backdrop-blur transition-colors hover:border-accent/50 hover:text-text-primary sm:top-14 sm:right-4"
    >
      {label}
    </button>
  );
}

function TipBox({ text, label }: { text: string; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] font-medium text-accent hover:underline"
      >
        {open ? `▾ ${label}` : `▸ ${label}`}
      </button>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto mt-2 max-w-md overflow-hidden rounded-md bg-current/5 px-3 py-2 text-left text-xs text-current/80"
          >
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ExitDialogProps {
  open: boolean;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function ExitDialog({ open, title, confirmLabel, cancelLabel, onCancel, onConfirm }: ExitDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-dialog-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="w-full max-w-sm rounded-2xl bg-bg-surface p-6 text-text-primary shadow-2xl ring-1 ring-accent/15"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="exit-dialog-title" className="text-base font-semibold">
              {title}
            </h2>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg border border-accent/20 px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-text-primary"
                autoFocus
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Re-export helpers used by flow specs.
export { scoreStrength };

function tryTranslate(t: Translator, key: string): string {
  try {
    return t(key);
  } catch {
    return key;
  }
}

/**
 * `useTranslations` returns a typed callable bag, but our flow specs treat translators
 * as plain `(key, values?) => string` functions. Centralize the cast here.
 */
function asTranslator(t: unknown): Translator {
  return t as Translator;
}
