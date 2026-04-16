"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useUIStore } from "@/stores/ui-store";

interface CoachStep {
  targetSelector: string;
  titleKey: string;
  descriptionKey: string;
}

const STEPS: CoachStep[] = [
  {
    targetSelector: '[data-coach="roadmap"]',
    titleKey: "roadmap",
    descriptionKey: "roadmapDesc",
  },
  {
    targetSelector: '[data-coach="xp-counter"]',
    titleKey: "xpCounter",
    descriptionKey: "xpCounterDesc",
  },
  {
    targetSelector: '[data-coach="auth-area"]',
    titleKey: "authArea",
    descriptionKey: "authAreaDesc",
  },
  {
    targetSelector: '[data-coach="passwords-card"]',
    titleKey: "passwordsCard",
    descriptionKey: "passwordsCardDesc",
  },
];

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getElementRect(selector: string): SpotlightRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  const padding = 8;
  return {
    top: rect.top - padding + window.scrollY,
    left: rect.left - padding,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
  };
}

export function CoachMarks() {
  const t = useTranslations("coachMarks");
  const hasSeenCoachMark = useUIStore((s) => s.hasSeenCoachMark);
  const markCoachMarkSeen = useUIStore((s) => s.markCoachMarkSeen);
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(false);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);

  useEffect(() => {
    if (!hasSeenCoachMark) {
      const timer = setTimeout(() => setActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, [hasSeenCoachMark]);

  const updateSpotlight = useCallback(() => {
    if (!active || step >= STEPS.length) return;
    const rect = getElementRect(STEPS[step].targetSelector);
    setSpotlight(rect);
    if (rect) {
      const el = document.querySelector(STEPS[step].targetSelector);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [active, step]);

  useEffect(() => {
    updateSpotlight();
    window.addEventListener("resize", updateSpotlight);
    return () => window.removeEventListener("resize", updateSpotlight);
  }, [updateSpotlight]);

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  }

  function dismiss() {
    setActive(false);
    markCoachMarkSeen();
  }

  if (hasSeenCoachMark || !active) return null;

  const currentStep = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dark overlay with spotlight cutout */}
        <svg className="absolute inset-0 h-full w-full">
          <defs>
            <mask id="coach-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {spotlight && (
                <rect
                  x={spotlight.left}
                  y={spotlight.top}
                  width={spotlight.width}
                  height={spotlight.height}
                  rx={12}
                  fill="black"
                />
              )}
            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.7)"
            mask="url(#coach-mask)"
          />
        </svg>

        {/* Spotlight border glow */}
        {spotlight && (
          <motion.div
            className="pointer-events-none absolute rounded-xl border-2 border-accent"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
              boxShadow: "var(--shadow-glow)",
            }}
            layoutId="spotlight"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Tooltip card */}
        <motion.div
          key={step}
          className="absolute z-10 w-80 rounded-xl border border-accent/30 bg-bg-elevated p-5 shadow-lg"
          style={{
            top: spotlight ? spotlight.top + spotlight.height + 16 : "50%",
            left: spotlight ? Math.max(16, Math.min(spotlight.left, window.innerWidth - 336)) : "50%",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          <p className="mb-1 text-xs text-text-muted">
            {step + 1}/{STEPS.length}
          </p>
          <h4 className="mb-2 text-base font-semibold text-text-primary">
            {t(currentStep.titleKey)}
          </h4>
          <p className="mb-4 text-sm text-text-secondary">
            {t(currentStep.descriptionKey)}
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={dismiss}
              className="text-xs text-text-muted hover:text-text-secondary"
            >
              {t("skip")}
            </button>
            <button
              onClick={handleNext}
              className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
            >
              {step < STEPS.length - 1 ? t("next") : t("done")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
