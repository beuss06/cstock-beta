import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cstock: {
          primary: '#0F766E',
          accent: '#0891B2'
        }
      }
    }
  },
  plugins: [],
} satisfies Config
