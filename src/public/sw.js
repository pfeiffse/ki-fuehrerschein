// ============================================================
// KI-Fuehrerschein - Service Worker
// Offline-First: App-Shell und statische Assets cachen
// ============================================================

var CACHE_NAME = 'ki-fuehrerschein-v1'

// App-Shell: diese Dateien werden beim Install gecacht
var APP_SHELL = [
  './',
  './index.html',
]

// Install: App-Shell cachen
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL)
    }).then(function() {
      return self.skipWaiting()
    })
  )
})

// Activate: alte Caches loeschen
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME })
            .map(function(key) { return caches.delete(key) })
      )
    }).then(function() {
      return self.clients.claim()
    })
  )
})

// Fetch: Netzwerk-First fuer Supabase, Cache-First fuer App-Assets
self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url)

  // Supabase-Anfragen: immer Netzwerk, kein Cache
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(event.request).catch(function() {
        // Offline: leere Antwort zurueckgeben
        return new Response(JSON.stringify({ data: null, error: { message: 'Offline' } }), {
          headers: { 'Content-Type': 'application/json' }
        })
      })
    )
    return
  }

  // App-Assets: Cache-First mit Netzwerk-Fallback
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached

      return fetch(event.request).then(function(response) {
        // Nur GET-Anfragen cachen
        if (event.request.method !== 'GET') return response
        if (!response || response.status !== 200) return response

        var responseClone = response.clone()
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone)
        })
        return response
      }).catch(function() {
        // Offline-Fallback: index.html fuer SPA-Routing
        return caches.match('./index.html')
      })
    })
  )
})