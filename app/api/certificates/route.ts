import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { auth } from "@/lib/auth/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { getTrack } from "@/features/certificates/tracks";

/**
 * POST /api/certificates
 *
 * Issue a certificate for a completed track. Works for both authenticated
 * users (user_id is set) and guests (user_id is null). The client has
 * already verified completion in the progress store — the server does not
 * re-verify against DB progress because guest progress lives only in
 * localStorage. This is a deliberate trust trade-off; the point of the
 * certificate is social proof for the learner, not a tamper-proof credential.
 * If forgery becomes a concern, applied- and mastery-level certificates
 * (VISION §7) can require a server-side check against quiz scores before
 * issuance.
 */
const issueSchema = z.object({
  track_slug: z.string().min(1).max(64),
  display_name: z.string().trim().min(1).max(60),
});

function generateVerificationCode(): string {
  // 16 chars of url-safe alphabet (~96 bits of entropy). Good enough for
  // a non-secret identifier we expect to be shared in OpenGraph cards.
  return randomBytes(12).toString("base64url");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = issueSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const track = getTrack(parsed.data.track_slug);
  if (!track) {
    return NextResponse.json({ error: "Unknown track" }, { status: 404 });
  }

  const session = await auth();
  const supabase = createServiceClient();
  const verification_code = generateVerificationCode();

  const { data, error } = await supabase
    .from("certificates")
    .insert({
      user_id: session?.user?.id ?? null,
      track_slug: track.slug,
      display_name: parsed.data.display_name,
      verification_code,
      level: "completion",
    })
    .select("id, verification_code, track_slug, display_name, issued_at, level")
    .single();

  if (error || !data) {
    // Log server-side so ops can diagnose. The client still gets an opaque
    // 500 — specific database errors must never reach the public response.
    console.error("POST /api/certificates failed", {
      track_slug: track.slug,
      db_code: error?.code,
      db_message: error?.message,
    });
    return NextResponse.json({ error: "Could not issue certificate" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
