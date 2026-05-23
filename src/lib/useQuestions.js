import { useState, useEffect } from 'react'
import { supabase } from './supabase'

/**
 * Fetches questions from the DB filtered by subject and difficulty.
 * subject: 'Todas' means no subject filter.
 * difficulty: 'Todas' means no difficulty filter.
 * Returns { questions, loading, error }
 * Each question has the same shape as the old QUESTION_BANK entries:
 *   { id, q, options, correct, subject, difficulty }
 */
export function useQuestions({ subject = 'Todas', difficulty = 'Todas' } = {}) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    let query = supabase.from('questions').select('*')
    if (subject && subject !== 'Todas') query = query.eq('subject', subject)
    if (difficulty && difficulty !== 'Todas') query = query.eq('difficulty', difficulty)

    query.then(({ data, error: err }) => {
      if (cancelled) return
      if (err) { setError(err.message); setLoading(false); return }
      // Normalise to the shape the game uses
      setQuestions(
        (data ?? []).map((row) => ({
          id: row.id,
          q: row.question,
          options: row.options,
          correct: row.correct_index,
          subject: row.subject,
          difficulty: row.difficulty,
        }))
      )
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [subject, difficulty])

  return { questions, loading, error }
}
