import { motion } from 'framer-motion'
import {
  Zap,
  Swords,
  Brain,
  Radio,
  Trophy,
  ArrowRight,
  Sparkles,
  Flame,
  Users,
  ChevronRight,
} from 'lucide-react'
import BoltLogo from '../components/BoltLogo'
import { Aurora, Chip, Countdown, CountUp, Card } from '../components/UI'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Landing({ onStart, onNavigate }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-900 text-white grain">
      <Aurora />

      {/* NAV */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-3">
          <BoltLogo size={42} />
          <span className="font-display text-xl font-bold">StudyBattle</span>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-medium text-white/60 md:flex">
          <a href="#tutor" className="hover:text-white">AI Tutor</a>
          <a href="#battle" className="hover:text-white">Battle</a>
          <a href="#live" className="hover:text-white">Live</a>
          <a href="#ranks" className="hover:text-white">Rankings</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hidden text-sm font-semibold text-white/70 hover:text-white sm:block"
          >
            Entrar
          </button>
          <button onClick={onStart} className="btn-spark rounded-xl px-4 py-2 text-sm font-bold">
            Start Free
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pt-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
        <div>
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <Chip color="ember" className="mb-5">
              <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-ember-500" />
              EVENTO LIVE EN DIRECTO
            </Chip>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl"
          >
            Study. <span className="text-gradient">Battle.</span>
            <br />
            Level Up.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-md text-lg text-white/60"
          >
            La plataforma donde aprender se siente como competir. IA que te entrena,
            batallas diarias y torneos en vivo con miles de jugadores.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onStart}
              className="btn-spark group flex items-center gap-2 rounded-2xl px-6 py-3.5 text-base font-bold"
            >
              Start Free
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => onNavigate('live')}
              className="flex items-center gap-2 rounded-2xl border border-white/15 px-6 py-3.5 text-base font-semibold text-white/80 transition hover:bg-white/5"
            >
              <Radio size={18} className="text-ember-400" />
              Ver torneo en vivo
            </button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10 flex items-center gap-6 text-sm text-white/50"
          >
            <div className="flex items-center gap-2">
              <Users size={16} className="text-bolt-300" />
              <CountUp to={128400} className="font-bold text-white" /> jugadores
            </div>
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-ember-400" />
              <CountUp to={2400000} className="font-bold text-white" /> batallas hoy
            </div>
          </motion.div>
        </div>

        {/* Tarjeta de evento en vivo (el gancho FOMO) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-ember-500/30 via-plasma-500/20 to-bolt-500/30 blur-2xl" />
          <Card className="relative overflow-hidden p-6">
            <div className="absolute inset-x-0 top-0 h-1 live-ring" />
            <div className="flex items-center justify-between">
              <Chip color="ember">SUNDAY NIGHT BATTLE</Chip>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-ember-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-ember-500" />
                EN DIRECTO
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center">
              <BoltLogo size={88} className="animate-floaty" />
              <p className="mt-4 text-xs uppercase tracking-[0.25em] text-white/40">
                El torneo empieza en
              </p>
              <Countdown seconds={7883} size="xl" className="mt-1 tracking-tight" />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <MiniStat label="Jugadores" value={<CountUp to={12847} />} accent="text-bolt-300" />
              <MiniStat label="Premio" value="50.000 XP" accent="text-spark-400" />
            </div>

            <button onClick={onStart} className="btn-gold mt-5 w-full rounded-2xl py-3 font-bold">
              Reservar mi plaza
            </button>
          </Card>
        </motion.div>
      </section>

      {/* MARQUEE de universidades / social proof */}
      <div className="relative z-10 mt-20 overflow-hidden border-y border-white/8 py-5">
        <div className="flex w-max animate-marquee gap-12 text-sm font-semibold uppercase tracking-wider text-white/30">
          {[...UNIS, ...UNIS].map((u, i) => (
            <span key={i} className="flex items-center gap-2">
              <Sparkles size={14} className="text-bolt-400" /> {u}
            </span>
          ))}
        </div>
      </div>

      {/* PILARES — demos vivas */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <SectionTitle
          kicker="El ecosistema"
          title={<>Cuatro formas de <span className="text-gradient-cool">subir de nivel</span></>}
          sub="No es otra app de estudio. Es entrenamiento, competición y comunidad alrededor del conocimiento."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <FeatureCard
            id="tutor"
            icon={Brain}
            color="bolt"
            tag="AI TUTOR"
            title="Tu entrenador personal"
            desc="Sube tus apuntes y la IA los resume, genera flashcards, crea simulacros y detecta tus puntos débiles."
          >
            <TutorDemo />
          </FeatureCard>

          <FeatureCard
            id="battle"
            icon={Swords}
            color="spark"
            tag="BATTLE MODE"
            title="Entrenamiento diario"
            desc="Preguntas a contrarreloj, combos, multiplicadores y XP. El hábito que te engancha cada día."
          >
            <BattleDemo />
          </FeatureCard>

          <FeatureCard
            id="live"
            icon={Radio}
            color="ember"
            tag="STUDYBATTLE LIVE"
            title="Torneos en directo"
            desc="Miles de jugadores responden a la vez. Fallas, quedas eliminado. Aguanta hasta el final."
            wide
          >
            <LiveDemo />
          </FeatureCard>

          <FeatureCard
            id="ranks"
            icon={Trophy}
            color="plasma"
            tag="PROGRESIÓN"
            title="Rangos y temporadas"
            desc="De Rookie a Grand Champion. XP, rachas, badges y recompensas que reinician cada temporada."
            wide
          >
            <RankDemo />
          </FeatureCard>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-28 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-bolt-600/30 via-plasma-600/20 to-ink-800 p-10 text-center sm:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-spark-500/30 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-bolt-500/30 blur-[100px]" />
          <BoltLogo size={72} className="mx-auto mb-6 animate-floaty" />
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            ¿Listo para <span className="text-gradient">competir</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/60">
            Únete gratis hoy. Tu primer rango, tu primera misión y tu plaza en el próximo
            torneo te están esperando.
          </p>
          <button
            onClick={onStart}
            className="btn-spark mx-auto mt-8 flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-bold"
          >
            Start Free <Zap size={20} className="fill-white" />
          </button>
          <p className="mt-4 text-xs text-white/40">Sin tarjeta. Empieza en 30 segundos.</p>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/8 px-5 py-10 text-center text-sm text-white/40 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <BoltLogo size={28} glow={false} />
            <span className="font-display font-bold text-white/70">StudyBattle</span>
          </div>
          <p>© 2026 StudyBattle — Study. Battle. Level Up.</p>
        </div>
      </footer>
    </div>
  )
}

const UNIS = [
  'Complutense', 'MIT', 'Oxford', 'ETH Zürich', 'Tokyo U', 'Sorbonne', 'SNU', 'Stanford', 'UAM',
]

function SectionTitle({ kicker, title, sub }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Chip color="bolt" className="mb-4">{kicker}</Chip>
      <h2 className="font-display text-4xl font-bold sm:text-5xl">{title}</h2>
      <p className="mx-auto mt-4 max-w-lg text-white/55">{sub}</p>
    </div>
  )
}

function MiniStat({ label, value, accent }) {
  return (
    <div className="rounded-2xl bg-white/5 p-3 text-center ring-1 ring-white/10">
      <div className={`font-display text-xl font-bold ${accent}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-white/40">{label}</div>
    </div>
  )
}

function FeatureCard({ id, icon: Icon, color, tag, title, desc, children, wide }) {
  const ring = {
    bolt: 'hover:shadow-glow',
    spark: 'hover:shadow-glow-spark',
    ember: 'hover:shadow-[0_0_40px_-8px_rgba(244,63,94,0.6)]',
    plasma: 'hover:shadow-glow-plasma',
  }[color]
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className={`group ${wide ? 'lg:col-span-1' : ''}`}
    >
      <Card className={`h-full p-7 transition-shadow ${ring}`}>
        <div className="flex items-center gap-3">
          <span
            className={`grid h-11 w-11 place-items-center rounded-2xl bg-${color}-500/15 ring-1 ring-${color}-500/30`}
          >
            <Icon size={20} className={`text-${color}-400`} />
          </span>
          <Chip color={color}>{tag}</Chip>
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-sm text-white/55">{desc}</p>
        <div className="mt-6">{children}</div>
      </Card>
    </motion.div>
  )
}

/* --- Mini-demos visuales dentro de cada feature --- */

function TutorDemo() {
  const steps = ['📄 Apuntes.pdf', '✨ Resumen', '🃏 12 flashcards', '📝 Simulacro']
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => (
        <motion.div
          key={s}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.15 }}
          className="rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold ring-1 ring-white/10"
        >
          {s}
          {i < steps.length - 1 && <ChevronRight size={12} className="ml-1 inline text-bolt-400" />}
        </motion.div>
      ))}
    </div>
  )
}

function BattleDemo() {
  return (
    <div className="rounded-2xl bg-ink-800/60 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-spark-400">⏱ 00:07</span>
        <span className="rounded-full bg-spark-500/20 px-2 py-0.5 font-bold text-spark-300">
          COMBO x4 🔥
        </span>
      </div>
      <p className="mt-3 text-sm font-semibold">¿Derivada de sen(x)?</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        {['cos(x)', '-sen(x)', 'tan(x)', '-cos(x)'].map((o, i) => (
          <div
            key={o}
            className={`rounded-lg px-2 py-2 text-center font-semibold ring-1 ${
              i === 0
                ? 'bg-toxic-500/20 text-toxic-400 ring-toxic-500/40'
                : 'bg-white/5 text-white/60 ring-white/10'
            }`}
          >
            {o}
          </div>
        ))}
      </div>
    </div>
  )
}

function LiveDemo() {
  return (
    <div className="rounded-2xl bg-ink-800/60 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-ember-400">RONDA 7 · FINALES</span>
        <span className="text-xs text-white/50">
          <CountUp to={184} /> / 12.847 vivos
        </span>
      </div>
      <div className="mt-3 grid grid-cols-12 gap-1">
        {Array.from({ length: 48 }).map((_, i) => (
          <span
            key={i}
            className={`h-3 rounded-sm ${
              i < 5 ? 'bg-toxic-400' : i < 8 ? 'bg-spark-400/60' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-white/50">Cada fallo elimina. La tensión sube por ronda.</p>
    </div>
  )
}

function RankDemo() {
  const ranks = [
    { n: 'Rookie', c: 'bg-slate-400' },
    { n: 'Challenger', c: 'bg-bolt-500' },
    { n: 'Scholar', c: 'bg-toxic-500' },
    { n: 'Legend', c: 'bg-plasma-500' },
    { n: 'Champion', c: 'bg-spark-400' },
  ]
  return (
    <div className="flex items-end gap-2">
      {ranks.map((r, i) => (
        <motion.div
          key={r.n}
          initial={{ height: 0 }}
          whileInView={{ height: 24 + i * 14 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, type: 'spring', stiffness: 120 }}
          className="flex-1 text-center"
        >
          <div className={`w-full rounded-t-lg ${r.c}`} style={{ height: 24 + i * 14 }} />
          <div className="mt-1 text-[9px] font-semibold text-white/50">{r.n}</div>
        </motion.div>
      ))}
    </div>
  )
}
