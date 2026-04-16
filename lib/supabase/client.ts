import { createClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client using the anon key.
 * Subject to RLS (DENY ALL) — effectively read-only public access is blocked.
 * Used only if we ever need realtime or public queries in the future.
 */
export function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(url, key);
}
