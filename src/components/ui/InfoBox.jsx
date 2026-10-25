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

export function MemoryBox({ children }) {
  return (
    <div className="box-memory" role="note" aria-label="Merksatz">
      💡 {children}
    </div>
  )
}