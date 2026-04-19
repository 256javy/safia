import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getTrack } from "@/features/certificates/tracks";
import { CertificateCard } from "@/features/certificates/CertificateCard";
import type { CertificateVerification } from "@/types/certificate";

/**
 * Public certificate verification page.
 *
 * Guest-first (VISION §6): no auth required to view.
 * Privacy-safe (VISION §7): the page reads exactly the same public-safe
 * fields the API returns; nothing more is loaded. Month-granular dates.
 */

interface Props {
  params: Promise<{ locale: string; code: string }>;
}

async function fetchCertificate(code: string): Promise<CertificateVerification | null> {
  if (!/^[A-Za-z0-9_-]{8,32}$/.test(code)) return null;

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("track_slug, display_name, level, issued_at, revoked_at")
    .eq("verification_code", code)
    .maybeSingle();

  if (error || !data) return null;

  const issuedDate = new Date(data.issued_at);
  const issued_month = `${issuedDate.getUTCFullYear()}-${String(
    issuedDate.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
  const track = getTrack(data.track_slug);

  return {
    track_slug: data.track_slug,
    track_title: track?.titleKey ?? data.track_slug,
    display_name: data.display_name,
    issued_month,
    level: data.level,
    revoked: Boolean(data.revoked_at),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code, locale } = await params;
  const t = await getTranslations({ locale, namespace: "certificates" });
  const cert = await fetchCertificate(code);
  if (!cert) {
    return { title: t("verifyPage.notFoundTitle") };
  }
  const trackTitle = t(`tracks.${cert.track_slug}.title`);
  const title = t("verifyPage.ogTitle", { name: cert.display_name, track: trackTitle });
  const description = t("verifyPage.ogDescription", {
    name: cert.display_name,
    track: trackTitle,
  });
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary", title, description },
  };
}

export default async function CertificateVerifyPage({ params }: Props) {
  const { code, locale } = await params;
  const cert = await fetchCertificate(code);
  if (!cert) return notFound();

  const t = await getTranslations({ locale, namespace: "certificates" });
  const trackTitle = t(`tracks.${cert.track_slug}.title`);
  const [year, monthNum] = cert.issued_month.split("-").map(Number);
  const issuedMonthLabel = new Date(Date.UTC(year, monthNum - 1, 1)).toLocaleDateString(
    locale,
    { year: "numeric", month: "long" },
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">
          {t("verifyPage.kicker")}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-text-primary sm:text-3xl">
          {t("verifyPage.heading")}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">{t("verifyPage.subheading")}</p>
      </header>

      {cert.revoked ? (
        <div
          role="alert"
          className="mx-auto mb-6 max-w-xl rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {t("verifyPage.revoked")}
        </div>
      ) : null}

      <CertificateCard
        trackTitle={trackTitle}
        displayName={cert.display_name}
        issuedMonthLabel={issuedMonthLabel}
        verificationCode={code}
        verificationUrl={`/cert/${code}`}
        level={cert.level}
      />

      <p className="mt-8 text-center text-xs text-text-muted">
        {t("verifyPage.privacyNote")}
      </p>
    </main>
  );
}
