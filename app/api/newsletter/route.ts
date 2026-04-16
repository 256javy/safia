import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";

const newsletterSchema = z.object({
  email: z.string().email(),
});

// In-memory rate limiter: 3 requests per hour per IP
// For production scale, replace with Upstash Ratelimit
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

// POST /api/newsletter — subscribe to newsletter
// Always returns HTTP 200 to prevent email enumeration (threat model §6.6)
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    // Return 200 to avoid leaking rate limit state to scrapers
    return NextResponse.json({ ok: true });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    // Always 200 — no email enumeration via status codes
    return NextResponse.json({ ok: true });
  }

  const supabase = createServiceClient();
  await supabase
    .from("newsletter")
    .upsert({ email: parsed.data.email }, { onConflict: "email" });

  // Always 200 regardless of DB outcome — prevents error-based enumeration
  return NextResponse.json({ ok: true });
}
