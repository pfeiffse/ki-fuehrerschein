// SLZBArcs - Dekorative SVG-Bögen in SLZB-Hausfarben
// Übernommen vom Design des Kollegen (KI-Führerschein Gesamtpaket)

import React from 'react'

export function SLZBArcs({ small = false }) {
  if (small) return (
    <svg className="arcs" viewBox="0 0 300 64" preserveAspectRatio="xMaxYMid slice"
      aria-hidden="true" style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '260px', pointerEvents: 'none', opacity: 0.9 }}>
      <path d="M300 -6 C 210 2, 190 50, 300 70" fill="none" stroke="#ffb225" strokeWidth="7"/>
      <path d="M300 8 C 232 14, 220 50, 300 66" fill="none" stroke="#e70c14" strokeWidth="7"/>
      <path d="M300 22 C 254 26, 250 52, 300 62" fill="none" stroke="#1b1b1b" strokeWidth="7" opacity="0.85"/>
      <path d="M300 36 C 270 38, 268 54, 300 58" fill="none" stroke="#3aa533" strokeWidth="5"/>
    </svg>
  )
  return (
    <svg className="arcs" viewBox="0 0 1000 520" preserveAspectRatio="none"
      aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <path d="M1000 30 C 700 50, 640 300, 1000 470" fill="none" stroke="#ffb225" strokeWidth="16"/>
      <path d="M1000 82 C 760 100, 720 300, 1000 420" fill="none" stroke="#e70c14" strokeWidth="16"/>
      <path d="M1000 134 C 820 150, 800 300, 1000 370" fill="none" stroke="#1b1b1b" strokeWidth="16" opacity="0.85"/>
      <path d="M-20 505 C 300 425, 600 475, 1000 525" fill="none" stroke="#3aa533" strokeWidth="11"/>
      <path d="M-20 70 C 200 50, 260 400, 120 540" fill="none" stroke="#a0cfff" strokeWidth="2" opacity="0.45"/>
    </svg>
  )
}

// SLZB-Farbstreifen (gelb/rot/schwarz/grün) wie auf slzb.de
export function SLZBStripe() {
  return (
    <div style={{
      height: '4px',
      background: 'linear-gradient(90deg, #ffb225 0 25%, #e70c14 25% 50%, #1b1b1b 50% 75%, #3aa533 75%)',
      flexShrink: 0,
    }} />
  )
}
