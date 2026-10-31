// ============================================================
// Modul 04 · Station 4: KI und Handy-Akku
// Regler 0-150 Anfragen, Formel sichtbar, Quiz
// Modellannahmen: 0,3 Wh/Anfrage, 15 Wh Akku
// ============================================================

import React, { useState } from 'react'
import { MODELL } from './data.js'
import { WarningBox, MemoryBox, InfoBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#087f83'

export default function Station4({ done, onComplete }) {
  const [anfragen,   setAnfragen]   = useState(50)
  const [quizAnswer, setQuizAnswer] = useState('')
  const [quizDone,   setQuizDone]   = useState(false)
  const [quizFeedback, setQuizFeedback] = useState(null)

  const energie    = anfragen * MODELL.energieProAnfrage          // Wh
  const anteil     = Math.min(1, energie / MODELL.akkuWh)         // 0-1
  const ladungen   = energie / MODELL.akkuWh                      // Anzahl Akkuladungen
  const verbleibend = Math.max(0, MODELL.akkuWh - energie)        // Wh verbleibend

  // Richtige Antwort: 50 Anfragen × 0,3 Wh = 15 Wh = 1 Akkuladung
  function checkQuiz() {
    if (!quizAnswer) return
    if (quizAnswer === '1') {
      setQuizFeedback('correct')
      setQuizDone(true)
    } else {
      setQuizFeedback('wrong')
    }
  }

  if (done) return (
    <div className="card">
      <div className="station-counter">Station 4 von 5 · Handy-Akku · Abgeschlossen</div>
      <div className="done-badge">✓ Energie-Experiment abgeschlossen!</div>
      <MemoryBox>50 Anfragen × 0,3 Wh = 15 Wh ≈ 1 Akkuladung (Modellrechnung)</MemoryBox>
      <div className="done-badge" style={{ marginTop: 'var(--sp-md)' }}>✓ Achievement: Energie-Checker 🔋</div>
    </div>
  )

  return (
    <div className="card">
      <div className="station-counter">Station 4 von 5 · KI und Handy-Akku · Rechnen</div>
      <h2 style={{ color: MOD_COLOR }}>🔋 Wie viel Energie braucht eine KI-Anfrage?</h2>
      <p className="lead">Untersuche den Energiebedarf vieler kleiner KI-Anfragen anhand eines anschaulichen Rechenmodells.</p>

      <WarningBox title="Modellannahmen:">
        <strong>Kurze KI-Textanfrage:</strong> 0,3 Wh (Modellannahme)<br />
        <strong>Vergleichsakku:</strong> 15 Wh (Beispielwert)<br />
        Diese Werte sind Modellannahmen für Lernzwecke. Tatsächliche Werte variieren stark je nach KI-Modell und Anfrage.
        Es handelt sich um einen <strong>Energievergleich</strong>, nicht darum, dass KI-Anfragen den Akku deines Smartphones direkt entsprechend entladen.
      </WarningBox>

      {/* Regler */}
      <div style={{ margin: 'var(--sp-lg) 0' }}>
        <label style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>
          Anzahl KI-Textanfragen: <strong style={{ color: MOD_COLOR, fontSize: '1.3rem' }}>{anfragen}</strong>
        </label>
        <input type="range" min="0" max="150" value={anfragen}
          onChange={e => setAnfragen(Number(e.target.value))}
          style={{ width: '100%', accentColor: MOD_COLOR, height: '8px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', marginTop: '4px' }}>
          <span>0</span><span>50</span><span>100</span><span>150</span>
        </div>
      </div>

      {/* Formel sichtbar */}
      <div style={{ background: '#f0fafb', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)', border: '1px solid var(--c-border)', fontFamily: 'monospace', fontSize: '1rem' }}>
        <div style={{ color: 'var(--c-muted)', fontSize: 'var(--fs-xs)', marginBottom: '4px' }}>Rechenweg:</div>
        <strong>{anfragen} Anfragen × 0,3 Wh = <span style={{ color: MOD_COLOR }}>{energie.toFixed(1)} Wh</span></strong>
      </div>

      {/* Batterie-Visualisierung */}
      <div style={{ marginBottom: 'var(--sp-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap' }}>
          {/* Batterie-Symbol */}
          <div style={{ position: 'relative', width: '200px', height: '60px', flexShrink: 0 }}>
            <div style={{ position: 'absolute', inset: 0, border: `3px solid ${MOD_COLOR}`, borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${Math.min(100, anteil * 100)}%`,
                background: anteil >= 1 ? 'var(--c-error)' : anteil >= 0.7 ? 'var(--c-warn)' : MOD_COLOR,
                transition: 'width 0.3s ease, background 0.3s ease',
              }} />
            </div>
            {/* Batterie-Pol */}
            <div style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', width: '8px', height: '24px', background: MOD_COLOR, borderRadius: '0 4px 4px 0' }} />
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.3rem', color: MOD_COLOR }}>{energie.toFixed(1)} Wh</div>
            <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
              = {(anteil * 100).toFixed(0)} % eines {MODELL.akkuWh}-Wh-Akkus
            </div>
            {anteil >= 1 && <div style={{ color: 'var(--c-error)', fontWeight: 800, fontSize: 'var(--fs-sm)' }}>Mehr als 1 Akkuladung!</div>}
          </div>
        </div>
      </div>

      {/* Vergleichs-Box */}
      <div className="compare-box">
        <div className="eyebrow">Energievergleich (Modellrechnung)</div>
        <div className="big">🔋 {ladungen.toFixed(2)} Akkuladungen</div>
        <p style={{ margin: '8px 0 0', fontSize: 'var(--fs-sm)' }}>
          {energie.toFixed(1)} Wh ÷ {MODELL.akkuWh} Wh = {ladungen.toFixed(2)} Akkuladungen (Modell)<br />
          {verbleibend > 0
            ? `Verbleibend im Vergleichsakku: ${verbleibend.toFixed(1)} Wh`
            : `Der Vergleichsakku wäre ${(ladungen - 1).toFixed(2)} Mal überschritten.`}
        </p>
      </div>

      {/* Quiz */}
      {!quizDone && (
        <div style={{ marginTop: 'var(--sp-lg)' }}>
          <p style={{ fontWeight: 800 }}>
            Wie viele Anfragen entsprechen im Modell ungefähr einer vollständigen Akkuladung (15 Wh)?
          </p>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
            Tipp: Stelle den Regler auf verschiedene Werte und beobachte die Formel.
          </p>
          {[
            { value: '0', label: '10 Anfragen × 0,3 Wh = 3 Wh' },
            { value: '1', label: '50 Anfragen × 0,3 Wh = 15 Wh ✓' },
            { value: '2', label: '100 Anfragen × 0,3 Wh = 30 Wh' },
          ].map(opt => (
            <label key={opt.value} className="option">
              <input type="radio" name="s4quiz" value={opt.value}
                checked={quizAnswer === opt.value}
                onChange={() => { setQuizAnswer(opt.value); setQuizFeedback(null) }} />
              {opt.label}
            </label>
          ))}
          {quizFeedback === 'wrong' && (
            <div className="feedback wrong" style={{ display: 'block' }}>
              ❌ Noch nicht ganz. Stelle den Regler auf 50 und schau dir die Formel an: 50 × 0,3 Wh = 15 Wh = 1 Akkuladung.
            </div>
          )}
          <div className="actions">
            <button className="btn btn-primary" onClick={checkQuiz} disabled={!quizAnswer} style={{ background: MOD_COLOR }}>
              Antwort prüfen
            </button>
          </div>
        </div>
      )}

      {quizDone && (
        <>
          <div className="feedback correct" style={{ display: 'block' }}>
            ✅ Richtig! 50 × 0,3 Wh = 15 Wh = 1 Akkuladung (Modellrechnung).
          </div>
          <MemoryBox>
            Im Modell entsprechen 50 KI-Textanfragen einer Akkuladung von 15 Wh.
            Das ist ein Energievergleich – nicht der direkte Akkuverbrauch deines Smartphones.
          </MemoryBox>
          <div className="actions" style={{ marginTop: 'var(--sp-lg)' }}>
            <button className="btn btn-success" onClick={onComplete}>
              Station 4 abschließen · Achievement freischalten 🔋
            </button>
          </div>
        </>
      )}
    </div>
  )
}