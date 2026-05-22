/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  // IMPORTANTE: algunas clases de color se construyen con template strings
  // (p.ej. `bg-${color}-500/15`). Este safelist acotado protege solo las
  // combinaciones que realmente usamos, sin inflar el CSS de producción.
  safelist: [
    {
      pattern: /(bg|text|ring|border)-(bolt|spark|plasma|toxic|ember)-(400)/,
      variants: ['hover'],
    },
    {
      pattern: /(from|to)-(bolt|spark|plasma|toxic|ember)-(400|500|600)/,
    },
    {
      pattern:
        /(bg|ring|border)-(bolt|spark|plasma|toxic|ember)-(400|500)\/(10|15|20|25|30|40|50)/,
      variants: ['hover'],
    },
    {
      pattern: /text-(bolt|spark|plasma|toxic|ember)-(300|400)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        // Núcleo de marca extraído del logo de Bolt
        ink: {
          900: '#05060f',
          800: '#0a0c1c',
          700: '#0f1228',
          600: '#161a3a',
          500: '#1e2350',
        },
        bolt: {
          50: '#eaf1ff',
          100: '#d4e2ff',
          200: '#a9c5ff',
          300: '#7da7ff',
          400: '#5288ff',
          500: '#3b6ef6', // azul eléctrico primario
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#172554',
        },
        spark: {
          300: '#ffe08a',
          400: '#ffc53d', // rayo dorado
          500: '#f5a623',
          600: '#e08c0b',
        },
        plasma: {
          400: '#c46bff',
          500: '#a855f7',
          600: '#8b2fe0',
        },
        toxic: {
          400: '#3ef0c4',
          500: '#10d9a3',
        },
        ember: {
          400: '#ff5c7a',
          500: '#f43f5e',
        },
      },
      fontFamily: {
        display: ['"Clash Display"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(59,110,246,0.35), 0 0 40px -8px rgba(59,110,246,0.6)',
        'glow-spark': '0 0 0 1px rgba(255,197,61,0.4), 0 0 40px -6px rgba(245,166,35,0.7)',
        'glow-plasma': '0 0 40px -8px rgba(168,85,247,0.6)',
        card: '0 24px 60px -20px rgba(0,0,0,0.7)',
      },
      backgroundImage: {
        'mesh-1':
          'radial-gradient(at 12% 18%, rgba(59,110,246,0.35) 0px, transparent 50%), radial-gradient(at 85% 12%, rgba(168,85,247,0.28) 0px, transparent 50%), radial-gradient(at 75% 85%, rgba(245,166,35,0.22) 0px, transparent 50%), radial-gradient(at 20% 90%, rgba(16,217,163,0.18) 0px, transparent 50%)',
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bar-grow': {
          '0%': { transform: 'scaleY(0.2)' },
          '100%': { transform: 'scaleY(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        floaty: 'floaty 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
}
