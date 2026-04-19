import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getTrack } from "@/features/certificates/tracks";
import type { CertificateVerification } from "@/types/certificate";

/**
 * GET /api/certificates/[code]
 *
 * Public verification endpoint. No auth. Returns only the fields safe to
 * expose on a shareable URL:
 *
 * - display_name (chosen by the user at issuance)
 * - track_slug + translated title
 * - issued_month — month granularity, never to the second, per VISION §7
 *   privacy commitment
 * - level
 * - revoked (boolean)
 *
 * No user_id, no raw timestamp, no issuer IP, no requester IP is logged
 * beyond default platform access logs. A bad code returns 404 — never
 * a message that could leak whether a code existed previously.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> },
) {
  const { code } = await ctx.params;

  if (!/^[A-Za-z0-9_-]{8,32}$/.test(code)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("track_slug, display_name, level, issued_at, revoked_at")
    .eq("verification_code", code)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const track = getTrack(data.track_slug);
  const issuedDate = new Date(data.issued_at);
  const issued_month = `${issuedDate.getUTCFullYear()}-${String(
    issuedDate.getUTCMonth() + 1,
  ).padStart(2, "0")}`;

  const body: CertificateVerification = {
    track_slug: data.track_slug,
    track_title: track?.titleKey ?? data.track_slug,
    display_name: data.display_name,
    issued_month,
    level: data.level,
    revoked: Boolean(data.revoked_at),
  };

  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}
