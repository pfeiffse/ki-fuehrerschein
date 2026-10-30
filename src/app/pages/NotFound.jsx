// KI-Fuehrerschein - 404-Seite

import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-lg)' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>🤖</div>
        <h1 style={{ color: 'var(--color-platform-teal)' }}>Seite nicht gefunden</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
          Diese Seite existiert nicht. Vielleicht hast du dich vertippt?
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/')}
            style={{ background: 'var(--color-platform-teal)' }}>
            → Zur Startseite
          </button>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← Zurück
          </button>
        </div>
        <div style={{ marginTop: 'var(--space-xl)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          <Link to="/lehrer" style={{ color: 'var(--color-text-muted)', marginRight: 'var(--space-md)' }}>Lehrkraft-Anmeldung</Link>
          <Link to="/datenschutz" style={{ color: 'var(--color-text-muted)' }}>Datenschutz</Link>
        </div>
      </div>
    </div>
  )
}