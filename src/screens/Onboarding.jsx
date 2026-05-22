import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, Zap, Target, Sparkles } from 'lucide-react'
import BoltLogo from '../components/BoltLogo'
import { Aurora, ProgressBar } from '../components/UI'

const GOALS = [
  { id: 'uni', label: 'Universidad', emoji: '🎓' },
  { id: 'opo', label: 'Oposiciones', emoji: '📋' },
  { id: 'gen', label: 'Cultura general', emoji: '🌍' },
  { id: 'code', label: 'Programación', emoji: '💻' },
  { id: 'lang', label: 'Idiomas', emoji: '🗣️' },
  { id: 'sci', label: 'Ciencias', emoji: '🔬' },
]
const LEVELS = [
  { id: 'beg', label: 'Principiante', desc: 'Empiezo desde cero' },
  { id: 'int', label: 'Intermedio', desc: 'Tengo una base' },
  { id: 'adv', label: 'Avanzado', desc: 'Quiero dominarlo' },
]
const INTERESTS = ['Velocidad', 'Estrategia', 'Competición', 'Constancia', 'Retos', 'Comunidad']

export default function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState(null)
  const [level, setLevel] = useState(null)
  const [interests, setInterests] = useState([])

  const steps = ['Bienvenida', 'Objetivo', 'Nivel', 'Estilo', 'Activación']
  const total = steps.length

  const next = () => setStep((s) => Math.min(total - 1, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  const toggleInterest = (i) =>
    setInterests((arr) => (arr.includes(i) ? arr.filter((x) => x !== i) : [...arr, i]))

  const canContinue =
    (step === 0) ||
    (step === 1 && goal) ||
    (step === 2 && level) ||
    (step === 3 && interests.length > 0) ||
    step === 4

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink-900 px-5 py-10 text-white grain">
      <Aurora />
      <div className="relative z-10 w-full max-w-lg">
        {/* progreso */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BoltLogo size={32} />
              <span className="font-display font-bold">StudyBattle</span>
            </div>
            <span className="text-xs font-semibold text-white/40">
              Paso {step + 1} de {total}
            </span>
          </div>
          <ProgressBar value={step + 1} total={total} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
          >
            {step === 0 && (
              <Welcome />
            )}

            {step === 1 && (
              <StepWrap title="¿Qué quieres dominar?" sub="Elige tu objetivo principal. Podrás añadir más después.">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {GOALS.map((g) => (
                    <SelectCard
                      key={g.id}
                      active={goal === g.id}
                      onClick={() => setGoal(g.id)}
                      emoji={g.emoji}
                      label={g.label}
                    />
                  ))}
                </div>
              </StepWrap>
            )}

            {step === 2 && (
              <StepWrap title="¿Cuál es tu nivel?" sub="Calibramos la dificultad de tus batallas.">
                <div className="flex flex-col gap-3">
                  {LEVELS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLevel(l.id)}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                        level === l.id
                          ? 'border-bolt-500 bg-bolt-500/15 shadow-glow'
                          : 'border-white/10 bg-white/5 hover:border-white/25'
                      }`}
                    >
                      <div>
                        <div className="font-display font-bold">{l.label}</div>
                        <div className="text-xs text-white/50">{l.desc}</div>
                      </div>
                      {level === l.id && (
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-bolt-500">
                          <Check size={14} />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </StepWrap>
            )}

            {step === 3 && (
              <StepWrap title="¿Cómo compites?" sub="Selecciona lo que te motiva (puedes elegir varios).">
                <div className="flex flex-wrap gap-2.5">
                  {INTERESTS.map((i) => (
                    <button
                      key={i}
                      onClick={() => toggleInterest(i)}
                      className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                        interests.includes(i)
                          ? 'border-plasma-500 bg-plasma-500/20 text-plasma-300'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </StepWrap>
            )}

            {step === 4 && <Activation goal={goal} />}
          </motion.div>
        </AnimatePresence>

        {/* controles */}
        <div className="mt-10 flex items-center justify-between">
          {step > 0 && step < 4 ? (
            <button
              onClick={back}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-white/60 hover:text-white"
            >
              <ArrowLeft size={16} /> Atrás
            </button>
          ) : (
            <span />
          )}

          {step < 4 ? (
            <button
              onClick={next}
              disabled={!canContinue}
              className="btn-spark flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === 0 ? 'Empezar' : 'Continuar'}
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="btn-gold ml-auto flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold"
            >
              Entrar a StudyBattle <Zap size={16} className="fill-current" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Welcome() {
  return (
    <div className="text-center">
      <BoltLogo size={96} className="mx-auto animate-floaty" />
      <h1 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
        Hola, soy <span className="text-gradient">Bolt</span>
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-white/60">
        Voy a ser tu entrenador. En 4 pasos preparo tu perfil, tu primer rango y tu plaza en
        el próximo torneo. ¿Empezamos?
      </p>
      <div className="mt-6 flex justify-center gap-3 text-xs">
        <span className="rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">⚡ 30 seg</span>
        <span className="rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">🎁 XP de bienvenida</span>
      </div>
    </div>
  )
}

function StepWrap({ title, sub, children }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      <p className="mt-2 text-sm text-white/55">{sub}</p>
      <div className="mt-7">{children}</div>
    </div>
  )
}

function SelectCard({ active, onClick, emoji, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl border p-4 transition ${
        active
          ? 'border-bolt-500 bg-bolt-500/15 shadow-glow'
          : 'border-white/10 bg-white/5 hover:border-white/25'
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}

function Activation() {
  const rewards = [
    { icon: Zap, label: '+250 XP de bienvenida', color: 'text-bolt-300' },
    { icon: Target, label: 'Primera misión desbloqueada', color: 'text-toxic-400' },
    { icon: Sparkles, label: 'Rango inicial: Rookie', color: 'text-spark-400' },
  ]
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 12 }}
        className="relative mx-auto w-fit"
      >
        <div className="absolute -inset-6 rounded-full bg-spark-500/30 blur-2xl" />
        <BoltLogo size={104} className="relative" />
      </motion.div>
      <h2 className="mt-6 font-display text-3xl font-bold">¡Perfil listo! 🎉</h2>
      <p className="mt-2 text-white/60">Esto es lo que acabas de desbloquear:</p>

      <div className="mt-6 space-y-3 text-left">
        {rewards.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.18 }}
            className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5">
              <r.icon size={18} className={r.color} />
            </span>
            <span className="font-semibold">{r.label}</span>
            <Check size={18} className="ml-auto text-toxic-400" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
