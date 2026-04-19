-- 003_drop_xp_column.sql
-- Drop the `xp` column from users.
--
-- Per VISION.md §6 ("Motivation by accomplishment, not by engagement") and §7
-- ("Gamification is not platform-wide"), XP is not tracked on atlas progress.
-- Completion state lives in `progress_json`. If/when Safia Range ships,
-- Range-specific scoring will live in its own table, not on the core users row.

ALTER TABLE public.users DROP COLUMN IF EXISTS xp;
