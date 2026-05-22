import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radio,
  Users,
  Trophy,
  Crown,
  Zap,
  Flame,
  Skull,
  MessageCircle,
  Check,
  X,
} from 'lucide-react'
import { Aurora, Card, Chip, Countdown, CountUp } from '../components/UI'
import BoltLogo from '../components/BoltLogo'
import { LIVE_EVENTS, QUESTION_BANK } from '../data/mock'

export default function Live() {
  const [inTournament, setInTournament] = useState(false)
  if (inTournament) return <Tournament onExit={() => setInTournament(false)} />
  return <Hub onJoin={() => setInTournament(true)} />
}

/* ---------- HUB ---------- */
function Hub({ onJoin }) {
  const featured = LIVE_EVENTS.find((e) => e.featured)
  const rest = LIVE_EVENTS.filter((e) => !e.featured)
  const accentBg = {
    spark: 'from-spark-500/20',
    bolt: 'from-bolt-500/20',
    plasma: 'from-plasma-500/20',
    ember: 'from-ember-500/20',
  }

  return (
    <div className="relative min-h-full">
      <Aurora className="opacity-70" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-7 sm:px-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-ember-500/15 ring-1 ring-ember-500/30">
            <span className="absolute inset-0 animate-pulse-ring rounded-2xl border-2 border-ember-400" />
            <Radio size={22} className="text-ember-400" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold">StudyBattle Live</h1>
            <p className="text-sm text-white/50">Miles de jugadores. Una pregunta a la vez. Eliminatorio.</p>
          </div>
        </div>

        {/* Hero del evento principal */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 p-px">
            <div className="absolute inset-0 live-ring opacity-60" />
            <div className="relative rounded-[2rem] bg-gradient-to-br from-ember-600/30 via-ink-800 to-ink-800 p-7 sm:p-10">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-ember-500/30 blur-[100px]" />
              <div className="relative flex flex-col items-center gap-6 lg:flex-row lg:justify-between">
                <div className="text-center lg:text-left">
                  <Chip color="ember" className="mb-3">{featured.tag}</Chip>
                  <h2 className="font-display text-4xl font-bold sm:text-5xl">{featured.name}</h2>
                  <div className="mt-4 flex flex-wrap justify-center gap-5 lg:justify-start">
                    <HeroStat icon={Users} value={<CountUp to={featured.players} />} label="jugadores" />
                    <HeroStat icon={Trophy} value="50.000 XP" label="premio" gold />
                    <HeroStat icon={Crown} value="Temporada 3" label="actual" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <BoltLogo size={96} className="animate-floaty" />
                  <p className="text-xs uppercase tracking-[0.25em] text-white/40">Empieza en</p>
                  <Countdown seconds={featured.startsInSec} size="xl" />
                  <button
                    onClick={onJoin}
                    className="btn-gold flex items-center gap-2 rounded-2xl px-8 py-3.5 text-base font-bold"
                  >
                    <Zap size={18} className="fill-current" /> Entrar a la sala
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Próximos eventos */}
        <h3 className="mb-3 mt-8 font-display text-sm font-bold uppercase tracking-wider text-white/50">
          Próximos eventos
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className={`relative overflow-hidden p-5 bg-gradient-to-br ${accentBg[e.accent]} to-transparent`} hover>
                <Chip color={e.accent}>{e.tag}</Chip>
                <h4 className="mt-3 font-display text-xl font-bold">{e.name}</h4>
                <div className="mt-2 flex items-center gap-2 text-xs text-white/55">
                  <Users size={13} /> <CountUp to={e.players} /> · {e.prize}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Countdown seconds={e.startsInSec} size="sm" />
                  <button
                    onClick={onJoin}
                    className={`rounded-xl bg-${e.accent}-500/20 px-4 py-2 text-xs font-bold text-${e.accent}-300 ring-1 ring-${e.accent}-500/30 hover:brightness-125`}
                  >
                    Unirse
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recompensas */}
        <h3 className="mb-3 mt-8 font-display text-sm font-bold uppercase tracking-wider text-white/50">
          Recompensas de temporada
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: '👑', name: 'Título Superviviente', t: 'Top 10' },
            { icon: '⚡', name: 'Skin Bolt Dorado', t: 'Ganar 1 torneo' },
            { icon: '🏆', name: 'Banner Campeón', t: '5 victorias' },
            { icon: '✨', name: 'Aura Legendaria', t: 'Final 4' },
          ].map((r) => (
            <Card key={r.name} className="p-4 text-center" hover>
              <div className="text-3xl">{r.icon}</div>
              <div className="mt-2 text-sm font-bold">{r.name}</div>
              <div className="text-[11px] text-white/40">{r.t}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function HeroStat({ icon: Icon, value, label, gold }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={18} className={gold ? 'text-spark-400' : 'text-bolt-300'} />
      <div className="leading-none">
        <div className="font-display text-lg font-bold">{value}</div>
        <div className="text-[10px] uppercase tracking-wide text-white/40">{label}</div>
      </div>
    </div>
  )
}

/* ---------- TORNEO EN VIVO (simulación jugable) ---------- */
function Tournament({ onExit }) {
  const [stage, setStage] = useState('queue') // queue | playing | eliminated | won
  if (stage === 'queue') return <Queue onStart={() => setStage('playing')} onExit={onExit} />
  if (stage === 'playing')
    return <LiveRound onEliminated={() => setStage('eliminated')} onWin={() => setStage('won')} />
  return <Outcome won={stage === 'won'} onExit={onExit} />
}

function Queue({ onStart, onExit }) {
  const [count, setCount] = useState(5)
  const [players, setPlayers] = useState(12847)
  useEffect(() => {
    const id = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(id)
          setTimeout(onStart, 600)
          return 0
        }
        return c - 1
      })
      setPlayers((p) => p + Math.floor(Math.random() * 40))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative grid min-h-full place-items-center">
      <Aurora className="opacity-70" />
      <div className="relative z-10 w-full max-w-md px-4 text-center">
        <button
          onClick={onExit}
          className="absolute right-4 top-0 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white/60 ring-1 ring-white/10"
        >
          Salir
        </button>
        <div className="relative mx-auto w-fit">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-ember-400" />
          <BoltLogo size={120} className="relative animate-floaty" />
        </div>
        <Chip color="ember" className="mt-6">
          <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-ember-500" /> SALA DE ESPERA
        </Chip>
        <h2 className="mt-4 font-display text-3xl font-bold">Sunday Night Battle</h2>
        <p className="mt-2 text-white/55">
          <CountUp to={players} className="font-bold text-white" /> jugadores conectados
        </p>

        <div className="mt-8">
          <div className="font-display text-7xl font-bold text-gradient nums">{count || '¡YA!'}</div>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-white/40">Comienza en</p>
        </div>

        {/* mini chat */}
        <Card className="mt-8 p-4 text-left">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-white/50">
            <MessageCircle size={13} /> Chat de sala
          </div>
          <div className="space-y-1.5 text-xs">
            {[
              ['Nova_Tan', '¡vamos allá! 🔥'],
              ['lucia_b', 'suerte a todos'],
              ['kenji.dev', 'season 3 is mine 👑'],
            ].map(([n, m], i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
              >
                <span className="font-bold text-bolt-300">{n}:</span>{' '}
                <span className="text-white/60">{m}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function LiveRound({ onEliminated, onWin }) {
  const TIME = 8
  const questions = useRef([...QUESTION_BANK].sort(() => Math.random() - 0.5)).current
  const [round, setRound] = useState(1)
  const [alive, setAlive] = useState(12847)
  const [time, setTime] = useState(TIME)
  const [picked, setPicked] = useState(null)
  const locked = picked !== null
  const totalRounds = 7
  const q = questions[(round - 1) % questions.length]

  useEffect(() => {
    if (locked) return
    if (time <= 0) {
      handlePick(-1)
      return
    }
    const id = setTimeout(() => setTime((t) => t - 0.05), 50)
    return () => clearTimeout(id)
  }, [time, locked])

  function handlePick(i) {
    if (locked) return
    setPicked(i)
    const right = i === q.correct
    setTimeout(() => {
      if (!right) {
        onEliminated()
        return
      }
      const survivors = Math.max(2, Math.floor(alive * (0.38 + Math.random() * 0.15)))
      setAlive(survivors)
      if (round >= totalRounds || survivors <= 3) {
        onWin()
        return
      }
      setRound((r) => r + 1)
      setTime(TIME)
      setPicked(null)
    }, 1200)
  }

  const isFinal = round >= totalRounds - 1

  return (
    <div className="relative min-h-full">
      <Aurora className="opacity-50" />
      <div className="relative z-10 mx-auto flex min-h-full max-w-2xl flex-col px-4 py-6 sm:px-8">
        {/* HUD */}
        <div className="flex items-center justify-between">
          <Chip color={isFinal ? 'spark' : 'ember'}>
            {isFinal ? '🔥 FINALES' : `RONDA ${round}`}
          </Chip>
          <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold ring-1 ring-white/10">
            <Users size={13} className="text-toxic-400" />
            <CountUp to={alive} key={alive} duration={600} /> vivos
          </div>
        </div>

        {/* survivors bar */}
        <div className="mt-4 grid grid-cols-[repeat(40,1fr)] gap-0.5">
          {Array.from({ length: 40 }).map((_, i) => {
            const ratio = alive / 12847
            const lit = i < Math.ceil(ratio * 40)
            return (
              <span
                key={i}
                className={`h-2.5 rounded-sm transition-colors ${
                  lit ? (isFinal ? 'bg-spark-400' : 'bg-toxic-400') : 'bg-white/8'
                }`}
              />
            )
          })}
        </div>

        {/* timer */}
        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-white/8">
          <motion.div
            className={`h-full rounded-full ${time < 2.5 ? 'bg-ember-500' : 'bg-gradient-to-r from-toxic-400 to-spark-400'}`}
            animate={{ width: `${(time / TIME) * 100}%` }}
            transition={{ ease: 'linear', duration: 0.05 }}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={round}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
            >
              <Chip color="bolt" className="mb-3">{q.subject}</Chip>
              <h2 className="font-display text-2xl font-bold leading-snug sm:text-3xl">{q.q}</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {q.options.map((opt, i) => {
                  let s = 'idle'
                  if (locked) {
                    if (i === q.correct) s = 'correct'
                    else if (i === picked) s = 'wrong'
                    else s = 'dim'
                  }
                  return (
                    <button
                      key={i}
                      disabled={locked}
                      onClick={() => handlePick(i)}
                      className={`flex items-center gap-3 rounded-2xl border p-4 text-left font-semibold transition ${
                        s === 'idle' ? 'border-white/10 bg-white/5 hover:-translate-y-0.5 hover:border-ember-500/50 hover:bg-ember-500/10' : ''
                      } ${s === 'correct' ? 'border-toxic-500 bg-toxic-500/20 text-toxic-300' : ''} ${
                        s === 'wrong' ? 'border-ember-500 bg-ember-500/20 text-ember-300' : ''
                      } ${s === 'dim' ? 'opacity-40' : ''}`}
                    >
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                        s === 'correct' ? 'bg-toxic-500 text-ink-900' : s === 'wrong' ? 'bg-ember-500' : 'bg-white/10 text-white/60'
                      }`}>
                        {s === 'correct' ? <Check size={14} /> : s === 'wrong' ? <X size={14} /> : String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="pb-2 text-center text-xs text-white/40">
          ⚠️ Una respuesta incorrecta y quedas eliminado
        </p>
      </div>
    </div>
  )
}

function Outcome({ won, onExit }) {
  return (
    <div className="relative grid min-h-full place-items-center">
      <Aurora className="opacity-70" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md px-4 text-center"
      >
        <Card className="p-8">
          <motion.div
            initial={{ scale: 0, rotate: won ? -30 : 0 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 150, damping: 12 }}
            className="relative mx-auto w-fit"
          >
            {won ? (
              <>
                <div className="absolute -inset-6 rounded-full bg-spark-500/40 blur-2xl" />
                <BoltLogo size={110} className="relative" />
              </>
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
                <Skull size={48} className="text-white/40" />
              </div>
            )}
          </motion.div>

          {won ? (
            <>
              <h2 className="mt-5 font-display text-3xl font-bold text-gradient">¡SUPERVIVIENTE! 👑</h2>
              <p className="mt-1 text-white/55">Terminaste en el Top 3 de 12.847 jugadores</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                <Reward icon={Zap} v="+8.500" l="XP" c="text-bolt-300" />
                <Reward icon={Crown} v="Top 3" l="puesto" c="text-spark-400" />
                <Reward icon={Trophy} v="1" l="badge" c="text-plasma-400" />
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-5 font-display text-3xl font-bold">Eliminado</h2>
              <p className="mt-1 text-white/55">Aguantaste más que el 64% de jugadores</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Reward icon={Zap} v="+1.200" l="XP" c="text-bolt-300" />
                <Reward icon={Flame} v="Ronda 4" l="alcanzada" c="text-ember-400" />
              </div>
            </>
          )}

          <button onClick={onExit} className="btn-spark mt-7 w-full rounded-2xl py-3 font-bold">
            Volver al hub Live
          </button>
        </Card>
      </motion.div>
    </div>
  )
}

function Reward({ icon: Icon, v, l, c }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
      <Icon size={18} className={`mx-auto ${c}`} />
      <div className={`mt-1 font-display text-lg font-bold ${c}`}>{v}</div>
      <div className="text-[10px] uppercase tracking-wide text-white/40">{l}</div>
    </div>
  )
}
