/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./src/**/*.{tsx, jsx, ts, js}"],
  theme: {
    extend: {
      colors: {
        primary: colors.sky
      }
    }
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
}
