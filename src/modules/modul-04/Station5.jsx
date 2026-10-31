// ============================================================
// Modul 04 · Station 5: KI im Alltag
// 13 Situationen, fachliche + persönliche Entscheidung
// Persönliche Regel, KI-Kompass
// ============================================================

import React, { useState } from 'react'
import { ALLTAG_SITUATIONEN, MODELL } from './data.js'
import { WarningBox, MemoryBox, InfoBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#087f83'

const KATEGORIEN = {
  hilfreich:   { label: '💡 Wirklich hilfreich',  color: 'var(--c-success)', bg: 'var(--c-success-bg)' },
  ueberflüssig:{ label: '🚫 Überflüssig',          color: 'var(--c-error)',   bg: 'var(--c-error-bg)'   },
  nachdenken:  { label: '⚖️ Erst nachdenken!',     color: 'var(--c-warn)', bg: 'var(--c-warn-bg)' },
}

export default function Station5({ done, onComplete, achieved, onDashboard }) {
  const [phase,       setPhase]       = useState('situationen')
  const [fachlich,    setFachlich]    = useState({})   // { id: kategorie }
  const [persoenlich, setPersoenlich] = useState({})   // { id: 'nutzen'|'verzichten' }
  const [checked,     setChecked]     = useState(false)
  const [regel,       setRegel]       = useState('')
  const [regelSaved,  setRegelSaved]  = useState(false)

  const allFachlich    = ALLTAG_SITUATIONEN.every(s => fachlich[s.id])
  const allPersoenlich = ALLTAG_SITUATIONEN.every(s => persoenlich[s.id])

  // Modell-Umweltbilanz
  const verzichtetAnzahl = Object.values(persoenlich).filter(v => v === 'verzichten').length
  const wasserMl  = verzichtetAnzahl * MODELL.wasserProAnfrageStation5
  const energieWh = verzichtetAnzahl * MODELL.energieProAnfrage

  function checkSituationen() {
    setChecked(true)
  }

  function weiterZuRegel() {
    setPhase('regel')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function saveRegel() {
    if (regel.trim().length < 10) return
    setRegelSaved(true)
    setPhase('abschluss')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Abschluss ─────────────────────────────────────────────

  if (phase === 'abschluss' || done) return (
    <div className="card">
      <div className="station-counter">Station 5 von 5 · KI im Alltag · Abgeschlossen</div>
      <div className="done-badge">✓ KI-Kompass erworben!</div>

      <h2 style={{ color: MOD_COLOR }}>🌱 Dein KI-Kompass</h2>

      {/* Persönliche Regel */}
      {regel && (
        <div style={{ background: '#f0fafb', borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', marginBottom: 'var(--sp-lg)', border: `2px solid ${MOD_COLOR}` }}>
          <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '8px' }}>Deine persönliche Regel:</div>
          <p style={{ margin: 0, fontStyle: 'italic', fontSize: '1.05rem' }}>„Bevor ich KI nutze, frage ich mich … {regel}"</p>
        </div>
      )}

      {/* Modell-Umweltbilanz */}
      {verzichtetAnzahl > 0 && (
        <div className="compare-box" style={{ marginBottom: 'var(--sp-lg)' }}>
          <div className="eyebrow">Modellvergleich deiner Entscheidungen</div>
          <div className="big">🌱 {verzichtetAnzahl} Anfragen vermieden</div>
          <p style={{ margin: '8px 0 0', fontSize: 'var(--fs-sm)' }}>
            Modellwert: {wasserMl.toFixed(1)} ml Wasser · {energieWh.toFixed(2)} Wh Strom
          </p>
          <WarningBox title="Wichtig:">
            Tatsächliche Werte variieren stark. Diese Modellwerte stellen keine exakt messbaren persönlichen Einsparungen dar.
          </WarningBox>
        </div>
      )}

      <MemoryBox>
        KI ist ein mächtiges Werkzeug – aber jede Anfrage kostet Ressourcen.
        Nutze KI bewusst und nur dann, wenn es wirklich sinnvoll ist.
      </MemoryBox>

      {!done && (
        <div className="actions">
          <button className="btn btn-success" onClick={onComplete}>
            Station 5 abschließen · Achievement freischalten 🌱
          </button>
        </div>
      )}
      {done && (
        <>
          <div className="done-badge" style={{ marginTop: 'var(--sp-md)' }}>✓ Achievement: KI-Zukunftsgestalter 🌱</div>
          {achieved && (
            <div style={{ marginTop: 'var(--sp-lg)', padding: 'var(--sp-lg)', background: '#fff8db', borderRadius: 'var(--r-xl)', border: '2px solid var(--color-gold-dark)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🌍</div>
              <h3 style={{ color: '#825300', margin: '0 0 8px' }}>Modul 4 vollständig abgeschlossen!</h3>
              <p style={{ color: 'var(--c-muted)', margin: '0 0 var(--sp-lg)' }}>
                Du hast alle 5 Stationen abgeschlossen und 5 Achievements erworben.
              </p>
              <button className="btn btn-primary" onClick={onDashboard} style={{ background: MOD_COLOR }}>
                Zur Modulübersicht →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )

  // ── Persönliche Regel ─────────────────────────────────────

  if (phase === 'regel') return (
    <div className="card">
      <div className="station-counter">Station 5 von 5 · KI im Alltag · Persönliche Regel</div>
      <h2 style={{ color: MOD_COLOR }}>🌱 Deine persönliche KI-Regel</h2>

      <p className="lead">Formuliere eine persönliche Regel für deinen Umgang mit KI.</p>

      <div style={{ background: '#f0fafb', borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', marginBottom: 'var(--sp-lg)', border: `2px solid ${MOD_COLOR}` }}>
        <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '12px', fontSize: '1.1rem' }}>
          Bevor ich KI nutze, frage ich mich …
        </div>
        <textarea value={regel} onChange={e => setRegel(e.target.value)}
          placeholder="z. B. … ob ich das auch selbst herausfinden könnte und ob KI hier wirklich hilft."
          rows={4} maxLength={300}
          style={{ width: '100%', padding: '12px', border: `2px solid ${regel.trim().length >= 10 ? MOD_COLOR : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', font: 'inherit', fontSize: '1rem', resize: 'vertical', lineHeight: 1.6 }} />
        <div style={{ fontSize: 'var(--fs-xs)', color: regel.trim().length >= 10 ? 'var(--c-success)' : 'var(--c-muted)', textAlign: 'right', marginTop: '4px', fontWeight: regel.trim().length >= 10 ? 800 : 400 }}>
          {regel.trim().length} / 300 Zeichen {regel.trim().length >= 10 ? '✓' : '(mindestens 10)'}
        </div>
      </div>

      {/* Reflexionsfragen */}
      <InfoBox title="Denkanstöße:">
        <ul style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: 2 }}>
          <li>Was hat dich in diesem Modul überrascht?</li>
          <li>Wo würdest du KI trotz Ressourcenverbrauch sinnvoll einsetzen?</li>
          <li>Auf welche KI-Nutzung könntest du ohne echten Nachteil verzichten?</li>
        </ul>
      </InfoBox>

      <div className="actions">
        <button className="btn btn-success" onClick={saveRegel} disabled={regel.trim().length < 10}>
          Regel speichern und Modul abschließen ✓
        </button>
      </div>
    </div>
  )

  // ── Situationen ───────────────────────────────────────────

  return (
    <div className="card">
      <div className="station-counter">Station 5 von 5 · KI im Alltag · Entscheiden</div>
      <h2 style={{ color: MOD_COLOR }}>🌱 KI im Alltag – sinnvoll oder nicht?</h2>
      <p className="lead">
        Beurteile 13 Alltagssituationen in zwei Schritten:
        Erst <strong>fachlich</strong> (wie ist die Situation einzuschätzen?),
        dann <strong>persönlich</strong> (wie entscheidest du dich?).
      </p>

      <InfoBox>
        <strong>Kategorien:</strong><br />
        💡 Wirklich hilfreich · 🚫 Überflüssig · ⚖️ Erst nachdenken!<br />
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>
          Eine persönlich begründete Nutzung trotz Ressourcenverbrauch kann sinnvoll sein.
        </span>
      </InfoBox>

      {ALLTAG_SITUATIONEN.map((s, i) => (
        <div key={s.id} style={{
          border: '1px solid var(--c-border)', borderRadius: 'var(--r-lg)',
          padding: 'var(--sp-md)', marginBottom: 'var(--sp-sm)',
          background: checked && fachlich[s.id] === s.kategorie ? 'var(--c-success-bg)' : 'white',
        }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700 }}>{i + 1}. {s.text}</p>

          {/* Fachliche Einschätzung */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 800, color: 'var(--c-muted)', marginBottom: '6px' }}>
              1. Fachliche Einschätzung:
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.entries(KATEGORIEN).map(([key, val]) => (
                <label key={key} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  border: `2px solid ${fachlich[s.id] === key ? val.color : 'var(--c-border)'}`,
                  borderRadius: 'var(--r-md)', padding: '6px 10px',
                  cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                  background: fachlich[s.id] === key ? val.bg : 'white',
                  transition: 'all 0.2s',
                }}>
                  <input type="radio" name={`fach-${s.id}`} value={key}
                    checked={fachlich[s.id] === key}
                    onChange={() => setFachlich(f => ({ ...f, [s.id]: key }))}
                    style={{ accentColor: MOD_COLOR }} />
                  {val.label}
                </label>
              ))}
            </div>
          </div>

          {/* Persönliche Entscheidung */}
          {fachlich[s.id] && (
            <div>
              <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 800, color: 'var(--c-muted)', marginBottom: '6px' }}>
                2. Meine persönliche Entscheidung:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { value: 'nutzen',    label: '✓ KI bewusst nutzen' },
                  { value: 'verzichten', label: '○ Auf KI verzichten' },
                ].map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    border: `2px solid ${persoenlich[s.id] === opt.value ? MOD_COLOR : 'var(--c-border)'}`,
                    borderRadius: 'var(--r-md)', padding: '6px 10px',
                    cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                    background: persoenlich[s.id] === opt.value ? '#dff5f1' : 'white',
                  }}>
                    <input type="radio" name={`pers-${s.id}`} value={opt.value}
                      checked={persoenlich[s.id] === opt.value}
                      onChange={() => setPersoenlich(p => ({ ...p, [s.id]: opt.value }))}
                      style={{ accentColor: MOD_COLOR }} />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Feedback nach Auswertung */}
          {checked && fachlich[s.id] && (
            <div style={{ marginTop: '8px', fontSize: 'var(--fs-sm)', color: 'var(--c-muted)', fontStyle: 'italic' }}>
              💬 {s.grund}
            </div>
          )}
        </div>
      ))}

      {!checked && (
        <div className="actions">
          <button className="btn btn-primary" onClick={checkSituationen}
            disabled={!allFachlich || !allPersoenlich}
            style={{ background: MOD_COLOR }}>
            {!allFachlich ? 'Bitte alle Situationen fachlich einschätzen' :
             !allPersoenlich ? 'Bitte alle persönlichen Entscheidungen treffen' :
             'Auswertung anzeigen →'}
          </button>
        </div>
      )}

      {checked && (
        <>
          <div className="feedback correct" style={{ display: 'block', marginTop: 'var(--sp-md)' }}>
            ✅ Gut gemacht! Du hast alle 13 Situationen bewertet.
            Es gibt bei manchen Situationen keine eindeutig richtige Antwort – wichtig ist, dass du bewusst entscheidest.
          </div>
          <div className="actions" style={{ marginTop: 'var(--sp-lg)' }}>
            <button className="btn btn-primary" onClick={weiterZuRegel} style={{ background: MOD_COLOR }}>
              Weiter zur persönlichen Regel →
            </button>
          </div>
        </>
      )}
    </div>
  )
}