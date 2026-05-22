# ⚡ StudyBattle — Study. Battle. Level Up.

Plataforma de estudio competitiva y social, estilo esports. React + Vite + Tailwind.
App completa multi-pantalla, lista para **Bolt.new**.

## 🚀 Cómo abrirlo en Bolt.new

**Opción A — Subir el ZIP (recomendada)**
1. Entra en https://bolt.new
2. Arrastra el archivo `studybattle.zip` (o usa la opción de importar carpeta).
3. Bolt detectará el `package.json` y ejecutará `npm install` solo.
4. Pulsa **Run** / espera a que arranque el `dev server`.

**Opción B — Copiar archivos a mano**
Crea cada archivo respetando exactamente la estructura de carpetas de abajo y pega su contenido.

> ⚠️ **El logo**: la imagen va en `public/bolt-logo.png`. Si Bolt no conserva el binario al importar, vuelve a subir tu logo a la carpeta `public` con ese nombre exacto. Si falta, la app muestra un logo vectorial de respaldo automáticamente (no se rompe nada).

## 🧱 Estructura

```
studybattle/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── bolt-logo.png        ← tu logo
└── src/
    ├── main.jsx             ← entry point
    ├── App.jsx              ← navegación (landing → onboarding → app)
    ├── index.css            ← estilos base + utilidades de marca
    ├── data/
    │   └── mock.js          ← datos de demo (rankings, preguntas, eventos…)
    ├── components/
    │   ├── BoltLogo.jsx     ← logo con fallback
    │   ├── UI.jsx           ← Card, Countdown, ProgressBar, CountUp, Aurora…
    │   └── AppShell.jsx     ← sidebar + bottom nav + topbar
    └── screens/
        ├── Landing.jsx      ← hero "trailer en vivo"
        ├── Onboarding.jsx   ← alta en 5 pasos
        ├── Dashboard.jsx    ← hub diario
        ├── Battle.jsx       ← modo batalla jugable (timer + combos)
        ├── Live.jsx         ← torneos en directo (simulación jugable)
        ├── Tutor.jsx        ← chat con IA + herramientas de estudio
        ├── Library.jsx      ← biblioteca de apuntes
        ├── Leaderboard.jsx  ← rankings
        └── Profile.jsx      ← perfil, rangos, badges, cosméticos
```

## 🎨 Identidad

- **Azul eléctrico** (`bolt`) primario · **rayo dorado** (`spark`) acento · fondo casi negro azulado (`ink`).
- Acentos: `plasma` (morado), `toxic` (verde), `ember` (rojo).
- Tipografías: **Clash Display** (títulos), **Plus Jakarta Sans** (texto), **Space Mono** (contadores).

## 🛠️ Comandos

```bash
npm install
npm run dev      # desarrollo
npm run build    # producción
```

## 💡 Notas técnicas

- Navegación por estado (sin router), simple y rápida de extender.
- Las clases de color dinámicas (`bg-${color}-...`) están protegidas con `safelist` en `tailwind.config.js` para que el build de producción no las elimine.
- Los datos viven en `src/data/mock.js`; conéctalos a tu backend (Supabase, Firebase, etc.) cuando quieras.

---
Hecho con ⚡ — Study. Battle. Level Up.
