// ============================================================
// KI-Führerschein · Anmeldeseite
// Schüler:innen geben Klassencode + Anzeigename ein
// ============================================================

import React, { useState } from 'react'
import { studentJoin } from '../../lib/auth.js'

export default function JoinPage({ onJoin }) {
  const [joinCode,     setJoinCode]     = useState('')
  const [displayName,  setDisplayName]  = useState('')
  const [error,        setError]        = useState('')
  const [loading,      setLoading]      = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!joinCode.trim())    { setError('Bitte gib den Klassencode ein.'); return }
    if (!displayName.trim()) { setError('Bitte gib deinen Namen ein.');    return }

    setLoading(true)
    const result = await studentJoin(joinCode, displayName)
    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      onJoin(result.student)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Hero */}
        <div style={{
          background:   'linear-gradient(135deg, #064c87, #1184cf)',
          color:        'white',
          borderRadius: 'var(--radius-xl)',
          padding:      'clamp(24px, 5vw, 40px)',
          marginBottom: 'var(--space-lg)',
          textAlign:    'center',
          boxShadow:    'var(--shadow-lg)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🤖</div>
          <h1 style={{ margin: '0 0 8px', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>
            KI-Führerschein
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>Klasse 7 · Lernplattform</p>
        </div>

        {/* Formular */}
        <div className="card">
          <h2 style={{ marginTop: 0, color: 'var(--color-platform)' }}>
            Anmelden
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Gib den Klassencode deiner Lehrkraft und deinen Namen ein.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {/* Klassencode */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="joinCode" style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Klassencode
              </label>
              <input
                id="joinCode"
                type="text"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                placeholder="z. B. KI7A42"
                maxLength={10}
                autoComplete="off"
                autoCapitalize="characters"
                style={{
                  width:        '100%',
                  padding:      '12px',
                  border:       '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize:     '1.2rem',
                  fontWeight:   700,
                  letterSpacing: '0.1em',
                  fontFamily:   'monospace',
                }}
              />
            </div>

            {/* Anzeigename */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="displayName" style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>
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
                }}
              />
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
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
              style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem' }}
            >
              {loading ? 'Wird angemeldet …' : 'Loslegen →'}
            </button>
          </form>

          {/* Lehrkraft-Link */}
          <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
            <a href="/lehrer" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              Lehrkraft-Anmeldung →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}