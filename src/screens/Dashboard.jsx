import { motion } from 'framer-motion'
import {
  Swords,
  Brain,
  Upload,
  Zap,
  Radio,
  Flame,
  Check,
  ChevronRight,
  Coins,
  TrendingUp,
} from 'lucide-react'
import { Aurora, Card, Chip, Countdown, CountUp, ProgressBar, Avatar } from '../components/UI'
import BoltLogo from '../components/BoltLogo'
import { useAuth } from '../context/AuthContext'
import {
  DAILY_MISSIONS,
  LEADERBOARD,
  LIVE_EVENTS,
  RANKS,
  rankColor,
} from '../data/mock'

function getInitials(name) {
  return (name || '')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'
}

function getRank(xp) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (xp >= r.min) rank = r
  }
  return rank
}

function getLevel(xp) {
  return Math.max(1, Math.floor(xp / 300) + 1)
}

function getXpToNext(xp) {
  const level = getLevel(xp)
  return level * 300
}

export default function Dashboard({ onNavigate }) {
  const { profile } = useAuth()

  const name = profile?.name ?? 'Jugador'
  const xp = profile?.xp ?? 0
  const streak = profile?.streak ?? 0
  const coins = profile?.coins ?? 0
  const rank = getRank(xp)
  const level = getLevel(xp)
  const xpToNext = getXpToNext(xp)
  const initials = getInitials(name)

  const featured = LIVE_EVENTS.find((e) => e.featured)
  const top = LEADERBOARD.slice(0, 4)
  const you = LEADERBOARD.find((r) => r.you)

  const QUICK = [
    { id: 'battle', label: 'Start Battle', icon: Swords, color: 'spark', sub: 'Entrena ahora' },
    { id: 'tutor', label: 'Study with AI', icon: Brain, color: 'bolt', sub: 'Aprende rápido' },
    { id: 'library', label: 'Upload Notes', icon: Upload, color: 'plasma', sub: 'Sube apuntes' },
    { id: 'battle', label: 'Daily Blitz', icon: Zap, color: 'toxic', sub: '60 seg de XP' },
  ]

  return (
    <div className="relative">
      <Aurora className="opacity-60" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-8 lg:py-8">
        {/* saludo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-end justify-between"
        >
          <div>
            <p className="text-sm text-white/50">¡Hola de nuevo,</p>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              {name.split(' ')[0]} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-ember-500/15 px-4 py-2 ring-1 ring-ember-500/30">
            <Flame size={20} className="text-ember-400" />
            <div className="leading-none">
              <div className="font-display text-xl font-bold">{streak}</div>
              <div className="text-[10px] uppercase tracking-wide text-ember-300/80">días</div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Columna principal */}
          <div className="space-y-5 lg:col-span-2">
            {/* Evento Live destacado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="relative overflow-hidden p-0">
                <div className="absolute inset-0 bg-gradient-to-br from-ember-600/30 via-plasma-600/15 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-1 live-ring" />
                <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Chip color="ember">
                        <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-ember-500" />
                        PRÓXIMO LIVE
                      </Chip>
                    </div>
                    <h2 className="mt-3 font-display text-2xl font-bold">{featured.name}</h2>
                    <p className="mt-1 text-sm text-white/60">
                      <CountUp to={featured.players} className="font-bold text-white" /> jugadores ·{' '}
                      <span className="text-spark-400">{featured.prize}</span>
                    </p>
                    <Countdown seconds={featured.startsInSec} size="md" className="mt-3" />
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <BoltLogo size={72} className="animate-floaty" />
                    <button
                      onClick={() => onNavigate('live')}
                      className="btn-gold flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold"
                    >
                      <Radio size={16} /> Entrar al torneo
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick actions */}
            <div>
              <SectionLabel>Acciones rápidas</SectionLabel>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {QUICK.map((q, i) => (
                  <motion.button
                    key={q.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => onNavigate(q.id)}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:-translate-y-1 hover:border-white/25"
                  >
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl bg-${q.color}-500/15 ring-1 ring-${q.color}-500/30`}
                    >
                      <q.icon size={18} className={`text-${q.color}-400`} />
                    </span>
                    <div className="mt-3 font-display text-sm font-bold">{q.label}</div>
                    <div className="text-[11px] text-white/45">{q.sub}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Misiones diarias */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <SectionLabel noMargin>Misiones diarias</SectionLabel>
                <span className="text-xs text-white/40">
                  {DAILY_MISSIONS.filter((m) => m.done).length}/{DAILY_MISSIONS.length} completadas
                </span>
              </div>
              <Card className="divide-y divide-white/5 p-2">
                {DAILY_MISSIONS.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                        m.done ? 'bg-toxic-500/20 text-toxic-400' : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {m.done ? <Check size={16} /> : <span className="text-xs font-bold nums">{m.progress}/{m.total}</span>}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className={`truncate text-sm font-semibold ${m.done ? 'text-white/50 line-through' : ''}`}>
                        {m.title}
                      </div>
                      {!m.done && (
                        <div className="mt-1.5">
                          <ProgressBar value={m.progress} total={m.total} height={5} color="bolt" />
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-sm font-bold">
                      {m.type === 'xp' && <Zap size={14} className="text-bolt-300" />}
                      {m.type === 'coins' && <Coins size={14} className="text-spark-400" />}
                      {m.type === 'streak' && <Flame size={14} className="text-ember-400" />}
                      <span className="nums">{m.type === 'streak' ? '+1' : `+${m.reward}`}</span>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* Columna lateral */}
          <div className="space-y-5">
            {/* Perfil rápido + XP */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <Avatar initials={initials} gradient="from-bolt-500 to-plasma-500" size={52} />
                  <div>
                    <div className="font-display text-lg font-bold leading-none">{name}</div>
                    <div
                      className="mt-1 text-sm font-bold"
                      style={{ color: rank.color }}
                    >
                      {rank.name}
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-[10px] uppercase tracking-wide text-white/40">Nivel</div>
                    <div className="font-display text-2xl font-bold text-gradient-cool">{level}</div>
                  </div>
                </div>
                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-xs text-white/50">
                    <span>XP del nivel</span>
                    <span className="nums">{xp.toLocaleString('es')} / {xpToNext.toLocaleString('es')}</span>
                  </div>
                  <ProgressBar value={xp} total={xpToNext} color="plasma" height={12} />
                </div>
              </Card>
            </motion.div>

            {/* Rankings preview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-display font-bold">
                    <TrendingUp size={18} className="text-spark-400" /> Ranking global
                  </div>
                  <button
                    onClick={() => onNavigate('leaderboard')}
                    className="flex items-center gap-1 text-xs font-semibold text-bolt-300 hover:text-bolt-200"
                  >
                    Ver todo <ChevronRight size={14} />
                  </button>
                </div>
                <div className="space-y-2">
                  {top.map((r) => (
                    <RankRow key={r.pos} r={r} />
                  ))}
                  <div className="my-2 text-center text-xs text-white/30">· · ·</div>
                  <RankRow r={you} />
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children, noMargin }) {
  return (
    <h3 className={`font-display text-sm font-bold uppercase tracking-wider text-white/50 ${noMargin ? '' : 'mb-2'}`}>
      {children}
    </h3>
  )
}

function RankRow({ r }) {
  const medal = ['🥇', '🥈', '🥉']
  return (
    <div
      className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
        r.you ? 'bg-bolt-500/15 ring-1 ring-bolt-500/40' : ''
      }`}
    >
      <span className="w-7 text-center text-sm font-bold nums text-white/60">
        {r.pos <= 3 ? medal[r.pos - 1] : `#${r.pos}`}
      </span>
      <span className="flex-1 truncate text-sm font-semibold">
        {r.name} {r.you && <span className="text-bolt-300">(tú)</span>}
      </span>
      <span className="text-xs font-bold nums" style={{ color: rankColor(r.rank) }}>
        {r.xp.toLocaleString('es')}
      </span>
    </div>
  )
}
