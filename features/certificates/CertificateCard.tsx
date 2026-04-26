import { useTranslations } from "next-intl";

interface Props {
  trackTitle: string;
  displayName: string;
  issuedMonthLabel: string; // pre-formatted human date ("abril de 2026")
  verificationCode: string;
  verificationUrl: string;
  level: "completion" | "applied" | "mastery";
}

/**
 * Shareable certificate card. Single visual component rendered both on
 * the earn-certificate success screen and on the public verification
 * page. Sober by design — no glitter, no XP. The whole point is it
 * should look decent next to a CV (VISION §7, "portfolio-grade PDF"
 * is a future upgrade; this is the share card for now).
 */
export function CertificateCard({
  trackTitle,
  displayName,
  issuedMonthLabel,
  verificationCode,
  verificationUrl,
  level,
}: Props) {
  const t = useTranslations("certificates");

  return (
    <article
      className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl border border-accent/20 bg-bg-surface shadow-glow"
      aria-label={t("cardAriaLabel", { track: trackTitle })}
    >
      <div className="bg-accent/10 px-8 py-5 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">{t("issuedBy")}</p>
        <p className="mt-1 text-lg font-semibold text-text-primary">Safia</p>
      </div>
      <div className="px-8 py-10 text-center">
        <p className="text-xs uppercase tracking-widest text-text-muted">
          {t("levelLabel")}
        </p>
        <p className="mt-1 text-sm font-medium text-text-secondary">
          {t(`levels.${level}`)}
        </p>

        <h2 className="mt-6 text-2xl font-bold text-text-primary sm:text-3xl">
          {trackTitle}
        </h2>

        <p className="mt-6 text-sm text-text-muted">{t("awardedTo")}</p>
        <p className="mt-1 text-xl font-semibold text-text-primary">{displayName}</p>

        <p className="mt-6 text-xs text-text-muted">
          {t("issuedOn", { date: issuedMonthLabel })}
        </p>
      </div>
      <div className="border-t border-accent/10 bg-bg-base/40 px-8 py-4 text-center">
        <p className="text-xs text-text-muted">{t("verifyAt")}</p>
        <p className="mt-0.5 font-mono text-xs text-text-secondary break-all">
          {verificationUrl}
        </p>
        <p className="mt-2 font-mono text-[10px] text-text-muted">
          {t("code")}: {verificationCode}
        </p>
      </div>
    </article>
  );
}
