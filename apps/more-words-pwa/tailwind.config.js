/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          bg: '#0d0d0d',
          accent: '#c9a84c',
        },
      },
    },
  },
  plugins: [],
}
