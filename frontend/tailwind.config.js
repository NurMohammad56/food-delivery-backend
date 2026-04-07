/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef0fb',
          100: '#dde1f8',
          200: '#c1c7f1',
          300: '#9ea7e8',
          400: '#727ed9',
          500: '#454fbf',
          600: '#353d9d',
          700: '#2f328f',
          800: '#282a74',
          900: '#20215a'
        },
        accent: '#029a57',
        signal: '#c23a35'
      },
      boxShadow: {
        soft: '0 24px 60px rgba(47, 50, 143, 0.12)',
        glow: '0 18px 48px rgba(47, 50, 143, 0.22)'
      }
    },
  },
  plugins: [],
};
