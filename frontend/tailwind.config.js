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
        secondary: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#262626',
        },
      },
    },
  },
  plugins: [],
}
