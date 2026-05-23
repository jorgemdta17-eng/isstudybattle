import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, CircleAlert as AlertCircle } from 'lucide-react'
import BoltLogo from '../components/BoltLogo'
import { Aurora } from '../components/UI'
import { useAuth } from '../context/AuthContext'

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp, signInWithGoogle } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)

    if (mode === 'register') {
      if (!name.trim()) { setError('Por favor escribe tu nombre.'); setLoading(false); return }
      const { error: err } = await signUp(email, password, name.trim())
      if (err) {
        setError(friendlyError(err.message))
      } else {
        setInfo('¡Cuenta creada! Revisa tu email para confirmar (si es necesario) y luego inicia sesión.')
        setMode('login')
      }
    } else {
      const { error: err } = await signIn(email, password)
      if (err) setError(friendlyError(err.message))
    }

    setLoading(false)
  }

  async function handleGoogle() {
    setError('')
    const { error: err } = await signInWithGoogle()
    if (err) setError(friendlyError(err.message))
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink-900 px-5 py-10 text-white grain">
      <Aurora />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <BoltLogo size={64} className="animate-floaty" />
          <div className="text-center">
            <h1 className="font-display text-3xl font-bold">StudyBattle</h1>
            <p className="mt-1 text-sm text-white/50">Study · Battle · Level Up</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-2xl bg-white/5 p-1 ring-1 ring-white/10">
          {['login', 'register'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); setInfo('') }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
                mode === m ? 'bg-white/10 text-white shadow' : 'text-white/40 hover:text-white'
              }`}
            >
              {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-ink-800/60 p-6 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === 'register' ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'register' && (
                <Field
                  icon={User}
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <Field
                icon={Mail}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Field
                icon={Lock}
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />

              {error && (
                <div className="flex items-start gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/20">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}
              {info && (
                <div className="rounded-xl bg-toxic-500/10 p-3 text-sm text-toxic-300 ring-1 ring-toxic-500/20">
                  {info}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-spark w-full rounded-xl py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Cargando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
              </button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/30">o continúa con</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            <GoogleIcon />
            Google
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function Field({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
      <input
        {...props}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-bolt-500 focus:ring-1 focus:ring-bolt-500/40"
      />
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function friendlyError(msg) {
  if (msg.includes('Invalid login credentials')) return 'Email o contraseña incorrectos.'
  if (msg.includes('User already registered')) return 'Ya existe una cuenta con ese email.'
  if (msg.includes('Password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (msg.includes('Unable to validate email')) return 'El formato del email no es válido.'
  return msg
}
