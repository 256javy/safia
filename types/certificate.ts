export type CertificateLevel = "completion" | "applied" | "mastery";

export interface Certificate {
  id: string;
  user_id: string | null;
  track_slug: string;
  display_name: string;
  verification_code: string;
  level: CertificateLevel;
  issued_at: string; // ISO
  revoked_at?: string | null;
}

/** Public-safe view returned by the verification endpoint (§VISION 7). */
export interface CertificateVerification {
  track_slug: string;
  track_title: string;
  display_name: string;
  issued_month: string; // "2026-04" — month granularity per STYLE §6 privacy note
  level: CertificateLevel;
  revoked: boolean;
}
