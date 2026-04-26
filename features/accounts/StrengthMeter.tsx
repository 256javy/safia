import type { PasswordStrength } from "@/lib/password";

const COLORS = ["#7f1d1d", "#dc2626", "#f59e0b", "#84cc16", "#22c55e"];

interface Props {
  score: PasswordStrength;
  className?: string;
}

export function StrengthMeter({ score, className = "" }: Props) {
  return (
    <div className={`flex gap-1 ${className}`} aria-label={`Password strength ${score}/4`}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="block h-1.5 w-5 rounded-sm"
          style={{ background: i < score ? COLORS[score] : "rgba(255,255,255,0.08)" }}
        />
      ))}
    </div>
  );
}
