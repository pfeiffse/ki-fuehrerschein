// ============================================================
// KI-Führerschein · Infobox-Komponenten
// Aufgabe · Info · Merksatz · Warnung
// ============================================================

import React from 'react'

/**
 * Aufgabenbox (gelb) – wie Modul 2 .task
 */
export function TaskBox({ children, title }) {
  return (
    <div className="box-task" role="note">
      {title && <strong>{title}<br /></strong>}
      {children}
    </div>
  )
}

/**
 * Informationsbox (blau) – wie Modul 2 .note
 */
export function InfoBox({ children, title }) {
  return (
    <div className="box-info" role="note">
      {title && <strong>{title}<br /></strong>}
      {children}
    </div>
  )
}

/**
 * Warnhinweis (rot) – wie Modul 2 .warning
 */
export function WarningBox({ children, title = 'Wichtig:' }) {
  return (
    <div className="box-warning" role="alert">
      {title && <strong>{title} </strong>}
      {children}
    </div>
  )
}

/**
 * Merksatz (grün) – wie Modul 2 .memory
 */
export function MemoryBox({ children }) {
  return (
    <div className="box-memory" role="note" aria-label="Merksatz">
      💡 {children}
    </div>
  )
}