import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer({ student }) {
  return (
    <footer style={{ background: '#0f2a3d', color: 'rgba(255,255,255,0.5)', padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', marginTop: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span>KI-Führerschein · Klasse 7</span>
        <Link to="/datenschutz" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>🔒 Datenschutz</Link>
        {student && <Link to="/meine-daten" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>📦 Meine Daten</Link>}
        <span style={{ opacity: 0.4 }}>EU-Server · Kein Klarname gespeichert</span>
      </div>
    </footer>
  )
}