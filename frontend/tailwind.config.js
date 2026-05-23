/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        brand: {
          50:  '#f5f7ff',
          100: '#ececff',
          200: '#d7d6ff',
          300: '#bfb8ff',
          400: '#9f92ff',
          500: '#4F46E5', // Primary Indigo
          600: '#3f3bd1',
          700: '#332fa8',
          800: '#2a256f',
          900: '#1c183f',
          950: '#0f0c20',
        },
        accent: {
          500: '#06B6D4', // Cyan accent
          600: '#049fb3',
        },
        alt: {
          500: '#7C3AED', // Secondary Purple
        },
      },
      animation: {
        'slide-up': 'slideUp 0.18s ease both',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.97)' },
          to:   { opacity: '1', transform: 'none' },
        },
      },
    },
  },
  plugins: [],
}
