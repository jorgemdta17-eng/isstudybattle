// Datos de demostración que alimentan toda la app.
// En producción esto vendría de tu backend / Supabase.

export const RANKS = [
  { name: 'Rookie', color: '#94a3b8', min: 0 },
  { name: 'Challenger', color: '#3b6ef6', min: 1500 },
  { name: 'Scholar', color: '#10d9a3', min: 4000 },
  { name: 'Legend', color: '#a855f7', min: 8000 },
  { name: 'Grand Champion', color: '#ffc53d', min: 15000 },
]

export const CURRENT_USER = {
  name: 'Alex Rivera',
  handle: '@alexr',
  university: 'Universidad Complutense',
  level: 24,
  xp: 6240,
  xpToNext: 7000,
  rank: 'Scholar',
  streak: 17,
  coins: 1840,
  globalRank: 248,
  avatarColor: 'from-bolt-500 to-plasma-500',
  initials: 'AR',
}

export const DAILY_MISSIONS = [
  { id: 1, title: 'Completa 3 batallas', reward: 150, type: 'xp', done: true, progress: 3, total: 3 },
  { id: 2, title: 'Estudia 15 minutos con la IA', reward: 100, type: 'xp', done: false, progress: 8, total: 15 },
  { id: 3, title: 'Mantén tu racha', reward: 1, type: 'streak', done: true, progress: 1, total: 1 },
  { id: 4, title: 'Gana una Ranked Battle', reward: 80, type: 'coins', done: false, progress: 0, total: 1 },
]

export const LEADERBOARD = [
  { pos: 1, name: 'Nova_Tan', uni: 'MIT', xp: 18420, rank: 'Grand Champion', streak: 92, you: false },
  { pos: 2, name: 'kenji.dev', uni: 'Tokyo U', xp: 17110, rank: 'Grand Champion', streak: 64, you: false },
  { pos: 3, name: 'lucia_b', uni: 'UCM', xp: 15980, rank: 'Grand Champion', streak: 41, you: false },
  { pos: 4, name: 'm4thwizard', uni: 'ETH Zürich', xp: 14200, rank: 'Legend', streak: 30, you: false },
  { pos: 5, name: 'sora.kim', uni: 'SNU', xp: 12850, rank: 'Legend', streak: 55, you: false },
  { pos: 6, name: 'theo_p', uni: 'Sorbonne', xp: 11400, rank: 'Legend', streak: 22, you: false },
  { pos: 7, name: 'aisha.r', uni: 'Oxford', xp: 10330, rank: 'Legend', streak: 18, you: false },
  { pos: 248, name: 'alexr', uni: 'UCM', xp: 6240, rank: 'Scholar', streak: 17, you: true },
]

export const LIVE_EVENTS = [
  {
    id: 'sunday',
    name: 'Sunday Night Battle',
    tag: 'SUNDAY MAJOR',
    players: 12847,
    prize: '50.000 XP + Skin Legendaria',
    startsInSec: 7883, // ~02:11:23
    accent: 'ember',
    featured: true,
  },
  {
    id: 'blitz',
    name: 'Daily Blitz',
    tag: 'DIARIO',
    players: 3210,
    prize: '5.000 XP',
    startsInSec: 1825,
    accent: 'spark',
  },
  {
    id: 'arena',
    name: 'Ranked Arena',
    tag: 'COMPETITIVO',
    players: 5680,
    prize: 'Puntos de Liga',
    startsInSec: 14400,
    accent: 'bolt',
  },
  {
    id: 'clash',
    name: 'University Clash',
    tag: 'UNIVERSIDADES',
    players: 8900,
    prize: 'Banner de Campus',
    startsInSec: 43200,
    accent: 'plasma',
  },
]

export const SUBJECTS = [
  { id: 'bio', name: 'Biología', emoji: '🧬', color: 'toxic', progress: 72, docs: 6 },
  { id: 'his', name: 'Historia', emoji: '📜', color: 'spark', progress: 45, docs: 4 },
  { id: 'mat', name: 'Matemáticas', emoji: '📐', color: 'bolt', progress: 88, docs: 9 },
  { id: 'cod', name: 'Programación', emoji: '💻', color: 'plasma', progress: 60, docs: 7 },
  { id: 'qui', name: 'Química', emoji: '⚗️', color: 'ember', progress: 30, docs: 3 },
]

export const LIBRARY_DOCS = [
  { id: 1, name: 'Tema 4 — Genética Mendeliana', subject: 'Biología', color: 'toxic', progress: 80, questions: 42, time: '2h 15m' },
  { id: 2, name: 'Apuntes Revolución Industrial', subject: 'Historia', color: 'spark', progress: 35, questions: 28, time: '48m' },
  { id: 3, name: 'Cálculo — Integrales', subject: 'Matemáticas', color: 'bolt', progress: 95, questions: 60, time: '3h 40m' },
  { id: 4, name: 'Estructuras de Datos', subject: 'Programación', color: 'plasma', progress: 55, questions: 38, time: '1h 50m' },
]

// Banco de preguntas para Battle Mode y Live
export const QUESTION_BANK = [
  {
    q: '¿Qué orgánulo se encarga de la producción de energía (ATP) en la célula?',
    options: ['Ribosoma', 'Mitocondria', 'Aparato de Golgi', 'Lisosoma'],
    correct: 1,
    subject: 'Biología',
  },
  {
    q: '¿Cuál es la derivada de sen(x)?',
    options: ['cos(x)', '-cos(x)', '-sen(x)', 'tan(x)'],
    correct: 0,
    subject: 'Matemáticas',
  },
  {
    q: 'En programación, ¿qué estructura sigue el principio LIFO?',
    options: ['Cola (Queue)', 'Lista enlazada', 'Pila (Stack)', 'Árbol'],
    correct: 2,
    subject: 'Programación',
  },
  {
    q: '¿En qué año comenzó la Revolución Francesa?',
    options: ['1776', '1789', '1804', '1815'],
    correct: 1,
    subject: 'Historia',
  },
  {
    q: '¿Cuál es el símbolo químico del Sodio?',
    options: ['S', 'So', 'Na', 'N'],
    correct: 2,
    subject: 'Química',
  },
  {
    q: '¿Qué teorema relaciona los lados de un triángulo rectángulo?',
    options: ['Tales', 'Pitágoras', 'Euclides', 'Fermat'],
    correct: 1,
    subject: 'Matemáticas',
  },
  {
    q: '¿Qué gas absorben las plantas durante la fotosíntesis?',
    options: ['Oxígeno', 'Nitrógeno', 'Dióxido de carbono', 'Hidrógeno'],
    correct: 2,
    subject: 'Biología',
  },
]

export const BADGES = [
  { id: 1, name: 'Primera Sangre', icon: '⚔️', desc: 'Gana tu primera batalla', owned: true, rarity: 'común' },
  { id: 2, name: 'Imparable', icon: '🔥', desc: 'Racha de 7 días', owned: true, rarity: 'raro' },
  { id: 3, name: 'Cerebro', icon: '🧠', desc: '100% de precisión en una batalla', owned: true, rarity: 'épico' },
  { id: 4, name: 'Superviviente', icon: '👑', desc: 'Top 10 en un torneo Live', owned: false, rarity: 'legendario' },
  { id: 5, name: 'Madrugador', icon: '🌅', desc: 'Estudia antes de las 7am', owned: true, rarity: 'común' },
  { id: 6, name: 'Maratón', icon: '⏱️', desc: '2h de estudio en un día', owned: false, rarity: 'raro' },
]

export const COSMETICS = [
  { id: 1, name: 'Bolt Neón', type: 'Skin', icon: '⚡', equipped: true, color: 'bolt' },
  { id: 2, name: 'Marco Plasma', type: 'Marco', icon: '🟣', equipped: false, color: 'plasma' },
  { id: 3, name: 'Banner Campeón', type: 'Banner', icon: '🏆', equipped: false, color: 'spark' },
  { id: 4, name: 'Título: Erudito', type: 'Título', icon: '📖', equipped: true, color: 'toxic' },
  { id: 5, name: 'Emote Victoria', type: 'Emote', icon: '🎉', equipped: false, color: 'ember' },
  { id: 6, name: 'Aura Dorada', type: 'Animación', icon: '✨', equipped: false, color: 'spark' },
]

export function rankColor(name) {
  return (RANKS.find((r) => r.name === name) || RANKS[0]).color
}
