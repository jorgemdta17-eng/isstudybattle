import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

// Returns today's date as a YYYY-MM-DD string in local time
function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Computes the new streak given the last recorded activity date and current streak
function computeStreak(lastActivityDate, currentStreak) {
  const today = todayStr()
  if (!lastActivityDate) return { streak: 1, last_activity_date: today }
  if (lastActivityDate === today) return null // same day, no change

  const last = new Date(lastActivityDate)
  const now = new Date(today)
  const diffDays = Math.round((now - last) / 86400000)

  if (diffDays === 1) return { streak: (currentStreak ?? 0) + 1, last_activity_date: today }
  return { streak: 1, last_activity_date: today } // gap — reset
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading
  const [profile, setProfile] = useState(null)

  async function fetchAndUpdateStreak(userId) {
    let { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    // If the profile row is missing (e.g. interrupted signup), create it now
    if (!data) {
      const { data: created } = await supabase
        .from('profiles')
        .insert({ id: userId })
        .select()
        .maybeSingle()
      data = created
    }

    if (!data) { setProfile(null); return }

    const update = computeStreak(data.last_activity_date, data.streak)
    if (update) {
      const { data: updated } = await supabase
        .from('profiles')
        .update(update)
        .eq('id', userId)
        .select()
        .maybeSingle()
      setProfile(updated ?? { ...data, ...update })
    } else {
      setProfile(data)
    }
  }

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    setProfile(data)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchAndUpdateStreak(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        // On SIGNED_IN update streak; on TOKEN_REFRESH just reload profile
        if (event === 'SIGNED_IN') {
          ;(async () => { await fetchAndUpdateStreak(session.user.id) })()
        } else {
          ;(async () => { await fetchProfile(session.user.id) })()
        }
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email, password, name) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    return { data, error }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, profile, signUp, signIn, signInWithGoogle, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
