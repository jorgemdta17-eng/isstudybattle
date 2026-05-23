import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Zap, Target, Trophy, Crown, Check, Lock, Sparkles } from 'lucide-react'
import { Aurora, Card, Chip, ProgressBar, Avatar } from '../components/UI'
import BoltLogo from '../components/BoltLogo'
import { BADGES, COSMETICS, RANKS, rankColor } from '../data/mock'
import { useAuth } from '../context/AuthContext'

function getRank(xp) {
  let rank = RANKS[0]
  for (const r of RANKS) { if (xp >= r.min) rank = r }
  return rank
}
function getLevel(xp) { return Math.max(1, Math.floor(xp / 300) + 1) }
function getXpToNext(xp) { return getLevel(xp) * 300 }
function getInitials(name) {
  return (name || '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?'
}

export default function Profile() {
  const { profile } = useAuth()
  const xp = profile?.xp ?? 0
  const streak = profile?.streak ?? 0
  const coins = profile?.coins ?? 0
  const name = profile?.name ?? 'Jugador'
  const rank = getRank(xp)
  const level = getLevel(xp)
  const xpToNext = getXpToNext(xp)
  const initials = getInitials(name)
  const [tab, setTab] = useState('badges')

  const battlesPlayed = profile?.battles_played ?? 0
  const battlesWon = profile?.battles_won ?? 0
  const winRate = battlesPlayed > 0 ? Math.round((battlesWon / battlesPlayed) * 100) : 0

  const stats = [
    { icon: Zap, label: 'XP total', value: xp.toLocaleString('es'), color: 'text-bolt-300' },
    { icon: Flame, label: 'Racha', value: `${streak} días`, color: 'text-ember-400' },
    { icon: Target, label: 'Win rate', value: `${winRate}%`, color: 'text-toxic-400' },
    { icon: Trophy, label: 'Victorias', value: battlesWon.toString(), color: 'text-spark-400' },
  ]

  return (
    <div className="relative min-h-full">
      <Aurora className="opacity-50" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-7 sm:px-8">
        {/* cabecera de perfil */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="relative overflow-hidden p-7">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-plasma-500/20 blur-[90px]" />
            <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <div className="relative">
                <Avatar initials={initials} gradient="from-bolt-500 to-plasma-500" size={88} />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-ink-700 px-2 py-0.5 text-xs font-bold ring-1 ring-white/10 nums">
                  Lv {level}
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="font-display text-2xl font-bold">{name}</h1>
                </div>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="font-bold" style={{ color: rank.color }}>{rank.name}</span>
                  <span className="text-white/30">·</span>
                  <span className="text-sm text-white/50">{battlesPlayed} batallas jugadas</span>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex justify-between text-xs text-white/50">
                    <span>Nivel {level}</span>
                    <span className="nums">{xp.toLocaleString('es')} / {xpToNext.toLocaleString('es')} XP</span>
                  </div>
                  <ProgressBar value={xp} total={xpToNext} color="plasma" height={12} />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* stats */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4 text-center">
                <s.icon size={20} className={`mx-auto ${s.color}`} />
                <div className={`mt-1.5 font-display text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[10px] uppercase tracking-wide text-white/40">{s.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* progresión de rangos */}
        <Card className="mt-5 p-6">
          <h3 className="mb-5 font-display text-sm font-bold uppercase tracking-wider text-white/50">
            Progresión de rango
          </h3>
          <div className="flex items-center justify-between">
            {RANKS.map((r, i) => {
              const reached = xp >= r.min
              const current = rank.name === r.name
              return (
                <div key={r.name} className="flex flex-1 flex-col items-center">
                  <div className="flex w-full items-center">
                    {i > 0 && (
                      <div className={`h-0.5 flex-1 ${reached ? 'bg-bolt-500' : 'bg-white/10'}`} />
                    )}
                    <div
                      className={`grid h-9 w-9 place-items-center rounded-full text-xs font-bold ring-2 ${
                        current ? 'ring-spark-400' : 'ring-transparent'
                      }`}
                      style={{
                        background: reached ? r.color : 'rgba(255,255,255,0.07)',
                        color: reached ? '#05060f' : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {reached ? <Crown size={15} /> : <Lock size={13} />}
                    </div>
                    {i < RANKS.length - 1 && (
                      <div className={`h-0.5 flex-1 ${xp >= RANKS[i + 1].min ? 'bg-bolt-500' : 'bg-white/10'}`} />
                    )}
                  </div>
                  <div className={`mt-2 text-center text-[10px] font-semibold ${current ? 'text-spark-400' : 'text-white/40'}`}>
                    {r.name}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* tabs badges / cosméticos */}
        <div className="mt-6 flex gap-2">
          {[
            ['badges', 'Badges'],
            ['cosmetics', 'Cosméticos'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === id ? 'btn-spark' : 'bg-white/5 text-white/60 ring-1 ring-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'badges' ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BADGES.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`p-4 text-center ${!b.owned ? 'opacity-50' : ''}`}>
                  <div className="text-3xl">{b.owned ? b.icon : '🔒'}</div>
                  <div className="mt-2 text-sm font-bold">{b.name}</div>
                  <div className="text-[11px] text-white/45">{b.desc}</div>
                  <div className="mt-2">
                    <RarityChip rarity={b.rarity} />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {COSMETICS.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={`p-4 text-center ${c.equipped ? `ring-1 ring-${c.color}-500/50` : ''}`}>
                  <div className="text-3xl">{c.icon}</div>
                  <div className="mt-2 text-sm font-bold">{c.name}</div>
                  <Chip color={c.color} className="mt-1">{c.type}</Chip>
                  <button
                    className={`mt-3 w-full rounded-xl py-1.5 text-xs font-bold ${
                      c.equipped
                        ? 'bg-toxic-500/20 text-toxic-400 ring-1 ring-toxic-500/30'
                        : 'bg-white/5 text-white/60 ring-1 ring-white/10 hover:bg-white/10'
                    }`}
                  >
                    {c.equipped ? (
                      <span className="flex items-center justify-center gap-1"><Check size={12} /> Equipado</span>
                    ) : (
                      'Equipar'
                    )}
                  </button>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Plus */}
        <div className="mt-7 overflow-hidden rounded-3xl bg-gradient-to-br from-spark-500/20 via-plasma-500/15 to-bolt-500/20 p-px">
          <div className="rounded-3xl bg-ink-800/80 p-7 text-center">
            <Sparkles size={28} className="mx-auto text-spark-400" />
            <h3 className="mt-3 font-display text-2xl font-bold">StudyBattle Plus</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/55">
              IA ilimitada, ranked sin límites, estadísticas avanzadas, revives en torneos y
              cosméticos exclusivos.
            </p>
            <button className="btn-gold mx-auto mt-5 rounded-2xl px-8 py-3 font-bold">
              Hazte Plus
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function RarityChip({ rarity }) {
  const map = {
    común: 'text-white/50 bg-white/5',
    raro: 'text-bolt-300 bg-bolt-500/15',
    épico: 'text-plasma-400 bg-plasma-500/15',
    legendario: 'text-spark-400 bg-spark-500/15',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${map[rarity]}`}>
      {rarity}
    </span>
  )
}
