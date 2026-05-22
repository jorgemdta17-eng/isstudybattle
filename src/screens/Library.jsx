import { motion } from 'framer-motion'
import {
  Upload,
  Brain,
  Swords,
  FileText,
  Layers,
  ListChecks,
  Clock,
  HelpCircle,
  FolderPlus,
} from 'lucide-react'
import { Aurora, Card, Chip, ProgressBar } from '../components/UI'
import { SUBJECTS, LIBRARY_DOCS } from '../data/mock'

export default function Library({ onNavigate }) {
  return (
    <div className="relative min-h-full">
      <Aurora className="opacity-40" />
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-7 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Biblioteca</h1>
            <p className="text-sm text-white/50">Tus apuntes, organizados y listos para la batalla.</p>
          </div>
          <button className="btn-spark flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold">
            <Upload size={17} /> Subir PDF
          </button>
        </div>

        {/* zona de subida */}
        <Card className="mb-7 border-dashed border-white/15 p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-bolt-500/15 ring-1 ring-bolt-500/30">
            <Upload size={24} className="text-bolt-400" />
          </div>
          <p className="mt-3 font-display font-bold">Arrastra tus apuntes aquí</p>
          <p className="text-xs text-white/45">PDF, imágenes o texto · la IA los procesa al instante</p>
        </Card>

        {/* asignaturas */}
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-white/50">
          Asignaturas
        </h3>
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SUBJECTS.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:-translate-y-1 hover:border-${s.color}-500/40`}
            >
              <div className="text-2xl">{s.emoji}</div>
              <div className="mt-2 text-sm font-bold">{s.name}</div>
              <div className="text-[11px] text-white/40">{s.docs} documentos</div>
              <div className="mt-2">
                <ProgressBar value={s.progress} total={100} height={5} color={s.color} />
              </div>
            </motion.button>
          ))}
          <button className="grid place-items-center rounded-2xl border border-dashed border-white/15 p-4 text-white/40 transition hover:border-white/30 hover:text-white/60">
            <FolderPlus size={22} />
            <span className="mt-1 text-xs font-semibold">Nueva</span>
          </button>
        </div>

        {/* documentos */}
        <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-white/50">
          Documentos recientes
        </h3>
        <div className="space-y-3">
          {LIBRARY_DOCS.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="p-4 transition hover:border-white/20" hover>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-3">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-${d.color}-500/15 ring-1 ring-${d.color}-500/30`}>
                      <FileText size={20} className={`text-${d.color}-400`} />
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-display font-bold">{d.name}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-white/45">
                        <Chip color={d.color}>{d.subject}</Chip>
                        <span className="flex items-center gap-1"><Clock size={12} /> {d.time}</span>
                        <span className="flex items-center gap-1"><HelpCircle size={12} /> {d.questions} preguntas</span>
                      </div>
                      <div className="mt-2 max-w-xs">
                        <ProgressBar value={d.progress} total={100} height={5} color={d.color} showLabel={false} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <DocAction icon={Brain} label="Study" onClick={() => onNavigate('tutor')} color="bolt" />
                    <DocAction icon={Swords} label="Battle" onClick={() => onNavigate('battle')} color="spark" />
                    <DocAction icon={FileText} label="Resumen" color="plasma" />
                    <DocAction icon={Layers} label="Cards" color="toxic" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DocAction({ icon: Icon, label, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl bg-${color}-500/10 px-3 py-2 text-xs font-semibold text-${color}-400 ring-1 ring-${color}-500/25 transition hover:bg-${color}-500/20`}
    >
      <Icon size={14} /> {label}
    </button>
  )
}
