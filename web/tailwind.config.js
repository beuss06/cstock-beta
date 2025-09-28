/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d9f0ff',
          200: '#b6e3ff',
          300: '#84d0ff',
          400: '#52bbff',
          500: '#2196f3',
          600: '#1679d6',
          700: '#125fad',
          800: '#104f8e',
          900: '#0f4377'
        }
      }
    }
  },
  plugins: []
}
