/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bitcoin: ['Ubuntu Bold Italic', 'Arial', 'sans-serif'],
        lookTour: ['Look Tour', 'Spartan', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
  darkMode: 'media',
}
