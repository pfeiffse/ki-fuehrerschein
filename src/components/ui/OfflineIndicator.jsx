// ============================================================
// KI-Fuehrerschein - Offline-Indikator
// Zeigt Online/Offline-Status und ausstehende Sync-Eintraege
// ============================================================

import React, { useState, useEffect, useCallback } from 'react'
import { flushSyncQueue, getPendingSyncCount } from '../../lib/progress.js'

export default function OfflineIndicator() {
  const [online,  setOnline]  = useState(navigator.onLine)
  const [pending, setPending] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState(null)

  // Online/Offline-Status ueberwachen
  useEffect(() => {
    function handleOnline() {
      setOnline(true)
      // Automatisch synchronisieren wenn wieder online
      doSync()
    }
    function handleOffline() {
      setOnline(false)
    }

    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)

    // Regelmaessig Queue-Groesse pruefen
    var interval = setInterval(() => {
      setPending(getPendingSyncCount())
    }, 3000)

    // Initial pruefen
    setPending(getPendingSyncCount())

    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  // Beim Online-Werden automatisch synchronisieren
  async function doSync() {
    if (syncing) return
    setSyncing(true)
    try {
      var result = await flushSyncQueue()
      if (result.synced > 0) {
        setLastSync(new Date())
        setPending(getPendingSyncCount())
      }
    } catch {}
    setSyncing(false)
  }

  // Nichts anzeigen wenn online und keine ausstehenden Eintraege
  if (online && pending === 0 && !syncing) return null

  return (
    <div style={{
      position:     'fixed',
      bottom:       '16px',
      right:        '16px',
      zIndex:       500,
      background:   online ? (syncing ? '#e8f5fc' : 'var(--color-warning-light)') : 'var(--color-error-light)',
      border:       '2px solid ' + (online ? (syncing ? '#2484bb' : 'var(--color-warning)') : 'var(--color-error)'),
      borderRadius: 'var(--radius-lg)',
      padding:      '10px 16px',
      boxShadow:    'var(--shadow-lg)',
      maxWidth:     '280px',
      fontSize:     'var(--font-size-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
        <span style={{ fontSize: '1.1rem' }}>
          {!online ? '📵' : syncing ? '🔄' : '⏳'}
        </span>
        <span style={{ color: online ? (syncing ? '#2484bb' : 'var(--color-warning)') : 'var(--color-error)' }}>
          {!online
            ? 'Offline – kein Internet'
            : syncing
            ? 'Wird synchronisiert …'
            : pending + ' Änderung' + (pending !== 1 ? 'en' : '') + ' nicht gespeichert'}
        </span>
      </div>

      {!online && (
        <p style={{ margin: '6px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          Dein Fortschritt wird lokal gespeichert und beim nächsten Online-Gang automatisch übertragen.
        </p>
      )}

      {online && pending > 0 && !syncing && (
        <div style={{ marginTop: '8px' }}>
          <button onClick={doSync}
            style={{ background: 'var(--color-warning)', color: 'white', border: 0, borderRadius: 'var(--radius-md)', padding: '6px 12px', fontSize: 'var(--font-size-xs)', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
            Jetzt synchronisieren
          </button>
        </div>
      )}

      {lastSync && online && pending === 0 && (
        <p style={{ margin: '4px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-success)' }}>
          ✓ Synchronisiert um {lastSync.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  )
}