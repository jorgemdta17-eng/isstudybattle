import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame, Zap, Loader } from 'lucide-react'
import { Aurora, Card, Chip, Avatar } from '../components/UI'
import { RANKS, rankColor } from '../data/mock'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function getLevel(xp) {
  return Math.max(1, Math.floor(xp / 300) + 1)
}

function getRankName(xp) {
  let rank = RANKS[0]
  for (const r of RANKS) {
    if (xp >= r.min) rank = r
  }
  return rank.name
}

function getInitials(name) {
  return (name || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const PODIUM_GRADS = {
  1: 'from-spark-400 to-spark-600',
  2: 'from-slate-300 to-slate-500',
  3: 'from-amber-600 to-amber-800',
}
const PODIUM_MEDALS = ['🥈', '🥇', '🥉']
const PODIUM_ORDER = [1, 0, 2] // positions in the visual podium (2nd, 1st, 3rd)

export default function Leaderboard() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, xp, streak')
        .order('xp', { ascending: false })

      if (data) {
        const enriched = data.map((p, i) => ({
          pos: i + 1,
          id: p.id,
          name: p.name || 'Anónimo',
          xp: p.xp ?? 0,
          streak: p.streak ?? 0,
          rank: getRankName(p.xp ?? 0),
          level: getLevel(p.xp ?? 0),
          you: p.id === user?.id,
        }))
        setRows(enriched)
      }
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader size={32} className="animate-spin text-white/30" />
      </div>
    )
  }

  const podium = rows.slice(0, Math.min(3, rows.length))
  const rest = rows.slice(3)
  const youInRest = rows.find((r) => r.you && r.pos > 3)

  // Build podium display: always [2nd,1st,3rd] order but only what exists
  const podiumDisplay = PODIUM_ORDER.map((i) => podium[i]).filter(Boolean)

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
            <p className="text-sm text-white/50">{rows.length} jugadores · ordenados por XP</p>
          </div>
        </div>

        {rows.length === 0 ? (
          <Card className="py-16 text-center text-white/40">
            Aún no hay jugadores en el ranking.
          </Card>
        ) : (
          <>
            {/* Podio */}
            {podiumDisplay.length > 0 && (
              <div
                className={`mb-6 grid items-end gap-3 ${
                  podiumDisplay.length === 1
                    ? 'grid-cols-1 max-w-xs mx-auto'
                    : podiumDisplay.length === 2
                    ? 'grid-cols-2 max-w-sm mx-auto'
                    : 'grid-cols-3'
                }`}
              >
                {podiumDisplay.map((p, idx) => {
                  const medal = PODIUM_MEDALS[PODIUM_ORDER[idx]]
                  const grad = PODIUM_GRADS[p.pos] ?? 'from-bolt-500 to-plasma-500'
                  const h = p.pos === 1 ? 'h-32' : p.pos === 2 ? 'h-24' : 'h-20'
                  const avatarSize = p.pos === 1 ? 56 : 46
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex flex-col items-center ${p.you ? 'ring-2 ring-bolt-400 rounded-2xl pb-2' : ''}`}
                    >
                      <div className="text-3xl">{medal}</div>
                      <Avatar initials={getInitials(p.name)} gradient={grad} size={avatarSize} />
                      <div className="mt-2 max-w-full truncate text-sm font-bold">
                        {p.name} {p.you && <span className="text-bolt-300">(tú)</span>}
                      </div>
                      <div className="text-xs font-semibold" style={{ color: rankColor(p.rank) }}>
                        {p.rank}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/50 nums">
                        <Zap size={11} className="text-bolt-300" />
                        {p.xp.toLocaleString('es')}
                      </div>
                      <div className={`mt-2 w-full rounded-t-xl bg-gradient-to-t ${grad} ${h}`} />
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Lista posiciones 4+ */}
            {rest.length > 0 && (
              <Card className="divide-y divide-white/5 p-2">
                {rest.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 ${
                      r.you ? 'bg-bolt-500/15 ring-1 ring-bolt-500/40' : ''
                    }`}
                  >
                    <span className="w-9 text-center font-display font-bold nums text-white/50">
                      #{r.pos}
                    </span>
                    <Avatar
                      initials={getInitials(r.name)}
                      gradient="from-bolt-500 to-plasma-500"
                      size={38}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold">
                        {r.name} {r.you && <span className="text-bolt-300">(tú)</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white/45">
                        <span>Nivel {r.level}</span>
                        <span className="flex items-center gap-0.5">
                          <Flame size={11} className="text-ember-400" /> {r.streak}
                        </span>
                      </div>
                    </div>
                    <Chip color="spark" className="hidden sm:inline-flex">
                      {r.rank}
                    </Chip>
                    <div
                      className="flex items-center gap-1 text-sm font-bold nums"
                      style={{ color: rankColor(r.rank) }}
                    >
                      <Zap size={13} /> {r.xp.toLocaleString('es')}
                    </div>
                  </motion.div>
                ))}
              </Card>
            )}

            {/* Si el usuario está en el podio pero la lista está vacía, no mostramos nada extra */}
            {/* Si hay pocos jugadores (todos en podio, ninguno en rest) y el usuario está en podio: ok */}

            {/* Nota de posición si el usuario está en el podio */}
            {!youInRest && rows.find((r) => r.you)?.pos <= 3 && rest.length > 0 && (
              <p className="mt-3 text-center text-xs text-white/35">
                Tu posición: #{rows.find((r) => r.you)?.pos}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
