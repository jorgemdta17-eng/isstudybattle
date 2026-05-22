import { useState } from 'react'

/**
 * Logo de Bolt.
 * Por defecto intenta cargar /bolt-logo.png (sube tu imagen a la carpeta public
 * de Bolt.new con ese nombre). Si no la encuentra, dibuja un fallback vectorial
 * con la misma identidad (conejo + rayo) para que la app nunca se vea rota.
 */
export default function BoltLogo({ size = 44, glow = true, className = '' }) {
  const [errored, setErrored] = useState(false)

  return (
    <div
      className={`relative inline-grid place-items-center rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          className="absolute inset-0 rounded-full blur-md opacity-60"
          style={{
            background:
              'radial-gradient(circle, rgba(59,110,246,0.9), rgba(59,110,246,0) 70%)',
          }}
        />
      )}
      {!errored ? (
        <img
          src="/bolt-logo.png"
          alt="Bolt — StudyBattle"
          onError={() => setErrored(true)}
          className="relative h-full w-full rounded-full object-cover ring-2 ring-bolt-500/60"
        />
      ) : (
        <BoltFallback size={size} />
      )}
    </div>
  )
}

function BoltFallback({ size }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="relative rounded-full ring-2 ring-bolt-500/60"
    >
      <defs>
        <radialGradient id="bg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#101634" />
          <stop offset="100%" stopColor="#05060f" />
        </radialGradient>
        <linearGradient id="bolt" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe08a" />
          <stop offset="100%" stopColor="#f5a623" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#bg)" stroke="#3b6ef6" strokeWidth="3" />
      {/* orejas */}
      <ellipse cx="38" cy="30" rx="7" ry="20" fill="#c7cbe0" transform="rotate(-12 38 30)" />
      <ellipse cx="60" cy="28" rx="7" ry="20" fill="#c7cbe0" transform="rotate(8 60 28)" />
      {/* cabeza */}
      <ellipse cx="50" cy="60" rx="22" ry="20" fill="#dfe3f2" />
      {/* ojos */}
      <circle cx="43" cy="57" r="2.6" fill="#1d2a52" />
      <circle cx="57" cy="57" r="2.6" fill="#1d2a52" />
      {/* nariz */}
      <path d="M50 63 l-3 3 h6 z" fill="#e8927a" />
      {/* rayo */}
      <path d="M62 18 l-8 14 h6 l-6 12 14 -16 h-6 z" fill="url(#bolt)" />
    </svg>
  )
}
