/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#d4af37",
        "gold-hover": "#ffcc33",
      },
    },
  },
  plugins: [[
    require('tailwind-scrollbar-hide')
  ]],
};

