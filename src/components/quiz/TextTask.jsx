// ============================================================
// KI-Führerschein · Freitext-Aufgabe
// Stil: Modul 5 – Teal, Petrol
// ============================================================

import React, { useState } from 'react'

export default function TextTask({
  id,
  label,
  placeholder = 'Schreibe hier deine Antwort …',
  minLength   = 20,
  points      = 5,
  done        = false,
  savedValue  = '',
  onSave,
}) {
  const [value,    setValue]    = useState(savedValue)
  const [feedback, setFeedback] = useState(null)
  const [locked,   setLocked]   = useState(done)

  function handleSave() {
    if (value.trim().length < minLength) { setFeedback('short'); return }
    setLocked(true); setFeedback('saved')
    onSave?.(value.trim(), points)
  }

  const charCount  = value.trim().length
  const sufficient = charCount >= minLength

  return (
    <div>
      <label htmlFor={id} style={{ fontWeight: 800, display: 'block', marginBottom: '6px', color: 'var(--color-text)' }}>
        {label}
      </label>

      <textarea
        id={id}
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={locked}
        rows={4}
        style={{
          width:        '100%',
          padding:      '12px',
          border:       `2px solid ${locked ? 'var(--color-border)' : sufficient ? 'var(--color-platform-teal)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-lg)',
          font:         'inherit',
          fontSize:     'var(--font-size-base)',
          resize:       'vertical',
          background:   locked ? '#f7fbfc' : 'white',
          transition:   'border-color var(--transition)',
          lineHeight:   1.6,
        }}
        aria-describedby={`${id}-feedback`}
      />

      {/* Zeichenzähler */}
      {!locked && (
        <div style={{
          fontSize:  'var(--font-size-xs)',
          color:     sufficient ? 'var(--color-success)' : 'var(--color-text-muted)',
          marginTop: '4px',
          textAlign: 'right',
          fontWeight: sufficient ? 800 : 400,
        }}>
          {charCount} / {minLength} Zeichen {sufficient ? '✓' : '(Mindestlänge)'}
        </div>
      )}

      {/* Feedback */}
      <div id={`${id}-feedback`}>
        {feedback === 'short' && (
          <div className="feedback wrong" style={{ display: 'block' }}>
            Bitte formuliere eine etwas ausführlichere Antwort (mindestens {minLength} Zeichen).
          </div>
        )}
        {feedback === 'saved' && (
          <div className="feedback correct" style={{ display: 'block' }}>
            ✅ Gespeichert. Punkte wurden gutgeschrieben.
          </div>
        )}
      </div>

      {/* Hinweis */}
      {!locked && (
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          ℹ️ Diese Aufgabe wird für die Bearbeitung bewertet, nicht für den Inhalt.
        </p>
      )}

      {/* Speichern-Button */}
      {!locked && (
        <div className="actions">
          <button className="btn btn-success" onClick={handleSave} disabled={!sufficient}>
            Antwort speichern · {points} Punkte
          </button>
        </div>
      )}

      {locked && (
        <div style={{ marginTop: 'var(--space-sm)', color: 'var(--color-success)', fontWeight: 800, fontSize: 'var(--font-size-sm)' }}>
          ✓ Erledigt
        </div>
      )}
    </div>
  )
}