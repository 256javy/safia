-- 001_create_users.sql
-- Users table for Auth.js-managed OAuth accounts

CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oauth_id text NOT NULL,
  provider text NOT NULL CHECK (provider IN ('google', 'github', 'apple')),
  xp integer NOT NULL DEFAULT 0 CHECK (xp >= 0),
  progress_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (oauth_id, provider)
);

-- RLS: DENY ALL
-- We use Auth.js with our own JWT, not Supabase Auth.
-- All DB access goes through the service role key on the server side,
-- which bypasses RLS. This policy is defense-in-depth only.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- No policies = deny all for non-service-role connections
