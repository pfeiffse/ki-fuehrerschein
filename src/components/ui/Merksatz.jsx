// ============================================================
// KI-Führerschein · Merksatz-Komponente
// Grüne Box mit 💡 – wie Modul 2 .memory
// ============================================================

import React from 'react'

export default function Merksatz({ children, icon = '💡' }) {
  return (
    <div className="box-memory" role="note" aria-label="Merksatz">
      <span aria-hidden="true">{icon} </span>
      {children}
    </div>
  )
}