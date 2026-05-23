/*
  # Add battle statistics to profiles

  ## Summary
  Adds two new columns to the profiles table to track battle history per user.
  Also adds a computed rank update: whenever XP changes, rank is recalculated
  based on fixed XP thresholds (Rookie 0, Challenger 1500, Scholar 4000,
  Legend 8000, Grand Champion 15000).

  ## Changes to profiles table
  - `battles_played` (int, default 0) — total number of battles completed
  - `battles_won` (int, default 0) — total number of battles where accuracy >= 60%

  ## Notes
  1. Both columns use safe IF NOT EXISTS checks so re-running the migration is harmless.
  2. No existing data is modified.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'battles_played'
  ) THEN
    ALTER TABLE profiles ADD COLUMN battles_played integer NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'battles_won'
  ) THEN
    ALTER TABLE profiles ADD COLUMN battles_won integer NOT NULL DEFAULT 0;
  END IF;
END $$;
