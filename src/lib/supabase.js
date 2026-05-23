import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// XP thresholds must match mock.js RANKS
const RANK_THRESHOLDS = [
  { name: 'Grand Champion', min: 15000 },
  { name: 'Legend', min: 8000 },
  { name: 'Scholar', min: 4000 },
  { name: 'Challenger', min: 1500 },
  { name: 'Rookie', min: 0 },
]

function computeRank(xp) {
  return (RANK_THRESHOLDS.find((r) => xp >= r.min) ?? RANK_THRESHOLDS.at(-1)).name
}

function computeLevel(xp) {
  return Math.max(1, Math.floor(xp / 300) + 1)
}

/**
 * Called when a battle ends. Adds xpGained to the user's profile,
 * recalculates level and rank, increments battles_played, and
 * increments battles_won if the accuracy was >= 60%.
 *
 * Returns the updated profile row, or throws on error.
 */
export async function saveBattleResult(userId, { xpGained, won }) {
  // 1. Fetch current profile
  const { data: current, error: fetchErr } = await supabase
    .from('profiles')
    .select('xp, battles_played, battles_won')
    .eq('id', userId)
    .maybeSingle()

  if (fetchErr) throw fetchErr
  if (!current) throw new Error('Perfil no encontrado')

  // 2. Compute new values
  const newXp = (current.xp ?? 0) + xpGained
  const newLevel = computeLevel(newXp)
  const newRank = computeRank(newXp)
  const newPlayed = (current.battles_played ?? 0) + 1
  const newWon = (current.battles_won ?? 0) + (won ? 1 : 0)

  // 3. Save
  const { data: updated, error: updateErr } = await supabase
    .from('profiles')
    .update({
      xp: newXp,
      level: newLevel,
      rank: newRank,
      battles_played: newPlayed,
      battles_won: newWon,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .maybeSingle()

  if (updateErr) throw updateErr
  return updated
}
