"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { useProgressStore } from "@/stores/progress-store";
import { useSessionStore } from "@/stores/session-store";
import { usePracticeAccountsStore } from "@/stores/practice-accounts-store";
import { TrainingBanner } from "./TrainingBanner";
import { SimulatorTooltip } from "./SimulatorTooltip";

export interface SimStep {
  key: string;
  type: "input" | "info";
  placeholder?: string;
  fieldType?: "email" | "password" | "text" | "mfa";
}

interface SimulatorShellProps {
  platform: string;
  platformLabel: string;
  steps: SimStep[];
  /** Render the fake UI chrome (e.g. Google logo, form styling) */
  renderChrome: (step: number) => React.ReactNode;
}

export function SimulatorShell({ platform, platformLabel, steps, renderChrome }: SimulatorShellProps) {
  const t = useTranslations("simulator");
  const pt = useTranslations(`simulator.${platform}`);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [warningNote, setWarningNote] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const completeLesson = useProgressStore((s) => s.completeLesson);
  const setCelebration = useSessionStore((s) => s.setCelebration);
  const validate = usePracticeAccountsStore((s) => s.validate);
  const getAccountsForPlatform = usePracticeAccountsStore((s) => s.getAccountsForPlatform);

  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  const handleNext = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault(); // CRITICAL: never submit
      e.stopPropagation();

      setError(null);
      setWarningNote(null);

      // Required field validation
      if (step.type === "input" && inputValue.trim() === "") {
        setError(
          step.fieldType === "email"
            ? t("validation.emailRequired")
            : step.fieldType === "password"
              ? t("validation.passwordRequired")
              : step.fieldType === "mfa"
                ? t("validation.mfaRequired")
                : t("validation.fieldRequired")
        );
        return;
      }

      // Basic email format validation
      if (step.fieldType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue.trim())) {
        setError(t("validation.emailInvalid"));
        return;
      }

      if (step.type === "input" && step.fieldType === "email") {
        setEmailValue(inputValue);
      }

      if (step.type === "input" && step.fieldType === "password") {
        const platformAccounts = getAccountsForPlatform(platform);
        if (platformAccounts.length > 0) {
          const isValid = validate(platform, emailValue, inputValue);
          if (!isValid) {
            setError(t("validation.credentialsInvalid"));
            return;
          }
        } else {
          setWarningNote(t("validation.noAccountWarning"));
        }
      }

      // MFA: always proceed — the lesson is that the attacker already has your password

      if (isLastStep) {
        setCompleted(true);
        completeLesson("simulators", platform, 50);
        setCelebration("50");
      } else {
        setCurrentStep((s) => s + 1);
        setInputValue("");
        setShowPassword(false);
        setShowTip(true);
      }
    },
    [
      isLastStep,
      platform,
      step,
      inputValue,
      emailValue,
      validate,
      getAccountsForPlatform,
      completeLesson,
      setCelebration,
    ],
  );

  const inputType =
    step.type === "input"
      ? step.fieldType === "password"
        ? showPassword
          ? "text"
          : "password"
        : step.fieldType === "email"
          ? "email"
          : "text"
      : "text";

  if (completed) {
    return (
      <>
        <TrainingBanner />
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 pt-12">
          <motion.div
            className="w-full max-w-sm text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-5xl mb-4">{"\u{2705}"}</div>
            <h2 className="text-2xl font-bold text-text-primary">{t("completed")}</h2>
            <p className="mt-2 text-text-secondary">{t("completedDesc", { platform: platformLabel })}</p>
            <p className="mt-2 text-xp font-bold text-lg">{t("xpEarned")}</p>
            <Link
              href="/simulator"
              className="mt-6 inline-flex items-center justify-center rounded-xl border border-accent/20 px-6 py-3 text-sm font-medium text-text-secondary transition-all hover:border-accent/40 hover:text-text-primary"
            >
              {t("backToSimulators")}
            </Link>
          </motion.div>
        </main>
      </>
    );
  }

  return (
    <>
      <TrainingBanner />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center px-6 pt-16 pb-12">
        {/* Step indicator */}
        <div className="mb-6 text-sm text-text-muted">
          {t("step", { current: currentStep + 1, total: steps.length })}
        </div>

        {/* Progress bar */}
        <div className="mb-8 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-bg-surface">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gradient-xp-bar)" }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Fake UI chrome */}
        <motion.div
          className="w-full max-w-md"
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form
            onSubmit={handleNext}
            action="javascript:void(0)"
            method="dialog"
          >
            {renderChrome(currentStep)}

            {/* Input field for input steps */}
            {step.type === "input" && (
              <div className="mt-4">
                <div className="relative">
                  <input
                    type={inputType}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setError(null);
                      setWarningNote(null);
                    }}
                    placeholder={pt(`step${currentStep + 1}.placeholder`)}
                    autoComplete="off"
                    className={`w-full rounded-lg border bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition-colors ${
                      error
                        ? "border-red-400 focus:border-red-400"
                        : "border-gray-300 focus:border-blue-400"
                    } ${step.fieldType === "password" ? "pr-12" : ""}`}
                  />
                  {step.fieldType === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      tabIndex={-1}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1.5 text-xs text-red-400"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Warning note (no practice accounts) */}
                <AnimatePresence>
                  {warningNote && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1.5 text-xs text-amber-400"
                    >
                      {warningNote}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Next/Complete button */}
            <button
              type="submit"
              disabled={step.type === "input" && inputValue.trim() === ""}
              className="mt-4 w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: "var(--gradient-accent)" }}
            >
              {isLastStep ? t("complete") : t("next")}
            </button>
          </form>

          {/* Tooltip */}
          <SimulatorTooltip
            tip={pt(`step${currentStep + 1}.tip`)}
            visible={showTip}
          />
        </motion.div>
      </main>
    </>
  );
}
