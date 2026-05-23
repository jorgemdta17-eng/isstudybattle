import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { AuthProvider, useAuth } from './context/AuthContext'
import AppShell from './components/AppShell'
import Landing from './screens/Landing'
import Auth from './screens/Auth'
import Onboarding from './screens/Onboarding'
import Dashboard from './screens/Dashboard'
import Battle from './screens/Battle'
import Live from './screens/Live'
import Tutor from './screens/Tutor'
import Library from './screens/Library'
import Leaderboard from './screens/Leaderboard'
import Profile from './screens/Profile'
import QuestionManager from './screens/QuestionManager'
import { supabase } from './lib/supabase'

const IN_APP = {
  dashboard: Dashboard,
  battle: Battle,
  live: Live,
  tutor: Tutor,
  library: Library,
  leaderboard: Leaderboard,
  profile: Profile,
  questions: QuestionManager,
}

function AppRouter() {
  const { user, profile, refreshProfile } = useAuth()
  const [screen, setScreen] = useState('dashboard')
  const [authScreen, setAuthScreen] = useState('landing') // 'landing' | 'auth'

  const navigate = (next) => {
    setScreen(next)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }

  // Still resolving auth session or waiting for profile to load
  if (user === undefined || (user && profile === null)) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-bolt-400" />
      </div>
    )
  }

  // Not logged in
  if (!user) {
    if (authScreen === 'auth') return <Auth />
    return <Landing onStart={() => setAuthScreen('auth')} onNavigate={(s) => setAuthScreen(s)} />
  }

  // Logged in but onboarding not yet completed
  if (!profile?.onboarding_completed) {
    async function handleOnboardingFinish() {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)
      // Refresh profile in context so the guard above flips on next render
      await refreshProfile()
      navigate('dashboard')
    }
    return <Onboarding onFinish={handleOnboardingFinish} />
  }

  // Fully authenticated and onboarded — render the main app
  const ScreenComp = IN_APP[screen] ?? Dashboard

  return (
    <AppShell screen={screen} onNavigate={navigate}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="min-h-full"
        >
          <ScreenComp onNavigate={navigate} />
        </motion.div>
      </AnimatePresence>
    </AppShell>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}
