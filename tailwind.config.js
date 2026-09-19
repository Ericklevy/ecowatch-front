/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#090d16',
          dim: '#06080e',
          panel: '#0e1422',
          card: '#131b2c',
          hover: '#1a243a',
          highest: '#222f4b'
        },
        border: {
          subtle: '#1e293b',
          muted: 'rgba(148, 163, 184, 0.1)',
          focus: '#334155'
        },
        hydro: {
          DEFAULT: '#38bdf8',
          dark: '#0284c7',
          light: '#e0f2fe'
        },
        nominal: {
          DEFAULT: '#10b981',
          dark: '#065f46',
          light: '#d1fae5'
        },
        warning: {
          DEFAULT: '#f59e0b',
          dark: '#92400e',
          light: '#fef3c7'
        },
        critical: {
          DEFAULT: '#ef4444',
          dark: '#991b1b',
          light: '#fee2e2'
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
