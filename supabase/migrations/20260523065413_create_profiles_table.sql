/*
  # Create profiles table

  ## Summary
  Creates the user profiles table that stores game-related data for each registered user.
  A profile is automatically created when a new user signs up via a database trigger.

  ## New Tables
  - `profiles`
    - `id` (uuid, primary key) — matches auth.users.id
    - `name` (text) — display name
    - `xp` (int) — total experience points, default 0
    - `level` (int) — current level, default 1
    - `streak` (int) — daily streak count, default 0
    - `coins` (int) — in-app currency, default 0
    - `rank` (text) — current rank name, default 'Rookie'
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled: only the owner can read/update their own profile
  - A trigger on auth.users creates a blank profile on signup

  ## Notes
  1. The trigger function `handle_new_user` reads the user's email to derive an initial name.
  2. XP thresholds: Rookie 0, Challenger 1500, Scholar 4000, Legend 8000, Grand Champion 15000.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  streak integer NOT NULL DEFAULT 0,
  coins integer NOT NULL DEFAULT 0,
  rank text NOT NULL DEFAULT 'Rookie',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
