// ============================================================
// KI-Führerschein · Freitext-Aufgabe
// Wie Modul 2 .text-task – mit Mindestlänge
// WICHTIG: Freitext ≠ fachliche Leistung (Übergabedokument Abschnitt 4)
// Fortschritt und Leistung werden getrennt behandelt.
// ============================================================

import React, { useState } from 'react'

/**
 * @param {string}   id           – eindeutige Aufgaben-ID
 * @param {string}   label        – Beschriftung des Textfelds
 * @param {string}   placeholder  – Platzhaltertext
 * @param {number}   minLength    – Mindestlänge (Standard: 20)
 * @param {number}   points       – Punkte für Bearbeitung (kein inhaltlicher Check)
 * @param {boolean}  done         – bereits abgeschlossen
 * @param {string}   savedValue   – gespeicherter Wert (aus Fortschritt)
 * @param {function} onSave       – Callback(value, points)
 */
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
    if (value.trim().length < minLength) {
      setFeedback('short')
      return
    }
    setLocked(true)
    setFeedback('saved')
    onSave?.(value.trim(), points)
  }

  return (
    <div>
      <label htmlFor={id} style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>
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
          padding:      '10px',
          border:       '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          font:         'inherit',
          fontSize:     'var(--font-size-base)',
          resize:       'vertical',
          background:   locked ? '#f8f8f8' : 'white',
        }}
        aria-describedby={`${id}-feedback`}
      />

      {/* Zeichenzähler */}
      {!locked && (
        <div style={{
          fontSize: 'var(--font-size-xs)',
          color:    value.trim().length >= minLength
                      ? 'var(--color-success)'
                      : 'var(--color-text-muted)',
          marginTop: '4px',
          textAlign: 'right',
        }}>
          {value.trim().length} / {minLength} Zeichen (Mindestlänge)
        </div>
      )}

      {/* Feedback */}
      <div id={`${id}-feedback`}>
        {feedback === 'short' && (
          <div className="feedback wrong" style={{ display: 'block' }}>
            Bitte formuliere eine etwas ausführlichere Antwort
            (mindestens {minLength} Zeichen).
          </div>
        )}
        {feedback === 'saved' && (
          <div className="feedback correct" style={{ display: 'block' }}>
            ✅ Gespeichert. Punkte wurden gutgeschrieben.
          </div>
        )}
      </div>

      {/* Hinweis: Fortschritt ≠ Leistung */}
      {!locked && (
        <p style={{
          fontSize: 'var(--font-size-xs)',
          color:    'var(--color-text-muted)',
          marginTop: '4px',
        }}>
          ℹ️ Diese Aufgabe wird für die Bearbeitung bewertet, nicht für den Inhalt.
        </p>
      )}

      {/* Speichern-Button */}
      {!locked && (
        <div className="actions">
          <button
            className="btn btn-success"
            onClick={handleSave}
            disabled={value.trim().length < minLength}
          >
            Antwort speichern · {points} Punkte
          </button>
        </div>
      )}

      {locked && (
        <div style={{
          marginTop:  'var(--space-sm)',
          color:      'var(--color-success)',
          fontWeight: 700,
          fontSize:   'var(--font-size-sm)',
        }}>
          ✓ Erledigt
        </div>
      )}
    </div>
  )
}