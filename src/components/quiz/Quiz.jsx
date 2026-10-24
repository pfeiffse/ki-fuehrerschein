// ============================================================
// KI-Führerschein · Quiz-Komponente
// Single-Choice mit Feedback – wie Modul 2
// Unterstützt lernorientierte Wiederholungsversuche
// ============================================================

import React, { useState } from 'react'

/**
 * @param {string}   id          – eindeutige Aufgaben-ID
 * @param {string}   question    – Fragetext
 * @param {Array}    options     – [{ value, label }]
 * @param {string}   answer      – korrekter value
 * @param {number}   points      – Punkte bei richtiger Antwort
 * @param {boolean}  done        – bereits abgeschlossen (aus Fortschritt)
 * @param {boolean}  allowRetry  – Wiederholungsversuch erlaubt (Standard: true)
 * @param {string}   correctFeedback  – Text bei richtiger Antwort
 * @param {string}   wrongFeedback    – Text bei falscher Antwort
 * @param {function} onCorrect   – Callback(points) bei richtiger Antwort
 * @param {function} onAttempt   – Callback(correct, attempts) bei jedem Versuch
 */
export default function Quiz({
  id,
  question,
  options = [],
  answer,
  points = 5,
  done = false,
  allowRetry = true,
  correctFeedback = 'Richtig! Gut gemacht.',
  wrongFeedback   = 'Noch nicht ganz. Lies die Aufgabe noch einmal und versuche es erneut.',
  onCorrect,
  onAttempt,
}) {
  const [selected,  setSelected]  = useState('')
  const [feedback,  setFeedback]  = useState(null)   // null | 'correct' | 'wrong'
  const [attempts,  setAttempts]  = useState(0)
  const [locked,    setLocked]    = useState(done)

  function handleCheck() {
    if (!selected) {
      setFeedback('empty')
      return
    }

    const correct    = selected === answer
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    setFeedback(correct ? 'correct' : 'wrong')

    onAttempt?.(correct, newAttempts)

    if (correct) {
      setLocked(true)
      onCorrect?.(points)
    } else if (!allowRetry) {
      setLocked(true)
    }
  }

  function handleReset() {
    setSelected('')
    setFeedback(null)
  }

  return (
    <div
      style={{ opacity: locked && !feedback?.startsWith('correct') ? 0.75 : 1 }}
      aria-live="polite"
    >
      <p style={{ fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
        {question}
      </p>

      {/* Optionen */}
      <div role="radiogroup" aria-label={question}>
        {options.map(opt => (
          <label
            key={opt.value}
            className="option"
            style={{
              cursor:      locked ? 'default' : 'pointer',
              borderColor: selected === opt.value ? '#8bbde3' : undefined,
            }}
          >
            <input
              type="radio"
              name={id}
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => !locked && setSelected(opt.value)}
              disabled={locked}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* Feedback */}
      {feedback === 'empty' && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          Bitte wähle zuerst eine Antwort aus.
        </div>
      )}
      {feedback === 'correct' && (
        <div className="feedback correct" style={{ display: 'block' }}>
          ✅ {correctFeedback}
        </div>
      )}
      {feedback === 'wrong' && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ {wrongFeedback}
          {allowRetry && (
            <div style={{ marginTop: '8px' }}>
              <button className="btn btn-ghost" onClick={handleReset}
                style={{ fontSize: '0.85rem', padding: '6px 12px', minHeight: '36px' }}>
                ↺ Erneut versuchen
              </button>
            </div>
          )}
        </div>
      )}

      {/* Prüfen-Button */}
      {!locked && feedback !== 'correct' && (
        <div className="actions">
          <button
            className="btn btn-primary"
            onClick={handleCheck}
            disabled={!selected}
          >
            Prüfen · {points} Punkte
          </button>
        </div>
      )}

      {/* Abgeschlossen-Anzeige */}
      {locked && feedback === 'correct' && (
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