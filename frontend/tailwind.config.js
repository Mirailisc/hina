/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      // sans: ['Niramit'],
    },
    extend: {
      colors: {
        transparent: 'transparent',
        background: '#1c1c1c',
        primary: {
          50: '#f1fafe',
          100: '#e1f5fd',
          200: '#bdebfa',
          300: '#82dcf7',
          400: '#3fcbf1',
          500: '#16b5e1',
          600: '#0a93bf',
          700: '#0a81ab',
          800: '#0c6380',
          900: '#10516a',
          950: '#0a3547',
        },
      },
    },
  },
  plugins: [],
}
