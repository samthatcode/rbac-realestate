import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api': 'https://surefinders-backend.onrender.com',
      // '/api': 'http://localhost:5175',
    },
  },
})
