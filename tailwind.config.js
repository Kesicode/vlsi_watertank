/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tank: {
          blue: '#00d2ff',
          cyan: '#00f2fe',
          yellow: '#f59e0b',
          red: '#ef4444',
          green: '#10b981',
          bg: '#0a0f1d',
          card: 'rgba(15, 23, 42, 0.45)', // glass backdrop
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.1)',
        'neon-blue': '0 0 15px rgba(0, 210, 255, 0.4)',
        'neon-cyan': '0 0 15px rgba(0, 242, 254, 0.4)',
        'neon-red': '0 0 15px rgba(239, 68, 68, 0.4)',
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
}


