import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['sb-2av9xzhhabrr.vercel.run'],
    proxy: { '/api': 'http://localhost:8787' },
  },
})
