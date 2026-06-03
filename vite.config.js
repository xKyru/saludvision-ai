import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,           // Importante para ngrok
    allowedHosts: ['80f5-2806-2f0-62c1-e4de-d4c8-1512-6925-4455.ngrok-free.app', 'saludvision.dpdns.org'],
    proxy: {
      '/salesforce': {
        target: 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.salesforce.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})