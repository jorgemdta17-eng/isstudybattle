import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swords, Bot, Users, BookOpen, Crown, Zap, Flame, Check, X, RotateCcw, Home, Target, Gauge, TrendingUp, Loader as Loader2 } from 'lucide-react'
import { Aurora, Card, Chip, ProgressBar } from '../components/UI'
import BoltLogo from '../components/BoltLogo'
import { SUBJECTS } from '../data/mock'
import { useAuth } from '../context/AuthContext'
import { saveBattleResult } from '../lib/supabase'
import { useQuestions } from '../lib/useQuestions'

const MODES = [
  { id: 'solo', name: 'Solo Battle', desc: 'Contra la IA', icon: Bot, color: 'bolt' },
  { id: 'ranked', name: 'Ranked Battle', desc: 'Competitivo', icon: Crown, color: 'spark' },
  { id: 'friend', name: 'Friend Battle', desc: 'Contra amigos', icon: Users, color: 'plasma' },
  { id: 'subject', name: 'Subject Battle', desc: 'Por temática', icon: BookOpen, color: 'toxic' },
  { id: 'exam', name: 'Exam Battle', desc: 'Tus apuntes', icon: Target, color: 'ember' },
]
const QUESTION_TIME = 10

export default function Battle() {
  const { user } = useAuth()
  const [phase, setPhase] = useState('select') // select | playing | results
  const [mode, setMode] = useState(MODES[0])
  const [stats, setStats] = useState(null)
  const [battleConfig, setBattleConfig] = useState({ subject: 'Todas', difficulty: 'Media' })

  if (phase === 'select')
    return (
      <Selector
        mode={mode}
        setMode={setMode}
        onStart={(cfg) => { setBattleConfig(cfg); setPhase('playing') }}
      />
    )
  if (phase === 'playing')
    return (
      <Game
        mode={mode}
        battleConfig={battleConfig}
        onFinish={(s) => { setStats(s); setPhase('results') }}
        onQuit={() => setPhase('select')}
      />
    )
  return (
    <Results
      stats={stats}
      mode={mode}
      userId={user?.id}
      onAgain={() => setPhase('playing')}
      onHome={() => setPhase('select')}
    />
  )
}

/* ---------- SELECCIÓN ---------- */
function Selector({ mode, setMode, onStart }) {
  const [subject, setSubject] = useState('Todas')
  const [difficulty, setDifficulty] = useState('Media')

  return (
    <div className="relative min-h-full">
      <Aurora className="opacity-50" />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <div className="mb-7 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-spark-500/15 ring-1 ring-spark-500/30">
            <Swords size={22} className="text-spark-400" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold">Battle Mode</h1>
            <p className="text-sm text-white/50">Tu entrenamiento diario. Elige tu combate.</p>
          </div>
        </div>

        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-white/50">
          Tipo de batalla
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m)}
              className={`group flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                mode.id === m.id
                  ? `border-${m.color}-500 bg-${m.color}-500/15`
                  : 'border-white/10 bg-white/5 hover:border-white/25'
              }`}
            >
              <m.icon size={22} className={`text-${m.color}-400`} />
              <div className="text-xs font-bold leading-tight">{m.name}</div>
              <div className="text-[10px] text-white/45">{m.desc}</div>
            </button>
          ))}
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-white/50">
              Asignatura
            </h3>
            <div className="flex flex-wrap gap-2">
              {[{ id: 'todas', name: 'Todas', emoji: '🎲', color: 'bolt' }, ...SUBJECTS].map((s) => {
                const id = s.id === 'todas' ? 'Todas' : s.name
                return (
                  <button
                    key={s.id}
                    onClick={() => setSubject(id)}
                    className={`rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition ${
                      subject === id
                        ? `bg-${s.color}-500/20 text-${s.color}-400 ring-${s.color}-500/40`
                        : 'bg-white/5 text-white/60 ring-white/10 hover:ring-white/25'
                    }`}
                  >
                    {s.emoji} {s.name}
                  </button>
                )
              })}
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-white/50">
              Dificultad
            </h3>
            <div className="flex gap-2">
              {['Fácil', 'Media', 'Difícil'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 rounded-xl py-3 text-sm font-bold transition ${
                    difficulty === d
                      ? 'btn-spark'
                      : 'bg-white/5 text-white/60 ring-1 ring-white/10 hover:ring-white/25'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
              <Gauge size={14} className="text-spark-400" />
              5 preguntas · {QUESTION_TIME}s cada una · combos x multiplicador
            </div>
          </Card>
        </div>

        <button
          onClick={() => onStart({ subject, difficulty })}
          className="btn-spark mt-7 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold sm:w-auto sm:px-12"
        >
          <Zap size={20} className="fill-white" /> Iniciar batalla
        </button>
      </div>
    </div>
  )
}

/* ---------- JUEGO ---------- */
function Game({ mode, battleConfig, onFinish, onQuit }) {
  const { questions: allQuestions, loading, error } = useQuestions({
    subject: battleConfig.subject,
    difficulty: battleConfig.difficulty,
  })

  // Pick 5 random questions once pool is loaded
  const questions = useRef(null)
  useEffect(() => {
    if (!loading && allQuestions.length > 0 && questions.current === null) {
      questions.current = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, 5)
    }
  }, [loading, allQuestions])

  if (loading || questions.current === null) {
    return (
      <div className="grid min-h-full place-items-center">
        <div className="flex flex-col items-center gap-4 text-white/60">
          <Loader2 size={36} className="animate-spin text-bolt-400" />
          <p className="text-sm">Cargando preguntas…</p>
        </div>
      </div>
    )
  }

  if (error || questions.current.length === 0) {
    return (
      <div className="grid min-h-full place-items-center px-6 text-center">
        <div className="space-y-3">
          <p className="text-lg font-bold text-white">No hay preguntas disponibles</p>
          <p className="text-sm text-white/50">
            {error ?? 'Prueba con otra asignatura o dificultad.'}
          </p>
          <button onClick={onQuit} className="btn-spark mx-auto mt-2 rounded-xl px-6 py-3 font-bold">
            Volver
          </button>
        </div>
      </div>
    )
  }

  return <GameBoard questions={questions.current} mode={mode} onFinish={onFinish} onQuit={onQuit} />
}

/* Inner game board — receives a fixed questions array */
function GameBoard({ questions, onFinish, onQuit }) {
  const [qi, setQi] = useState(0)
  const [time, setTime] = useState(QUESTION_TIME)
  const [picked, setPicked] = useState(null)
  const [combo, setCombo] = useState(0)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [speeds, setSpeeds] = useState([])
  const locked = picked !== null

  const q = questions[qi]
  const multiplier = 1 + Math.floor(combo / 2)

  useEffect(() => {
    if (locked) return
    if (time <= 0) { handlePick(-1); return }
    const id = setTimeout(() => setTime((t) => t - 0.05), 50)
    return () => clearTimeout(id)
  }, [time, locked])

  function handlePick(i) {
    if (locked) return
    const isCorrect = i === q.correct
    setPicked(i)
    setSpeeds((s) => [...s, QUESTION_TIME - time])
    if (isCorrect) {
      const gained = Math.round((100 + time * 8) * multiplier)
      setScore((v) => v + gained)
      setCombo((c) => c + 1)
      setCorrect((c) => c + 1)
    } else {
      setCombo(0)
    }
    setTimeout(() => {
      if (qi + 1 >= questions.length) {
        const allSpeeds = [...speeds, QUESTION_TIME - time]
        const avgSpeed = (allSpeeds.reduce((a, b) => a + b, 0) / questions.length).toFixed(1)
        const finalCorrect = correct + (isCorrect ? 1 : 0)
        const finalScore = score + (isCorrect ? Math.round((100 + time * 8) * multiplier) : 0)
        onFinish({ score: finalScore, correct: finalCorrect, totalQ: questions.length, avgSpeed, maxCombo: combo + (isCorrect ? 1 : 0) })
      } else {
        setQi((n) => n + 1)
        setTime(QUESTION_TIME)
        setPicked(null)
      }
    }, 1100)
  }

  return (
    <div className="relative min-h-full">
      <Aurora className="opacity-40" />
      <div className="relative z-10 mx-auto flex min-h-full max-w-2xl flex-col px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between">
          <button
            onClick={onQuit}
            className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white/60 ring-1 ring-white/10 hover:text-white"
          >
            <X size={14} /> Salir
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-bold ring-1 ring-white/10 nums">
              {qi + 1} / {questions.length}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-bolt-500/15 px-3 py-1.5 text-xs font-bold text-bolt-300 ring-1 ring-bolt-500/30 nums">
              <Zap size={12} /> {score}
            </span>
          </div>
        </div>

        <div className="mt-4 flex h-8 items-center justify-center">
          <AnimatePresence>
            {combo >= 1 && (
              <motion.div
                key={combo}
                initial={{ scale: 0.5, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-spark-500/30 to-ember-500/30 px-4 py-1 text-sm font-bold text-spark-300 ring-1 ring-spark-500/40"
              >
                <Flame size={15} className="text-ember-400" />
                COMBO x{combo} · multiplicador {multiplier}x
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4">
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-white/8">
            <motion.div
              className={`h-full rounded-full ${time < 3 ? 'bg-ember-500' : 'bg-gradient-to-r from-toxic-400 to-bolt-500'}`}
              animate={{ width: `${(time / QUESTION_TIME) * 100}%` }}
              transition={{ ease: 'linear', duration: 0.05 }}
            />
          </div>
          <div className="mt-1 text-right font-mono text-xs text-white/50 nums">{time.toFixed(1)}s</div>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={qi}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.3 }}
            >
              <Chip color="bolt" className="mb-4">{q.subject}</Chip>
              <h2 className="font-display text-2xl font-bold leading-snug sm:text-3xl">{q.q}</h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {q.options.map((opt, i) => {
                  let state = 'idle'
                  if (locked) {
                    if (i === q.correct) state = 'correct'
                    else if (i === picked) state = 'wrong'
                    else state = 'dim'
                  }
                  return (
                    <button
                      key={i}
                      disabled={locked}
                      onClick={() => handlePick(i)}
                      className={`flex items-center gap-3 rounded-2xl border p-4 text-left font-semibold transition ${
                        state === 'idle' ? 'border-white/10 bg-white/5 hover:-translate-y-0.5 hover:border-bolt-500/50 hover:bg-bolt-500/10' : ''
                      } ${state === 'correct' ? 'border-toxic-500 bg-toxic-500/20 text-toxic-300' : ''
                      } ${state === 'wrong' ? 'border-ember-500 bg-ember-500/20 text-ember-300' : ''
                      } ${state === 'dim' ? 'border-white/5 bg-white/5 opacity-40' : ''}`}
                    >
                      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                        state === 'correct' ? 'bg-toxic-500 text-ink-900'
                        : state === 'wrong' ? 'bg-ember-500 text-white'
                        : 'bg-white/10 text-white/60'
                      }`}>
                        {state === 'correct' ? <Check size={14} /> : state === 'wrong' ? <X size={14} /> : String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ---------- RESULTADOS ---------- */
function Results({ stats, mode, userId, onAgain, onHome }) {
  const { refreshProfile } = useAuth()
  const [saving, setSaving] = useState(true)
  const [saveError, setSaveError] = useState(null)
  const [levelUp, setLevelUp] = useState(null)

  const accuracy = Math.round((stats.correct / stats.totalQ) * 100)
  const won = accuracy >= 60

  useEffect(() => {
    if (!userId) { setSaving(false); return }
    saveBattleResult(userId, { xpGained: stats.score, won })
      .then((updated) => {
        const oldXp = updated.xp - stats.score
        const oldLevel = Math.max(1, Math.floor(oldXp / 300) + 1)
        if (updated.level > oldLevel) setLevelUp(updated.level)
        refreshProfile()
      })
      .catch((err) => {
        setSaveError('No se pudo guardar el resultado. Comprueba tu conexión.')
        console.error(err)
      })
      .finally(() => setSaving(false))
  }, [])

  const rows = [
    { icon: Zap, label: 'XP ganado', value: `+${stats.score}`, color: 'text-bolt-300' },
    { icon: Target, label: 'Precisión', value: `${accuracy}%`, color: 'text-toxic-400' },
    { icon: Gauge, label: 'Velocidad media', value: `${stats.avgSpeed}s`, color: 'text-spark-400' },
    { icon: Flame, label: 'Combo máximo', value: `x${stats.maxCombo}`, color: 'text-ember-400' },
  ]
  const verdict = accuracy >= 80 ? '¡Dominado! 🔥' : accuracy >= 50 ? '¡Buen trabajo! 💪' : 'A seguir entrenando 📚'

  return (
    <div className="relative grid min-h-full place-items-center">
      <Aurora className="opacity-60" />
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md px-4 py-8"
      >
        <Card className="overflow-hidden p-8 text-center">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-bolt-500 via-plasma-500 to-spark-500" />
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 160, damping: 12 }}
          >
            <BoltLogo size={88} className="mx-auto" />
          </motion.div>
          <h2 className="mt-5 font-display text-3xl font-bold">{verdict}</h2>
          <p className="mt-1 text-sm text-white/50">{mode.name} completada</p>

          <AnimatePresence>
            {levelUp && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-spark-500/20 px-4 py-3 ring-1 ring-spark-500/40"
              >
                <TrendingUp size={18} className="text-spark-400" />
                <span className="font-display font-bold text-spark-300">¡Subiste al nivel {levelUp}!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {saving && <p className="mt-3 text-xs text-white/40">Guardando resultado…</p>}
          {saveError && <p className="mt-3 text-xs text-red-400">{saveError}</p>}

          <div className="mt-6 grid grid-cols-2 gap-3">
            {rows.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
              >
                <r.icon size={18} className={`mx-auto ${r.color}`} />
                <div className={`mt-1.5 font-display text-2xl font-bold ${r.color}`}>{r.value}</div>
                <div className="text-[11px] uppercase tracking-wide text-white/40">{r.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-bolt-500/10 p-4 text-left ring-1 ring-bolt-500/20">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-bolt-300">
              <Bot size={14} /> Bolt te recomienda
            </div>
            <p className="mt-1 text-sm text-white/70">
              {accuracy >= 80
                ? 'Sube la dificultad a Difícil para ganar más XP por combo.'
                : 'Repasa con el AI Tutor las preguntas que fallaste antes de la próxima ronda.'}
            </p>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={onAgain} className="btn-spark flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 font-bold">
              <RotateCcw size={16} /> Otra vez
            </button>
            <button onClick={onHome} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white/5 py-3 font-bold ring-1 ring-white/10 hover:bg-white/10">
              <Home size={16} /> Volver
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
