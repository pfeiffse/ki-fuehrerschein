// ============================================================
// Modul 01 · Station 3: Kontext / Wortwahrscheinlichkeiten
// Didaktik: Kontext beeinflusst Wahrscheinlichkeiten
// Hinweis: Prozentwerte sind erfundene Anschauungswerte
// ============================================================

import React from 'react'
import { InfoBox, MemoryBox, WarningBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#2859d8'

const CONTEXTS = {
  pause: {
    label: 'Pause',
    sentence: 'In der Pause esse ich ein …',
    options: [
      { emoji: '🥪', label: 'Sandwich',  prob: 65 },
      { emoji: '🥐', label: 'Croissant', prob: 30 },
      { emoji: '🚲', label: 'Fahrrad',   prob: 5  },
    ],
  },
  sport: {
    label: 'Sportplatz',
    sentence: 'Auf dem Sportplatz entdecke ich …',
    options: [
      { emoji: '⚽', label: 'einen Ball',        prob: 50 },
      { emoji: '🚲', label: 'ein Fahrrad',       prob: 45 },
      { emoji: '🧊', label: 'einen Kühlschrank', prob: 5  },
    ],
  },
}

export default function Station3({ context, setContext, s3picked, setS3picked, onNext }) {
  const ctx = CONTEXTS[context]

  return (
    <div className="card">
      <div className="station-counter">Station 3 von 4 · Kontext und Wahrscheinlichkeiten</div>
      <h2 style={{ color: MOD_COLOR }}>Wie verändert der Kontext Wortwahrscheinlichkeiten?</h2>
      <p className="lead">
        Eine Sprach-KI schaut auf den bisherigen Text und berechnet, welches Wort als nächstes
        wahrscheinlich kommt. Wechsle den Kontext und beobachte, wie sich die Wahrscheinlichkeiten ändern.
      </p>

      <WarningBox title="Hinweis:">
        Die Prozentwerte sind <strong>erfundene Anschauungswerte</strong> – keine echten Messungen
        eines KI-Modells.
      </WarningBox>

      {/* Kontext-Umschalter */}
      <div style={{ display: 'flex', gap: '10px', margin: 'var(--space-lg) 0 var(--space-md)', flexWrap: 'wrap' }}>
        {Object.entries(CONTEXTS).map(([key, val]) => (
          <button key={key}
            className={`nav-btn ${context === key ? 'active' : ''}`}
            onClick={() => { setContext(key); setS3picked('') }}
            style={{ fontSize: '1rem', padding: '10px 20px' }}>
            {key === 'pause' ? '🏫 ' : '⚽ '}{val.label}
          </button>
        ))}
      </div>

      {/* Satz */}
      <div style={{
        background: 'white', border: `2px solid ${MOD_COLOR}`,
        borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg)',
        fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 800,
        color: 'var(--color-platform)', marginBottom: 'var(--space-lg)', textAlign: 'center',
      }}>
        {ctx.sentence}
      </div>

      {/* Wahrscheinlichkeitsbalken */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: 'var(--space-lg)' }}>
        {ctx.options.map((opt, i) => (
          <div key={i}>
            <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 55px', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.4rem' }}>{opt.emoji}</span>
                <span style={{ fontSize: '0.82rem' }}>{opt.label}</span>
              </div>
              <div style={{ background: '#dbe4f5', borderRadius: 'var(--radius-pill)', height: '24px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${opt.prob}%`,
                  background: opt.prob >= 45 ? MOD_COLOR : opt.prob >= 20 ? '#5880eb' : '#b0bfea',
                  borderRadius: 'var(--radius-pill)', transition: 'width 0.4s ease',
                }} />
              </div>
              <div style={{ fontWeight: 900, color: MOD_COLOR, textAlign: 'right' }}>{opt.prob} %</div>
            </div>
          </div>
        ))}
      </div>

      {/* Fahrrad-Highlight als compare-box */}
      <div className="compare-box">
        <div className="eyebrow">Der Kontext-Vergleich</div>
        <div className="big">🚲 Fahrrad: {context === 'pause' ? '5 %' : '45 %'}</div>
        <p style={{ margin: 0 }}>
          {context === 'pause'
            ? 'Im Pausen-Kontext nur 5 % – ein Fahrrad isst man nicht!'
            : 'Im Sport-Kontext 45 % – auf dem Sportplatz ist ein Fahrrad viel wahrscheinlicher!'}
        </p>
      </div>

      {/* Wort auswählen */}
      <p style={{ fontWeight: 800 }}>Klicke auf eine Fortsetzung und schau, was passiert:</p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
        {ctx.options.map((opt, i) => (
          <button key={i}
            onClick={() => setS3picked(opt.label)}
            style={{
              border: `2px solid ${s3picked === opt.label ? MOD_COLOR : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-lg)', padding: '12px 18px',
              background: s3picked === opt.label ? '#e7eeff' : 'white',
              cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
              fontFamily: 'inherit', transition: 'all 0.2s',
            }}>
            {opt.emoji} {opt.label}
          </button>
        ))}
      </div>

      {s3picked && (
        <div className="feedback correct" style={{ display: 'block' }}>
          💡 Du hast „{s3picked}" gewählt. Die KI könnte auch eine andere Fortsetzung wählen –
          der Satz davor verändert die Chancen!
        </div>
      )}

      <MemoryBox>
        Der Kontext beeinflusst, welche Wörter wahrscheinlich als nächstes kommen.
        Dasselbe Wort kann in verschiedenen Sätzen sehr unterschiedliche Wahrscheinlichkeiten haben.
      </MemoryBox>

      <div className="actions" style={{ marginTop: 'var(--space-lg)' }}>
        <button className="btn btn-primary" onClick={onNext} style={{ background: MOD_COLOR }}>
          Weiter zu Station 4 →
        </button>
      </div>
    </div>
  )
}