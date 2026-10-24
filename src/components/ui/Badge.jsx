// ============================================================
// KI-Führerschein · Badge-Komponente
// Wie Modul 2 .badge – gesperrt/freigeschaltet
// ============================================================

import React from 'react'

export default function Badge({ icon, title, description, unlocked = false }) {
  return (
    <div
      role="img"
      aria-label={`${title}: ${unlocked ? 'freigeschaltet' : 'noch nicht freigeschaltet'}`}
      style={{
        border:      `2px solid ${unlocked ? '#e2ac21' : '#d9e2ea'}`,
        borderRadius: 'var(--radius-lg)',
        padding:     'var(--space-md)',
        textAlign:   'center',
        background:  unlocked ? '#fff8db' : '#f6f8fa',
        filter:      unlocked ? 'none' : 'grayscale(1)',
        opacity:     unlocked ? 1 : 0.55,
        transition:  'all var(--transition)',
        transform:   unlocked ? 'translateY(-2px)' : 'none',
      }}
    >
      <div style={{ fontSize: '2rem', lineHeight: 1.4 }} aria-hidden="true">
        {icon}
      </div>
      <h3 style={{ margin: '6px 0 4px', fontSize: '1rem' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
        {description}
      </p>
      {unlocked && (
        <div style={{
          marginTop:    '8px',
          fontSize:     'var(--font-size-xs)',
          color:        '#b8860b',
          fontWeight:   700,
        }}>
          ✓ Freigeschaltet
        </div>
      )}
    </div>
  )
}