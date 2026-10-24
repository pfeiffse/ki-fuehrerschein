// ============================================================
// KI-Führerschein · 404-Seite
// ============================================================

import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🤖</div>
        <h1 style={{ color: 'var(--color-platform)' }}>Seite nicht gefunden</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Diese Seite existiert nicht. Vielleicht hast du dich vertippt?
        </p>
        <div className="actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            → Zur Startseite
          </button>
        </div>
      </div>
    </div>
  )
}