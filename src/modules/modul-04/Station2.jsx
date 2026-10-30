// ============================================================
// Modul 04 · Station 2: KI unter Strom (Filmcheck)
// ARD-Film + 6 Richtig/Falsch-Fragen + Textalternative
// ============================================================

import React, { useState } from 'react'
import { FILM_FRAGEN } from './data.js'
import { InfoBox, WarningBox, MemoryBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#087f83'

export default function Station2({ done, onComplete, onSkip }) {
  const [phase,    setPhase]    = useState('film')   // film | quiz | ergebnis
  const [answers,  setAnswers]  = useState({})
  const [checked,  setChecked]  = useState(false)
  const [showAlt,  setShowAlt]  = useState(false)

  const allAnswered = FILM_FRAGEN.every(f => answers[f.id] !== undefined)
  const correctCount = FILM_FRAGEN.filter(f => answers[f.id] === f.richtig).length
  const passed = correctCount === FILM_FRAGEN.length

  function checkAnswers() {
    setChecked(true)
    if (passed) setTimeout(() => setPhase('ergebnis'), 500)
  }

  function retry() { setAnswers({}); setChecked(false) }

  // ── Ergebnis ──────────────────────────────────────────────

  if (phase === 'ergebnis' || done) return (
    <div className="card">
      <div className="station-counter">Station 2 von 5 · Filmcheck · Abgeschlossen</div>
      <div className="done-badge">✓ Filmcheck geschafft!</div>
      <h2 style={{ color: MOD_COLOR }}>Das hast du gelernt</h2>
      <p>KI braucht Rechenzentren mit leistungsfähigen Chips. Nicht nur das Rechnen, sondern auch die Kühlung verbraucht Energie. Besonders aufwendige Anwendungen wie KI-Videos können deutlich mehr Strom benötigen als kurze Texte. Deshalb lohnt es sich, KI bewusst einzusetzen.</p>
      <WarningBox title="Hinweis:">
        Die Mikrowellen-Vergleiche aus dem Film sind Beispiele und keine festen Verbrauchswerte für jede KI-Anfrage.
      </WarningBox>
      <MemoryBox>Nicht nur das Rechnen, auch die Kühlung verbraucht Energie. Videos brauchen mehr als Texte.</MemoryBox>
      {!done && (
        <div className="actions">
          <button className="btn btn-success" onClick={onComplete}>
            Station 2 abschließen · Achievement freischalten 🎬
          </button>
        </div>
      )}
      {done && <div className="done-badge" style={{ marginTop: 'var(--space-md)' }}>✓ Achievement: KI-Durchblicker 🎬</div>}
    </div>
  )

  // ── Quiz ──────────────────────────────────────────────────

  if (phase === 'quiz') return (
    <div className="card">
      <div className="station-counter">Station 2 von 5 · Filmcheck · Quiz</div>
      <h2 style={{ color: MOD_COLOR }}>🧠 Filmcheck: Richtig oder falsch?</h2>
      <p className="lead">Lies die sechs Aussagen. Wähle bei jeder <strong>Richtig</strong> oder <strong>Falsch</strong>.</p>

      {FILM_FRAGEN.map((f, i) => (
        <div key={f.id} style={{
          border: `2px solid ${checked ? (answers[f.id] === f.richtig ? 'var(--color-success)' : 'var(--color-error)') : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', marginBottom: 'var(--space-sm)',
          background: checked ? (answers[f.id] === f.richtig ? 'var(--color-success-light)' : 'var(--color-error-light)') : 'white',
        }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700 }}>{i + 1}. {f.aussage}</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[true, false].map(v => (
              <label key={String(v)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: checked ? 'default' : 'pointer', fontWeight: 700 }}>
                <input type="radio" name={f.id} checked={answers[f.id] === v}
                  onChange={() => !checked && setAnswers(a => ({ ...a, [f.id]: v }))}
                  disabled={checked}
                  style={{ accentColor: MOD_COLOR, width: '18px', height: '18px' }} />
                {v ? '✓ Richtig' : '✗ Falsch'}
              </label>
            ))}
          </div>
          {checked && (
            <p style={{ margin: '8px 0 0', fontSize: 'var(--font-size-sm)', fontWeight: 700,
              color: answers[f.id] === f.richtig ? 'var(--color-success)' : 'var(--color-error)' }}>
              {answers[f.id] === f.richtig ? '✓ ' : '✗ '}{f.erklaerung}
            </p>
          )}
        </div>
      ))}

      {checked && !passed && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          {correctCount} von {FILM_FRAGEN.length} Aussagen richtig. Alle müssen richtig sein.
          <div style={{ marginTop: '8px' }}>
            <button className="nav-btn" onClick={retry}>↺ Erneut versuchen</button>
          </div>
        </div>
      )}

      {!checked && (
        <div className="actions">
          <button className="btn btn-primary" onClick={checkAnswers} disabled={!allAnswered} style={{ background: MOD_COLOR }}>
            Antworten überprüfen ✓
          </button>
          <button className="nav-btn" onClick={retry}>Antworten zurücksetzen ↺</button>
        </div>
      )}
    </div>
  )

  // ── Film-Phase ────────────────────────────────────────────

  return (
    <div className="card">
      <div className="station-counter">Station 2 von 5 · KI unter Strom · Verstehen</div>
      <h2 style={{ color: MOD_COLOR }}>⚡ KI unter Strom</h2>
      <p className="lead">Was kostet eine KI-Anfrage unsere Umwelt?</p>

      {/* Film-Link */}
      <div style={{ background: '#103d54', color: 'white', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
        <p style={{ margin: '0 0 12px', fontWeight: 800 }}>
          Schau dir den kurzen ARD-Beitrag „Wie klimaschädlich ist Künstliche Intelligenz?" an.
          Achte besonders auf Rechenzentren, Kühlung und den Unterschied zwischen Texten und Videos.
        </p>
        <a href="https://www.ardmediathek.de/video/wissen-vor-acht-erde/wie-klimaschaedlich-ist-kuenstliche-intelligenz/ard/Y3JpZDovL2FyZC5kZS9wbGFuQVJEXzdkNjgzMDg3LTI0ZDktNGJiNi04ZWQ0LTNhZmE4MmI0NDJmZF9nYW56ZVNlbmR1bmc"
          target="_blank" rel="noopener"
          style={{ color: '#103d54', background: '#bff5e5', padding: '12px 20px', borderRadius: 'var(--radius-md)', fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
          ▶ Film in der ARD Mediathek ansehen ↗
        </a>
      </div>

      <InfoBox>
        ⏱️ Öffne den Film über den Link oben. Kehre anschließend zu dieser Seite zurück und starte den Filmcheck.
      </InfoBox>
      <WarningBox title="Film lässt sich nicht abspielen?">
        Das kann an den Sicherheitseinstellungen des Schulnetzes liegen.
        Du kannst stattdessen den <button className="nav-btn" onClick={() => setShowAlt(!showAlt)} style={{ display: 'inline', padding: '2px 8px', fontSize: '0.85rem' }}>Lesetext anzeigen</button>.
      </WarningBox>

      {/* Textalternative */}
      {showAlt && (
        <div style={{ background: '#f0fafb', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', marginBottom: 'var(--space-md)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '12px' }}>📄 Textalternative zum Film</div>
          <p><strong>KI-Anfragen und Rechenzentren:</strong> Wenn du eine Frage an eine KI stellst, wird sie in einem großen Rechenzentrum verarbeitet. Dort arbeiten viele leistungsfähige Computerchips gleichzeitig.</p>
          <p><strong>Kühlung:</strong> Diese Chips werden sehr heiß. Die Kühlung kann laut Schätzungen bis zu 30 % der gesamten Energie eines Rechenzentrums verbrauchen.</p>
          <p><strong>Transparenz:</strong> Große Technologieunternehmen veröffentlichen oft keine genauen Angaben darüber, wie viel Strom jede einzelne KI-Anfrage verbraucht.</p>
          <p><strong>Texte vs. Videos:</strong> Ein kurzer KI-generierter Text benötigt weniger Energie als ein KI-generiertes Bild oder Video. Videos sind deutlich aufwendiger.</p>
          <p><strong>Vergleich:</strong> Im Film wird die Erzeugung eines kurzen KI-Textes mit ungefähr acht Sekunden Mikrowellenbetrieb verglichen. Das ist eine Veranschaulichung, kein exakter Messwert.</p>
          <p><strong>Empfehlung:</strong> KI bewusst und nur dann einsetzen, wenn sie wirklich sinnvoll ist.</p>
          <WarningBox title="Hinweis:">Diese Zusammenfassung basiert auf dem ARD-Beitrag. Die Vergleichswerte sind Veranschaulichungen, keine allgemeingültigen Messwerte.</WarningBox>
        </div>
      )}

      <div className="actions">
        <button className="btn btn-primary" onClick={() => setPhase('quiz')} style={{ background: MOD_COLOR }}>
          Film angesehen – zum Filmcheck →
        </button>
        <button className="btn btn-ghost" onClick={() => { onSkip() }}>
          Film nicht erreichbar? Station überspringen →
        </button>
      </div>
    </div>
  )
}