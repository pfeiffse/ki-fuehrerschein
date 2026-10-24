// ============================================================
// KI-Führerschein · Lehrkraft-Anmeldung
// ============================================================

import React, { useState } from 'react'
import { teacherLogin } from '../../lib/auth.js'

export default function TeacherLogin({ onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Bitte alle Felder ausfüllen.'); return }

    setLoading(true)
    const result = await teacherLogin(email, password)
    setLoading(false)

    if (result.error) setError(result.error)
    else onLogin(result.session)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{
          background:   'linear-gradient(135deg, #064c87, #1184cf)',
          color:        'white',
          borderRadius: 'var(--radius-xl)',
          padding:      '32px',
          marginBottom: 'var(--space-lg)',
          textAlign:    'center',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>👩‍🏫</div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.8rem' }}>Lehrkraft-Bereich</h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>KI-Führerschein · Klassenübersicht</p>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0, color: 'var(--color-platform)' }}>Anmelden</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="email" style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                E-Mail-Adresse
              </label>
              <input
                id="email" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@schule.de"
                autoComplete="email"
                style={{ width: '100%', padding: '12px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="password" style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                Passwort
              </label>
              <input
                id="password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ width: '100%', padding: '12px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}
              />
            </div>

            {error && <div className="box-warning" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? 'Wird angemeldet …' : 'Anmelden →'}
            </button>
          </form>

          <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
            <a href="/" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              ← Zur Schüler-Anmeldung
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}