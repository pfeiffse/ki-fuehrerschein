import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import '../styles/global.css'

const basename = import.meta.env.BASE_URL

// Sync-Queue beim Start leeren (wenn online)
// Service Worker wird automatisch von vite-plugin-pwa registriert
window.addEventListener('load', async () => {
  if (navigator.onLine) {
    try {
      const { flushSyncQueue } = await import('../lib/progress.js')
      await flushSyncQueue()
    } catch {}
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)