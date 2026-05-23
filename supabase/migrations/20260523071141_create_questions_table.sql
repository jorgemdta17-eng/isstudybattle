/*
  # Create questions table

  ## Summary
  Creates a table to store all Battle Mode quiz questions.
  Any authenticated user can read questions; only service-role (admin) can write them.
  The table is pre-seeded with the 7 questions that were previously hard-coded in mock.js.

  ## New Table: questions
  - `id` (uuid, primary key)
  - `question` (text) — the question text
  - `options` (text[]) — array of exactly 4 answer options
  - `correct_index` (int) — 0-based index of the correct option in the options array
  - `subject` (text) — e.g. 'Biología', 'Matemáticas', etc.
  - `difficulty` (text) — 'Fácil' | 'Media' | 'Difícil'
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Authenticated users can SELECT (read) all questions
  - INSERT/UPDATE/DELETE restricted to service role only (no client-side policy)
    — questions are managed via the Supabase dashboard table editor

  ## Seed data
  The 7 original QUESTION_BANK entries from mock.js are inserted here.
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  options text[] NOT NULL,
  correct_index integer NOT NULL,
  subject text NOT NULL DEFAULT '',
  difficulty text NOT NULL DEFAULT 'Media',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read questions"
  ON questions FOR SELECT
  TO authenticated
  USING (true);

-- Seed the 7 original questions
INSERT INTO questions (question, options, correct_index, subject, difficulty) VALUES
(
  '¿Qué orgánulo se encarga de la producción de energía (ATP) en la célula?',
  ARRAY['Ribosoma', 'Mitocondria', 'Aparato de Golgi', 'Lisosoma'],
  1, 'Biología', 'Media'
),
(
  '¿Cuál es la derivada de sen(x)?',
  ARRAY['cos(x)', '-cos(x)', '-sen(x)', 'tan(x)'],
  0, 'Matemáticas', 'Media'
),
(
  'En programación, ¿qué estructura sigue el principio LIFO?',
  ARRAY['Cola (Queue)', 'Lista enlazada', 'Pila (Stack)', 'Árbol'],
  2, 'Programación', 'Media'
),
(
  '¿En qué año comenzó la Revolución Francesa?',
  ARRAY['1776', '1789', '1804', '1815'],
  1, 'Historia', 'Media'
),
(
  '¿Cuál es el símbolo químico del Sodio?',
  ARRAY['S', 'So', 'Na', 'N'],
  2, 'Química', 'Fácil'
),
(
  '¿Qué teorema relaciona los lados de un triángulo rectángulo?',
  ARRAY['Tales', 'Pitágoras', 'Euclides', 'Fermat'],
  1, 'Matemáticas', 'Fácil'
),
(
  '¿Qué gas absorben las plantas durante la fotosíntesis?',
  ARRAY['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Hidrógeno'],
  2, 'Biología', 'Fácil'
)
ON CONFLICT DO NOTHING;
