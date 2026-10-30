// ============================================================
// KI-Führerschein · Footer
// Datenschutz-Link + Impressum-Hinweis
// ============================================================

import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer({ student }) {
  return (
    <footer style={{
      background:   '#103d54',
      color:        'rgba(255,255,255,0.7)',
      padding:      '16px 20px',
      textAlign:    'center',
      fontSize:     'var(--font-size-xs)',
      marginTop:    'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span>KI-Führerschein · Klasse 7</span>
        <Link to="/datenschutz" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
          onMouseOver={e => e.target.style.color = 'white'}
          onMouseOut={e  => e.target.style.color = 'rgba(255,255,255,0.7)'}>
          🔒 Datenschutz
        </Link>
        {student && (
          <Link to="/meine-daten" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
            onMouseOver={e => e.target.style.color = 'white'}
            onMouseOut={e  => e.target.style.color = 'rgba(255,255,255,0.7)'}>
            📦 Meine Daten
          </Link>
        )}
        <span style={{ opacity: 0.5 }}>
          Alle Daten auf EU-Servern · Kein Klarname gespeichert
        </span>
      </div>
    </footer>
  )
}