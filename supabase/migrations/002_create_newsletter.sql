-- 002_create_newsletter.sql
-- Newsletter subscriptions

CREATE TABLE public.newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  confirmed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS: DENY ALL (same rationale as users table)
ALTER TABLE public.newsletter ENABLE ROW LEVEL SECURITY;
