// ============================================================
// Modul 01 · Station 3: Kontext / Wortwahrscheinlichkeiten
// Erweitert: eigener Satzanfang, Halluzinations-Demo, 3 Kontexte
// ============================================================

import React, { useState } from 'react'
import { MemoryBox, WarningBox, InfoBox, TaskBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#2859d8'

const CONTEXTS = {
  pause: {
    label:    'Pause',
    icon:     '🏫',
    sentence: 'In der Pause esse ich ein …',
    options: [
      { emoji: '🥪', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=120&q=80', label: 'Sandwich',  prob: 65, article: 'ein' },
      { emoji: '🥐', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&q=80', label: 'Croissant', prob: 30, article: 'ein' },
      { emoji: '🚲', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=120&q=80', label: 'Fahrrad',   prob: 5,  article: 'ein' },
    ],
    highlight: 'Im Pausen-Kontext ist „Fahrrad" sehr unwahrscheinlich – ein Fahrrad isst man nicht!',
  },
  sport: {
    label:    'Sportplatz',
    icon:     '⚽',
    sentence: 'Auf dem Sportplatz entdecke ich …',
    options: [
      { emoji: '⚽', img: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=120&q=80', label: 'einen Ball',        prob: 50, article: 'einen' },
      { emoji: '🚲', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=120&q=80', label: 'ein Fahrrad',       prob: 45, article: 'ein'   },
      { emoji: '🧊', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=120&q=80', label: 'einen Kühlschrank', prob: 5,  article: 'einen' },
    ],
    highlight: 'Im Sport-Kontext steigt „Fahrrad" von 5 % auf 45 % – auf dem Sportplatz ist das viel wahrscheinlicher!',
  },
  kueche: {
    label:    'Küche',
    icon:     '🍳',
    sentence: 'In der Küche benutze ich ein …',
    options: [
      { emoji: '🔪', img: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=120&q=80', label: 'Messer',    prob: 60, article: 'ein' },
      { emoji: '🥄', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=120&q=80', label: 'Löffel',    prob: 35, article: 'einen' },
      { emoji: '🚲', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=120&q=80', label: 'Fahrrad',   prob: 5,  article: 'ein' },
    ],
    highlight: 'In der Küche bleibt „Fahrrad" bei 5 % – egal wo, ein Fahrrad gehört nicht in die Küche!',
  },
}

const STAR_CONTEXTS = {
  pause: {
    sentence: 'In der Pause esse ich ein leckeres …',
    options: [
      { emoji: '🥪', img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=120&q=80', label: 'Sandwich',  prob: 55 },
      { emoji: '🥐', img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&q=80', label: 'Croissant', prob: 40 },
      { emoji: '🚲', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=120&q=80', label: 'Fahrrad',   prob: 5  },
    ],
    note: '„leckeres" macht Croissant wahrscheinlicher – Adjektive verändern die Wahrscheinlichkeiten!',
  },
  sport: {
    sentence: 'Auf dem Sportplatz entdecke ich ein rotes …',
    options: [
      { emoji: '⚽', img: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=120&q=80', label: 'einen Ball',        prob: 70 },
      { emoji: '🚲', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=120&q=80', label: 'ein Fahrrad',       prob: 20 },
      { emoji: '🧊', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=120&q=80', label: 'einen Kühlschrank', prob: 10 },
    ],
    note: '„rotes" macht Ball noch wahrscheinlicher – rote Bälle sind häufiger als rote Kühlschränke!',
  },
  kueche: {
    sentence: 'In der Küche benutze ich ein scharfes …',
    options: [
      { emoji: '🔪', img: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=120&q=80', label: 'Messer',    prob: 85 },
      { emoji: '🥄', img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=120&q=80', label: 'Löffel',    prob: 10 },
      { emoji: '🚲', img: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=120&q=80', label: 'Fahrrad',   prob: 5  },
    ],
    note: '„scharfes" macht Messer viel wahrscheinlicher – scharfe Löffel gibt es kaum!',
  },
}

// Halluzinations-Beispiele: KI wählt "wahrscheinlichstes" Wort, liegt aber falsch
const HALLUZINATION_EXAMPLES = [
  {
    prompt: 'Die Hauptstadt von Australien ist …',
    kiSays: 'Sydney',
    correct: 'Canberra',
    explanation: 'In Texten kommt „Sydney" viel häufiger zusammen mit „Australien" vor als „Canberra". Die KI wählt das wahrscheinlichste Wort – aber das ist hier falsch!',
    icon: '🦘',
  },
  {
    prompt: 'Albert Einstein erfand die …',
    kiSays: 'Atombombe',
    correct: 'Relativitätstheorie (er erfand die Atombombe nicht)',
    explanation: 'Einstein und Atombombe kommen in Texten oft zusammen vor (Manhattan-Projekt). Die KI verknüpft diese Wörter – obwohl Einstein die Bombe nicht erfunden hat.',
    icon: '⚛️',
  },
  {
    prompt: 'Das schnellste Tier der Welt ist der …',
    kiSays: 'Gepard ✓',
    correct: 'Gepard (hier stimmt es!)',
    explanation: 'Manchmal liegt die KI richtig – weil das häufigste Wort auch das korrekte ist. Aber das ist Zufall, nicht Verständnis.',
    icon: '🐆',
  },
]

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
  const [context,      setContext]      = useState('pause')
  const [starOn,       setStarOn]       = useState(false)
  const [picked,       setPicked]       = useState('')
  const [phase,        setPhase]        = useState('erkunden')
  const [quizAnswer,   setQuizAnswer]   = useState('')
  const [quizFb,       setQuizFb]       = useState(null)
  const [explored,     setExplored]     = useState(new Set(['pause']))
  const [hallStep,     setHallStep]     = useState(0)
  const [hallRevealed, setHallRevealed] = useState(false)

  const ctx     = starOn ? STAR_CONTEXTS[context] : CONTEXTS[context]
  const baseCtx = CONTEXTS[context]

  function switchContext(key) {
    setContext(key); setPicked(''); setStarOn(false)
    setExplored(prev => new Set([...prev, key]))
  }

  function handlePick(label) { setPicked(label) }

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
      <MemoryBox>Der Kontext beeinflusst, welche Wörter wahrscheinlich als nächstes kommen. Wahrscheinlich bedeutet aber nicht richtig – KI kann auch falsch liegen.</MemoryBox>
      <InfoBox title="Was bedeutet das für Sprach-KI?">
        Echte Sprachmodelle wie ChatGPT berechnen für jedes mögliche nächste Wort eine Wahrscheinlichkeit – basierend auf allem, was bisher im Text steht. Je mehr Kontext, desto präziser die Vorhersage. Aber: Häufig ≠ Wahr!
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
        <button className="btn btn-ghost" onClick={() => setPhase('halluzination')}>← Zurück</button>
      </div>
    </div>
  )

  // Halluzinations-Demo
  if (phase === 'halluzination') {
    const ex = HALLUZINATION_EXAMPLES[hallStep]
    return (
      <div className="card">
        <div className="station-counter">Station 3 von 4 · Kontext · Wahrscheinlich ≠ Richtig</div>
        <h2 style={{ color: '#dc2626' }}>⚠️ Wahrscheinlich ≠ Richtig</h2>
        <p className="lead">
          Die KI wählt immer das <strong>wahrscheinlichste</strong> nächste Wort – aber das ist nicht immer das <strong>richtige</strong>!
        </p>

        {/* Fortschritt */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--sp-md)' }}>
          {HALLUZINATION_EXAMPLES.map((_, i) => (
            <div key={i} style={{ flex: 1, height: '6px', borderRadius: '99px',
              background: i < hallStep ? '#4ade80' : i === hallStep ? '#dc2626' : 'var(--c-border)' }} />
          ))}
        </div>

        {/* Beispiel */}
        <div style={{ background: '#f8fafc', border: '2px solid var(--c-border)', borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', marginBottom: 'var(--sp-md)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{ex.icon}</div>
          <div style={{ fontWeight: 800, fontSize: 'var(--fs-lg)', marginBottom: 'var(--sp-md)', color: 'var(--c-dark)' }}>
            „{ex.prompt}"
          </div>

          {/* KI-Antwort */}
          <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-sm)', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#991b1b', letterSpacing: '0.1em', marginBottom: '4px' }}>KI ANTWORTET:</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626' }}>{ex.kiSays}</div>
          </div>

          {!hallRevealed ? (
            <div className="actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => setHallRevealed(true)}
                style={{ background: '#dc2626' }}>
                Stimmt das? Aufdecken →
              </button>
            </div>
          ) : (
            <>
              <div style={{ background: '#f0fdf4', border: '2px solid #4ade80', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', letterSpacing: '0.1em', marginBottom: '4px' }}>RICHTIGE ANTWORT:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#166534' }}>{ex.correct}</div>
              </div>
              <div style={{ background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)' }}>
                <div style={{ fontWeight: 800, color: '#92400e', marginBottom: '4px', fontSize: 'var(--fs-sm)' }}>💡 Warum macht die KI das?</div>
                <p style={{ margin: 0, color: '#78350f', fontSize: 'var(--fs-sm)' }}>{ex.explanation}</p>
              </div>
              <div className="actions" style={{ marginTop: 'var(--sp-md)' }}>
                {hallStep < HALLUZINATION_EXAMPLES.length - 1 ? (
                  <button className="btn btn-primary" onClick={() => { setHallStep(s => s+1); setHallRevealed(false) }}
                    style={{ background: MOD_COLOR }}>
                    Nächstes Beispiel →
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={() => setPhase('quiz')}
                    style={{ background: MOD_COLOR }}>
                    Zur Abschlussfrage →
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // Reflexion
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
        Eine Sprach-KI hat aus riesigen Textmengen gelernt, welche Wörter häufig zusammen vorkommen. In Texten über Pausen kommen Fahrräder selten vor – in Texten über Sport viel häufiger.
      </InfoBox>
      <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#991b1b', fontSize: 'var(--fs-sm)' }}>
          ⚠️ Aber Vorsicht: Wahrscheinlich bedeutet nicht richtig!<br/>
          Im nächsten Schritt siehst du, wie KI trotz „wahrscheinlicher" Antworten falsch liegen kann.
        </p>
      </div>
      <WarningBox title="Wichtig:">
        Die Prozentwerte in dieser Station sind <strong>erfundene Anschauungswerte</strong> – keine echten Messungen eines KI-Modells.
      </WarningBox>
      <div className="actions">
        <button className="btn btn-primary" onClick={() => setPhase('halluzination')} style={{ background: MOD_COLOR }}>
          Weiter: Wahrscheinlich ≠ Richtig →
        </button>
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
            style={{ fontSize: '1rem', padding: '10px 20px',
              background: explored.has(key) && context !== key ? 'rgba(22,163,74,0.1)' : undefined,
              border: explored.has(key) && context !== key ? '1px solid rgba(22,163,74,0.4)' : undefined }}>
            {explored.has(key) && context !== key ? '✓ ' : ''}{val.icon} {val.label}
          </button>
        ))}
        <button
          onClick={() => { setStarOn(!starOn); setPicked('') }}
          style={{ border: `2px solid ${starOn ? '#f2b705' : 'var(--c-border)'}`, borderRadius: 'var(--r-md)', padding: '10px 16px', background: starOn ? '#fff7d9' : 'white', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: '0.9rem', transition: 'all 0.2s' }}>
          ⭐ {starOn ? 'Adjektiv aktiv' : '+ Adjektiv hinzufügen'}
        </button>
      </div>

      {starOn && (
        <div style={{ background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
          <p style={{ margin: 0, fontWeight: 700, color: '#92400e', fontSize: 'var(--fs-sm)' }}>
            ⭐ <strong>Adjektiv-Effekt:</strong> {STAR_CONTEXTS[context].note}
          </p>
        </div>
      )}

      {/* Satz */}
      <div style={{ background: 'white', border: `2px solid ${MOD_COLOR}`, borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', fontSize: 'clamp(1.1rem,3vw,1.4rem)', fontWeight: 800, color: 'var(--c-dark)', marginBottom: 'var(--sp-lg)', textAlign: 'center' }}>
        {ctx.sentence}
      </div>

      {/* Wahrscheinlichkeitsbalken */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: 'var(--sp-lg)' }}>
        {ctx.options.map((opt, i) => (
          <div key={i}>
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 55px', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {opt.img
                  ? <img src={opt.img} alt={opt.label} style={{ width: '2rem', height: '2rem', objectFit: 'cover', borderRadius: '0.375rem' }} />
                  : <span style={{ fontSize: '1.4rem' }}>{opt.emoji}</span>}
                <span style={{ fontSize: '0.82rem' }}>{opt.label}</span>
              </div>
              <div style={{ background: '#dbe4f5', borderRadius: 'var(--r-pill)', height: '26px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${opt.prob}%`, background: opt.prob >= 45 ? MOD_COLOR : opt.prob >= 20 ? '#5880eb' : '#b0bfea', borderRadius: 'var(--r-pill)', transition: 'width 0.6s ease', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
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
            {opt.img
              ? <img src={opt.img} alt={opt.label} style={{ width: '1.5rem', height: '1.5rem', objectFit: 'cover', borderRadius: '0.25rem', verticalAlign: 'middle' }} />
              : opt.emoji} {opt.label}
          </button>
        ))}
      </div>

      {picked && (
        <div className="feedback correct" style={{ display: 'block' }}>
          💡 Du hast „{picked}" gewählt. Die KI könnte auch eine andere Fortsetzung wählen – der Satz davor verändert die Chancen!
        </div>
      )}

      {/* Fortschritt: alle 3 Kontexte erkundet? */}
      <div style={{ marginTop: 'var(--sp-md)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(CONTEXTS).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--fs-xs)', fontWeight: 700,
            color: explored.has(key) ? 'var(--c-success)' : 'var(--c-muted)' }}>
            {explored.has(key) ? '✓' : '○'} {val.icon} {val.label}
          </div>
        ))}
        {explored.size < 3 && (
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>
            – Erkunde noch {3 - explored.size} Kontext{3 - explored.size !== 1 ? 'e' : ''}!
          </span>
        )}
      </div>

      {explored.size >= 2 && picked && (
        <div className="actions" style={{ marginTop: 'var(--sp-lg)' }}>
          <button className="btn btn-primary" onClick={() => setPhase('reflexion')} style={{ background: MOD_COLOR }}>
            Zur Reflexion →
          </button>
        </div>
      )}
    </div>
  )
}
