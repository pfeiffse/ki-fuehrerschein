// ============================================================
// KI-Führerschein · Lehrkraft-Anmeldung
// Stil: Modul 5 – dunkles Petrol, Teal
// ============================================================

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
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

  const inputStyle = {
    width:        '100%',
    padding:      '12px',
    border:       '2px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    fontSize:     '1rem',
    fontFamily:   'inherit',
    background:   'var(--color-platform-pale)',
    transition:   'border-color var(--transition)',
  }

  return (
    <div style={{
      minHeight:      '100vh',
      background:     'var(--color-bg-gradient)',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        {/* Hero */}
        <div style={{
          background:   'var(--gradient-hero-dark)',
          color:        'white',
          borderRadius: 'var(--radius-2xl)',
          padding:      '36px',
          marginBottom: 'var(--space-lg)',
          textAlign:    'center',
          boxShadow:    'var(--shadow-lg)',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👩‍🏫</div>
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein · Klasse 7</div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.8rem' }}>Lehrkraft-Bereich</h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.9rem' }}>Klassenübersicht und Fortschrittsverfolgung</p>
        </div>

        {/* Formular */}
        <div className="card">
          <h2 style={{ marginTop: 0, color: 'var(--color-platform-teal)' }}>Anmelden</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="email" style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                E-Mail-Adresse
              </label>
              <input id="email" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@schule.de"
                autoComplete="email"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-platform-teal)'}
                onBlur={e  => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="password" style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                Passwort
              </label>
              <input id="password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'var(--color-platform-teal)'}
                onBlur={e  => e.target.style.borderColor = 'var(--color-border)'}
              />
            </div>

            {error && <div className="box-warning" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
              {loading ? 'Wird angemeldet …' : 'Anmelden →'}
            </button>
          </form>

          
        </div>
      </div>
    </div>
  )
}