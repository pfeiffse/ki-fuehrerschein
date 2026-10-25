import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Auf GitHub Pages läuft die App unter /ki-fuehrerschein/
// Lokal (npm run dev) läuft sie unter /
const base = process.env.GITHUB_ACTIONS ? '/ki-fuehrerschein/' : '/'

export default defineConfig({
  plugins: [react()],
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
    alias: {
      '@': '/src',
    },
  },
})