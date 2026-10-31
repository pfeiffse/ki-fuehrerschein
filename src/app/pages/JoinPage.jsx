// JoinPage - Einfache Anmeldeseite

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { studentJoin } from '../../lib/auth.js'

export default function JoinPage({ onJoin }) {
  const [joinCode,    setJoinCode]    = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!joinCode.trim())    { setError('Bitte Klassencode eingeben.'); return }
    if (!displayName.trim()) { setError('Bitte Namen eingeben.'); return }
    setLoading(true)
    const result = await studentJoin(joinCode, displayName)
    setLoading(false)
    if (result.error) setError(result.error)
    else {
      if (result.restored) {
        // Kurz anzeigen dass Fortschritt wiederhergestellt wurde
        setError('') 
        // Kleiner Hinweis – dann weiterleiten
        setTimeout(() => onJoin(result.student), 800)
        setError('✅ Willkommen zurück! Dein Fortschritt wurde wiederhergestellt.')
      } else {
        onJoin(result.student)
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ background: 'white', borderRadius: 'var(--r-2xl)', padding: '2.5rem', maxWidth: '28rem', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🤖</div>
          <h1 style={{ margin: '0 0 0.25rem', color: 'var(--c-dark)' }}>KI-Führerschein</h1>
          <p style={{ margin: 0, color: 'var(--c-muted)', fontSize: '0.875rem' }}>Klasse 7 · Lernplattform</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.375rem' }}>Klassencode</label>
            <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="z. B. DEMO7A" maxLength={10} autoComplete="off"
              style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.1em' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.375rem' }}>Dein Name (oder Pseudonym)</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
              placeholder="z. B. Lena M." maxLength={50} autoComplete="off" />
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--c-muted)' }}>Du kannst auch ein Pseudonym verwenden. Kein echter Name nötig.</p>
          </div>
          {error && <div style={{ background: 'var(--c-error-bg)', color: 'var(--c-error)', borderRadius: 'var(--r-md)', padding: '0.75rem', marginBottom: '1rem', fontWeight: 700, fontSize: '0.875rem' }}>{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem' }}>
            {loading ? 'Wird angemeldet …' : 'Loslegen →'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--c-border)', paddingTop: '1rem' }}>
          <Link to="/lehrer" style={{ fontSize: '0.8rem', color: 'var(--c-muted)' }}>Lehrkraft-Anmeldung →</Link>
        </div>
      </div>
    </div>
  )
}