// ============================================================
// KI-Führerschein · Modul 03 – Kennzeichnung & Datenschutz
// Zwei Themen in einem Modul, mit echter Freischaltlogik
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { MemoryBox, InfoBox, TaskBox, WarningBox } from '../../components/ui/InfoBox.jsx'

const MOD       = getModule('modul-03')
const MOD_COLOR = '#1a6b7a'
const STORAGE_KEY = 'ki_m03_state'

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
  return { done: {} }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ done: s.done })) } catch {}
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

// ── Datenschutz-Szenario ──────────────────────────────────────

const DS_SCENARIOS = [
  { id: 'a', text: 'Du gibst deinen vollen Namen und deine Adresse in eine KI ein, um einen Brief zu schreiben.', correct: 'nein', explanation: 'Persönliche Daten wie Name und Adresse solltest du nicht in KI-Systeme eingeben.' },
  { id: 'b', text: 'Du fragst eine KI: „Erkläre mir, wie Photosynthese funktioniert."', correct: 'ja', explanation: 'Das ist unbedenklich – keine persönlichen Daten enthalten.' },
  { id: 'c', text: 'Du gibst Informationen über eine Mitschülerin in eine KI ein, ohne sie zu fragen.', correct: 'nein', explanation: 'Daten anderer Personen dürfen nicht ohne deren Einwilligung weitergegeben werden.' },
  { id: 'd', text: 'Du nutzt eine KI, um Vokabeln zu üben.', correct: 'ja', explanation: 'Kein Problem – keine persönlichen Daten beteiligt.' },
]

function DatenschutzCheck({ done, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)
  const [locked,  setLocked]  = useState(done)
  const allAnswered = DS_SCENARIOS.every(s => answers[s.id])

  function check() {
    if (!allAnswered) return
    setChecked(true)
    setLocked(true)
    const correct = DS_SCENARIOS.filter(s => answers[s.id] === s.correct).length
    onComplete(correct >= 3)
  }

  return (
    <div>
      <p className="lead">Beurteile jede Situation: Ist die KI-Nutzung aus Datenschutzsicht in Ordnung?</p>
      {DS_SCENARIOS.map(s => (
        <div key={s.id} style={{
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md)', marginBottom: 'var(--space-sm)',
          background: checked ? (answers[s.id] === s.correct ? 'var(--color-success-light)' : 'var(--color-error-light)') : 'white',
        }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700 }}>{s.text}</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['ja', 'nein'].map(v => (
              <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: locked ? 'default' : 'pointer', fontWeight: 700 }}>
                <input type="radio" name={s.id} value={v}
                  checked={answers[s.id] === v}
                  onChange={() => !locked && setAnswers(a => ({ ...a, [s.id]: v }))}
                  disabled={locked}
                  style={{ accentColor: MOD_COLOR, width: '18px', height: '18px' }} />
                {v === 'ja' ? '✓ Unbedenklich' : '✗ Bedenklich'}
              </label>
            ))}
          </div>
          {checked && (
            <p style={{ margin: '8px 0 0', fontSize: 'var(--font-size-sm)', fontWeight: 700,
              color: answers[s.id] === s.correct ? 'var(--color-success)' : 'var(--color-error)' }}>
              {answers[s.id] === s.correct ? '✓ ' : '✗ '}{s.explanation}
            </p>
          )}
        </div>
      ))}
      {!locked && (
        <div className="actions">
          <button className="btn btn-primary" onClick={check} disabled={!allAnswered} style={{ background: MOD_COLOR }}>
            Antworten prüfen
          </button>
        </div>
      )}
      {locked && <div style={{ color: 'var(--color-success)', fontWeight: 800, marginTop: '8px', fontSize: 'var(--font-size-sm)' }}>✓ Erledigt</div>}
    </div>
  )
}

// ── Hauptkomponente ───────────────────────────────────────────

export default function Modul03Page() {
  const navigate = useNavigate()
  const [done,     setDone]     = useState({})
  const [achieved, setAchieved] = useState(false)
  const [loaded,   setLoaded]   = useState(false)

  useEffect(() => {
    const s = loadState()
    setDone(s.done ?? {})
    setAchieved(hasAchievement(MOD.id))
    setLoaded(true)
  }, [])

  function markDone(id) {
    const next = { ...done, [id]: true }
    setDone(next)
    saveState({ done: next })
  }

  // Alle Pflichtaufgaben erledigt?
  const allDone = ['kp-quiz1','kp-quiz2','kp-quiz3','ds-check','ds-quiz1','ds-quiz2','abschluss'].every(id => done[id])

  useEffect(() => {
    if (allDone && !achieved) {
      saveAchievementLocal(MOD.id)
      setAchieved(true)
    }
  }, [allDone])

  const progress = Math.round(Object.keys(done).length / 7 * 100)

  if (!loaded) return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap"><p style={{ color: 'var(--color-text-muted)' }}>Modul wird geladen …</p></div>
    </div>
  )

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* ── Modulkopf ── */}
        <header className="hero" style={{ background: `linear-gradient(120deg, #0d4f5c, ${MOD_COLOR})` }}>
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein Klasse 7 · Modul 3</div>
          <h1 style={{ margin: '8px 0 6px' }}>{MOD.icon} Kennzeichnung & Datenschutz</h1>
          <p className="lead" style={{ margin: '4px 0 16px', opacity: 0.9 }}>
            Wann müssen KI-Inhalte gekennzeichnet werden – und welche Daten musst du schützen?
          </p>
          <div className="hero-progress">
            <div className="hero-progress-bar" style={{ width: `${progress}%` }}
              role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
          </div>
        </header>

        {/* ── Tab-Navigation ── */}
        <div className="station-tabs no-print">
          {['Teil A: Kennzeichnung','Teil B: Datenschutz','Abschluss'].map((label, i) => (
            <button key={i} className="nav-btn"
              onClick={() => document.getElementById(`s03-${i+1}`)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ fontSize: '0.85rem' }}>
              {label}
            </button>
          ))}
        </div>

        {/* ══ TEIL A: KENNZEICHNUNGSPFLICHT ══ */}
        <div id="s03-1" style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)', border: `3px solid ${MOD_COLOR}` }}>
          <div className="station-counter">Teil A · Kennzeichnungspflicht</div>
          <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>🏷️ Wann muss ich KI-Inhalte kennzeichnen?</h2>

          <InfoBox title="Grundregel:">
            Wenn du KI-generierte Inhalte verwendest – Texte, Bilder, Zusammenfassungen – musst du das in vielen Situationen kenntlich machen.
          </InfoBox>
          <InfoBox title="Warum ist das wichtig?">
            Andere Menschen sollen wissen, ob ein Inhalt von einem Menschen oder einer KI erstellt wurde. Das ist eine Frage der <strong>Ehrlichkeit und Transparenz</strong>.
          </InfoBox>
          <InfoBox title="Wann muss ich kennzeichnen?">
            <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
              <li>Bei Hausaufgaben und Referaten, wenn die Schule es verlangt</li>
              <li>Bei öffentlichen Texten oder Beiträgen</li>
              <li>Wenn KI-Inhalte als eigene Arbeit eingereicht werden sollen</li>
            </ul>
          </InfoBox>
          <WarningBox>
            KI-generierte Inhalte als eigene Arbeit auszugeben, ohne sie zu kennzeichnen, ist unehrlich – und in der Schule nicht erlaubt.
          </WarningBox>
          <MemoryBox>Kennzeichne KI-Inhalte immer dann, wenn andere wissen müssen, dass eine KI beteiligt war.</MemoryBox>

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: 'var(--space-lg) 0' }} />

          {/* Quiz 1 */}
          <QuizBlock id="kp-quiz1"
            question="Du schreibst ein Referat und nutzt KI für eine Zusammenfassung. Musst du das kennzeichnen?"
            options={[
              { value: 'ja',   label: 'Ja, wenn die Schule es verlangt' },
              { value: 'nein', label: 'Nein, das ist nicht nötig' },
              { value: 'egal', label: 'Das ist egal, solange der Text gut ist' },
            ]}
            answer="ja" done={!!done['kp-quiz1']} allowRetry={true}
            correctFeedback="Richtig! Wenn die Schule KI-Nutzung kennzeichnen lässt, ist das Pflicht."
            wrongFeedback="Noch nicht ganz. Lies die Grundregel oben noch einmal."
            onCorrect={() => markDone('kp-quiz1')}
          />

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: 'var(--space-lg) 0' }} />

          {/* Quiz 2 */}
          <QuizBlock id="kp-quiz2"
            question="Du lässt eine KI dein Referat komplett schreiben und gibst es ohne Kennzeichnung als deine eigene Arbeit ab. Ist das in Ordnung?"
            options={[
              { value: 'ja',   label: 'Ja, das ist erlaubt' },
              { value: 'nein', label: 'Nein, das ist nicht in Ordnung' },
              { value: 'kommt', label: 'Kommt auf die Lehrkraft an' },
            ]}
            answer="nein" done={!!done['kp-quiz2']} allowRetry={true}
            correctFeedback="Richtig! KI-generierte Inhalte als eigene Arbeit auszugeben ist unehrlich."
            wrongFeedback="Noch nicht ganz. Überlege: Was bedeutet eigene Arbeit?"
            onCorrect={() => markDone('kp-quiz2')}
          />

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: 'var(--space-lg) 0' }} />

          {/* Quiz 3 – Situationen */}
          <QuizBlock id="kp-quiz3"
            question="Du nutzt KI, um Ideen für ein Referat zu sammeln, und formulierst dann selbst. Musst du das kennzeichnen?"
            options={[
              { value: 'immer',  label: 'Ja, immer – auch wenn ich selbst formuliert habe' },
              { value: 'kommt',  label: 'Das kommt auf die Schulregeln an' },
              { value: 'nie',    label: 'Nein, weil ich selbst geschrieben habe' },
            ]}
            answer="kommt" done={!!done['kp-quiz3']} allowRetry={true}
            correctFeedback="Richtig! Es kommt auf die Schulregeln an. Im Zweifel: kennzeichnen."
            wrongFeedback="Noch nicht ganz. Es gibt keine pauschale Antwort – die Schulregeln entscheiden."
            onCorrect={() => markDone('kp-quiz3')}
          />
        </div>

        {/* ══ TEIL B: DATENSCHUTZ ══ */}
        <div id="s03-2" style={{ background: 'white', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)', border: `3px solid ${MOD_COLOR}` }}>
          <div className="station-counter">Teil B · Datenschutz</div>
          <h2 style={{ color: MOD_COLOR, marginTop: 0 }}>🔒 Welche Daten muss ich schützen?</h2>

          <InfoBox title="Persönliche Daten sind z. B.:">
            <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
              <li>Name, Adresse, Geburtsdatum</li>
              <li>Fotos und Videos von Personen</li>
              <li>Gesundheitsdaten, Noten, persönliche Probleme</li>
              <li>Daten über andere Personen (Mitschüler:innen, Familie)</li>
            </ul>
          </InfoBox>
          <WarningBox title="Wichtige Regel:">
            Gib <strong>keine persönlichen Daten</strong> in KI-Systeme ein – weder deine eigenen noch die anderer Personen.
          </WarningBox>
          <InfoBox title="Warum ist das wichtig?">
            KI-Anbieter können Eingaben speichern, auswerten oder für das Training neuer Modelle verwenden. Persönliche Daten könnten so in falsche Hände geraten.
          </InfoBox>
          <MemoryBox>Keine persönlichen Daten in KI eingeben – weder eigene noch fremde.</MemoryBox>

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: 'var(--space-lg) 0' }} />

          {/* Datenschutz-Check */}
          <DatenschutzCheck done={!!done['ds-check']}
            onComplete={(passed) => markDone('ds-check')} />

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: 'var(--space-lg) 0' }} />

          {/* DS Quiz 1 */}
          <QuizBlock id="ds-quiz1"
            question="Darf eine KI Eingaben speichern und für ihr Training verwenden?"
            options={[
              { value: 'nein',  label: 'Nein, das ist grundsätzlich verboten' },
              { value: 'ja',    label: 'Ja, das kann je nach Anbieter möglich sein' },
              { value: 'egal',  label: 'Das spielt keine Rolle' },
            ]}
            answer="ja" done={!!done['ds-quiz1']} allowRetry={true}
            correctFeedback="Richtig! Deshalb solltest du keine persönlichen Daten eingeben."
            wrongFeedback="Noch nicht ganz. Lies den Abschnitt 'Warum ist das wichtig?' noch einmal."
            onCorrect={() => markDone('ds-quiz1')}
          />

          <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: 'var(--space-lg) 0' }} />

          {/* DS Quiz 2 */}
          <QuizBlock id="ds-quiz2"
            question="Du möchtest einer KI helfen, einen Text über deine Mitschülerin Lena zu schreiben. Was solltest du tun?"
            options={[
              { value: 'ok',    label: 'Einfach eingeben – das ist harmlos' },
              { value: 'fragen', label: 'Lena zuerst fragen und keine persönlichen Details eingeben' },
              { value: 'anonym', label: 'Ihren Namen weglassen und keine persönlichen Details eingeben' },
            ]}
            answer="anonym" done={!!done['ds-quiz2']} allowRetry={true}
            correctFeedback="Richtig! Keine persönlichen Daten anderer Personen eingeben."
            wrongFeedback="Noch nicht ganz. Denke daran: Daten anderer Personen gehören nicht in KI-Systeme."
            onCorrect={() => markDone('ds-quiz2')}
          />
        </div>

        {/* ══ ABSCHLUSS ══ */}
        <div id="s03-3" className="card">
          <div className="station-counter">Abschluss</div>
          <h2 style={{ color: MOD_COLOR }}>Zusammenfassung</h2>
          <MemoryBox>Kennzeichne KI-Inhalte immer dann, wenn andere wissen müssen, dass eine KI beteiligt war.</MemoryBox>
          <MemoryBox>Keine persönlichen Daten in KI eingeben – weder eigene noch fremde.</MemoryBox>

          {!done['abschluss'] ? (
            <div className="actions">
              <button className="btn btn-success"
                onClick={() => markDone('abschluss')}
                disabled={!['kp-quiz1','kp-quiz2','kp-quiz3','ds-check','ds-quiz1','ds-quiz2'].every(id => done[id])}>
                {['kp-quiz1','kp-quiz2','kp-quiz3','ds-check','ds-quiz1','ds-quiz2'].every(id => done[id])
                  ? 'Modul abschließen ✓'
                  : 'Bitte alle Aufgaben oben erledigen'}
              </button>
            </div>
          ) : (
            <>
              <div className="card" style={{
                border: `2px solid ${achieved ? 'var(--color-gold-dark)' : 'var(--color-border)'}`,
                background: achieved ? '#fff8db' : 'white', textAlign: 'center', marginTop: 'var(--space-lg)',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{MOD.achievement.icon}</div>
                <h3 style={{ color: achieved ? '#825300' : MOD_COLOR, margin: '0 0 8px' }}>{MOD.achievement.title}</h3>
                <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>{MOD.achievement.description}</p>
                {achieved && <div style={{ color: 'var(--color-success)', fontWeight: 800, marginTop: '12px' }}>✓ Achievement erworben!</div>}
              </div>
              <div className="actions" style={{ marginTop: 'var(--space-lg)' }}>
                <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ background: MOD_COLOR }}>
                  Weiter zur Modulübersicht →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}