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

const IN_APP = {
  dashboard: Dashboard,
  battle: Battle,
  live: Live,
  tutor: Tutor,
  library: Library,
  leaderboard: Leaderboard,
  profile: Profile,
}

function AppRouter() {
  const { user, profile } = useAuth()
  const [screen, setScreen] = useState('landing')
  const [hasOnboarded, setHasOnboarded] = useState(false)

  const navigate = (next) => {
    setScreen(next)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }

  // Still resolving auth session
  if (user === undefined) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-bolt-400" />
      </div>
    )
  }

  // Not logged in: show landing or auth
  if (!user) {
    if (screen === 'auth') return <Auth />
    return <Landing onStart={() => navigate('auth')} onNavigate={navigate} />
  }

  // Logged in but hasn't completed onboarding this session
  if (!hasOnboarded && screen === 'landing') {
    return (
      <Onboarding
        onFinish={() => {
          setHasOnboarded(true)
          navigate('dashboard')
        }}
      />
    )
  }

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
