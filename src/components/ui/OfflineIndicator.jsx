// KI-Fuehrerschein - Offline-Indikator
// Zeigt Online/Offline-Status, ausstehende Sync-Eintraege und Storage-Warnung

import React, { useState, useEffect } from 'react'
import { flushSyncQueue, getPendingSyncCount, checkLocalStorageSize } from '../../lib/progress.js'

export default function OfflineIndicator() {
  const [online,   setOnline]   = useState(navigator.onLine)
  const [pending,  setPending]  = useState(0)
  const [syncing,  setSyncing]  = useState(false)
  const [lastSync, setLastSync] = useState(null)
  const [storage,  setStorage]  = useState(null)

  useEffect(() => {
    function handleOnline()  { setOnline(true);  doSync() }
    function handleOffline() { setOnline(false) }

    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)

    var interval = setInterval(() => {
      setPending(getPendingSyncCount())
      setStorage(checkLocalStorageSize())
    }, 3000)

    setPending(getPendingSyncCount())
    setStorage(checkLocalStorageSize())

    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

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

  var showStorageWarning = storage && storage.isWarning && online && pending === 0 && !syncing

  if (online && pending === 0 && !syncing && !showStorageWarning) return null

  return (
    <div style={{
      position:     'fixed',
      bottom:       '1rem',
      right:        '1rem',
      zIndex:       500,
      background:   online ? (syncing ? '#e8f5fc' : 'var(--color-warning-light)') : 'var(--color-error-light)',
      border:       '2px solid ' + (online ? (syncing ? '#2484bb' : 'var(--color-warning)') : 'var(--color-error)'),
      borderRadius: 'var(--radius-lg)',
      padding:      '0.625rem 1rem',
      boxShadow:    'var(--shadow-lg)',
      maxWidth:     '17.5rem',
      fontSize:     'var(--font-size-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
        <span style={{ fontSize: '1.1rem' }}>
          {!online ? '📵' : syncing ? '🔄' : showStorageWarning ? '⚠️' : '⏳'}
        </span>
        <span style={{ color: online ? (syncing ? '#2484bb' : 'var(--color-warning)') : 'var(--color-error)' }}>
          {!online
            ? 'Offline – kein Internet'
            : syncing
            ? 'Wird synchronisiert …'
            : showStorageWarning
            ? 'Speicher fast voll'
            : pending + ' Änderung' + (pending !== 1 ? 'en' : '') + ' nicht gespeichert'}
        </span>
      </div>

      {!online && (
        <p style={{ margin: '0.375rem 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          Dein Fortschritt wird lokal gespeichert und beim nächsten Online-Gang automatisch übertragen.
        </p>
      )}

      {online && pending > 0 && !syncing && (
        <div style={{ marginTop: '0.5rem' }}>
          <button onClick={doSync}
            style={{ background: 'var(--color-warning)', color: 'white', border: 0, borderRadius: 'var(--radius-md)', padding: '0.375rem 0.75rem', fontSize: 'var(--font-size-xs)', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
            Jetzt synchronisieren
          </button>
        </div>
      )}

      {showStorageWarning && (
        <p style={{ margin: '0.375rem 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-warning)' }}>
          {storage.usedMB} MB belegt.
          {storage.isCritical ? ' Bitte Browser-Cache leeren.' : ' Fortschritt wird trotzdem gespeichert.'}
        </p>
      )}

      {lastSync && online && pending === 0 && !showStorageWarning && (
        <p style={{ margin: '0.25rem 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-success)' }}>
          ✓ Synchronisiert um {lastSync.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </div>
  )
}