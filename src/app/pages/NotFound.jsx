import React from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ textAlign: 'center', color: 'white', maxWidth: '28rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
        <h1 style={{ color: '#7dd3fc' }}>Seite nicht gefunden</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>Diese Seite existiert nicht. Vielleicht hast du dich vertippt?</p>
        <div className="actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-xp" onClick={() => navigate('/')}>→ Zur Startseite</button>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Zurück</button>
        </div>
        <div style={{ marginTop: '1.5rem', fontSize: '0.8rem' }}>
          <Link to="/lehrer" style={{ color: 'rgba(255,255,255,0.4)', marginRight: '1rem' }}>Lehrkraft-Anmeldung</Link>
          <Link to="/datenschutz" style={{ color: 'rgba(255,255,255,0.4)' }}>Datenschutz</Link>
        </div>
      </div>
    </div>
  )
}