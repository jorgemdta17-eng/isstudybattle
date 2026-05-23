/*
  # Add onboarding_completed to profiles

  ## Summary
  Adds a boolean column to track whether each user has completed the onboarding
  flow. Starts as false for all users (new and existing). The app uses this to
  show the onboarding screen exactly once after account creation.

  ## Changes to profiles table
  - `onboarding_completed` (boolean, default false) — set to true when the user
    finishes the onboarding wizard for the first time.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;
  END IF;
END $$;
