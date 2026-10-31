// ============================================================
// KI-Führerschein · Quiz-Komponente
// Stil: Modul 5 – Teal, Gold, Petrol
// ============================================================

import React, { useState } from 'react'

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
  const [selected, setSelected] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [locked,   setLocked]   = useState(done)

  function handleCheck() {
    if (!selected) { setFeedback('empty'); return }
    const correct     = selected === answer
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    setFeedback(correct ? 'correct' : 'wrong')
    onAttempt?.(correct, newAttempts)
    if (correct) { setLocked(true); onCorrect?.(points) }
    else if (!allowRetry) { setLocked(true) }
  }

  function handleReset() { setSelected(''); setFeedback(null) }

  return (
    <div aria-live="polite">
      <p style={{ fontWeight: 800, marginBottom: 'var(--sp-sm)', color: 'var(--color-text)' }}>
        {question}
      </p>

      <div role="radiogroup" aria-label={question}>
        {options.map(opt => (
          <label key={opt.value} className="option" style={{
            cursor:      locked ? 'default' : 'pointer',
            opacity:     locked && selected !== opt.value ? 0.7 : 1,
          }}>
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
            <div style={{ marginTop: '10px' }}>
              <button className="nav-btn" onClick={handleReset} style={{ fontSize: '0.85rem' }}>
                ↺ Erneut versuchen
              </button>
            </div>
          )}
        </div>
      )}

      {/* Prüfen-Button */}
      {!locked && feedback !== 'correct' && (
        <div className="actions">
          <button className="btn btn-primary" onClick={handleCheck} disabled={!selected}>
            Prüfen · {points} Punkte
          </button>
        </div>
      )}

      {locked && feedback === 'correct' && (
        <div style={{ marginTop: 'var(--sp-sm)', color: 'var(--c-success)', fontWeight: 800, fontSize: 'var(--fs-sm)' }}>
          ✓ Erledigt
        </div>
      )}
    </div>
  )
}