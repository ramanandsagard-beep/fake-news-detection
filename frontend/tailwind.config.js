/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ec4899', // pink-500
          dark: '#db2777', // pink-600
        },
        accent: {
          DEFAULT: '#a855f7', // purple-500
          dark: '#9333ea', // purple-600
        },
        background: {
          DEFAULT: '#0f172a', // slate-900
          card: '#1e293b', // slate-800
          lighter: '#334155', // slate-700
        }
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(236, 72, 153, 0.5)',
        'glow-accent': '0 0 15px rgba(168, 85, 247, 0.5)',
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
