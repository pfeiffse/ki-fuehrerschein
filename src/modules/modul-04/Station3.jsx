// ============================================================
// Modul 04 · Station 3: KI, Wasser und die Toilettenspülung
// Experiment 1: Klassenrechner
// Experiment 2: Toilettenvergleich mit Schätzung
// ============================================================

import React, { useState } from 'react'
import { MODELL } from './data.js'
import { WarningBox, MemoryBox, InfoBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#087f83'

export default function Station3({ done, onComplete }) {
  const [phase,      setPhase]      = useState('exp1')
  const [personen,   setPersonen]   = useState(25)
  const [tage,       setTage]       = useState(1)
  const [anfragen,   setAnfragen]   = useState(null)
  const [schaetzung, setSchaetzung] = useState(null)
  const [gespuelt,   setGespuelt]   = useState(0)
  const [revealed,   setRevealed]   = useState(false)
  const [quizAnswer, setQuizAnswer] = useState('')
  const [quizDone,   setQuizDone]   = useState(false)

  // Modellrechnung
  const gesamtAnfragen = personen * tage * 10
  const liter = (gesamtAnfragen / 1000) * MODELL.wasserPro1000Anfragen
  const modellSpuelungen = liter / MODELL.toilettenLiter

  function berechnen() {
    setAnfragen(gesamtAnfragen)
    setPhase('exp2')
  }

  function spuelen() {
    setGespuelt(prev => Math.min(prev + 1, 20))
  }

  function auflösen() {
    setRevealed(true)
  }

  function checkQuiz() {
    if (quizAnswer === '1') {
      setQuizDone(true)
    }
  }

  // ── Abschluss ─────────────────────────────────────────────

  if (phase === 'abschluss' || done) return (
    <div className="card">
      <div className="station-counter">Station 3 von 5 · Wasser · Abgeschlossen</div>
      <div className="done-badge">✓ Wasser-Experiment abgeschlossen!</div>
      <h2 style={{ color: MOD_COLOR }}>Was du gelernt hast</h2>
      <p>Viele kleine KI-Anfragen können sich zu einem spürbaren Wasserverbrauch summieren – besonders wenn viele Menschen gleichzeitig KI nutzen.</p>
      <WarningBox title="Wichtig:">
        Der Wert von {MODELL.wasserPro1000Anfragen} Litern für 1.000 Anfragen ist eine didaktische Näherung und keine Vorhersage für eine bestimmte KI. Tatsächliche Werte variieren stark.
      </WarningBox>
      <MemoryBox>Einzelne Verbräuche können sich bei großer Nutzung summieren. Zahlen zu Umweltwirkungen brauchen immer Kontext.</MemoryBox>
      {!done && (
        <div className="actions">
          <button className="btn btn-success" onClick={onComplete}>
            Station 3 abschließen · Achievement freischalten 💧
          </button>
        </div>
      )}
      {done && <div className="done-badge" style={{ marginTop: 'var(--sp-md)' }}>✓ Achievement: Wasser-Detektiv 💧</div>}
    </div>
  )

  // ── Experiment 2: Toilettenvergleich ──────────────────────

  if (phase === 'exp2') return (
    <div className="card">
      <div className="station-counter">Station 3 von 5 · Wasser · Experiment 2: Toilettenvergleich</div>
      <h2 style={{ color: MOD_COLOR }}>🚽 Wie viele Toilettenspülungen?</h2>

      <div className="compare-box">
        <div className="eyebrow">Ergebnis aus Experiment 1</div>
        <div className="big">💧 {liter.toFixed(1)} Liter</div>
        <p style={{ margin: '8px 0 0', fontSize: 'var(--fs-sm)' }}>
          {personen} Personen × {tage} Tag(e) × 10 Anfragen = <strong>{gesamtAnfragen.toLocaleString('de-DE')} Anfragen</strong><br />
          Modellwert: {MODELL.wasserPro1000Anfragen} Liter pro 1.000 Anfragen
        </p>
      </div>

      <WarningBox title="Modellwert:">
        Diese {MODELL.wasserPro1000Anfragen} Liter sind eine didaktische Näherung – keine exakte Messung für eine bestimmte KI.
        Tatsächliche Werte variieren stark je nach Rechenzentrum und Kühltechnik.
      </WarningBox>

      <InfoBox>
        <strong>Zwischenschritt:</strong> {gesamtAnfragen.toLocaleString('de-DE')} Anfragen → Modellwert {liter.toFixed(1)} Liter → Vergleich mit {MODELL.toilettenLiter}-Liter-Spülungen
      </InfoBox>

      <p style={{ fontWeight: 800, marginTop: 'var(--sp-lg)' }}>
        Wie viele Toilettenspülungen entsprechen {liter.toFixed(1)} Litern? Schätze zuerst!
      </p>

      {/* Virtuelle Spülkette */}
      {!revealed && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-md)', flexWrap: 'wrap', margin: 'var(--sp-md) 0' }}>
            <button className="btn btn-primary" onClick={spuelen} style={{ background: MOD_COLOR, fontSize: '1.2rem', padding: '14px 24px' }}>
              🚽 Spülen!
            </button>
            <div style={{ fontWeight: 900, fontSize: '1.5rem', color: MOD_COLOR }}>
              {gespuelt} × {MODELL.toilettenLiter} L = {(gespuelt * MODELL.toilettenLiter).toFixed(1)} L
            </div>
          </div>
          <p style={{ color: 'var(--c-muted)', fontSize: 'var(--fs-sm)' }}>
            Klicke auf „Spülen", bis du denkst, dass du {liter.toFixed(1)} Liter erreicht hast.
          </p>
          {gespuelt > 0 && (
            <div className="actions">
              <button className="btn btn-ghost" onClick={auflösen}>
                Meine Schätzung: {gespuelt} Spülungen – Auflösen!
              </button>
            </div>
          )}
        </>
      )}

      {/* Auflösung */}
      {revealed && (
        <>
          <div className="compare-box">
            <div className="eyebrow">Modellwert</div>
            <div className="big">🚽 ca. {Math.round(modellSpuelungen)} Spülungen</div>
            <p style={{ margin: '8px 0 0', fontSize: 'var(--fs-sm)' }}>
              {liter.toFixed(1)} Liter ÷ {MODELL.toilettenLiter} Liter pro Spülung ≈ {modellSpuelungen.toFixed(1)} Spülungen
            </p>
            {gespuelt > 0 && (
              <p style={{ margin: '8px 0 0', fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
                Deine Schätzung: {gespuelt} Spülungen –{' '}
                {Math.abs(gespuelt - Math.round(modellSpuelungen)) <= 2 ? '✓ Sehr nah dran!' : 'Interessant, oder?'}
              </p>
            )}
          </div>

          {/* Reflexionsfrage */}
          {!quizDone && (
            <>
              <p style={{ fontWeight: 800, marginTop: 'var(--sp-lg)' }}>
                Was zeigt dieses Experiment?
              </p>
              {[
                { value: '0', label: 'KI-Nutzung hat keinen Einfluss auf den Wasserverbrauch.' },
                { value: '1', label: 'Viele kleine KI-Anfragen können sich zu einem spürbaren Wasserverbrauch summieren.' },
                { value: '2', label: 'Man sollte KI nie benutzen, weil sie zu viel Wasser verbraucht.' },
              ].map(opt => (
                <label key={opt.value} className="option">
                  <input type="radio" name="s3quiz" value={opt.value}
                    checked={quizAnswer === opt.value}
                    onChange={() => setQuizAnswer(opt.value)} />
                  {opt.label}
                </label>
              ))}
              <div className="actions">
                <button className="btn btn-primary" onClick={checkQuiz} disabled={!quizAnswer} style={{ background: MOD_COLOR }}>
                  Antwort prüfen
                </button>
              </div>
              {quizAnswer && quizAnswer !== '1' && (
                <div className="feedback wrong" style={{ display: 'block' }}>
                  ❌ Noch nicht ganz. Das Modul soll nicht vermitteln, dass KI grundsätzlich vermieden werden muss – sondern dass bewusster Einsatz wichtig ist.
                </div>
              )}
            </>
          )}

          {quizDone && (
            <>
              <div className="feedback correct" style={{ display: 'block' }}>
                ✅ Richtig! Einzelne Verbräuche summieren sich bei großer Nutzung.
              </div>
              <div className="actions" style={{ marginTop: 'var(--sp-lg)' }}>
                <button className="btn btn-success" onClick={() => setPhase('abschluss')}>
                  Weiter zur Zusammenfassung →
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )

  // ── Experiment 1: Klassenrechner ──────────────────────────

  return (
    <div className="card">
      <div className="station-counter">Station 3 von 5 · Wasser · Vergleichen</div>
      <h2 style={{ color: MOD_COLOR }}>💧 KI, Wasser und die Toilettenspülung</h2>
      <p className="lead">Rechne aus, wie viele KI-Anfragen eure Klasse stellt – und vergleiche das mit Wasser.</p>

      <WarningBox title="Modellwert:">
        Dieses Experiment verwendet {MODELL.wasserPro1000Anfragen} Liter Wasser für 1.000 KI-Textanfragen als didaktische Näherung.
        Das ist kein exakter Messwert für eine bestimmte KI.
      </WarningBox>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-md)', margin: 'var(--sp-lg) 0' }}>
        <div>
          <label style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>
            Personen in eurer Klasse: <strong style={{ color: MOD_COLOR }}>{personen}</strong>
          </label>
          <input type="range" min="5" max="30" value={personen}
            onChange={e => setPersonen(Number(e.target.value))}
            style={{ width: '100%', accentColor: MOD_COLOR }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>
            <span>5</span><span>30</span>
          </div>
        </div>
        <div>
          <label style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>
            Nutzungstage: <strong style={{ color: MOD_COLOR }}>{tage}</strong>
          </label>
          <input type="range" min="1" max="7" value={tage}
            onChange={e => setTage(Number(e.target.value))}
            style={{ width: '100%', accentColor: MOD_COLOR }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>
            <span>1</span><span>7</span>
          </div>
        </div>
      </div>

      <div className="compare-box">
        <div className="eyebrow">Modellrechnung (Zielgröße: mindestens 1.000 Anfragen)</div>
        <div className="big">📊 {gesamtAnfragen.toLocaleString('de-DE')} Anfragen</div>
        <p style={{ margin: '8px 0 0', fontSize: 'var(--fs-sm)' }}>
          {personen} Personen × {tage} Tag(e) × 10 Anfragen pro Person und Tag
        </p>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={berechnen} style={{ background: MOD_COLOR }}>
          Weiter zum Toilettenvergleich →
        </button>
      </div>
    </div>
  )
}