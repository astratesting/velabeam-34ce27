/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        ivory: 'var(--ivory)',
        charcoal: 'var(--charcoal)',
        gold: 'var(--gold)',
        burgundy: 'var(--burgundy)',
        mist: 'var(--mist)',
        fog: 'var(--fog)',
        ink: 'var(--ink)',
      },
      fontFamily: {
        display: ['Canela', 'Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Neue Haas Grotesk', 'Inter', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};
