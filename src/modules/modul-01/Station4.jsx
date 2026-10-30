// ============================================================
// Modul 01 · Station 4: Satzwerkstatt
// Didaktik: Sprach-KI baut Sätze Schritt für Schritt auf
// ============================================================

import React, { useState } from 'react'
import { InfoBox, MemoryBox, WarningBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#2859d8'

const SW_STEPS = [
  {
    prompt: 'Wähle ein Subjekt:',
    options: [
      { id: 'hund-sg',  text: 'Der kleine Hund',     number: 'sg' },
      { id: 'hunde-pl', text: 'Die kleinen Hunde',    number: 'pl' },
      { id: 'katze-sg', text: 'Die neugierige Katze', number: 'sg' },
    ],
  },
  {
    prompt: 'Wähle ein Verb:',
    getOptions: (built) => {
      const num = built[0]?.number ?? 'sg'
      return [
        { id: 'rennt',    text: 'rennt',    number: 'sg', disabled: num === 'pl' },
        { id: 'rennen',   text: 'rennen',   number: 'pl', disabled: num === 'sg' },
        { id: 'schlaeft', text: 'schläft',  number: 'sg', disabled: num === 'pl' },
        { id: 'schlafen', text: 'schlafen', number: 'pl', disabled: num === 'sg' },
      ]
    },
  },
  {
    prompt: 'Wähle eine Ergänzung:',
    options: [
      { id: 'park',   text: 'durch den Park.' },
      { id: 'wiese',  text: 'über die Wiese.' },
      { id: 'garten', text: 'in den Garten.' },
    ],
  },
]

const S4_QUIZ = [
  { id: 0, text: 'Die KI legt zuerst den ganzen Satz fest und schreibt ihn dann auf.' },
  { id: 1, text: 'Die bisherigen Wörter beeinflussen, welche Fortsetzungen wahrscheinlich sind.' },
  { id: 2, text: 'Die grauen Felder zeigen die echten Regeln eines Sprachmodells.' },
  { id: 3, text: 'Der Zusammenhang ändert sich nicht, wenn neue Wörter hinzukommen.' },
]
const S4_EXPLAIN = [
  'Die KI legt nicht zuerst einen ganzen fertigen Satz fest – sie wählt Schritt für Schritt.',
  '',
  'Die grauen Felder zeigen nur die vereinfachten Regeln des Spiels, nicht echte KI-Logik.',
  'Der Zusammenhang verändert sich mit jedem neuen Textstück – das ist gerade der Kern.',
]

export default function Station4({
  swBuilt, setSwBuilt, s4Conclusion, setS4Conclusion,
  s4Order, s4Quiz, setS4Quiz, s4Feedback, setS4Feedback, onNext,
}) {
  const step = swBuilt.length

  function pickWord(option) {
    if (step >= SW_STEPS.length) return
    setSwBuilt([...swBuilt, option])
  }

  function goBack() {
    if (swBuilt.length > 0) setSwBuilt(swBuilt.slice(0, -1))
  }

  function reset() {
    setSwBuilt([])
    setS4Conclusion(0)
    setS4Quiz('')
    setS4Feedback('')
  }

  function checkQuiz() {
    if (!s4Quiz) { setS4Feedback('Bitte wähle eine Antwort aus.'); return }
    const id = parseInt(s4Quiz)
    if (id === 1) { setS4Feedback('correct'); setTimeout(() => setS4Conclusion(2), 600) }
    else setS4Feedback(S4_EXPLAIN[id])
  }

  // ── Merksatz ──────────────────────────────────────────────

  if (s4Conclusion === 2) return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>💡</div>
      <h2 style={{ color: MOD_COLOR }}>Merksatz · Station 4</h2>
      <MemoryBox>
        Eine Sprach-KI erzeugt Texte Schritt für Schritt.
        Was schon dasteht, beeinflusst, welche Wörter als nächstes wahrscheinlich sind.
      </MemoryBox>
      <WarningBox title="Didaktischer Hinweis:">
        Reale Sprachmodelle verwenden keine harte Liste erlaubter Wörter.
        Das Ausgrauen ist eine vereinfachte Spielmechanik.
      </WarningBox>
      <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
        <button className="btn btn-primary" onClick={onNext} style={{ background: MOD_COLOR }}>
          Zum Abschluss →
        </button>
      </div>
    </div>
  )

  // ── Abschlussfrage ────────────────────────────────────────

  if (s4Conclusion === 1) return (
    <div className="card">
      <div className="station-counter">Station 4 von 4 · Abschlussfrage</div>
      <h2 style={{ color: MOD_COLOR }}>Wie erzeugt eine Sprach-KI einen Satz?</h2>
      {s4Order.map(idx => {
        const q = S4_QUIZ[idx]
        return (
          <label key={q.id} className="option">
            <input type="radio" name="s4quiz" value={q.id}
              checked={s4Quiz === String(q.id)}
              onChange={() => { setS4Quiz(String(q.id)); setS4Feedback('') }} />
            {q.text}
          </label>
        )
      })}
      {s4Feedback && s4Feedback !== 'correct' && (
        <div className="feedback wrong" style={{ display: 'block' }}>❌ {s4Feedback}</div>
      )}
      {s4Feedback === 'correct' && (
        <div className="feedback correct" style={{ display: 'block' }}>
          ✅ Genau! Die bisherigen Wörter beeinflussen, welche Fortsetzungen wahrscheinlich sind.
        </div>
      )}
      <div className="actions">
        <button className="btn btn-primary" onClick={checkQuiz} style={{ background: MOD_COLOR }}>
          Antwort prüfen
        </button>
        <button className="btn btn-ghost" onClick={reset}>↺ Neu starten</button>
      </div>
    </div>
  )

  // ── Satzwerkstatt ─────────────────────────────────────────

  const currentStep   = SW_STEPS[step]
  const currentOptions = currentStep?.getOptions
    ? currentStep.getOptions(swBuilt)
    : currentStep?.options ?? []
  const sentence = swBuilt.map(w => w.text).join(' ')
  const finished = step >= SW_STEPS.length

  return (
    <div className="card">
      <div className="station-counter">Station 4 von 4 · Satzwerkstatt</div>
      <h2 style={{ color: MOD_COLOR }}>Satzwerkstatt</h2>
      <p className="lead">
        Baue einen Satz Schritt für Schritt auf – genau wie eine Sprach-KI.
        Frühere Entscheidungen beeinflussen, welche Wörter als nächstes passen.
      </p>

      {/* Aktueller Satz */}
      <div style={{
        background: 'white', border: `2px solid ${MOD_COLOR}`,
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)',
        fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: 800,
        color: 'var(--color-platform)', minHeight: '70px',
        marginBottom: 'var(--space-lg)',
        display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px',
      }}>
        {swBuilt.length === 0
          ? <span style={{ color: 'var(--color-text-muted)', fontWeight: 400, fontSize: '1rem' }}>
              Dein Satz erscheint hier …
            </span>
          : swBuilt.map((w, i) => (
            <span key={i} style={{
              background:   i === swBuilt.length - 1 ? MOD_COLOR : '#dce8ff',
              color:        i === swBuilt.length - 1 ? 'white' : 'var(--color-platform)',
              borderRadius: 'var(--radius-md)', padding: '4px 10px',
              fontSize:     'clamp(0.9rem, 2vw, 1.1rem)', transition: 'all 0.2s',
            }}>{w.text}</span>
          ))}
      </div>

      {/* Optionen */}
      {!finished && currentStep && (
        <>
          <p style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: 'var(--space-sm)' }}>
            Schritt {step + 1} von {SW_STEPS.length}: {currentStep.prompt}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--space-md)' }}>
            {currentOptions.map(opt => (
              <button key={opt.id}
                onClick={() => !opt.disabled && pickWord(opt)}
                disabled={opt.disabled}
                style={{
                  border:       `2px solid ${opt.disabled ? '#e0e0e0' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius-lg)', padding: '12px 18px',
                  background:   opt.disabled ? '#f5f5f5' : 'linear-gradient(155deg, #fff, #eaf8f5)',
                  cursor:       opt.disabled ? 'not-allowed' : 'pointer',
                  fontWeight:   700, fontSize: '1rem', fontFamily: 'inherit',
                  color:        opt.disabled ? '#bbb' : 'var(--color-text)',
                  textAlign:    'left', transition: 'all 0.2s',
                  display:      'flex', alignItems: 'center', gap: '10px',
                }}>
                {opt.disabled
                  ? <span style={{ fontSize: '0.8rem', color: '#bbb' }}>⬜ Passt grammatikalisch nicht</span>
                  : <span style={{ color: MOD_COLOR }}>▶</span>}
                {opt.text}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Fertiger Satz */}
      {finished && (
        <div className="done-badge">✅ Dein Satz: „{sentence}"</div>
      )}

      {/* Navigation */}
      <div className="actions">
        {swBuilt.length > 0 && !finished && (
          <button className="btn btn-ghost" onClick={goBack}>← Einen Schritt zurück</button>
        )}
        <button className="btn btn-ghost" onClick={reset}>↺ Neuer Satz</button>
        {finished && (
          <button className="btn btn-primary" onClick={() => setS4Conclusion(1)} style={{ background: MOD_COLOR }}>
            Zur Abschlussfrage →
          </button>
        )}
      </div>

      <WarningBox title="Didaktischer Hinweis:">
        Das Ausgrauen ist eine vereinfachte Spielmechanik. Reale Sprachmodelle berechnen
        Wahrscheinlichkeiten für nächste Tokens und können auch grammatikalisch unpassende
        Texte erzeugen.
      </WarningBox>
    </div>
  )
}