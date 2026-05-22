import { motion } from 'framer-motion'
import {
  Home,
  Swords,
  Radio,
  Brain,
  Library,
  Trophy,
  User,
  Flame,
  Coins,
  Zap,
} from 'lucide-react'
import BoltLogo from './BoltLogo'
import { Avatar } from './UI'
import { CURRENT_USER } from '../data/mock'

export const NAV = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'battle', label: 'Battle', icon: Swords },
  { id: 'live', label: 'Live', icon: Radio, live: true },
  { id: 'tutor', label: 'Tutor', icon: Brain },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'leaderboard', label: 'Ranking', icon: Trophy },
  { id: 'profile', label: 'Profile', icon: User },
]

export default function AppShell({ screen, onNavigate, children }) {
  return (
    <div className="relative flex min-h-screen bg-ink-900 text-white grain">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 z-30 hidden h-screen w-[248px] shrink-0 flex-col border-r border-white/8 bg-ink-800/60 px-4 py-6 backdrop-blur-xl lg:flex">
        <button
          onClick={() => onNavigate('landing')}
          className="mb-8 flex items-center gap-3 px-2"
        >
          <BoltLogo size={40} />
          <div className="text-left leading-none">
            <div className="font-display text-lg font-bold">StudyBattle</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
              Study · Battle · Level Up
            </div>
          </div>
        </button>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const Active = screen === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                  Active
                    ? 'bg-white/10 text-white'
                    : 'text-white/55 hover:bg-white/5 hover:text-white'
                }`}
              >
                {Active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute left-0 top-1/2 h-6 -translate-y-1/2 rounded-full bg-gradient-to-b from-bolt-400 to-plasma-500"
                    style={{ width: 3 }}
                  />
                )}
                <Icon
                  size={19}
                  className={item.live && !Active ? 'text-ember-400' : ''}
                />
                <span>{item.label}</span>
                {item.live && (
                  <span className="ml-auto flex h-2 w-2 items-center justify-center">
                    <span className="absolute h-2 w-2 animate-ping rounded-full bg-ember-500" />
                    <span className="h-2 w-2 rounded-full bg-ember-500" />
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Tarjeta Plus */}
        <div className="mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-spark-500/20 to-plasma-500/20 p-px">
          <div className="rounded-2xl bg-ink-800/80 p-4">
            <div className="flex items-center gap-2 text-spark-300">
              <Zap size={16} className="fill-spark-400 text-spark-400" />
              <span className="font-display text-sm font-bold">StudyBattle Plus</span>
            </div>
            <p className="mt-1 text-[11px] text-white/50">
              IA ilimitada, ranked sin límite y cosméticos exclusivos.
            </p>
            <button
              onClick={() => onNavigate('profile')}
              className="btn-gold mt-3 w-full rounded-xl py-2 text-xs font-bold"
            >
              Probar Plus
            </button>
          </div>
        </div>
      </aside>

      {/* Columna principal */}
      <div className="relative z-10 flex min-h-screen flex-1 flex-col">
        <TopBar onNavigate={onNavigate} />
        <main className="relative flex-1 pb-24 lg:pb-8">{children}</main>
      </div>

      {/* Bottom nav móvil */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-white/10 bg-ink-800/90 px-2 py-2 backdrop-blur-xl lg:hidden">
        {NAV.filter((n) => ['dashboard', 'battle', 'live', 'tutor', 'profile'].includes(n.id)).map(
          (item) => {
            const Active = screen === item.id
            const Icon = item.icon
            if (item.live) {
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="relative -mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-ember-500 to-ember-400 shadow-[0_8px_30px_-6px_rgba(244,63,94,0.8)]"
                >
                  <span className="absolute inset-0 animate-pulse-ring rounded-2xl border-2 border-ember-400" />
                  <Icon size={24} className="relative" />
                </button>
              )
            }
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-semibold ${
                  Active ? 'text-bolt-300' : 'text-white/45'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            )
          }
        )}
      </nav>
    </div>
  )
}

function TopBar({ onNavigate }) {
  const u = CURRENT_USER
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/8 bg-ink-900/70 px-4 py-3 backdrop-blur-xl lg:px-8">
      <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 lg:hidden">
        <BoltLogo size={32} />
        <span className="font-display text-base font-bold">StudyBattle</span>
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-2 sm:gap-3">
        <Stat icon={Flame} value={u.streak} color="text-ember-400" label="racha" />
        <Stat icon={Zap} value={u.xp.toLocaleString('es')} color="text-bolt-300" label="XP" />
        <Stat icon={Coins} value={u.coins.toLocaleString('es')} color="text-spark-400" label="monedas" />
        <button onClick={() => onNavigate('profile')} className="ml-1">
          <Avatar initials={u.initials} gradient={u.avatarColor} size={38} />
        </button>
      </div>
    </header>
  )
}

function Stat({ icon: Icon, value, color, label }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1.5 ring-1 ring-white/10">
      <Icon size={15} className={color} />
      <span className="text-sm font-bold nums">{value}</span>
      <span className="hidden text-[10px] uppercase tracking-wide text-white/40 sm:inline">
        {label}
      </span>
    </div>
  )
}
