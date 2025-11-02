import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'light.png', 'dark.png'],
      manifest: {
        name: 'CampusHive',
        short_name: 'CampusHive',
        description: 'CampusHive — Buzzing with campus activity.',
        theme_color: '#FFC107',
        background_color: '#121212',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/light.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/dark.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      }
    })
  ],
  server: {
    port: 5173
  }
})