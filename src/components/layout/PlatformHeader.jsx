// ============================================================
// KI-Führerschein · Plattformkopf
// Sticky, zeigt Schülername + Navigation
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
    <header
      style={{
        position:   'sticky',
        top:        0,
        zIndex:     100,
        background: 'linear-gradient(135deg, #064c87, #1184cf)',
        color:      'white',
        padding:    '10px 18px',
        display:    'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap:        '12px',
        flexWrap:   'wrap',
        boxShadow:  '0 4px 12px #064c8740',
      }}
    >
      {/* Logo / Titel */}
      <Link
        to="/dashboard"
        style={{
          color:          'white',
          textDecoration: 'none',
          fontWeight:     900,
          fontSize:       'clamp(1rem, 3vw, 1.3rem)',
          display:        'flex',
          alignItems:     'center',
          gap:            '8px',
        }}
      >
        🤖 KI-Führerschein
        <span style={{
          background:   'rgba(255,255,255,0.2)',
          borderRadius: '99px',
          padding:      '2px 10px',
          fontSize:     '0.78rem',
          fontWeight:   700,
        }}>
          Klasse 7
        </span>
      </Link>

      {/* Rechte Seite: Schülername + Abmelden */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {location.pathname !== '/dashboard' && (
          <Link
            to="/dashboard"
            style={{
              color:          'white',
              textDecoration: 'none',
              fontSize:       '0.9rem',
              opacity:        0.85,
            }}
          >
            ← Übersicht
          </Link>
        )}
        <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
          👤 {student?.display_name ?? 'Schüler:in'}
        </span>
        <button
          onClick={handleLogout}
          style={{
            background:   'rgba(255,255,255,0.15)',
            border:       '1px solid rgba(255,255,255,0.4)',
            borderRadius: '8px',
            color:        'white',
            padding:      '6px 12px',
            fontSize:     '0.85rem',
            cursor:       'pointer',
            fontWeight:   600,
          }}
        >
          Abmelden
        </button>
      </div>
    </header>
  )
}