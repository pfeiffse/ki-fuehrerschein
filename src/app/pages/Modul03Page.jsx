// ============================================================
// KI-Führerschein · Modul 03 – Kennzeichnungspflicht
// Platzhalter mit Achievement-Vergabe
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { MemoryBox, InfoBox, TaskBox, WarningBox } from '../../components/ui/InfoBox.jsx'

const MOD = getModule('modul-03')

export default function Modul03Page() {
  const navigate        = useNavigate()
  const [done, setDone] = useState(false)
  const [q1,   setQ1]   = useState('')
  const [q2,   setQ2]   = useState('')
  const [checked, setChecked] = useState(false)

  useEffect(() => { setDone(hasAchievement(MOD.id)) }, [])

  function handleCheck() {
    setChecked(true)
  }

  function handleComplete() {
    saveAchievementLocal(MOD.id)
    setDone(true)
  }

  const quizCorrect = q1 === 'ja' && q2 === 'nein'

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* Hero */}
        <header className="hero" style={{ background: `linear-gradient(120deg, #0d4f5c, ${MOD.color})` }}>
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein Klasse 7 · Modul 3</div>
          <h1 style={{ margin: '8px 0 6px' }}>{MOD.icon} {MOD.title}</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>{MOD.subtitle}</p>
        </header>

        {/* Inhalt */}
        <div className="card">
          <h2>Was ist die Kennzeichnungspflicht?</h2>
          <InfoBox title="Grundregel:">
            Wenn du KI-generierte Inhalte verwendest – zum Beispiel Texte, Bilder oder Zusammenfassungen – musst du das in vielen Situationen kenntlich machen.
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
          <MemoryBox>
            Kennzeichne KI-Inhalte immer dann, wenn andere wissen müssen, dass eine KI beteiligt war.
          </MemoryBox>
        </div>

        {/* Quiz */}
        <div className="card">
          <h2>Kurz-Quiz</h2>
          <p style={{ fontWeight: 800, marginBottom: 'var(--space-sm)' }}>
            1. Du schreibst ein Referat und nutzt KI für eine Zusammenfassung. Musst du das kennzeichnen?
          </p>
          {['ja', 'nein', 'kommt-drauf-an'].map(v => (
            <label key={v} className="option">
              <input type="radio" name="q1" value={v} checked={q1 === v}
                onChange={() => { setQ1(v); setChecked(false) }} disabled={done} />
              {v === 'ja' ? 'Ja, immer' : v === 'nein' ? 'Nein, das ist nicht nötig' : 'Kommt auf die Schule an'}
            </label>
          ))}

          <p style={{ fontWeight: 800, margin: 'var(--space-md) 0 var(--space-sm)' }}>
            2. Du lässt eine KI dein Referat komplett schreiben und gibst es als deine eigene Arbeit ab – ohne Kennzeichnung. Ist das in Ordnung?
          </p>
          {['ja', 'nein'].map(v => (
            <label key={v} className="option">
              <input type="radio" name="q2" value={v} checked={q2 === v}
                onChange={() => { setQ2(v); setChecked(false) }} disabled={done} />
              {v === 'ja' ? 'Ja, das ist erlaubt' : 'Nein, das ist nicht in Ordnung'}
            </label>
          ))}

          {!done && q1 && q2 && (
            <div className="actions">
              <button className="btn btn-primary" onClick={handleCheck}>Antworten prüfen</button>
            </div>
          )}

          {checked && (
            <div className={`feedback ${quizCorrect ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
              {quizCorrect
                ? '✅ Richtig! Du kennst die Kennzeichnungsregeln.'
                : '❌ Noch nicht ganz. Lies die Informationen oben noch einmal durch.'}
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