import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['del-ve.png'],
      manifest: {
        name: 'del-ve',
        short_name: 'del-ve',
        description: 'نظام إدارة الطلبات الذكي',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'del-ve.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'del-ve.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'del-ve.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })],
})
