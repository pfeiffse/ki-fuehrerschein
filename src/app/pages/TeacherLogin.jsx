// TeacherLogin - Lehrkraft-Anmeldung

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { teacherLogin } from '../../lib/auth.js'

const INTERN_DOMAIN = '@ki-fuehrerschein.intern'

function buildEmail(input) {
  const trimmed = input.trim()
  if (trimmed.includes('@') && !trimmed.endsWith(INTERN_DOMAIN)) return trimmed
  const username = trimmed.replace(INTERN_DOMAIN, '').toLowerCase().replace(/[^a-z0-9]/g, '')
  return username + INTERN_DOMAIN
}

export default function TeacherLogin({ onLogin }) {
  const [login,    setLogin]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!login.trim() || !password) { setError('Bitte alle Felder ausfüllen.'); return }
    setLoading(true)
    const email  = buildEmail(login)
    const result = await teacherLogin(email, password)
    setLoading(false)
    if (result.error) setError(result.error)
    else onLogin(result.session)
  }

  const inp = {
    width: '100%', padding: '12px',
    border: '2px solid var(--c-border)',
    borderRadius: 'var(--r-md)',
    fontSize: '1rem', fontFamily: 'inherit',
    background: 'white', transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '26rem' }}>

        {/* Hero */}
        <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--r-2xl)', padding: '2rem', marginBottom: '1rem', textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>👩‍🏫</div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>KI-Führerschein · Klasse 7</div>
          <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.75rem' }}>Lehrkraft-Bereich</h1>
          <p style={{ margin: 0, opacity: 0.75, fontSize: '0.875rem' }}>Klassenübersicht und Fortschrittsverfolgung</p>
        </div>

        {/* Formular */}
        <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '2rem', boxShadow: 'var(--sh-lg)' }}>
          <h2 style={{ marginTop: 0, color: 'var(--c-dark)' }}>Anmelden</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="login" style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                Benutzername oder E-Mail
              </label>
              <input id="login" type="text" value={login}
                onChange={e => setLogin(e.target.value)}
                placeholder="z. B. musterfrau"
                autoComplete="username"
                style={inp}
                onFocus={e => e.target.style.borderColor = 'var(--c-teal)'}
                onBlur={e  => e.target.style.borderColor = 'var(--c-border)'}
              />
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--c-muted)' }}>
                Benutzername (z. B. musterfrau) oder vollständige E-Mail-Adresse
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password" style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>
                Passwort
              </label>
              <input id="password" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                style={inp}
                onFocus={e => e.target.style.borderColor = 'var(--c-teal)'}
                onBlur={e  => e.target.style.borderColor = 'var(--c-border)'}
              />
            </div>

            {error && (
              <div style={{ background: 'var(--c-error-bg)', color: 'var(--c-error)', borderRadius: 'var(--r-md)', padding: '0.75rem', marginBottom: '1rem', fontWeight: 700, fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem', background: 'var(--c-teal)' }}>
              {loading ? 'Wird angemeldet …' : 'Anmelden →'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--c-border)', paddingTop: '1rem' }}>
            <Link to="/" style={{ fontSize: '0.8rem', color: 'var(--c-muted)' }}>
              ← Zur Schüler-Anmeldung
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}