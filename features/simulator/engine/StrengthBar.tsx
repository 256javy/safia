"use client";

import { useTranslations } from "next-intl";
import { strength } from "@/lib/password";

const COLORS = ["#dc2626", "#ea580c", "#eab308", "#84cc16", "#16a34a"];

export function StrengthBar({ value }: { value: string }) {
  const t = useTranslations("validation.password.strength");
  const score = strength(value);
  return (
    <div className="mt-2 select-none" aria-live="polite">
      <div className="flex gap-1" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              background: i <= score - 1 ? COLORS[Math.min(score, COLORS.length - 1)] : "rgba(127,127,127,0.18)",
            }}
          />
        ))}
      </div>
      {value && (
        <p className="mt-1 text-[11px] text-text-muted">
          {t.has(`s${score}`) ? t(`s${score}`) : ""}
        </p>
      )}
    </div>
  );
}
