/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rise: {
          dark: '#0B132B',
          navy: '#1C2541',
          blue: '#3A506B',
          cyan: '#00B4D8',
          amber: '#F59E0B',
          orange: '#F97316',
          sunset: '#E63946',
          gold: '#FFD700',
          light: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
