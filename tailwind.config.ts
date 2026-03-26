import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Domain colors
        mind: '#5B8C5A',       // Verde sálvia — Mente
        body: '#C67B5C',       // Terracota — Corpo
        soul: '#6BA3B7',       // Azul céu — Alma
        creation: '#B8976A',   // Bege areia — Criação

        // Base palette
        parchment: '#FBF6F0',  // Background
        ink: '#2A2118',        // Texto
        gold: '#D4A843',       // XP / Ouro

        // Tints/shades (used for hover states, borders, etc.)
        'mind-light': '#8AB889',
        'mind-dark': '#3A6B39',
        'body-light': '#D9A48A',
        'body-dark': '#9E5A3A',
        'soul-light': '#96C3D3',
        'soul-dark': '#4A7D93',
        'creation-light': '#D3BDA0',
        'creation-dark': '#8A6A3A',
        'parchment-dark': '#EDE5D8',
        'gold-light': '#E8C878',
        'gold-dark': '#A8802A',
      },
      fontFamily: {
        heading: ['Lora', 'Georgia', 'serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'xp': ['0.875rem', { lineHeight: '1', fontWeight: '700', letterSpacing: '0.05em' }],
      },
      borderRadius: {
        'card': '12px',
        'badge': '20px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(42, 33, 24, 0.08)',
        'card-hover': '0 4px 16px rgba(42, 33, 24, 0.14)',
        'glow-mind': '0 0 12px rgba(91, 140, 90, 0.4)',
        'glow-body': '0 0 12px rgba(198, 123, 92, 0.4)',
        'glow-soul': '0 0 12px rgba(107, 163, 183, 0.4)',
        'glow-creation': '0 0 12px rgba(184, 151, 106, 0.4)',
        'glow-gold': '0 0 12px rgba(212, 168, 67, 0.4)',
      },
      animation: {
        'xp-float': 'xpFloat 1.2s ease-out forwards',
        'level-up': 'levelUp 0.6s ease-out',
        'streak-pulse': 'streakPulse 2s ease-in-out infinite',
        'fog-reveal': 'fogReveal 1.5s ease-out forwards',
      },
      keyframes: {
        xpFloat: {
          '0%':   { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-40px)' },
        },
        levelUp: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        streakPulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
        fogReveal: {
          '0%':   { opacity: '1' },
          '100%': { opacity: '0', pointerEvents: 'none' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
