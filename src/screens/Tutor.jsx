import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Sparkles,
  FileText,
  Layers,
  ListChecks,
  Send,
  Upload,
  AlertTriangle,
  CalendarClock,
} from 'lucide-react'
import { Aurora, Card, Chip, ProgressBar } from '../components/UI'
import BoltLogo from '../components/BoltLogo'
import { SUBJECTS } from '../data/mock'

const TOOLS = [
  { id: 'summary', label: 'Resumir', icon: FileText, color: 'bolt', prompt: 'Resúmeme el Tema 4 de Genética' },
  { id: 'flash', label: 'Flashcards', icon: Layers, color: 'plasma', prompt: 'Genera flashcards de este tema' },
  { id: 'quiz', label: 'Simulacro', icon: ListChecks, color: 'spark', prompt: 'Hazme un simulacro tipo examen' },
  { id: 'explain', label: 'Explicar', icon: Brain, color: 'toxic', prompt: 'Explícame la mitosis paso a paso' },
]

const SEED = [
  {
    from: 'bolt',
    text: '¡Listo para entrenar! 💪 Soy tu tutor. Sube tus apuntes o dime qué quieres repasar y lo preparo: resúmenes, flashcards o un simulacro tipo examen.',
  },
]

export default function Tutor() {
  const [messages, setMessages] = useState(SEED)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  function send(text) {
    const t = (text ?? input).trim()
    if (!t) return
    setMessages((m) => [...m, { from: 'user', text: t }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, fakeReply(t)])
    }, 1100)
  }

  return (
    <div className="relative min-h-full">
      <Aurora className="opacity-40" />
      <div className="relative z-10 mx-auto grid h-full max-w-6xl gap-5 px-4 py-6 sm:px-8 lg:grid-cols-[1fr_300px]">
        {/* Chat */}
        <div className="flex min-h-[70vh] flex-col">
          <div className="mb-4 flex items-center gap-3">
            <BoltLogo size={44} />
            <div>
              <h1 className="font-display text-2xl font-bold">AI Tutor</h1>
              <p className="text-xs text-white/50">Tu entrenador personal antes de competir</p>
            </div>
            <Chip color="toxic" className="ml-auto">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-toxic-400" /> En línea
            </Chip>
          </div>

          <Card className="flex flex-1 flex-col overflow-hidden p-0">
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.map((m, i) => (
                <Bubble key={i} from={m.from} text={m.text} extra={m.extra} />
              ))}
              {typing && <Typing />}
            </div>

            {/* herramientas rápidas */}
            <div className="flex gap-2 overflow-x-auto border-t border-white/8 px-4 py-3">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => send(t.prompt)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full bg-${t.color}-500/15 px-3 py-1.5 text-xs font-semibold text-${t.color}-400 ring-1 ring-${t.color}-500/30 hover:brightness-125`}
                >
                  <t.icon size={13} /> {t.label}
                </button>
              ))}
            </div>

            {/* input */}
            <div className="flex items-center gap-2 border-t border-white/8 p-3">
              <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/5 text-white/60 ring-1 ring-white/10 hover:text-white">
                <Upload size={18} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Pregúntame lo que quieras estudiar…"
                className="flex-1 rounded-xl bg-white/5 px-4 py-2.5 text-sm outline-none ring-1 ring-white/10 placeholder:text-white/30 focus:ring-bolt-500/50"
              />
              <button
                onClick={() => send()}
                className="btn-spark grid h-10 w-10 shrink-0 place-items-center rounded-xl"
              >
                <Send size={17} />
              </button>
            </div>
          </Card>
        </div>

        {/* Panel lateral: debilidades + plan */}
        <div className="space-y-5">
          <Card className="p-5">
            <div className="flex items-center gap-2 font-display font-bold">
              <AlertTriangle size={18} className="text-ember-400" /> Puntos débiles
            </div>
            <p className="mt-1 text-xs text-white/45">Detectados por tus últimas batallas</p>
            <div className="mt-4 space-y-3">
              {[
                { name: 'Genética — Cruces', val: 38, color: 'ember' },
                { name: 'Cálculo — Límites', val: 55, color: 'spark' },
                { name: 'Historia — Fechas', val: 62, color: 'bolt' },
              ].map((w) => (
                <div key={w.name}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-white/70">{w.name}</span>
                    <span className="nums text-white/50">{w.val}%</span>
                  </div>
                  <ProgressBar value={w.val} total={100} height={6} color={w.color} />
                </div>
              ))}
            </div>
            <button className="mt-4 w-full rounded-xl bg-ember-500/15 py-2 text-xs font-bold text-ember-300 ring-1 ring-ember-500/30 hover:bg-ember-500/25">
              Entrenar debilidades
            </button>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2 font-display font-bold">
              <CalendarClock size={18} className="text-plasma-400" /> Plan de hoy
            </div>
            <div className="mt-4 space-y-2.5 text-sm">
              {[
                { t: '09:00', a: 'Repaso Genética', done: true },
                { t: '12:30', a: 'Daily Blitz', done: true },
                { t: '18:00', a: 'Flashcards Cálculo', done: false },
                { t: '21:00', a: 'Sunday Night Battle', done: false },
              ].map((p) => (
                <div key={p.t} className="flex items-center gap-3">
                  <span className="w-12 font-mono text-xs text-white/40 nums">{p.t}</span>
                  <span className={`flex-1 ${p.done ? 'text-white/40 line-through' : 'text-white/80'}`}>
                    {p.a}
                  </span>
                  <span
                    className={`h-2 w-2 rounded-full ${p.done ? 'bg-toxic-400' : 'bg-white/20'}`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Bubble({ from, text, extra }) {
  const isBolt = from === 'bolt'
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isBolt ? '' : 'flex-row-reverse'}`}
    >
      {isBolt && <BoltLogo size={32} glow={false} className="mt-1 shrink-0" />}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
          isBolt
            ? 'bg-white/5 ring-1 ring-white/10'
            : 'bg-gradient-to-br from-bolt-600 to-bolt-700 text-white'
        }`}
      >
        <p className="leading-relaxed">{text}</p>
        {extra}
      </div>
    </motion.div>
  )
}

function Typing() {
  return (
    <div className="flex items-center gap-3">
      <BoltLogo size={32} glow={false} />
      <div className="flex gap-1 rounded-2xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-bolt-300"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  )
}

// Respuestas simuladas con bloques visuales según la intención
function fakeReply(prompt) {
  const p = prompt.toLowerCase()
  if (p.includes('flashcard')) {
    return {
      from: 'bolt',
      text: 'He generado 12 flashcards de este tema. Aquí tienes una muestra:',
      extra: (
        <div className="mt-3 grid grid-cols-1 gap-2">
          {[
            ['¿Qué es un alelo?', 'Una variante de un gen.'],
            ['Genotipo vs fenotipo', 'Genética vs rasgo observable.'],
          ].map(([q, a]) => (
            <div key={q} className="rounded-xl bg-plasma-500/10 p-3 ring-1 ring-plasma-500/25">
              <div className="text-xs font-bold text-plasma-300">{q}</div>
              <div className="mt-1 text-xs text-white/60">{a}</div>
            </div>
          ))}
        </div>
      ),
    }
  }
  if (p.includes('simulacro') || p.includes('examen') || p.includes('quiz')) {
    return {
      from: 'bolt',
      text: 'Listo un simulacro de 10 preguntas tipo examen. ¿Lo lanzamos como Battle para ganar XP? 🎯',
      extra: (
        <div className="mt-3 rounded-xl bg-spark-500/10 p-3 ring-1 ring-spark-500/25">
          <div className="text-xs font-bold text-spark-300">Simulacro generado</div>
          <div className="mt-1 text-xs text-white/60">10 preguntas · dificultad media · ~6 min</div>
        </div>
      ),
    }
  }
  if (p.includes('resum')) {
    return {
      from: 'bolt',
      text: 'Aquí va el resumen en 3 ideas clave:',
      extra: (
        <ul className="mt-3 space-y-1.5 text-xs text-white/70">
          <li>• Las leyes de Mendel describen la herencia de los caracteres.</li>
          <li>• Dominante y recesivo determinan el fenotipo.</li>
          <li>• Los cuadros de Punnett predicen las proporciones.</li>
        </ul>
      ),
    }
  }
  return {
    from: 'bolt',
    text: 'Buena pregunta. Te lo explico paso a paso y luego te lanzo 3 preguntas rápidas para fijarlo. ¿Te parece? ⚡',
  }
}
