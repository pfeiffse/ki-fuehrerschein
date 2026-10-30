// ============================================================
// KI-Führerschein · Modul 04 – KI & Nachhaltigkeit
// Basiert auf: legacy/KI_Nachhaltigkeit_5_Stationen_EINE_DATEI.html
// Pflichtmodul mit echter Freischaltlogik
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { MemoryBox, InfoBox, TaskBox, WarningBox } from '../../components/ui/InfoBox.jsx'

const MOD       = getModule('modul-04')
const MOD_COLOR = '#087f83'
const STORAGE_KEY = 'ki_m04_state'

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
  return { done: {}, station: 1 }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ done: s.done, station: s.station })) } catch {}
}

// ── Quiz-Komponente ───────────────────────────────────────────

function QuizBlock({ id, question, options, answer, correctFeedback, wrongFeedback, done, onCorrect, allowRetry = true }) {
  const [selected, setSelected] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [locked,   setLocked]   = useState(done)

  function check() {
    if (!selected) { setFeedback('empty'); return }
    if (selected === answer) { setLocked(true); setFeedback('correct'); onCorrect?.() }
    else { setFeedback('wrong'); if (!allowRetry) setLocked(true) }
  }

  return (
    <div>
      <p style={{ fontWeight: 800, marginBottom: 'var(--space-sm)' }}>{question}</p>
      {options.map(opt => (
        <label key={opt.value} className="option" style={{ cursor: locked ? 'default' : 'pointer' }}>
          <input type="radio" name={id} value={opt.value}
            checked={selected === opt.value}
            onChange={() => !locked && setSelected(opt.value)} disabled={locked} />
          {opt.label}
        </label>
      ))}
      {feedback === 'empty'   && <div className="feedback wrong" style={{ display: 'block' }}>Bitte wähle zuerst eine Antwort aus.</div>}
      {feedback === 'correct' && <div className="feedback correct" style={{ display: 'block' }}>✅ {correctFeedback}</div>}
      {feedback === 'wrong'   && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ {wrongFeedback}
          {allowRetry && <div style={{ marginTop: '8px' }}><button className="nav-btn" onClick={() => { setSelected(''); setFeedback(null) }}>↺ Erneut versuchen</button></div>}
        </div>
      )}
      {!locked && feedback !== 'correct' && (
        <div className="actions">
          <button className="btn btn-primary" onClick={check} disabled={!selected} style={{ background: MOD_COLOR }}>Prüfen</button>
        </div>
      )}
      {locked && <div style={{ color: 'var(--color-success)', fontWeight: 800, fontSize: 'var(--font-size-sm)', marginTop: '8px' }}>✓ Erledigt</div>}
    </div>
  )
}

// ── Ressourcen-Kacheln (Station 1) ───────────────────────────

const RESOURCES = [
  { id: 'strom',    emoji: '⚡', label: 'Strom',         correct: true,  info: 'KI-Rechenzentren verbrauchen sehr viel Strom – rund um die Uhr.' },
  { id: 'wasser',   emoji: '💧', label: 'Wasser',        correct: true,  info: 'Viele Rechenzentren nutzen Wasser zur Kühlung.' },
  { id: 'rohstoffe',emoji: '🪨', label: 'Rohstoffe',     correct: true,  info: 'Chips, Kabel und Gehäuse brauchen Kupfer, seltene Erden und andere Materialien.' },
  { id: 'kühlung',  emoji: '❄️', label: 'Kühlung',       correct: true,  info: 'Chips werden heiß – Kühlung braucht Energie und manchmal Wasser.' },
  { id: 'netze',    emoji: '🌐', label: 'Datennetze',    correct: true,  info: 'Jede KI-Anfrage reist durch Router, Kabel und Mobilfunkanlagen.' },
  { id: 'menschen', emoji: '👩‍💻', label: 'Menschen',      correct: true,  info: 'KI braucht Menschen: Entwickler:innen, Bergbauarbeiter:innen, Techniker:innen.' },
  { id: 'bäume',    emoji: '🌳', label: 'Bäume',         correct: false, info: 'Bäume sind keine direkte Ressource für KI-Systeme.' },
  { id: 'schokolade',emoji:'🍫', label: 'Schokolade',    correct: false, info: 'Schokolade wird für KI nicht benötigt.' },
  { id: 'uhrzeit',  emoji: '⏰', label: 'Uhrzeit',       correct: false, info: 'Die Uhrzeit ist keine Ressource für KI.' },
]

function ResourceStation({ done, onComplete }) {
  const [selected, setSelected] = useState(new Set())
  const [checked,  setChecked]  = useState(false)
  const [locked,   setLocked]   = useState(done)

  function toggle(id) {
    if (locked) return
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
    setChecked(false)
  }

  function check() {
    setChecked(true)
    const correct = RESOURCES.filter(r => r.correct).map(r => r.id)
    const allCorrect = correct.every(id => selected.has(id)) && selected.size === correct.length
    if (allCorrect) { setLocked(true); onComplete() }
  }

  function retry() { setSelected(new Set()); setChecked(false) }

  const correctIds = new Set(RESOURCES.filter(r => r.correct).map(r => r.id))

  return (
    <div>
      <p className="lead">Klicke alle Ressourcen an, die KI-Systeme wirklich benötigen. Manche Antworten sind Ablenkungen.</p>
      <WarningBox title="Hinweis:">Die Zahlen in diesem Modul sind Anschauungswerte und Modellwerte – keine exakten Messungen.</WarningBox>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--space-md) 0' }}>
        {RESOURCES.map(r => {
          const sel = selected.has(r.id)
          let border = sel ? `2px solid ${MOD_COLOR}` : '2px solid var(--color-border)'
          let bg = sel ? '#dff5f1' : 'linear-gradient(155deg, #fff, #eaf8f5)'
          if (checked) {
            if (correctIds.has(r.id) && sel) { border = '2px solid var(--color-success)'; bg = 'var(--color-success-light)' }
            else if (correctIds.has(r.id) && !sel) { border = '2px solid var(--color-warning)'; bg = 'var(--color-warning-light)' }
            else if (!correctIds.has(r.id) && sel) { border = '2px solid var(--color-error)'; bg = 'var(--color-error-light)' }
            else { border = '2px solid var(--color-border)'; bg = '#f5f5f5' }
          }
          return (
            <button key={r.id} onClick={() => toggle(r.id)} disabled={locked}
              style={{ border, borderRadius: 'var(--radius-lg)', padding: '14px 8px', textAlign: 'center', background: bg, cursor: locked ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '2rem' }}>{r.emoji}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '6px' }}>{r.label}</div>
              {checked && <div style={{ fontSize: '0.72rem', marginTop: '4px', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{r.info}</div>}
            </button>
          )
        })}
      </div>
      {checked && !locked && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ Noch nicht ganz. Wähle genau die 6 richtigen Ressourcen aus.
          <div style={{ marginTop: '8px' }}><button className="nav-btn" onClick={retry}>↺ Erneut versuchen</button></div>
        </div>
      )}
      {!locked && (
        <div className="actions">
          <button className="btn btn-primary" onClick={check} disabled={selected.size === 0} style={{ background: MOD_COLOR }}>
            Auswahl prüfen
          </button>
        </div>
      )}
      {locked && <div className="done-badge">✓ Ressourcen erkannt!</div>}
    </div>
  )
}

// ── Wasser-Rechenaufgabe (Station 3) ─────────────────────────

function WaterStation({ done, onComplete }) {
  const [schueler, setSchueler] = useState('')
  const [anfragen, setAnfragen] = useState('')
  const [result,   setResult]   = useState(null)
  const [locked,   setLocked]   = useState(done)
  const [quizDone, setQuizDone] = useState(done)

  function calculate() {
    const s = parseInt(schueler)
    const a = parseInt(anfragen)
    if (!s || !a || s < 1 || a < 1) return
    // Modellwert: ca. 0,5 Liter pro KI-Anfrage (vereinfacht)
    const liter = s * a * 0.5
    const toiletten = Math.round(liter / 6)
    setResult({ liter: liter.toFixed(1), toiletten })
  }

  return (
    <div>
      <p className="lead">Rechne aus, wie viel Wasser eure Klasse durch KI-Anfragen verbraucht.</p>
      <WarningBox title="Modellwert:">Der Wert von 0,5 Liter pro Anfrage ist ein vereinfachter Schätzwert für Lernzwecke – kein exakter Messwert.</WarningBox>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', margin: 'var(--space-md) 0' }}>
        <div>
          <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Anzahl Schüler:innen in eurer Klasse:</label>
          <input type="number" value={schueler} onChange={e => setSchueler(e.target.value)} min="1" max="40"
            disabled={locked}
            style={{ width: '100%', padding: '12px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontFamily: 'inherit' }} />
        </div>
        <div>
          <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>KI-Anfragen pro Person heute:</label>
          <input type="number" value={anfragen} onChange={e => setAnfragen(e.target.value)} min="1" max="100"
            disabled={locked}
            style={{ width: '100%', padding: '12px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '1.1rem', fontFamily: 'inherit' }} />
        </div>
      </div>

      {!locked && (
        <div className="actions">
          <button className="btn btn-primary" onClick={calculate} disabled={!schueler || !anfragen} style={{ background: MOD_COLOR }}>
            Berechnen
          </button>
        </div>
      )}

      {result && (
        <div className="compare-box" style={{ marginTop: 'var(--space-md)' }}>
          <div className="eyebrow">Ergebnis (Modellwert)</div>
          <div className="big">💧 {result.liter} Liter</div>
          <p style={{ margin: '8px 0 0' }}>
            Das entspricht ungefähr <strong>{result.toiletten} Toilettenspülungen</strong>.
            (Modellwert: 0,5 L pro Anfrage, 6 L pro Spülung)
          </p>
        </div>
      )}

      {result && !quizDone && (
        <>
          <QuizBlock id="water-quiz"
            question="Was zeigt diese Rechnung?"
            options={[
              { value: '0', label: 'KI-Nutzung hat keinen Einfluss auf den Wasserverbrauch.' },
              { value: '1', label: 'Viele kleine KI-Anfragen können zusammen einen spürbaren Ressourcenverbrauch ergeben.' },
              { value: '2', label: 'Man sollte KI nie benutzen.' },
            ]}
            answer="1" done={quizDone} allowRetry={true}
            correctFeedback="Richtig! Viele kleine Anfragen summieren sich."
            wrongFeedback="Noch nicht ganz. Schau dir das Ergebnis noch einmal an."
            onCorrect={() => { setQuizDone(true); setLocked(true); onComplete() }}
          />
        </>
      )}
      {locked && <div className="done-badge">✓ Wasserverbrauch berechnet!</div>}
    </div>
  )
}

// ── Energie-Vergleich (Station 4) ────────────────────────────

function EnergyStation({ done, onComplete }) {
  const [anfragen, setAnfragen] = useState(10)
  const [locked,   setLocked]   = useState(done)

  // Modellwert: 1 KI-Anfrage ≈ 0,003 Wh (vereinfacht)
  const wh       = (anfragen * 0.003).toFixed(3)
  const sekunden = Math.round(anfragen * 0.003 / 0.8 * 3600) // Mikrowelle 800W

  return (
    <div>
      <p className="lead">Vergleiche den Energiebedarf von KI-Anfragen mit einem Alltagsgerät.</p>
      <WarningBox title="Modellwert:">0,003 Wh pro Anfrage ist ein vereinfachter Schätzwert. Echte Werte variieren stark je nach Modell und Anfrage.</WarningBox>

      <div style={{ margin: 'var(--space-lg) 0' }}>
        <label style={{ fontWeight: 800, display: 'block', marginBottom: '8px' }}>
          Anzahl KI-Anfragen: <strong style={{ color: MOD_COLOR }}>{anfragen}</strong>
        </label>
        <input type="range" min="1" max="100" value={anfragen}
          onChange={e => setAnfragen(Number(e.target.value))}
          disabled={locked}
          style={{ width: '100%', accentColor: MOD_COLOR }} />
      </div>

      <div className="compare-box">
        <div className="eyebrow">Energievergleich (Modellwert)</div>
        <div className="big">⚡ {wh} Wh</div>
        <p style={{ margin: '8px 0 0' }}>
          {anfragen} KI-Anfragen ≈ <strong>{sekunden} Sekunden Mikrowellenbetrieb</strong> (800 W)
        </p>
      </div>

      {!locked && (
        <QuizBlock id="energy-quiz"
          question="Was bedeutet das für deinen Alltag?"
          options={[
            { value: '0', label: 'KI-Anfragen verbrauchen so wenig Energie, dass man sich keine Gedanken machen muss.' },
            { value: '1', label: 'Es lohnt sich, KI bewusst einzusetzen – besonders wenn viele Menschen viele Anfragen stellen.' },
            { value: '2', label: 'Man sollte KI komplett vermeiden.' },
          ]}
          answer="1" done={locked} allowRetry={true}
          correctFeedback="Richtig! Bewusster Einsatz macht den Unterschied."
          wrongFeedback="Noch nicht ganz. Denke an die Summe vieler kleiner Anfragen."
          onCorrect={() => { setLocked(true); onComplete() }}
        />
      )}
      {locked && <div className="done-badge">✓ Energieverbrauch verstanden!</div>}
    </div>
  )
}

// ── Hauptkomponente ───────────────────────────────────────────

const STATIONS = [
  { id: 1, label: '1 · Ressourcen',   taskId: 'ressourcen' },
  { id: 2, label: '2 · Filmcheck',    taskId: 'filmcheck'  },
  { id: 3, label: '3 · Wasser',       taskId: 'wasser'     },
  { id: 4, label: '4 · Energie',      taskId: 'energie'    },
  { id: 5, label: '5 · KI im Alltag', taskId: 'alltag'     },
]

export default function Modul04Page() {
  const navigate  = useNavigate()
  const [done,     setDone]     = useState({})
  const [station,  setStation]  = useState(1)
  const [achieved, setAchieved] = useState(false)
  const [loaded,   setLoaded]   = useState(false)

  useEffect(() => {
    const s = loadState()
    setDone(s.done ?? {})
    setStation(s.station ?? 1)
    setAchieved(hasAchievement(MOD.id))
    setLoaded(true)
  }, [])

  function markDone(id) {
    const next = { ...done, [id]: true }
    setDone(next)
    saveState({ done: next, station })
    // Prüfen ob alle Stationen erledigt
    const allIds = ['ressourcen','filmcheck','wasser','energie','alltag','abschluss']
    if (allIds.every(k => next[k]) && !achieved) {
      saveAchievementLocal(MOD.id)
      setAchieved(true)
    }
  }

  function goStation(n) {
    setStation(n)
    saveState({ done, station: n })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const progress = Math.round(Object.keys(done).length / 6 * 100)
  const currentTaskDone = done[STATIONS.find(s => s.id === station)?.taskId]

  if (!loaded) return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap"><p style={{ color: 'var(--color-text-muted)' }}>Modul wird geladen …</p></div>
    </div>
  )

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* ── Modulkopf ── */}
        <header className="hero" style={{ background: 'linear-gradient(120deg, #063a45, #087f83)' }}>
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein Klasse 7 · Modul 4</div>
          <h1 style={{ margin: '8px 0 6px' }}>🌍 KI & Nachhaltigkeit</h1>
          <p className="lead" style={{ margin: '4px 0 16px', opacity: 0.9 }}>
            Welche Ressourcen stecken hinter KI – und wann lohnt sich ihr Einsatz wirklich?
          </p>
          <div className="hero-progress">
            <div className="hero-progress-bar" style={{ width: `${progress}%` }}
              role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
          </div>
        </header>

        {/* ── Stations-Navigation (wie Modul 5 Original) ── */}
        <div className="station-tabs no-print">
          <button className={`nav-btn ${station === 0 ? 'active' : ''}`} onClick={() => goStation(0)}>Start</button>
          {STATIONS.map(s => (
            <button key={s.id}
              className={`nav-btn ${station === s.id ? 'active' : ''}`}
              onClick={() => goStation(s.id)}>
              {s.label}
              {done[s.taskId] && ' ✓'}
            </button>
          ))}
        </div>

        {/* ── Startseite ── */}
        {station === 0 && (
          <div className="card">
            <h2 style={{ color: MOD_COLOR }}>Entdecke die Umweltseite der KI!</h2>
            <p className="lead">Fünf Stationen zeigen dir, welche Ressourcen KI benötigt und wann sich ihr Einsatz wirklich lohnt.</p>
            <InfoBox>Du kannst jederzeit oben zwischen den Stationen wechseln. Falls der Film nicht erreichbar ist, kannst du trotzdem mit Station 3 weitermachen.</InfoBox>
            <WarningBox title="Hinweis:">Alle Zahlen in diesem Modul sind Anschauungs- und Modellwerte – keine exakten Messungen.</WarningBox>
            <div className="actions">
              <button className="btn btn-primary" onClick={() => goStation(1)} style={{ background: MOD_COLOR }}>
                Station 1 starten →
              </button>
            </div>
          </div>
        )}

        {/* ── Station 1: Ressourcen ── */}
        {station === 1 && (
          <div className="card">
            <div className="station-counter">Station 1 von 5 · Ressourcen-Detektive</div>
            <h2 style={{ color: MOD_COLOR }}>🔍 Was steckt wirklich hinter einer KI-Antwort?</h2>
            <ResourceStation done={!!done['ressourcen']} onComplete={() => markDone('ressourcen')} />
            {done['ressourcen'] && (
              <div className="actions" style={{ marginTop: 'var(--space-lg)' }}>
                <button className="btn btn-primary" onClick={() => goStation(2)} style={{ background: MOD_COLOR }}>
                  Weiter zu Station 2 →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Station 2: Filmcheck ── */}
        {station === 2 && (
          <div className="card">
            <div className="station-counter">Station 2 von 5 · Filmcheck</div>
            <h2 style={{ color: MOD_COLOR }}>⚡ KI unter Strom</h2>
            <p className="lead">Schau dir den kurzen ARD-Beitrag „Wie klimaschädlich ist Künstliche Intelligenz?" an.</p>
            <div style={{ background: '#103d54', color: '#bff5e5', borderRadius: 'var(--radius-lg)', padding: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
              <p style={{ margin: '0 0 12px', fontWeight: 800 }}>Film in der ARD Mediathek:</p>
              <a href="https://www.ardmediathek.de/video/wissen-vor-acht-erde/wie-klimaschaedlich-ist-kuenstliche-intelligenz/ard/Y3JpZDovL2FyZC5kZS9wbGFuQVJEXzdkNjgzMDg3LTI0ZDktNGJiNi04ZWQ0LTNhZmE4MmI0NDJmZF9nYW56ZVNlbmR1bmc"
                target="_blank" rel="noopener"
                style={{ color: '#103d54', background: '#bff5e5', padding: '12px 20px', borderRadius: 'var(--radius-md)', fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
                ▶ Film ansehen ↗
              </a>
            </div>
            <InfoBox>Falls der Film nicht erreichbar ist, kannst du Station 2 überspringen und direkt zu Station 3 wechseln.</InfoBox>

            {!done['filmcheck'] && (
              <>
                <QuizBlock id="film-q1"
                  question="Laut Film: Was verbrauchen Rechenzentren neben Strom noch?"
                  options={[
                    { value: '0', label: 'Nichts weiter – nur Strom' },
                    { value: '1', label: 'Auch Wasser zur Kühlung' },
                    { value: '2', label: 'Vor allem Öl' },
                  ]}
                  answer="1" done={false} allowRetry={true}
                  correctFeedback="Richtig! Kühlung braucht oft Wasser."
                  wrongFeedback="Noch nicht ganz. Denke an die Kühlung der Server."
                  onCorrect={() => {}}
                />
                <QuizBlock id="film-q2"
                  question="Was empfiehlt der Film zum Umgang mit KI?"
                  options={[
                    { value: '0', label: 'KI so oft wie möglich nutzen' },
                    { value: '1', label: 'KI bewusst und nur dann einsetzen, wenn es sinnvoll ist' },
                    { value: '2', label: 'KI komplett vermeiden' },
                  ]}
                  answer="1" done={false} allowRetry={true}
                  correctFeedback="Richtig! Bewusster Einsatz ist der Schlüssel."
                  wrongFeedback="Noch nicht ganz. Der Film empfiehlt einen bewussten Umgang."
                  onCorrect={() => markDone('filmcheck')}
                />
              </>
            )}
            {done['filmcheck'] && <div className="done-badge">✓ Filmcheck abgeschlossen!</div>}
            <div className="actions" style={{ marginTop: 'var(--space-lg)' }}>
              {done['filmcheck']
                ? <button className="btn btn-primary" onClick={() => goStation(3)} style={{ background: MOD_COLOR }}>Weiter zu Station 3 →</button>
                : <button className="btn btn-ghost" onClick={() => { markDone('filmcheck'); goStation(3) }}>Film nicht erreichbar? Station überspringen →</button>}
            </div>
          </div>
        )}

        {/* ── Station 3: Wasser ── */}
        {station === 3 && (
          <div className="card">
            <div className="station-counter">Station 3 von 5 · Wasserverbrauch</div>
            <h2 style={{ color: MOD_COLOR }}>💧 Wie viel Wasser verbraucht eure Klasse?</h2>
            <WaterStation done={!!done['wasser']} onComplete={() => markDone('wasser')} />
            {done['wasser'] && (
              <div className="actions" style={{ marginTop: 'var(--space-lg)' }}>
                <button className="btn btn-primary" onClick={() => goStation(4)} style={{ background: MOD_COLOR }}>Weiter zu Station 4 →</button>
              </div>
            )}
          </div>
        )}

        {/* ── Station 4: Energie ── */}
        {station === 4 && (
          <div className="card">
            <div className="station-counter">Station 4 von 5 · Energieverbrauch</div>
            <h2 style={{ color: MOD_COLOR }}>🔋 Wie viel Energie braucht eine KI-Anfrage?</h2>
            <EnergyStation done={!!done['energie']} onComplete={() => markDone('energie')} />
            {done['energie'] && (
              <div className="actions" style={{ marginTop: 'var(--space-lg)' }}>
                <button className="btn btn-primary" onClick={() => goStation(5)} style={{ background: MOD_COLOR }}>Weiter zu Station 5 →</button>
              </div>
            )}
          </div>
        )}

        {/* ── Station 5: KI im Alltag ── */}
        {station === 5 && (
          <div className="card">
            <div className="station-counter">Station 5 von 5 · KI im Alltag</div>
            <h2 style={{ color: MOD_COLOR }}>🌱 Wann lohnt sich KI – wann nicht?</h2>
            <p className="lead">Überlege für jede Situation: Ist der Einsatz von KI sinnvoll?</p>

            {!done['alltag'] && (
              <AlltagStation onComplete={() => markDone('alltag')} />
            )}
            {done['alltag'] && (
              <>
                <div className="done-badge">✓ Transfer abgeschlossen!</div>
                <MemoryBox>KI ist ein mächtiges Werkzeug – aber jede Anfrage kostet Ressourcen. Nutze KI bewusst und nur dann, wenn es wirklich sinnvoll ist.</MemoryBox>

                {/* Abschluss */}
                {!done['abschluss'] ? (
                  <div className="actions" style={{ marginTop: 'var(--space-lg)' }}>
                    <button className="btn btn-success" onClick={() => markDone('abschluss')}>
                      Modul abschließen ✓
                    </button>
                  </div>
                ) : (
                  <div className="card" style={{
                    border: `2px solid ${achieved ? 'var(--color-gold-dark)' : 'var(--color-border)'}`,
                    background: achieved ? '#fff8db' : 'white', textAlign: 'center', marginTop: 'var(--space-lg)',
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{MOD.achievement.icon}</div>
                    <h3 style={{ color: achieved ? '#825300' : MOD_COLOR, margin: '0 0 8px' }}>{MOD.achievement.title}</h3>
                    <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{MOD.achievement.description}</p>
                    {achieved && <div style={{ color: 'var(--color-success)', fontWeight: 800, marginTop: '12px' }}>✓ Achievement erworben!</div>}
                    <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
                      <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ background: MOD_COLOR }}>
                        Zur Modulübersicht →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Zurück-Button */}
        {station > 0 && (
          <div className="actions no-print" style={{ marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-ghost" onClick={() => goStation(station - 1)}>← Zurück</button>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Zur Übersicht</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Alltag-Station ────────────────────────────────────────────

const ALLTAG_ITEMS = [
  { id: 'a1', text: 'Du lässt dir ein schwieriges Mathe-Konzept erklären.', sinnvoll: true },
  { id: 'a2', text: 'Du lässt KI deine gesamte Hausaufgabe schreiben.', sinnvoll: false },
  { id: 'a3', text: 'Du fragst KI nach dem Wetter – obwohl du aus dem Fenster schauen könntest.', sinnvoll: false },
  { id: 'a4', text: 'Du nutzt KI, um Ideen für ein Projekt zu sammeln, und entscheidest dann selbst.', sinnvoll: true },
  { id: 'a5', text: 'Du lässt KI einen einfachen Text übersetzen, den du auch im Wörterbuch nachschlagen könntest.', sinnvoll: false },
]

function AlltagStation({ onComplete }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [locked,  setLocked]  = useState(false)
  const allAnswered = ALLTAG_ITEMS.every(s => answers[s.id] !== undefined)

  function check() {
    if (!allAnswered) return
    setChecked(true)
    const correct = ALLTAG_ITEMS.filter(s => answers[s.id] === s.sinnvoll).length
    if (correct >= 4) { setLocked(true); onComplete() }
  }

  function retry() { setAnswers({}); setChecked(false) }

  return (
    <div>
      {ALLTAG_ITEMS.map(item => (
        <div key={item.id} style={{
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md)', marginBottom: 'var(--space-sm)',
          background: checked ? (answers[item.id] === item.sinnvoll ? 'var(--color-success-light)' : 'var(--color-error-light)') : 'white',
        }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700 }}>{item.text}</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[true, false].map(v => (
              <label key={String(v)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: locked ? 'default' : 'pointer', fontWeight: 700 }}>
                <input type="radio" name={item.id} checked={answers[item.id] === v}
                  onChange={() => !locked && setAnswers(a => ({ ...a, [item.id]: v }))}
                  disabled={locked}
                  style={{ accentColor: MOD_COLOR, width: '18px', height: '18px' }} />
                {v ? '✓ Sinnvoll' : '✗ Nicht sinnvoll'}
              </label>
            ))}
          </div>
          {checked && (
            <p style={{ margin: '8px 0 0', fontSize: 'var(--font-size-sm)', fontWeight: 700,
              color: answers[item.id] === item.sinnvoll ? 'var(--color-success)' : 'var(--color-error)' }}>
              {answers[item.id] === item.sinnvoll ? '✓ Richtig!' : `✗ ${item.sinnvoll ? 'Das wäre sinnvoll.' : 'Das ist nicht sinnvoll.'}`}
            </p>
          )}
        </div>
      ))}
      {checked && !locked && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ Noch nicht ganz. Mindestens 4 von 5 müssen richtig sein.
          <div style={{ marginTop: '8px' }}><button className="nav-btn" onClick={retry}>↺ Erneut versuchen</button></div>
        </div>
      )}
      {!locked && (
        <div className="actions">
          <button className="btn btn-primary" onClick={check} disabled={!allAnswered} style={{ background: MOD_COLOR }}>
            Auswerten
          </button>
        </div>
      )}
    </div>
  )
}