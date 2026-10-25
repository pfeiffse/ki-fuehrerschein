// ============================================================
// KI-Führerschein · Plattformkopf
// Stil: Modul 5 (KI & Nachhaltigkeit) – dunkles Petrol #103d54
// ============================================================

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { studentLogout } from '../../lib/auth.js'

export default function PlatformHeader({ student, onLogout }) {
  const location = useLocation()

  function handleLogout() {
    studentLogout()
    onLogout()
  }

  return (
    <header style={{
      background:     '#103d54',
      color:          'white',
      padding:        '12px 20px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      gap:            '10px',
      flexWrap:       'wrap',
      position:       'sticky',
      top:            0,
      zIndex:         100,
      boxShadow:      '0 4px 16px #10395440',
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{
        color:          'white',
        textDecoration: 'none',
        fontWeight:     900,
        fontSize:       'clamp(1rem, 3vw, 1.2rem)',
        display:        'flex',
        alignItems:     'center',
        gap:            '8px',
      }}>
        🌍 KI-Führerschein
        <span style={{
          background:   'rgba(255,255,255,0.15)',
          border:       '1px solid rgba(255,255,255,0.3)',
          borderRadius: '99px',
          padding:      '2px 10px',
          fontSize:     '0.75rem',
          fontWeight:   700,
          letterSpacing: '0.05em',
        }}>
          Klasse 7
        </span>
      </Link>

      {/* Navigation */}
      <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {location.pathname !== '/dashboard' && (
          <Link to="/dashboard" style={{
            color:          'white',
            textDecoration: 'none',
            fontSize:       '0.9rem',
            opacity:        0.85,
            fontWeight:     700,
            padding:        '6px 12px',
            borderRadius:   '99px',
            border:         '1px solid rgba(255,255,255,0.3)',
          }}>
            ← Übersicht
          </Link>
        )}

        <span style={{
          fontSize:  '0.88rem',
          opacity:   0.85,
          padding:   '4px 10px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '99px',
        }}>
          👤 {student?.display_name ?? 'Schüler:in'}
        </span>

        <button onClick={handleLogout} style={{
          background:   'rgba(255,255,255,0.12)',
          border:       '1px solid rgba(255,255,255,0.3)',
          borderRadius: '99px',
          color:        'white',
          padding:      '6px 14px',
          fontSize:     '0.85rem',
          cursor:       'pointer',
          fontWeight:   700,
          fontFamily:   'inherit',
        }}>
          Abmelden
        </button>
      </nav>
    </header>
  )
}