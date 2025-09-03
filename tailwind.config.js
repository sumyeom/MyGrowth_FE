/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        myBlue: '#889acd', 
        mygreen: '#88d2a6',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-mygreen'
  ],
}
