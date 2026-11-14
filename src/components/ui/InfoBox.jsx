// ============================================================
// KI-Führerschein · Infobox-Komponenten
// Stil: Modul 5 – Teal, Gold, Petrol
// ============================================================

import React from 'react'

export function TaskBox({ children, title }) {
  return (
    <div className="box-task" role="note">
      {title && <strong>{title}<br /></strong>}
      {children}
    </div>
  )
}

export function InfoBox({ children, title }) {
  return (
    <div className="box-info" role="note">
      {title && <strong>{title}<br /></strong>}
      {children}
    </div>
  )
}

export function WarningBox({ children, title = 'Wichtig:' }) {
  return (
    <div className="box-warning" role="alert">
      {title && <strong>{title} </strong>}
      {children}
    </div>
  )
}

export function MemoryBox({ children, arbeitsblatt = true }) {
  if (arbeitsblatt) {
    return (
      <div className="merksatz-highlight" role="note" aria-label="Merksatz – auf Arbeitsblatt übertragen">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>💡</span>
          <div style={{ fontWeight: 700, color: '#78350f', lineHeight: 1.5 }}>{children}</div>
        </div>
      </div>
    )
  }
  return (
    <div className="box-memory" role="note" aria-label="Merksatz">
      💡 {children}
    </div>
  )
}