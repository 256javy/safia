"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CertificateCard } from "./CertificateCard";

interface IssuedCertificate {
  verification_code: string;
  display_name: string;
  issued_at: string;
  level: "completion" | "applied" | "mastery";
}

interface Props {
  trackSlug: string;
  trackTitle: string;
  /** Callback invoked when the learner dismisses the flow. */
  onClose?: () => void;
}

/**
 * Client-side flow that appears when a learner has completed every lesson
 * of a track. Prompts for a display name (guest-first: no account needed),
 * calls POST /api/certificates, and renders the share card.
 */
export function IssueFlow({ trackSlug, trackTitle, onClose }: Props) {
  const t = useTranslations("certificates");
  const [displayName, setDisplayName] = useState("");
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "issuing" }
    | { kind: "error"; message: string }
    | { kind: "issued"; certificate: IssuedCertificate }
  >({ kind: "idle" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = displayName.trim();
    if (!name) return;
    setState({ kind: "issuing" });
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track_slug: trackSlug, display_name: name }),
      });
      if (!res.ok) {
        setState({ kind: "error", message: t("error") });
        return;
      }
      const cert = (await res.json()) as IssuedCertificate;
      setState({ kind: "issued", certificate: cert });
    } catch {
      setState({ kind: "error", message: t("error") });
    }
  }

  if (state.kind === "issued") {
    const issuedDate = new Date(state.certificate.issued_at);
    const issuedMonthLabel = issuedDate.toLocaleDateString("es", {
      year: "numeric",
      month: "long",
    });
    const verificationUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/cert/${state.certificate.verification_code}`
        : `/cert/${state.certificate.verification_code}`;
    return (
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CertificateCard
          trackTitle={trackTitle}
          displayName={state.certificate.display_name}
          issuedMonthLabel={issuedMonthLabel}
          verificationCode={state.certificate.verification_code}
          verificationUrl={verificationUrl}
          level={state.certificate.level}
        />
        <div className="mt-4 flex items-center justify-center gap-3">
          <a
            href={`/cert/${state.certificate.verification_code}`}
            className="rounded-xl border border-accent/30 px-4 py-2 text-sm text-text-secondary transition-all hover:border-accent/60 hover:text-text-primary"
          >
            {t("viewVerificationPage")}
          </a>
          {onClose && (
            <button
              onClick={onClose}
              className="text-sm text-text-muted hover:text-text-secondary"
            >
              {t("close")}
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mt-6 rounded-2xl border border-accent/20 bg-bg-surface p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold text-text-primary">
        {t("earnedTitle", { track: trackTitle })}
      </h3>
      <p className="mt-2 text-sm text-text-secondary">{t("earnedBody")}</p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label className="block text-sm text-text-secondary">
          {t("displayNameLabel")}
          <input
            type="text"
            maxLength={60}
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t("displayNamePlaceholder")}
            className="mt-1 w-full rounded-xl border border-accent/20 bg-bg-base px-4 py-2 text-text-primary placeholder:text-text-muted focus:border-accent/60 focus:outline-none"
          />
        </label>
        <p className="text-xs text-text-muted">{t("displayNameHint")}</p>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={state.kind === "issuing" || !displayName.trim()}
            className="rounded-xl bg-accent px-5 py-2 text-sm font-medium text-white transition-all hover:bg-accent-hover disabled:opacity-40"
          >
            {state.kind === "issuing" ? t("issuing") : t("issueButton")}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-text-muted hover:text-text-secondary"
            >
              {t("later")}
            </button>
          )}
        </div>

        {state.kind === "error" && (
          <p role="alert" className="text-sm text-destructive">
            {state.message}
          </p>
        )}
      </form>
    </motion.div>
  );
}
