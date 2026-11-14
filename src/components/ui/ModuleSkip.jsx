// ModuleSkip - Modul überspringen mit Code (für Entwickler/Lehrkräfte)

import React, { useState } from 'react'
import { checkSkipCode } from '../../lib/devSkip.js'

export default function ModuleSkip({ onSkip, moduleName }) {
  const [open,    setOpen]    = useState(false)
  const [code,    setCode]    = useState('')
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (checkSkipCode(code)) {
      setSuccess(true)
      setTimeout(() => onSkip(), 800)
    } else {
      setError('Falscher Code.')
      setCode('')
    }
  }

  if (!open) return (
    <div style={{ textAlign: 'center', marginTop: 'var(--sp-lg)' }}>
      <button onClick={() => setOpen(true)}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 8px' }}>
        ··· Modul überspringen
      </button>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', maxWidth: '20rem', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
            <p style={{ fontWeight: 800, color: 'var(--c-success)' }}>{moduleName} übersprungen!</p>
          </div>
        ) : (
          <>
            <h3 style={{ margin: '0 0 0.25rem', color: 'var(--c-dark)' }}>🔑 Modul überspringen</h3>
            <p style={{ margin: '0 0 1rem', fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
              Nur für Lehrkräfte & Entwickler. Code eingeben:
            </p>
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                value={code}
                onChange={e => { setCode(e.target.value); setError('') }}
                placeholder="Code eingeben …"
                autoFocus
                style={{ width: '100%', padding: '0.625rem', border: `2px solid ${error ? 'var(--c-error)' : 'var(--c-border)'}`, borderRadius: 'var(--r-md)', font: 'inherit', fontSize: '1rem', marginBottom: '0.5rem', boxSizing: 'border-box' }}
              />
              {error && <p style={{ color: 'var(--c-error)', fontSize: 'var(--fs-xs)', margin: '0 0 0.5rem', fontWeight: 700 }}>{error}</p>}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" style={{ flex: 1, background: 'var(--slzb-navy)', color: 'white', border: 'none', borderRadius: 'var(--r-md)', padding: '0.625rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Überspringen
                </button>
                <button type="button" onClick={() => { setOpen(false); setCode(''); setError('') }}
                  style={{ flex: 1, background: 'var(--c-pale2)', color: 'var(--c-dark)', border: '1px solid var(--c-border)', borderRadius: 'var(--r-md)', padding: '0.625rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Abbrechen
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
