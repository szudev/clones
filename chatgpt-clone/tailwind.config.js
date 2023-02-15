/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gptdarkgray: '#202123',
        gptlogo: '#10a37f',
        gptgray: '#343541',
        gptlightgray: '#444654'
      }
    }
  },
  plugins: []
}
