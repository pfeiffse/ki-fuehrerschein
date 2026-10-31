// Modul 03 - Kennzeichnung & Datenschutz (Gamification)

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { startModuleLocal, passModule } from '../../lib/progress.js'

const MOD = getModule('modul-03')
const MOD_COLOR = '#1a6b7a'
const STORAGE_KEY = 'ki_m03_v3'

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
  return { done: {}, mission: 1 }
}
function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {} }

function AchievementPopup({ ach, onClose }) {
  if (!ach) return null
  return (
    <div className="achievement-overlay" onClick={onClose}>
      <div className="achievement-popup" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>{ach.icon}</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Achievement freigeschaltet!</div>
        <h2 style={{ margin: '0 0 0.5rem', color: '#fbbf24' }}>{ach.title}</h2>
        <button className="btn btn-xp" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }} autoFocus>Weiter →</button>
      </div>
    </div>
  )
}

const MISSIONS = [
  { n: 1, title: 'Was ist Kennzeichnungspflicht?', icon: '🏷️' },
  { n: 2, title: 'Wann muss ich kennzeichnen?', icon: '📋' },
  { n: 3, title: 'Was sind persönliche Daten?', icon: '🔒' },
  { n: 4, title: 'Datenschutz-Check', icon: '🛡️' },
  { n: 5, title: 'Abschluss', icon: '🏆' },
]

const KP_QUIZ = [
  { id: 'kp1', q: 'Du schreibst ein Referat und nutzt KI für eine Zusammenfassung. Musst du das kennzeichnen?', opts: ['Ja, wenn die Schule es verlangt', 'Nein, das ist nicht nötig', 'Nur wenn der Text länger als eine Seite ist'], ans: 0, explain: 'Richtig! Wenn die Schule KI-Nutzung kennzeichnen lässt, ist das Pflicht.' },
  { id: 'kp2', q: 'Du lässt eine KI dein Referat komplett schreiben und gibst es ohne Kennzeichnung ab. Ist das in Ordnung?', opts: ['Ja, das ist erlaubt', 'Nein, das ist nicht in Ordnung', 'Kommt auf die Lehrkraft an'], ans: 1, explain: 'Richtig! KI-generierte Inhalte als eigene Arbeit auszugeben ist unehrlich.' },
  { id: 'kp3', q: 'Du nutzt KI, um Ideen zu sammeln, und formulierst dann selbst. Musst du kennzeichnen?', opts: ['Immer – auch wenn ich selbst formuliert habe', 'Das kommt auf die Schulregeln an', 'Nie – weil ich selbst geschrieben habe'], ans: 1, explain: 'Richtig! Es kommt auf die Schulregeln an. Im Zweifel: kennzeichnen.' },
]

const DS_SCENARIOS = [
  { id: 'ds1', text: 'Du gibst deinen vollen Namen und deine Adresse in eine KI ein.', correct: 'nein', explain: 'Persönliche Daten wie Name und Adresse nicht in KI eingeben!' },
  { id: 'ds2', text: 'Du fragst eine KI: „Erkläre mir, wie Photosynthese funktioniert."', correct: 'ja', explain: 'Unbedenklich – keine persönlichen Daten enthalten.' },
  { id: 'ds3', text: 'Du gibst Informationen über eine Mitschülerin in eine KI ein.', correct: 'nein', explain: 'Daten anderer Personen nicht ohne Einwilligung weitergeben!' },
  { id: 'ds4', text: 'Du nutzt eine KI, um Vokabeln zu üben.', correct: 'ja', explain: 'Kein Problem – keine persönlichen Daten beteiligt.' },
]

export default function Modul03Page() {
  const navigate = useNavigate()
  const [state,    setState]    = useState(loadState)
  const [achieved, setAchieved] = useState(() => hasAchievement(MOD.id))
  const [showAch,  setShowAch]  = useState(null)

  useEffect(() => { startModuleLocal(MOD.id) }, [])

  function update(updates) {
    setState(prev => { const next = { ...prev, ...updates }; saveState(next); return next })
  }
  function markDone(id) { update({ done: { ...state.done, [id]: true } }) }
  function goMission(n) { update({ mission: n }); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const { done, mission } = state
  const completedCount = Object.keys(done).length
  const progress = Math.round((completedCount / 5) * 100)

  return (
    <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh' }}>
      <AchievementPopup ach={showAch} onClose={() => setShowAch(null)} />
      <div className="wrap">

        {/* Header */}
        <div className="mission-header" style={{ marginBottom: 'var(--sp-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>KI-Führerschein · Modul 3</div>
              <h1 style={{ margin: '0 0 0.375rem', color: 'white' }}>🛡️ Kennzeichnung & Datenschutz</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Wann kennzeichnen · Daten schützen</p>
            </div>
            <div className="xp-badge">⭐ +{MOD.xp} XP</div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.6)' }}>
              <span>Fortschritt</span><span>{progress}%</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        {/* Missions-Navigation */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: 'var(--sp-lg)' }}>
          {MISSIONS.map(m => (
            <button key={m.n} className={`nav-btn ${mission === m.n ? 'active' : ''}`} onClick={() => goMission(m.n)}
              style={{ fontSize: '0.7rem', padding: '0.375rem 0.625rem', minHeight: '2rem',
                background: done['m' + m.n] ? 'rgba(22,163,74,0.2)' : mission === m.n ? 'var(--c-xp)' : 'rgba(255,255,255,0.08)',
                border: done['m' + m.n] ? '1px solid rgba(22,163,74,0.5)' : '1px solid rgba(255,255,255,0.15)',
                color: done['m' + m.n] ? '#4ade80' : 'white' }}>
              {done['m' + m.n] ? '✓' : m.n} {m.icon}
            </button>
          ))}
        </div>

        {/* Mission 1: Info Kennzeichnung */}
        {mission === 1 && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--sp-md)' }}>
              <div className="mission-number">1</div>
              <h2 style={{ margin: 0, color: MOD_COLOR }}>🏷️ Was ist Kennzeichnungspflicht?</h2>
            </div>
            <div className="box-info"><strong>Grundregel:</strong> Wenn du KI-generierte Inhalte verwendest, musst du das in vielen Situationen kenntlich machen.</div>
            <div className="box-info"><strong>Warum?</strong> Andere sollen wissen, ob ein Inhalt von einem Menschen oder einer KI erstellt wurde. Das ist eine Frage der <strong>Ehrlichkeit und Transparenz</strong>.</div>
            <div className="box-warning">KI-generierte Inhalte als eigene Arbeit auszugeben, ohne sie zu kennzeichnen, ist unehrlich – und in der Schule nicht erlaubt.</div>
            <div className="box-memory">Kennzeichne KI-Inhalte immer dann, wenn andere wissen müssen, dass eine KI beteiligt war.</div>
            {!done['m1'] ? (
              <div className="actions"><button className="btn btn-xp" onClick={() => { markDone('m1'); goMission(2) }}>Verstanden · Weiter →</button></div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div className="done-badge">✓ Mission 1 abgeschlossen</div>
                <button className="btn btn-primary" onClick={() => goMission(2)} style={{ background: MOD_COLOR }}>Weiter →</button>
              </div>
            )}
          </div>
        )}

        {/* Mission 2: Quiz Kennzeichnung */}
        {mission === 2 && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--sp-md)' }}>
              <div className="mission-number">2</div>
              <h2 style={{ margin: 0, color: MOD_COLOR }}>📋 Wann muss ich kennzeichnen?</h2>
            </div>
            <M3Quiz questions={KP_QUIZ} done={!!done['m2']} onComplete={() => { markDone('m2'); goMission(3) }} color={MOD_COLOR} />
          </div>
        )}

        {/* Mission 3: Info Datenschutz */}
        {mission === 3 && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--sp-md)' }}>
              <div className="mission-number">3</div>
              <h2 style={{ margin: 0, color: MOD_COLOR }}>🔒 Was sind persönliche Daten?</h2>
            </div>
            <div className="box-info"><strong>Persönliche Daten sind z. B.:</strong><ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', lineHeight: 2 }}><li>Name, Adresse, Geburtsdatum</li><li>Fotos und Videos von Personen</li><li>Gesundheitsdaten, Noten, persönliche Probleme</li><li>Daten über andere Personen</li></ul></div>
            <div className="box-warning"><strong>Wichtige Regel:</strong> Gib <strong>keine persönlichen Daten</strong> in KI-Systeme ein – weder deine eigenen noch die anderer Personen.</div>
            <div className="box-info"><strong>Warum?</strong> KI-Anbieter können Eingaben speichern, auswerten oder für das Training neuer Modelle verwenden.</div>
            <div className="box-memory">Keine persönlichen Daten in KI eingeben – weder eigene noch fremde.</div>
            {!done['m3'] ? (
              <div className="actions"><button className="btn btn-xp" onClick={() => { markDone('m3'); goMission(4) }}>Verstanden · Weiter →</button></div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div className="done-badge">✓ Mission 3 abgeschlossen</div>
                <button className="btn btn-primary" onClick={() => goMission(4)} style={{ background: MOD_COLOR }}>Weiter →</button>
              </div>
            )}
          </div>
        )}

        {/* Mission 4: Datenschutz-Check */}
        {mission === 4 && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--sp-md)' }}>
              <div className="mission-number">4</div>
              <h2 style={{ margin: 0, color: MOD_COLOR }}>🛡️ Datenschutz-Check</h2>
            </div>
            <p className="lead">Beurteile jede Situation: Ist die KI-Nutzung aus Datenschutzsicht in Ordnung?</p>
            <M3DSCheck scenarios={DS_SCENARIOS} done={!!done['m4']} onComplete={() => { markDone('m4'); goMission(5) }} color={MOD_COLOR} />
          </div>
        )}

        {/* Mission 5: Abschluss */}
        {mission === 5 && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--sp-md)' }}>
              <div className="mission-number">5</div>
              <h2 style={{ margin: 0, color: MOD_COLOR }}>🏆 Abschluss</h2>
            </div>
            <div className="box-memory">Kennzeichne KI-Inhalte immer dann, wenn andere wissen müssen, dass eine KI beteiligt war.</div>
            <div className="box-memory">Keine persönlichen Daten in KI eingeben – weder eigene noch fremde.</div>
            {!done['m5'] ? (
              <div className="actions">
                <button className="btn btn-xp"
                  disabled={!['m1','m2','m3','m4'].every(id => done[id])}
                  onClick={() => {
                    markDone('m5')
                    passModule(MOD.id, 100, 100)
                    saveAchievementLocal(MOD.id)
                    setAchieved(true)
                    setShowAch({ icon: '🛡️', title: 'KI-Verantwortliche:r', desc: 'Du kennst die Regeln zur Kennzeichnung und zum Datenschutz!' })
                  }}>
                  Modul abschließen · Achievement freischalten 🛡️
                </button>
              </div>
            ) : (
              <div>
                <div className="done-badge">✓ Modul 3 abgeschlossen!</div>
                <div className="actions" style={{ marginTop: 'var(--sp-md)' }}>
                  <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ background: MOD_COLOR }}>Zur Übersicht →</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="actions no-print" style={{ marginTop: 'var(--sp-lg)' }}>
          {mission > 1 && <button className="btn btn-ghost" onClick={() => goMission(mission - 1)}>← Zurück</button>}
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Zur Übersicht</button>
        </div>
      </div>
    </div>
  )
}

function M3Quiz({ questions, done, onComplete, color }) {
  const [answers, setAnswers] = useState({})
  const [feedback, setFeedback] = useState({})
  const [allCorrect, setAllCorrect] = useState(false)

  function check(qid, val, correct) {
    const isCorrect = val === correct
    setAnswers(a => ({ ...a, [qid]: val }))
    setFeedback(f => ({ ...f, [qid]: isCorrect ? 'correct' : 'wrong' }))
    const newAnswers = { ...answers, [qid]: val }
    if (questions.every(q => newAnswers[q.id] === q.ans)) setAllCorrect(true)
  }

  if (done) return <div className="done-badge">✓ Quiz abgeschlossen</div>

  return (
    <div>
      {questions.map(q => (
        <div key={q.id} style={{ marginBottom: 'var(--sp-md)', padding: 'var(--sp-md)', background: 'var(--c-pale2)', borderRadius: 'var(--r-lg)', border: `2px solid ${feedback[q.id] === 'correct' ? 'var(--c-success)' : feedback[q.id] === 'wrong' ? 'var(--c-error)' : 'var(--c-border)'}` }}>
          <p style={{ fontWeight: 700, marginBottom: '0.625rem' }}>{q.q}</p>
          {q.opts.map((opt, i) => (
            <label key={i} className="option" style={{ background: answers[q.id] === i ? (feedback[q.id] === 'correct' ? 'var(--c-success-bg)' : 'var(--c-error-bg)') : 'white' }}>
              <input type="radio" name={q.id} value={i} checked={answers[q.id] === i}
                onChange={() => !feedback[q.id] && check(q.id, i, q.ans)}
                disabled={!!feedback[q.id]} style={{ accentColor: color }} />
              {opt}
            </label>
          ))}
          {feedback[q.id] === 'correct' && <div className="feedback correct" style={{ display: 'block' }}>✅ {q.explain}</div>}
          {feedback[q.id] === 'wrong' && (
            <div className="feedback wrong" style={{ display: 'block' }}>
              ❌ {q.explain}
              <div style={{ marginTop: '0.5rem' }}><button className="nav-btn" onClick={() => { setAnswers(a => ({ ...a, [q.id]: undefined })); setFeedback(f => ({ ...f, [q.id]: undefined })) }}>↺ Erneut versuchen</button></div>
            </div>
          )}
        </div>
      ))}
      {allCorrect && <div className="actions"><button className="btn btn-xp" onClick={onComplete}>Alle richtig! Weiter →</button></div>}
    </div>
  )
}

function M3DSCheck({ scenarios, done, onComplete, color }) {
  const [answers, setAnswers] = useState({})
  const [checked,  setChecked]  = useState(false)
  const allAnswered = scenarios.every(s => answers[s.id])
  const correct = scenarios.filter(s => answers[s.id] === s.correct).length

  if (done) return <div className="done-badge">✓ Datenschutz-Check abgeschlossen</div>

  return (
    <div>
      {scenarios.map(s => (
        <div key={s.id} style={{ border: `2px solid ${checked ? (answers[s.id] === s.correct ? 'var(--c-success)' : 'var(--c-error)') : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: '0.75rem', background: checked ? (answers[s.id] === s.correct ? 'var(--c-success-bg)' : 'var(--c-error-bg)') : 'white' }}>
          <p style={{ margin: '0 0 0.625rem', fontWeight: 600 }}>{s.text}</p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {[{ v: 'ja', label: '✓ Unbedenklich' }, { v: 'nein', label: '✗ Bedenklich' }].map(opt => (
              <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: checked ? 'default' : 'pointer', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>
                <input type="radio" name={s.id} value={opt.v} checked={answers[s.id] === opt.v}
                  onChange={() => !checked && setAnswers(a => ({ ...a, [s.id]: opt.v }))} disabled={checked}
                  style={{ accentColor: color, width: '1rem', height: '1rem' }} />
                {opt.label}
              </label>
            ))}
          </div>
          {checked && <p style={{ margin: '0.5rem 0 0', fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', fontStyle: 'italic' }}>{s.explain}</p>}
        </div>
      ))}
      {!checked ? (
        <div className="actions"><button className="btn btn-primary" disabled={!allAnswered} onClick={() => setChecked(true)} style={{ background: color }}>Auswerten</button></div>
      ) : (
        <div>
          <div className={`feedback ${correct >= 3 ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>{correct} von {scenarios.length} richtig. {correct >= 3 ? 'Gut gemacht!' : 'Lies die Erklärungen und versuche es erneut.'}</div>
          {correct >= 3 ? (
            <div className="actions"><button className="btn btn-xp" onClick={onComplete}>Weiter →</button></div>
          ) : (
            <div className="actions"><button className="btn btn-ghost" onClick={() => { setAnswers({}); setChecked(false) }}>↺ Erneut versuchen</button></div>
          )}
        </div>
      )}
    </div>
  )
}