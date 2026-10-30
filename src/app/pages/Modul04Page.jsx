// ============================================================
// KI-Führerschein · Modul 04 – Datenschutz
// Platzhalter mit Achievement-Vergabe
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { MemoryBox, InfoBox, TaskBox, WarningBox } from '../../components/ui/InfoBox.jsx'

const MOD = getModule('modul-04')

const SCENARIOS = [
  { id: 'a', text: 'Du gibst deinen vollen Namen und deine Adresse in eine KI ein, um einen Brief zu schreiben.', correct: 'nein', explanation: 'Persönliche Daten wie Name und Adresse solltest du nicht in KI-Systeme eingeben.' },
  { id: 'b', text: 'Du fragst eine KI: „Erkläre mir, wie Photosynthese funktioniert."', correct: 'ja', explanation: 'Das ist unbedenklich – keine persönlichen Daten enthalten.' },
  { id: 'c', text: 'Du gibst Informationen über eine Mitschülerin in eine KI ein, ohne sie zu fragen.', correct: 'nein', explanation: 'Daten anderer Personen dürfen nicht ohne deren Einwilligung weitergegeben werden.' },
  { id: 'd', text: 'Du nutzt eine KI, um Vokabeln zu üben.', correct: 'ja', explanation: 'Kein Problem – keine persönlichen Daten beteiligt.' },
]

export default function Modul04Page() {
  const navigate          = useNavigate()
  const [done, setDone]   = useState(false)
  const [answers, setAnswers] = useState({})
  const [checked, setChecked] = useState(false)

  useEffect(() => { setDone(hasAchievement(MOD.id)) }, [])

  function handleComplete() {
    saveAchievementLocal(MOD.id)
    setDone(true)
  }

  const allAnswered = SCENARIOS.every(s => answers[s.id])
  const correctCount = SCENARIOS.filter(s => answers[s.id] === s.correct).length

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* Hero */}
        <header className="hero" style={{ background: `linear-gradient(120deg, #063a45, ${MOD.color})` }}>
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein Klasse 7 · Modul 4</div>
          <h1 style={{ margin: '8px 0 6px' }}>{MOD.icon} {MOD.title}</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>{MOD.subtitle}</p>
        </header>

        {/* Inhalt */}
        <div className="card">
          <h2>Was sind persönliche Daten?</h2>
          <InfoBox title="Persönliche Daten sind z. B.:">
            <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
              <li>Name, Adresse, Geburtsdatum</li>
              <li>Fotos und Videos von Personen</li>
              <li>Gesundheitsdaten, Noten, persönliche Probleme</li>
              <li>Daten über andere Personen (Mitschüler:innen, Familie)</li>
            </ul>
          </InfoBox>
          <WarningBox title="Wichtige Regel:">
            Gib <strong>keine persönlichen Daten</strong> in KI-Systeme ein – weder deine eigenen noch die anderer Personen. Du weißt nicht, wie diese Daten gespeichert oder verwendet werden.
          </WarningBox>
          <InfoBox title="Warum ist das wichtig?">
            KI-Anbieter können Eingaben speichern, auswerten oder für das Training neuer Modelle verwenden. Persönliche Daten könnten so in falsche Hände geraten.
          </InfoBox>
          <MemoryBox>
            Keine persönlichen Daten in KI eingeben – weder eigene noch fremde.
          </MemoryBox>
        </div>

        {/* Szenarien-Quiz */}
        <div className="card">
          <h2>Datenschutz-Check: Bedenklich oder unbedenklich?</h2>
          <p>Beurteile jede Situation: Ist die KI-Nutzung aus Datenschutzsicht in Ordnung?</p>

          {SCENARIOS.map(s => (
            <div key={s.id} style={{
              border:       '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              padding:      'var(--space-md)',
              marginBottom: 'var(--space-sm)',
              background:   checked
                ? answers[s.id] === s.correct ? 'var(--color-success-light)' : 'var(--color-error-light)'
                : 'white',
            }}>
              <p style={{ margin: '0 0 10px', fontWeight: 700 }}>{s.text}</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {['ja', 'nein'].map(v => (
                  <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: done ? 'default' : 'pointer', fontWeight: 700 }}>
                    <input type="radio" name={s.id} value={v}
                      checked={answers[s.id] === v}
                      onChange={() => { setAnswers(a => ({ ...a, [s.id]: v })); setChecked(false) }}
                      disabled={done}
                      style={{ accentColor: 'var(--color-platform-teal)', width: '18px', height: '18px' }}
                    />
                    {v === 'ja' ? '✓ Unbedenklich' : '✗ Bedenklich'}
                  </label>
                ))}
              </div>
              {checked && (
                <p style={{
                  margin:    '8px 0 0',
                  fontSize:  'var(--font-size-sm)',
                  color:     answers[s.id] === s.correct ? 'var(--color-success)' : 'var(--color-error)',
                  fontWeight: 700,
                }}>
                  {answers[s.id] === s.correct ? '✓ ' : '✗ '}{s.explanation}
                </p>
              )}
            </div>
          ))}

          {!done && allAnswered && !checked && (
            <div className="actions">
              <button className="btn btn-primary" onClick={() => setChecked(true)}>
                Antworten prüfen
              </button>
            </div>
          )}

          {checked && (
            <div className={`feedback ${correctCount >= 3 ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
              {correctCount} von {SCENARIOS.length} Situationen richtig beurteilt.
              {correctCount === SCENARIOS.length ? ' Ausgezeichnet!' : ' Lies die Erklärungen oben noch einmal.'}
            </div>
          )}
        </div>

        {/* Achievement */}
        <div className="card" style={{
          border:     `2px solid ${done ? 'var(--color-gold-dark)' : 'var(--color-border)'}`,
          background: done ? '#fff8db' : 'white',
          textAlign:  'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{MOD.achievement.icon}</div>
          <h2 style={{ color: done ? '#825300' : 'var(--color-platform-teal)', marginTop: 0 }}>
            {MOD.achievement.title}
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
            {MOD.achievement.description}
          </p>
          {done ? (
            <div style={{ color: 'var(--color-success)', fontWeight: 800, fontSize: '1.1rem' }}>
              ✓ Achievement erworben!
            </div>
          ) : (
            <button className="btn btn-primary" onClick={handleComplete}
              style={{ fontSize: '1rem', padding: '14px 28px' }}>
              Modul abschließen · Achievement erwerben 🏅
            </button>
          )}
        </div>

        <div className="actions">
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Zur Übersicht</button>
          {done && <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Weiter →</button>}
        </div>
      </div>
    </div>
  )
}