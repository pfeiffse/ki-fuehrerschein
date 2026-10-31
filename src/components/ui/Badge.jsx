// ============================================================
// KI-Führerschein · Badge-Komponente
// Stil: Modul 5 – Gold für freigeschaltete Badges
// ============================================================

import React from 'react'

export default function Badge({ icon, title, description, unlocked = false }) {
  return (
    <div
      role="img"
      aria-label={`${title}: ${unlocked ? 'freigeschaltet' : 'noch nicht freigeschaltet'}`}
      style={{
        border:       `2px solid ${unlocked ? 'var(--color-gold-dark)' : 'var(--c-border)'}`,
        borderRadius: 'var(--radius-xl)',
        padding:      'var(--sp-md)',
        textAlign:    'center',
        background:   unlocked ? '#fff8db' : '#f5f9fc',
        filter:       unlocked ? 'none' : 'grayscale(1)',
        opacity:      unlocked ? 1 : 0.55,
        transition:   'all var(--transition)',
        transform:    unlocked ? 'translateY(-2px)' : 'none',
        boxShadow:    unlocked ? '0 6px 18px #ffcb6630' : 'none',
      }}
    >
      <div style={{ fontSize: '2.2rem', lineHeight: 1.4 }} aria-hidden="true">
        {icon}
      </div>
      <h3 style={{ margin: '6px 0 4px', fontSize: '1rem', color: unlocked ? 'var(--c-dark)' : 'var(--c-muted)' }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>
        {description}
      </p>
      {unlocked && (
        <div style={{ marginTop: '8px', fontSize: 'var(--fs-xs)', color: '#825300', fontWeight: 800 }}>
          ✓ Freigeschaltet
        </div>
      )}
    </div>
  )
}