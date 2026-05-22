import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Globe, Users, GraduationCap, Flame, Zap } from 'lucide-react'
import { Aurora, Card, Chip, Avatar } from '../components/UI'
import { LEADERBOARD, rankColor } from '../data/mock'

const TABS = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'friends', label: 'Amigos', icon: Users },
  { id: 'uni', label: 'Universidad', icon: GraduationCap },
  { id: 'season', label: 'Temporada', icon: Trophy },
]

export default function Leaderboard() {
  const [tab, setTab] = useState('global')
  const data = LEADERBOARD
  const podium = data.slice(0, 3)
  const rest = data.filter((r) => r.pos > 3)

  return (
    <div className="relative min-h-full">
      <Aurora className="opacity-50" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-7 sm:px-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-spark-500/15 ring-1 ring-spark-500/30">
            <Trophy size={22} className="text-spark-400" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold">Rankings</h1>
            <p className="text-sm text-white/50">Temporada 3 · termina en 12 días</p>
          </div>
        </div>

        {/* tabs */}
        <div className="mb-7 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.id ? 'btn-spark' : 'bg-white/5 text-white/60 ring-1 ring-white/10 hover:text-white'
              }`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {/* podio */}
        <div className="mb-6 grid grid-cols-3 items-end gap-3">
          {[podium[1], podium[0], podium[2]].map((p, idx) => {
            const place = p.pos
            const h = place === 1 ? 'h-32' : place === 2 ? 'h-24' : 'h-20'
            const grads = {
              1: 'from-spark-400 to-spark-600',
              2: 'from-slate-300 to-slate-500',
              3: 'from-amber-600 to-amber-800',
            }
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-3xl">{['🥈', '🥇', '🥉'][idx]}</div>
                <Avatar
                  initials={p.name.slice(0, 2).toUpperCase()}
                  gradient={grads[place]}
                  size={place === 1 ? 56 : 46}
                />
                <div className="mt-2 max-w-full truncate text-sm font-bold">{p.name}</div>
                <div className="text-xs nums" style={{ color: rankColor(p.rank) }}>
                  {p.xp.toLocaleString('es')}
                </div>
                <div className={`mt-2 w-full rounded-t-xl bg-gradient-to-t ${grads[place]} ${h}`} />
              </motion.div>
            )
          })}
        </div>

        {/* lista */}
        <Card className="divide-y divide-white/5 p-2">
          {rest.map((r, i) => (
            <motion.div
              key={r.pos}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
                r.you ? 'bg-bolt-500/15 ring-1 ring-bolt-500/40' : ''
              }`}
            >
              <span className="w-9 text-center font-display font-bold nums text-white/50">#{r.pos}</span>
              <Avatar initials={r.name.slice(0, 2).toUpperCase()} gradient="from-bolt-500 to-plasma-500" size={38} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-bold">
                  {r.name} {r.you && <span className="text-bolt-300">(tú)</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/45">
                  <span>{r.uni}</span>
                  <span className="flex items-center gap-0.5"><Flame size={11} className="text-ember-400" /> {r.streak}</span>
                </div>
              </div>
              <Chip color="spark" className="hidden sm:inline-flex">{r.rank}</Chip>
              <div className="flex items-center gap-1 text-sm font-bold nums" style={{ color: rankColor(r.rank) }}>
                <Zap size={13} /> {r.xp.toLocaleString('es')}
              </div>
            </motion.div>
          ))}
        </Card>
      </div>
    </div>
  )
}
