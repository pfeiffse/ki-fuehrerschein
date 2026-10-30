// ============================================================
// KI-Führerschein · Modul 01 – Was ist KI?
// Platzhalter mit Achievement-Vergabe nach Bestätigung
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { MemoryBox, InfoBox, TaskBox } from '../../components/ui/InfoBox.jsx'

const MOD = getModule('modul-01')

export default function Modul01Page() {
  const navigate  = useNavigate()
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDone(hasAchievement(MOD.id))
  }, [])

  function handleComplete() {
    saveAchievementLocal(MOD.id)
    setDone(true)
  }

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* Hero */}
        <header className="hero" style={{ background: `linear-gradient(120deg, #1a3a8f, ${MOD.color})` }}>
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein Klasse 7 · Modul 1</div>
          <h1 style={{ margin: '8px 0 6px' }}>{MOD.icon} {MOD.title}</h1>
          <p style={{ margin: 0, opacity: 0.9 }}>{MOD.subtitle}</p>
        </header>

        {/* Inhalt */}
        <div className="card">
          <h2>Wie lernt eine KI?</h2>
          <InfoBox title="Trainingsdaten">
            KI-Systeme lernen aus großen Mengen von Beispielen. Je mehr und vielfältigere Beispiele, desto besser kann die KI Muster erkennen.
          </InfoBox>
          <InfoBox title="Mustererkennung">
            Eine KI erkennt keine Bedeutung – sie erkennt statistische Muster in Daten. Das macht sie in manchen Bereichen sehr leistungsfähig, in anderen aber auch fehleranfällig.
          </InfoBox>
          <InfoBox title="Sprach-KI">
            Sprachmodelle sagen Wort für Wort voraus, welches Wort als nächstes wahrscheinlich kommt – basierend auf dem bisherigen Text.
          </InfoBox>
          <MemoryBox>
            KI lernt aus Beispielen, nicht aus Verständnis. Sie erkennt Muster – aber sie „denkt" nicht.
          </MemoryBox>
        </div>

        <div className="card">
          <h2>Wasserzeichen-Rätsel</h2>
          <TaskBox title="Aufgabe:">
            Überlege: Was passiert, wenn alle Trainingsbilder einer KI dasselbe Wasserzeichen tragen? Was lernt die KI dann wirklich?
          </TaskBox>
          <InfoBox>
            Eine KI kann auch <strong>falsche Merkmale</strong> lernen – zum Beispiel ein Wasserzeichen statt das eigentliche Objekt. Das nennt man einen <em>Bias</em> oder <em>Artefakt</em>.
          </InfoBox>
          <MemoryBox>
            KI kann auch irrelevante oder falsche Merkmale lernen. Deshalb sind vielfältige und sorgfältig ausgewählte Trainingsdaten so wichtig.
          </MemoryBox>
        </div>

        <div className="card">
          <h2>Satzwerkstatt</h2>
          <InfoBox>
            Sprach-KI baut Sätze Wort für Wort auf. Jedes neue Wort hängt vom bisherigen Kontext ab. Das Modell wählt nicht das „richtige" Wort – sondern das wahrscheinlichste.
          </InfoBox>
          <MemoryBox>
            Sprach-KI wählt immer das wahrscheinlichste nächste Wort – nicht das „wahre" oder „richtige".
          </MemoryBox>
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
          {done && (
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Weiter zum nächsten Modul →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}