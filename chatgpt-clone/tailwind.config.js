/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        typing: 'blink 1s steps(3, start) infinite'
      },
      keyframes: {
        blink: {
          to: { visibility: 'hidden' }
        }
      },
      colors: {
        gptdarkgray: '#202123',
        gptlogo: '#10a37f',
        gptgray: '#343541',
        gptlightgray: '#444654'
      }
    }
  },
  variants: {
    extend: {
      display: ['group-focus'],
      opacity: ['group-focus'],
      inset: ['group-focus']
    }
  },
  plugins: []
}
