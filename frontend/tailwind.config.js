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
        violetDark: {
          bg: '#080612',         // Deepest blackish violet background
          surface: '#0e0b1f',    // Headers, sidebars, panel surfaces
          card: '#15102d',       // Cards, modals, dropdowns
          input: '#1a1438',      // Input fields, secondary buttons
          hover: '#241b4d',      // Hover states
          border: '#2a1f56',     // Borders
          borderStrong: '#4c3891', // Active borders / rings
          accent: '#a855f7',     // Main glowing violet accent
          accentHover: '#9333ea', // Accent hover
          text: '#f5f3ff',       // Primary text
          muted: '#a79fc4',      // Secondary / muted text
          faint: '#6c6194',      // Icons, subtle borders
        },
        brand: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'canvas': '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(168, 85, 247, 0.1)',
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.15)',
        'glow': '0 0 20px -3px rgba(168, 85, 247, 0.4)',
      }
    },
  },
  plugins: [],
}
