/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class', // This is crucial - make sure it's set to 'class'
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
      },
    },
  },
  plugins: [],
}