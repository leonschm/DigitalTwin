import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a1a2e',
        'dark-card': '#16213e',
        'neon-blue': '#0f4c75',
        'neon-blue-hover': '#3282b8',
      },
    },
  },
  plugins: [],
} satisfies Config;