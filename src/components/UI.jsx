import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/* Fondo atmosférico con mesh de gradientes + grid sutil. Se usa en toda la app. */
export function Aurora({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-mesh-1 opacity-90" />
      <div className="absolute inset-0 bg-grid-faint [background-size:46px_46px] opacity-[0.5]" />
      <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-bolt-500/30 blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-plasma-500/20 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-spark-500/15 blur-[120px]" />
    </div>
  )
}

/* Píldora / etiqueta pequeña */
export function Chip({ children, color = 'bolt', className = '' }) {
  const map = {
    bolt: 'bg-bolt-500/15 text-bolt-200 ring-bolt-500/30',
    spark: 'bg-spark-500/15 text-spark-300 ring-spark-500/30',
    plasma: 'bg-plasma-500/15 text-plasma-400 ring-plasma-500/30',
    toxic: 'bg-toxic-500/15 text-toxic-400 ring-toxic-500/30',
    ember: 'bg-ember-500/15 text-ember-400 ring-ember-500/30',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ${map[color]} ${className}`}
    >
      {children}
    </span>
  )
}

/* Barra de XP / progreso con animación de relleno */
export function ProgressBar({ value, total, color = 'bolt', height = 10, showLabel = false }) {
  const pct = Math.min(100, Math.round((value / total) * 100))
  const grad = {
    bolt: 'from-bolt-400 to-bolt-600',
    spark: 'from-spark-300 to-spark-500',
    plasma: 'from-plasma-400 to-plasma-600',
    toxic: 'from-toxic-400 to-toxic-500',
    ember: 'from-ember-400 to-ember-500',
  }[color]
  return (
    <div className="w-full">
      <div
        className="relative w-full overflow-hidden rounded-full bg-white/8"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${grad}`}
        />
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-between text-[11px] text-white/50 nums">
          <span>{value.toLocaleString('es')}</span>
          <span>{total.toLocaleString('es')}</span>
        </div>
      )}
    </div>
  )
}

/* Contador regresivo en formato HH:MM:SS que tic-tac de verdad */
export function Countdown({ seconds, className = '', size = 'lg' }) {
  const [s, setS] = useState(seconds)
  useEffect(() => setS(seconds), [seconds])
  useEffect(() => {
    const id = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])
  const hh = String(Math.floor(s / 3600)).padStart(2, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  const sizes = { sm: 'text-lg', md: 'text-2xl', lg: 'text-4xl', xl: 'text-6xl' }
  return (
    <div className={`font-mono font-bold nums ${sizes[size]} ${className}`}>
      <span>{hh}</span>
      <span className="opacity-40">:</span>
      <span>{mm}</span>
      <span className="opacity-40">:</span>
      <span className="text-spark-400">{ss}</span>
    </div>
  )
}

/* Número que sube animado (jugadores conectados, XP, etc.) */
export function CountUp({ to, duration = 1500, className = '', suffix = '' }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(to * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, duration])
  return (
    <span className={`nums ${className}`}>
      {n.toLocaleString('es')}
      {suffix}
    </span>
  )
}

/* Tarjeta de vidrio genérica */
export function Card({ children, className = '', hover = false, ...rest }) {
  return (
    <div
      className={`glass rounded-3xl shadow-card ${
        hover ? 'transition-transform hover:-translate-y-1 hover:shadow-glow' : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

/* Avatar con iniciales y gradiente */
export function Avatar({ initials, gradient = 'from-bolt-500 to-plasma-500', size = 44, ring = true }) {
  return (
    <div
      className={`grid place-items-center rounded-2xl bg-gradient-to-br font-display font-bold text-white ${gradient} ${
        ring ? 'ring-2 ring-white/15' : ''
      }`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  )
}
