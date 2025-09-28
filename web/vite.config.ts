import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // expose :: et 0.0.0.0
    port: 5173,
    strictPort: false,
    open: true        // ouvre le navigateur
  }
})
