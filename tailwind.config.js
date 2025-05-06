/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        fitness: {
          primary: 'rgb(var(--color-fitness-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-fitness-secondary) / <alpha-value>)',
          accent: 'rgb(var(--color-fitness-accent) / <alpha-value>)',
          'text-primary': 'rgb(var(--color-fitness-text-primary) / <alpha-value>)',
          'text-secondary': 'rgb(var(--color-fitness-text-secondary) / <alpha-value>)',
          background: 'rgb(var(--color-fitness-background) / <alpha-value>)',
        },
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      screens: {
        'xs': '320px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}