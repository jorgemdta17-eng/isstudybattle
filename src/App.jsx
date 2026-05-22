import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import AppShell from './components/AppShell'
import Landing from './screens/Landing'
import Onboarding from './screens/Onboarding'
import Dashboard from './screens/Dashboard'
import Battle from './screens/Battle'
import Live from './screens/Live'
import Tutor from './screens/Tutor'
import Library from './screens/Library'
import Leaderboard from './screens/Leaderboard'
import Profile from './screens/Profile'

// Pantallas que viven DENTRO del shell de la app (con sidebar / bottom nav)
const IN_APP = {
  dashboard: Dashboard,
  battle: Battle,
  live: Live,
  tutor: Tutor,
  library: Library,
  leaderboard: Leaderboard,
  profile: Profile,
}

export default function App() {
  // 'landing' | 'onboarding' | <id de pantalla interna>
  const [screen, setScreen] = useState('landing')

  const navigate = (next) => {
    setScreen(next)
    // al cambiar de sección, volvemos arriba
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }

  if (screen === 'landing') {
    return <Landing onStart={() => navigate('onboarding')} onNavigate={navigate} />
  }

  if (screen === 'onboarding') {
    return <Onboarding onFinish={() => navigate('dashboard')} />
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
