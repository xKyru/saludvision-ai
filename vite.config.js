import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,           // Importante para ngrok
    allowedHosts: ['saludvision-ai.vercel.app'],
    proxy: {
      '/salesforce': {
        target: 'https://orgfarm-5f6fd17f81-dev-ed.develop.my.salesforce.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})