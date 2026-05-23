/*
  # Add last_activity_date to profiles

  1. Changes
    - Adds `last_activity_date` (date) column to `profiles`
      - Stores the calendar date (no time) of the user's last recorded activity
      - Used to compute consecutive-day streaks
  2. Notes
    - Existing rows get NULL, which the app treats as "no activity yet"
    - `streak` column already exists and will be updated by the app logic
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_activity_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_activity_date date;
  END IF;
END $$;
