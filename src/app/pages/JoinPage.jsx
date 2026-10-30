// ============================================================
// KI-Führerschein · Anmeldeseite
// Stil: Modul 5 – dunkles Petrol, Teal, Gold
// ============================================================

import React, { useState } from 'react'
import { studentJoin } from '../../lib/auth.js'

export default function JoinPage({ onJoin }) {
  const [joinCode,    setJoinCode]    = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    

    setLoading(true)
    const result = await studentJoin(joinCode, displayName)
    setLoading(false)

    if (result.error) setError(result.error)
    else onJoin(result.student)
  }

  return (
    <div style={{
      minHeight:       '100vh',
      background:      'var(--color-bg-gradient)',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      padding:         '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Hero */}
        <div style={{
          background:   'var(--gradient-hero-dark)',
          color:        'white',
          borderRadius: 'var(--radius-2xl)',
          padding:      'clamp(28px, 5vw, 44px)',
          marginBottom: 'var(--space-lg)',
          textAlign:    'center',
          boxShadow:    'var(--shadow-lg)',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🌍</div>
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein · Klasse 7</div>
          <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(1.8rem, 5vw, 2.4rem)' }}>
            Willkommen!
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '1rem' }}>
            Melde dich mit dem Klassencode deiner Lehrkraft an.
          </p>
        </div>

        {/* Formular */}
        <div className="card">
          <h2 style={{ marginTop: 0, color: 'var(--color-platform-teal)' }}>
            Anmelden
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            {/* Klassencode */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="joinCode" style={{ fontWeight: 800, display: 'block', marginBottom: '6px', color: 'var(--color-text)' }}>
                Klassencode
              </label>
              <input
                id="joinCode"
                type="text"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="z. B. TEST01"
                maxLength={10}
                autoComplete="off"
                autoCapitalize="characters"
                style={{
                  width:         '100%',
                  padding:       '14px',
                  border:        '2px solid var(--color-border)',
                  borderRadius:  'var(--radius-md)',
                  fontSize:      '1.3rem',
                  fontWeight:    900,
                  letterSpacing: '0.15em',
                  fontFamily:    'monospace',
                  color:         'var(--color-platform)',
                  background:    'var(--color-platform-pale)',
                  transition:    'border-color var(--transition)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-platform-teal)'}
                onBlur={e  => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            {/* Anzeigename */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="displayName" style={{ fontWeight: 800, display: 'block', marginBottom: '6px', color: 'var(--color-text)' }}>
                Dein Name (oder Pseudonym)
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="z. B. Lena M."
                maxLength={50}
                autoComplete="off"
                style={{
                  width:        '100%',
                  padding:      '12px',
                  border:       '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize:     '1rem',
                  fontFamily:   'inherit',
                  transition:   'border-color var(--transition)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-platform-teal)'}
                onBlur={e  => e.target.style.borderColor = 'var(--color-border)'}
              />
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                Du kannst auch ein Pseudonym verwenden. Es werden keine persönlichen Daten gespeichert.
              </p>
            </div>

            {/* Fehler */}
            {error && (
              <div className="box-warning" style={{ marginBottom: 'var(--space-md)' }}>
                {error}
              </div>
            )}

            {/* Absenden */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem', padding: '15px' }}
            >
              {loading ? 'Wird angemeldet …' : 'Loslegen →'}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  )
}