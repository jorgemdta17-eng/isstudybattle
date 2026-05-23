import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Check, X, BookOpen, ChevronDown, Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react'
import { Aurora, Card, Chip } from '../components/UI'
import { supabase } from '../lib/supabase'

const SUBJECTS = ['Biología', 'Historia', 'Matemáticas', 'Programación', 'Química']
const DIFFICULTIES = ['Fácil', 'Media', 'Difícil']

const BLANK_FORM = {
  question: '',
  options: ['', '', '', ''],
  correct_index: 0,
  subject: SUBJECTS[0],
  difficulty: 'Media',
}

export default function QuestionManager() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(BLANK_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filterSubject, setFilterSubject] = useState('Todas')

  useEffect(() => { fetchQuestions() }, [])

  async function fetchQuestions() {
    setLoading(true)
    const { data } = await supabase.from('questions').select('*').order('created_at', { ascending: false })
    setQuestions(data ?? [])
    setLoading(false)
  }

  function setOption(i, val) {
    setForm((f) => {
      const opts = [...f.options]
      opts[i] = val
      return { ...f, options: opts }
    })
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.question.trim()) return setError('Escribe el enunciado de la pregunta.')
    if (form.options.some((o) => !o.trim())) return setError('Rellena las 4 opciones de respuesta.')

    setSaving(true)
    const { error: err } = await supabase.from('questions').insert({
      question: form.question.trim(),
      options: form.options.map((o) => o.trim()),
      correct_index: form.correct_index,
      subject: form.subject,
      difficulty: form.difficulty,
    })

    if (err) {
      setError('Error al guardar: ' + err.message)
    } else {
      setSuccess('¡Pregunta añadida!')
      setForm(BLANK_FORM)
      fetchQuestions()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    await supabase.from('questions').delete().eq('id', id)
    setQuestions((qs) => qs.filter((q) => q.id !== id))
  }

  const filtered = filterSubject === 'Todas'
    ? questions
    : questions.filter((q) => q.subject === filterSubject)

  return (
    <div className="relative min-h-full">
      <Aurora className="opacity-40" />
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-8">
        {/* Header */}
        <div className="mb-7 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-toxic-500/15 ring-1 ring-toxic-500/30">
            <BookOpen size={22} className="text-toxic-400" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-bold">Gestionar Preguntas</h1>
            <p className="text-sm text-white/50">
              Añade y elimina preguntas del Battle Mode
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* ─── Formulario nueva pregunta ─── */}
          <div>
            <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-white/50">
              Nueva pregunta
            </h2>
            <Card className="p-6">
              <form onSubmit={handleSave} className="space-y-4">
                {/* Enunciado */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-white/60">
                    Enunciado
                  </label>
                  <textarea
                    value={form.question}
                    onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                    rows={3}
                    placeholder="¿Cuál es la pregunta?"
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-bolt-500 focus:ring-1 focus:ring-bolt-500/40"
                  />
                </div>

                {/* Opciones */}
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-white/60">
                    Opciones — marca la correcta
                  </label>
                  <div className="space-y-2">
                    {form.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, correct_index: i }))}
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold transition ${
                            form.correct_index === i
                              ? 'bg-toxic-500 text-ink-900'
                              : 'bg-white/10 text-white/50 hover:bg-white/20'
                          }`}
                        >
                          {form.correct_index === i ? <Check size={14} /> : String.fromCharCode(65 + i)}
                        </button>
                        <input
                          value={opt}
                          onChange={(e) => setOption(i, e.target.value)}
                          placeholder={`Opción ${String.fromCharCode(65 + i)}`}
                          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-bolt-500 focus:ring-1 focus:ring-bolt-500/40"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Asignatura + Dificultad */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-white/60">Asignatura</label>
                    <div className="relative">
                      <select
                        value={form.subject}
                        onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                        className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-bolt-500"
                      >
                        {SUBJECTS.map((s) => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-white/60">Dificultad</label>
                    <div className="relative">
                      <select
                        value={form.difficulty}
                        onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value }))}
                        className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-bolt-500"
                      >
                        {DIFFICULTIES.map((d) => <option key={d} value={d} className="bg-gray-900">{d}</option>)}
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/20"
                    >
                      <AlertCircle size={15} className="mt-0.5 shrink-0" />
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 rounded-xl bg-toxic-500/10 p-3 text-sm text-toxic-300 ring-1 ring-toxic-500/20"
                    >
                      <Check size={15} /> {success}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-spark flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold disabled:opacity-50"
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {saving ? 'Guardando…' : 'Añadir pregunta'}
                </button>
              </form>
            </Card>
          </div>

          {/* ─── Lista de preguntas ─── */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold uppercase tracking-wider text-white/50">
                Preguntas guardadas
                <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold">
                  {filtered.length}
                </span>
              </h2>
            </div>

            {/* Filter chips */}
            <div className="mb-4 flex flex-wrap gap-2">
              {['Todas', ...SUBJECTS].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterSubject(s)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 transition ${
                    filterSubject === s
                      ? 'bg-bolt-500/20 text-bolt-300 ring-bolt-500/40'
                      : 'bg-white/5 text-white/50 ring-white/10 hover:ring-white/25'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 size={28} className="animate-spin text-white/30" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 py-10 text-center text-sm text-white/40">
                No hay preguntas en esta categoría todavía.
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '600px' }}>
                {filtered.map((q) => (
                  <motion.div
                    key={q.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            <Chip color="bolt">{q.subject}</Chip>
                            <Chip color={q.difficulty === 'Fácil' ? 'toxic' : q.difficulty === 'Difícil' ? 'ember' : 'spark'}>
                              {q.difficulty}
                            </Chip>
                          </div>
                          <p className="text-sm font-semibold leading-snug">{q.question}</p>
                          <div className="mt-2 grid grid-cols-2 gap-1">
                            {q.options.map((opt, i) => (
                              <div
                                key={i}
                                className={`rounded-lg px-2 py-1 text-xs ${
                                  i === q.correct_index
                                    ? 'bg-toxic-500/20 text-toxic-300 font-semibold'
                                    : 'text-white/40'
                                }`}
                              >
                                {String.fromCharCode(65 + i)}. {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="shrink-0 grid h-8 w-8 place-items-center rounded-xl text-white/30 transition hover:bg-red-500/15 hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
