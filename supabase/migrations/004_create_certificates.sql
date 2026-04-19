-- 004_create_certificates.sql
-- Certificates issued on track completion (VISION §7).
--
-- Privacy posture (VISION §6, §7):
-- - The display_name is chosen by the user and is the only identifying string.
--   No PII. No email. No avatar. No reverse lookup from display_name to user_id
--   is exposed by any endpoint.
-- - user_id is nullable. Guest learners can earn a certificate without an
--   account; their row has user_id = NULL. If they later sign in, a claim
--   flow can associate the row with their user_id using the local claim token
--   stored in the browser.
-- - verification_code is a short random token suitable for a public URL.
--   The public verification endpoint returns display_name, track_slug,
--   issued_at (month granularity), and level — nothing else.
--
-- level (VISION §7): certificates are multi-level — completion, applied,
-- mastery. MVP issues only 'completion'; the column is present so applied
-- and mastery can land without a schema migration.

CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  track_slug text NOT NULL,
  display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 60),
  verification_code text NOT NULL UNIQUE,
  level text NOT NULL DEFAULT 'completion' CHECK (level IN ('completion', 'applied', 'mastery')),
  issued_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);

CREATE INDEX certificates_user_id_idx ON public.certificates (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX certificates_track_idx ON public.certificates (track_slug);

-- RLS: DENY ALL (defense-in-depth; access is via service role only).
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
