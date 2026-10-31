// ============================================================
// Modul 01 · Station 3: Kontext / Wortwahrscheinlichkeiten
// Reichhaltigere Didaktik: zwei Kontexte, Stern-Toggle, Reflexion
// ============================================================

import React, { useState } from 'react'
import { MemoryBox, WarningBox, InfoBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#2859d8'

const CONTEXTS = {
  pause: {
    label:    'Pause',
    icon:     '🏫',
    sentence: 'In der Pause esse ich ein …',
    options: [
      { emoji: '🥪', label: 'Sandwich',  prob: 65, article: 'ein' },
      { emoji: '🥐', label: 'Croissant', prob: 30, article: 'ein' },
      { emoji: '🚲', label: 'Fahrrad',   prob: 5,  article: 'ein' },
    ],
    highlight: 'Im Pausen-Kontext ist „Fahrrad" sehr unwahrscheinlich – ein Fahrrad isst man nicht!',
  },
  sport: {
    label:    'Sportplatz',
    icon:     '⚽',
    sentence: 'Auf dem Sportplatz entdecke ich …',
    options: [
      { emoji: '⚽', label: 'einen Ball',        prob: 50, article: 'einen' },
      { emoji: '🚲', label: 'ein Fahrrad',       prob: 45, article: 'ein'   },
      { emoji: '🧊', label: 'einen Kühlschrank', prob: 5,  article: 'einen' },
    ],
    highlight: 'Im Sport-Kontext steigt „Fahrrad" von 5 % auf 45 % – auf dem Sportplatz ist das viel wahrscheinlicher!',
  },
}

// Stern-Kontext (wie im Original: starOn)
const STAR_CONTEXTS = {
  pause: {
    sentence: 'In der Pause esse ich ein leckeres …',
    options: [
      { emoji: '🥪', label: 'Sandwich',  prob: 55 },
      { emoji: '🥐', label: 'Croissant', prob: 40 },
      { emoji: '🚲', label: 'Fahrrad',   prob: 5  },
    ],
    note: 'Das Wort „leckeres" verändert die Wahrscheinlichkeiten leicht – Croissant wird wahrscheinlicher.',
  },
  sport: {
    sentence: 'Auf dem Sportplatz entdecke ich ein rotes …',
    options: [
      { emoji: '⚽', label: 'einen Ball',        prob: 70 },
      { emoji: '🚲', label: 'ein Fahrrad',       prob: 20 },
      { emoji: '🧊', label: 'einen Kühlschrank', prob: 10 },
    ],
    note: 'Das Wort „rotes" macht „Ball" noch wahrscheinlicher – rote Fahrräder und Kühlschränke gibt es auch, aber Bälle sind häufiger rot.',
  },
}

const QUIZ = [
  { id: 0, text: 'Die KI legt zuerst fest, welches Wort am Ende des Satzes stehen soll.' },
  { id: 1, text: 'Die bisherigen Wörter beeinflussen, welche Fortsetzungen wahrscheinlich sind.' },
  { id: 2, text: 'Die Prozentwerte sind exakte Messungen eines echten KI-Modells.' },
  { id: 3, text: 'Der Kontext spielt keine Rolle – die KI wählt immer zufällig.' },
]
const QUIZ_EXPLAIN = [
  'Die KI legt nicht zuerst das Ende fest – sie wählt Schritt für Schritt das wahrscheinlichste nächste Wort.',
  '',
  'Die Prozentwerte sind erfundene Anschauungswerte – keine echten Messungen.',
  'Der Kontext ist entscheidend! Das Fahrrad-Beispiel zeigt: 5 % vs. 45 % je nach Kontext.',
]
const QUIZ_ORDER = [0,1,2,3].sort(() => Math.random() - 0.5)

export default function Station3({ done, onComplete }) {
  const [context,    setContext]    = useState('pause')
  const [starOn,     setStarOn]     = useState(false)
  const [picked,     setPicked]     = useState('')
  const [phase,      setPhase]      = useState('erkunden')
  const [quizAnswer, setQuizAnswer] = useState('')
  const [quizFb,     setQuizFb]     = useState(null)
  const [explored,   setExplored]   = useState(new Set())

  const ctx     = starOn ? STAR_CONTEXTS[context] : CONTEXTS[context]
  const baseCtx = CONTEXTS[context]

  function switchContext(key) {
    setContext(key); setPicked(''); setStarOn(false)
    setExplored(prev => new Set([...prev, key]))
  }

  function handlePick(label) {
    setPicked(label)
    // Beide Kontexte erkundet → Quiz freischalten
    if (explored.size >= 1 || context === 'sport') setPhase('reflexion')
  }

  function checkQuiz() {
    if (!quizAnswer) { setQuizFb('empty'); return }
    const id = parseInt(quizAnswer)
    if (id === 1) { setQuizFb('correct'); setTimeout(() => setPhase('merksatz'), 600) }
    else setQuizFb(QUIZ_EXPLAIN[id])
  }

  // Merksatz
  if (phase === 'merksatz' || done) return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="station-counter">Station 3 von 4 · Kontext · Merksatz</div>
      <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-md)' }}>💡</div>
      <h2 style={{ color: MOD_COLOR }}>Merksatz</h2>
      <MemoryBox>Der Kontext beeinflusst, welche Wörter wahrscheinlich als nächstes kommen. Dasselbe Wort kann in verschiedenen Sätzen sehr unterschiedliche Wahrscheinlichkeiten haben.</MemoryBox>
      <InfoBox title="Was bedeutet das für Sprach-KI?">
        Echte Sprachmodelle wie ChatGPT oder Gemini berechnen für jedes mögliche nächste Wort eine Wahrscheinlichkeit – basierend auf allem, was bisher im Text steht. Je mehr Kontext, desto präziser die Vorhersage.
      </InfoBox>
      {!done && (
        <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--sp-lg)' }}>
          <button className="btn btn-success" onClick={onComplete}>Station 3 abschließen · Achievement freischalten 💬</button>
        </div>
      )}
      {done && <div className="done-badge">✓ Station 3 abgeschlossen</div>}
    </div>
  )

  // Quiz
  if (phase === 'quiz') return (
    <div className="card">
      <div className="station-counter">Station 3 von 4 · Kontext · Abschlussfrage</div>
      <h2 style={{ color: MOD_COLOR }}>Wie funktioniert Sprach-KI?</h2>
      {QUIZ_ORDER.map(idx => {
        const q = QUIZ[idx]
        return (
          <label key={q.id} className="option">
            <input type="radio" name="s3quiz" value={q.id}
              checked={quizAnswer === String(q.id)}
              onChange={() => { setQuizAnswer(String(q.id)); setQuizFb(null) }} />
            {q.text}
          </label>
        )
      })}
      {quizFb === 'empty'   && <div className="feedback wrong" style={{ display: 'block' }}>Bitte wähle eine Antwort aus.</div>}
      {quizFb === 'correct' && <div className="feedback correct" style={{ display: 'block' }}>✅ Genau! Die bisherigen Wörter beeinflussen, welche Fortsetzungen wahrscheinlich sind.</div>}
      {quizFb && quizFb !== 'empty' && quizFb !== 'correct' && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ {quizFb}
          <div style={{ marginTop: '8px' }}><button className="nav-btn" onClick={() => { setQuizAnswer(''); setQuizFb(null) }}>↺ Erneut versuchen</button></div>
        </div>
      )}
      <div className="actions">
        <button className="btn btn-primary" onClick={checkQuiz} style={{ background: MOD_COLOR }}>Antwort prüfen</button>
      </div>
    </div>
  )

  // Reflexion nach Erkunden
  if (phase === 'reflexion') return (
    <div className="card">
      <div className="station-counter">Station 3 von 4 · Kontext · Reflexion</div>
      <h2 style={{ color: MOD_COLOR }}>Was hast du beobachtet?</h2>
      <div className="compare-box">
        <div className="eyebrow">Der Fahrrad-Vergleich</div>
        <div className="big">🚲 5 % → 45 %</div>
        <p style={{ margin: '8px 0 0' }}>
          Im Pausen-Kontext: <strong>5 %</strong> Wahrscheinlichkeit für „Fahrrad"<br />
          Im Sport-Kontext: <strong>45 %</strong> Wahrscheinlichkeit für „Fahrrad"
        </p>
      </div>
      <InfoBox title="Warum ist das so?">
        Eine Sprach-KI hat aus riesigen Textmengen gelernt, welche Wörter häufig zusammen vorkommen. In Texten über Pausen kommen Fahrräder selten vor – in Texten über Sport viel häufiger. Dieses Wissen nutzt die KI, um das nächste Wort vorherzusagen.
      </InfoBox>
      <WarningBox title="Wichtig:">
        Die Prozentwerte in dieser Station sind <strong>erfundene Anschauungswerte</strong> – keine echten Messungen eines KI-Modells. Echte Modelle berechnen Wahrscheinlichkeiten für Tausende von Wörtern gleichzeitig.
      </WarningBox>
      <div className="actions">
        <button className="btn btn-primary" onClick={() => setPhase('quiz')} style={{ background: MOD_COLOR }}>Zur Abschlussfrage →</button>
        <button className="btn btn-ghost" onClick={() => setPhase('erkunden')}>Noch weiter erkunden</button>
      </div>
    </div>
  )

  // Erkunden
  return (
    <div className="card">
      <div className="station-counter">Station 3 von 4 · Kontext und Wahrscheinlichkeiten · Erkunden</div>
      <h2 style={{ color: MOD_COLOR }}>Wie verändert der Kontext Wortwahrscheinlichkeiten?</h2>
      <p className="lead">Eine Sprach-KI schaut auf den bisherigen Text und berechnet, welches Wort als nächstes wahrscheinlich kommt. Wechsle den Kontext und beobachte!</p>
      <WarningBox title="Hinweis:">Die Prozentwerte sind <strong>erfundene Anschauungswerte</strong> – keine echten Messungen eines KI-Modells.</WarningBox>

      {/* Kontext-Umschalter */}
      <div style={{ display: 'flex', gap: '10px', margin: 'var(--sp-lg) 0 var(--sp-md)', flexWrap: 'wrap' }}>
        {Object.entries(CONTEXTS).map(([key, val]) => (
          <button key={key} className={`nav-btn ${context === key ? 'active' : ''}`}
            onClick={() => switchContext(key)}
            style={{ fontSize: '1rem', padding: '10px 20px' }}>
            {val.icon} {val.label}
          </button>
        ))}
        <button
          onClick={() => { setStarOn(!starOn); setPicked('') }}
          style={{ border: `2px solid ${starOn ? '#f2b705' : 'var(--c-border)'}`, borderRadius: 'var(--r-md)', padding: '10px 16px', background: starOn ? '#fff7d9' : 'white', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: '0.9rem', transition: 'all 0.2s' }}>
          ⭐ {starOn ? 'Zusatzwort aktiv' : 'Zusatzwort hinzufügen'}
        </button>
      </div>

      {starOn && (
        <InfoBox>
          <strong>Zusatzwort aktiv:</strong> {STAR_CONTEXTS[context].note}
        </InfoBox>
      )}

      {/* Satz */}
      <div style={{ background: 'white', border: `2px solid ${MOD_COLOR}`, borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', fontSize: 'clamp(1.1rem,3vw,1.4rem)', fontWeight: 800, color: 'var(--color-platform)', marginBottom: 'var(--sp-lg)', textAlign: 'center' }}>
        {ctx.sentence}
      </div>

      {/* Wahrscheinlichkeitsbalken */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: 'var(--sp-lg)' }}>
        {ctx.options.map((opt, i) => (
          <div key={i}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 55px', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.4rem' }}>{opt.emoji}</span>
                <span style={{ fontSize: '0.82rem' }}>{opt.label}</span>
              </div>
              <div style={{ background: '#dbe4f5', borderRadius: 'var(--r-pill)', height: '26px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${opt.prob}%`, background: opt.prob >= 45 ? MOD_COLOR : opt.prob >= 20 ? '#5880eb' : '#b0bfea', borderRadius: 'var(--r-pill)', transition: 'width 0.4s ease', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
                  {opt.prob >= 20 && <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 800 }}>{opt.prob} %</span>}
                </div>
              </div>
              <div style={{ fontWeight: 900, color: MOD_COLOR, textAlign: 'right' }}>{opt.prob} %</div>
            </div>
          </div>
        ))}
      </div>

      {/* Fahrrad-Highlight */}
      <div className="compare-box">
        <div className="eyebrow">Beobachtung</div>
        <div className="big">🚲 Fahrrad: {ctx.options.find(o => o.label.includes('Fahrrad'))?.prob ?? '?'} %</div>
        <p style={{ margin: 0 }}>{baseCtx.highlight}</p>
      </div>

      {/* Wort auswählen */}
      <p style={{ fontWeight: 800, marginTop: 'var(--sp-md)' }}>Klicke auf eine Fortsetzung:</p>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: 'var(--sp-md)' }}>
        {ctx.options.map((opt, i) => (
          <button key={i} onClick={() => handlePick(opt.label)}
            style={{ border: `2px solid ${picked === opt.label ? MOD_COLOR : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: '12px 18px', background: picked === opt.label ? '#e7eeff' : 'white', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', fontFamily: 'inherit', transition: 'all 0.2s' }}>
            {opt.emoji} {opt.label}
          </button>
        ))}
      </div>

      {picked && (
        <div className="feedback correct" style={{ display: 'block' }}>
          💡 Du hast „{picked}" gewählt. Die KI könnte auch eine andere Fortsetzung wählen – der Satz davor verändert die Chancen!
          Wechsle den Kontext und beobachte, wie sich die Wahrscheinlichkeiten verändern.
        </div>
      )}

      {explored.size >= 1 && picked && (
        <div className="actions" style={{ marginTop: 'var(--sp-lg)' }}>
          <button className="btn btn-primary" onClick={() => setPhase('reflexion')} style={{ background: MOD_COLOR }}>
            Zur Reflexion →
          </button>
        </div>
      )}
    </div>
  )
}