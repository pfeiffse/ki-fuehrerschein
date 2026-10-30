import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.GITHUB_ACTIONS ? '/ki-fuehrerschein/' : '/'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      base,
      includeAssets: ['favicon.svg', 'manifest.json'],
      manifest: {
        name: 'KI-Führerschein',
        short_name: 'KI-Führerschein',
        description: 'Schulische KI-Kompetenzplattform für Klasse 7',
        theme_color: '#103d54',
        background_color: '#eaf5f6',
        display: 'standalone',
        lang: 'de',
        start_url: base,
        icons: [
          {
            src: 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'><text y=\'.9em\' font-size=\'90\'>🤖</text></svg>',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: base + 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Supabase: Network-First (online bevorzugt, Offline-Fallback)
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Wikimedia-Bilder: Cache-First (Pferdefotos)
            urlPattern: /^https:\/\/commons\.wikimedia\.org\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wikimedia-images',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Unsplash-Bilder: Cache-First
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  base,
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
  },
  resolve: {
    alias: { '@': '/src' },
  },
})