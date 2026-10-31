// ============================================================
// Modul 04 · Station 1: Ressourcen-Detektive
// Entdecken → 18 Kacheln → 12 Infokarten mit Quiz
// Freischaltung: alle 12 Quizfragen richtig beantwortet
// ============================================================

import React, { useState } from 'react'
import { RESSOURCEN_KACHELN, INFO_KARTEN } from './data.js'
import { InfoBox, WarningBox, MemoryBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#087f83'
const CORRECT_IDS = new Set(RESSOURCEN_KACHELN.filter(r => r.correct).map(r => r.id))

export default function Station1({ done, onComplete }) {
  const [phase,      setPhase]      = useState('kacheln')  // kacheln | karten | zusammenfassung
  const [selected,   setSelected]   = useState(new Set())
  const [checked,    setChecked]    = useState(false)
  const [karteIdx,   setKarteIdx]   = useState(0)
  const [gelesen,    setGelesen]    = useState(new Set())   // gelesene Karten
  const [richtig,    setRichtig]    = useState(new Set())   // richtig beantwortete Quizfragen
  const [quizAnswer, setQuizAnswer] = useState('')
  const [quizFeedback, setQuizFeedback] = useState(null)

  function toggleKachel(id) {
    if (checked) return
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  function checkKacheln() {
    setChecked(true)
    const allCorrect = [...CORRECT_IDS].every(id => selected.has(id)) && selected.size === CORRECT_IDS.size
    if (allCorrect) setTimeout(() => setPhase('karten'), 800)
  }

  function retryKacheln() { setSelected(new Set()); setChecked(false) }

  // Aktuelle Karte
  const karte = INFO_KARTEN[karteIdx]
  const alleRichtig = richtig.size === INFO_KARTEN.length

  function checkQuiz() {
    if (!quizAnswer) return
    if (quizAnswer === karte.quiz.antwort) {
      setQuizFeedback('correct')
      setRichtig(prev => new Set([...prev, karte.id]))
      setGelesen(prev => new Set([...prev, karte.id]))
    } else {
      setQuizFeedback('wrong')
    }
  }

  function naechsteKarte() {
    if (karteIdx < INFO_KARTEN.length - 1) {
      setKarteIdx(karteIdx + 1)
      setQuizAnswer('')
      setQuizFeedback(null)
    } else {
      setPhase('zusammenfassung')
    }
  }

  function vorherige() {
    if (karteIdx > 0) {
      setKarteIdx(karteIdx - 1)
      setQuizAnswer('')
      setQuizFeedback(null)
    }
  }

  // ── Zusammenfassung ───────────────────────────────────────

  if (phase === 'zusammenfassung' || done) return (
    <div className="card">
      <div className="station-counter">Station 1 von 5 · Ressourcen-Detektive · Zusammenfassung</div>
      <h2 style={{ color: MOD_COLOR }}>Das Wichtigste auf einen Blick</h2>
      <WarningBox title="Hinweis zu den Zahlen:">
        Die folgenden Werte haben unterschiedliche Bezugsgrößen. Man darf sie nicht als Verbrauch einer einzelnen KI-Anfrage verstehen.
      </WarningBox>
      <div style={{ overflowX: 'auto', marginBottom: 'var(--sp-lg)' }}>
        <table>
          <thead>
            <tr>
              <th>Ressource</th>
              <th>Vergleich / Erkenntnis</th>
              <th>Wichtig zu wissen</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['⚡ Strom', '415 TWh weltweit (2024)', 'Alle Rechenzentren, nicht nur KI'],
              ['💧 Wasser', '21 Mrd. Liter (Google, 2022)', 'Rechenzentren und Büros; nicht nur KI'],
              ['🔌 Kupfer', 'Große Tagebaue verändern Landschaften', 'Abbau kann Böden und Gewässer belasten'],
              ['🧲 Seltene Erden', 'Gruppe von 17 Elementen', 'Nicht mit Kupfer verwechseln'],
              ['🏗️ Fläche', 'Große Anlagen: mehrere Fußballfelder', 'Größe variiert je nach Standort'],
              ['❄️ Kühlung', 'Auch nachts und am Wochenende', 'Je nach Technik Strom und Wasser'],
              ['🪨 Rohstoffe', 'Viele Materialien in Chips, Kabeln, Gebäuden', 'Umweltwirkung beginnt vor der Nutzung'],
              ['🌐 Netze & Daten', 'Technik außerhalb deines Geräts', 'Benötigt ebenfalls Strom und Materialien'],
            ].map(([r, v, h]) => (
              <tr key={r}>
                <td style={{ fontWeight: 700 }}>{r}</td>
                <td>{v}</td>
                <td style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)' }}>{h}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MemoryBox>KI ist digital – ihre Voraussetzungen sind es nicht. Strom, Wasser, Rohstoffe und Menschen stecken hinter jeder KI-Antwort.</MemoryBox>
      {!done && (
        <div className="actions">
          <button className="btn btn-success" onClick={onComplete}>
            Station 1 abschließen · Achievement freischalten 🔍
          </button>
        </div>
      )}
      {done && <div className="done-badge">✓ Station 1 abgeschlossen · Achievement: Ressourcen-Profi 🔍</div>}
    </div>
  )

  // ── Informationskarten ────────────────────────────────────

  if (phase === 'karten') return (
    <div className="card">
      <div className="station-counter">
        Station 1 von 5 · Informationskarte {karteIdx + 1} von {INFO_KARTEN.length} · {richtig.size} gelesen
      </div>
      <h2 style={{ color: MOD_COLOR }}>
        {karte.icon} {karte.title}
      </h2>

      {/* Fortschrittsbalken Karten */}
      <div className="progress-shell dark" style={{ marginBottom: 'var(--sp-lg)' }}>
        <div className="progress-bar green" style={{ width: `${(richtig.size / INFO_KARTEN.length) * 100}%` }} />
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--sp-md)' }}>
        <div style={{ background: '#f0fafb', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)' }}>
          <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '6px' }}>🔍 Wofür wird sie benötigt?</div>
          <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>{karte.was}</p>
        </div>
        <div style={{ background: '#f0fafb', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)' }}>
          <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '6px' }}>🌍 Welche Umweltfolgen gibt es?</div>
          <p style={{ margin: 0, fontSize: 'var(--fs-sm)' }}>{karte.wirkung}</p>
        </div>
      </div>

      {/* Vergleichs-Box */}
      <div className="compare-box">
        <div className="eyebrow">Der Alltagsvergleich</div>
        <div className="big">{karte.vergleich}</div>
        <p style={{ margin: '8px 0 0', fontSize: 'var(--fs-sm)' }}>{karte.vergleichText}</p>
      </div>

      {/* Quelle */}
      <p className="source" style={{ marginBottom: 'var(--sp-md)' }}>
        Quelle: {karte.quellUrl
          ? <a href={karte.quellUrl} target="_blank" rel="noopener">{karte.quelle} ↗</a>
          : karte.quelle}
      </p>

      {/* Quiz */}
      <div style={{ background: richtig.has(karte.id) ? 'var(--c-success-bg)' : '#fff3d8', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', border: `1px solid ${richtig.has(karte.id) ? 'var(--c-success)' : 'var(--c-warn)'}` }}>
        <div style={{ fontWeight: 800, marginBottom: 'var(--space-sm)', color: richtig.has(karte.id) ? 'var(--c-success)' : '#825300' }}>
          {richtig.has(karte.id) ? '✓ Verständnisfrage beantwortet' : '❓ Verständnisfrage'}
        </div>
        {!richtig.has(karte.id) && (
          <>
            <p style={{ fontWeight: 700, marginBottom: 'var(--space-sm)' }}>{karte.quiz.frage}</p>
            {karte.quiz.optionen.map(opt => (
              <label key={opt.value} className="option" style={{ cursor: quizFeedback === 'correct' ? 'default' : 'pointer' }}>
                <input type="radio" name={`quiz-${karte.id}`} value={opt.value}
                  checked={quizAnswer === opt.value}
                  onChange={() => quizFeedback !== 'correct' && setQuizAnswer(opt.value)}
                  disabled={quizFeedback === 'correct'} />
                {opt.label}
              </label>
            ))}
            {quizFeedback === 'wrong' && (
              <div className="feedback wrong" style={{ display: 'block' }}>
                ❌ {karte.quiz.falsch}
                <div style={{ marginTop: '8px' }}>
                  <button className="nav-btn" onClick={() => { setQuizAnswer(''); setQuizFeedback(null) }}>↺ Erneut versuchen</button>
                </div>
              </div>
            )}
            {quizFeedback !== 'correct' && (
              <div className="actions">
                <button className="btn btn-primary" onClick={checkQuiz} disabled={!quizAnswer} style={{ background: MOD_COLOR }}>
                  Antwort prüfen
                </button>
              </div>
            )}
          </>
        )}
        {richtig.has(karte.id) && (
          <div className="feedback correct" style={{ display: 'block' }}>✅ {karte.quiz.erklaerung}</div>
        )}
      </div>

      {/* Navigation */}
      <div className="actions" style={{ marginTop: 'var(--sp-lg)' }}>
        <button className="btn btn-ghost" onClick={vorherige} disabled={karteIdx === 0}>← Zurück</button>
        {richtig.has(karte.id) && (
          <button className="btn btn-primary" onClick={naechsteKarte} style={{ background: MOD_COLOR }}>
            {karteIdx < INFO_KARTEN.length - 1 ? 'Gelesen – nächste Karte →' : 'Zusammenfassung öffnen →'}
          </button>
        )}
      </div>

      {alleRichtig && karteIdx === INFO_KARTEN.length - 1 && (
        <div className="done-badge" style={{ marginTop: 'var(--sp-md)' }}>
          ✓ Alle {INFO_KARTEN.length} Informationskarten gelesen!
        </div>
      )}
    </div>
  )

  // ── Kachel-Auswahl ────────────────────────────────────────

  return (
    <div className="card">
      <div className="station-counter">Station 1 von 5 · Ressourcen-Detektive · Entdecken</div>
      <h2 style={{ color: MOD_COLOR }}>🔍 Was braucht KI wirklich?</h2>
      <p className="lead">
        Klicke alle Ressourcen und Voraussetzungen an, die für die Herstellung oder Nutzung von KI wichtig sind.
        Manche Antworten sind absichtlich falsch.
      </p>
      <WarningBox title="Hinweis:">
        Alle Zahlen in diesem Modul sind Anschauungs- und Modellwerte – keine exakten Messungen für eine einzelne KI-Anfrage.
      </WarningBox>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px', margin: 'var(--sp-lg) 0' }}>
        {RESSOURCEN_KACHELN.map(r => {
          const sel = selected.has(r.id)
          let border = sel ? `2px solid ${MOD_COLOR}` : '2px solid var(--c-border)'
          let bg = sel ? '#dff5f1' : 'linear-gradient(155deg, #fff, #eaf8f5)'
          let opacity = 1
          if (checked) {
            if (CORRECT_IDS.has(r.id) && sel)  { border = '2px solid var(--c-success)'; bg = 'var(--c-success-bg)' }
            if (CORRECT_IDS.has(r.id) && !sel) { border = '2px solid var(--c-warn)'; bg = 'var(--c-warn-bg)' }
            if (!CORRECT_IDS.has(r.id) && sel) { border = '2px solid var(--c-error)';   bg = 'var(--c-error-bg)' }
            if (!CORRECT_IDS.has(r.id) && !sel){ opacity = 0.35 }
          }
          return (
            <button key={r.id} onClick={() => toggleKachel(r.id)}
              disabled={checked && [...CORRECT_IDS].every(id => selected.has(id)) && selected.size === CORRECT_IDS.size}
              aria-pressed={sel}
              aria-label={`${r.label}, ${sel ? 'ausgewählt' : 'nicht ausgewählt'}`}
              style={{ border, borderRadius: 'var(--r-lg)', padding: '12px 6px', textAlign: 'center', background: bg, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', opacity }}>
              <div style={{ fontSize: '1.8rem' }}>{r.emoji}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '6px', lineHeight: 1.3 }}>{r.label}</div>
              {sel && !checked && <div style={{ fontSize: '0.65rem', color: MOD_COLOR, marginTop: '4px' }}>✓</div>}
            </button>
          )
        })}
      </div>

      {checked && !([...CORRECT_IDS].every(id => selected.has(id)) && selected.size === CORRECT_IDS.size) && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ Noch nicht ganz. Du hast {[...selected].filter(id => CORRECT_IDS.has(id)).length} von {CORRECT_IDS.size} richtigen Ressourcen gefunden.
          Grün = richtig gewählt · Orange = vergessen · Rot = falsch gewählt · Blass = richtig ausgelassen.
          <div style={{ marginTop: '8px' }}>
            <button className="nav-btn" onClick={retryKacheln}>↺ Noch einmal versuchen</button>
          </div>
        </div>
      )}

      {!checked && (
        <div className="actions">
          <button className="btn btn-primary" onClick={checkKacheln} disabled={selected.size === 0} style={{ background: MOD_COLOR }}>
            Auswahl überprüfen ↻
          </button>
        </div>
      )}
    </div>
  )
}