/** @type {import('tailwindcss').Config} */
export default {
  content: ['./daisy.html'],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")
  ],
}

