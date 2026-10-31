// GameHeader - Gamification-Navigation mit XP und Level

import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { studentLogout } from '../../lib/auth.js'
import { getXP, getLevel } from '../../lib/achievements.js'

export default function GameHeader({ student, onLogout }) {
  const location = useLocation()
  const xp    = getXP()
  const level = getLevel(xp)
  const prevXP = level.level === 1 ? 0 : level.level === 2 ? 400 : level.level === 3 ? 900 : 1600
  const pct   = level.next ? Math.round(((xp - prevXP) / (level.next - prevXP)) * 100) : 100
  const [showConfirm, setShowConfirm] = useState(false)

  function handleLogout() { studentLogout(); onLogout() }

  return (
    <>
      <header style={{
        background: 'linear-gradient(135deg, #0f2a3d, #1a4a6b)',
        color: 'white', padding: '0.625rem 1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '0.75rem', flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 20px rgba(15,42,61,0.4)',
      }}>
        {/* Logo */}
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, fontSize: '1rem' }}>
          🤖 <span>KI-Führerschein</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '99px', padding: '0.125rem 0.5rem', fontSize: '0.7rem', fontWeight: 700 }}>Klasse 7</span>
        </Link>

        {/* XP + Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '12rem', maxWidth: '20rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.6)', borderRadius: '99px', padding: '0.25rem 0.625rem', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '0.9rem' }}>{level.icon}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#c4b5fd' }}>Lv.{level.level}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>⭐ {xp} XP</span>
              {level.next && <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{level.next} XP</span>}
            </div>
            <div style={{ height: '0.3rem', background: 'rgba(255,255,255,0.15)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', borderRadius: '99px', transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

        {/* Rechte Seite */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {location.pathname !== '/dashboard' && (
            <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700, padding: '0.375rem 0.75rem', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '99px' }}>
              ← Übersicht
            </Link>
          )}
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>👤 {student?.display_name ?? ''}</span>
          <button onClick={() => setShowConfirm(true)}
            style={{ background: 'rgba(220,38,38,0.25)', border: '1px solid rgba(220,38,38,0.5)', borderRadius: '99px', color: '#fca5a5', padding: '0.375rem 0.875rem', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700 }}>
            Abmelden
          </button>
        </div>
      </header>

      {/* Bestätigungsdialog */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '1.25rem', padding: '2rem', maxWidth: '22rem', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', textAlign: 'center' }}>

            {/* Icon */}
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔒</div>

            {/* Titel */}
            <h2 style={{ margin: '0 0 0.5rem', color: '#0f2a3d', fontSize: '1.25rem' }}>
              Gerät weitergeben?
            </h2>

            {/* Hinweis */}
            <div style={{ background: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '0.75rem', padding: '0.875rem', marginBottom: '1.25rem', textAlign: 'left' }}>
              <p style={{ margin: '0 0 0.5rem', fontWeight: 800, color: '#92400e', fontSize: '0.875rem' }}>
                ⚠️ Wichtig vor der Weitergabe:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#78350f', fontSize: '0.8rem', lineHeight: 1.6 }}>
                <li>Dein Fortschritt ist gespeichert</li>
                <li>Merke dir deinen Namen: <strong>{student?.display_name}</strong></li>
                <li>Beim nächsten Mal einfach wieder mit demselben Namen anmelden</li>
              </ul>
            </div>

            {/* Name-Erinnerung */}
            <div style={{ background: '#f0fdf4', border: '2px solid #4ade80', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '1.5rem' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#166534' }}>
                ✅ Dein Fortschritt wird in der Cloud gespeichert.<br/>
                Du kannst dich jederzeit wieder anmelden.
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowConfirm(false)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: '2px solid #e5e7eb', background: 'white', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', color: '#374151' }}>
                Weiterlernen
              </button>
              <button onClick={handleLogout}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: 'white', fontFamily: 'inherit', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }}>
                Abmelden 🔒
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
