/* ~~/tailwind.config.js */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: ['selector', '[data-mode="dark"]'],
  plugins: [
    require('@tailwindcss/typography')
  ],
  theme: {
    extend: {
      fontFamily: {
        bitcoin: ['Ubuntu Bold Italic', 'Arial', 'sans-serif'],
        lookTour: ['Look Tour', 'Spartan', 'serif'],
      },
    },
  },
}
