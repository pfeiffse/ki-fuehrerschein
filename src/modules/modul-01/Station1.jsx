// ============================================================
// Modul 01 · Station 1: Trainingsdaten / Pferdebilder
// ============================================================

import React, { useState } from 'react'
import { InfoBox, TaskBox, MemoryBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#2859d8'

const HORSES_P1 = [
  { id: 'a', emoji: '🐴', label: 'Braunes Pferd',   correct: false },
  { id: 'b', emoji: '🐎', label: 'Braunes Pferd 2', correct: false },
  { id: 'c', emoji: '🐴', label: 'Braunes Pferd 3', correct: false },
  { id: 'd', emoji: '🐎', label: 'Weißes Pferd',    correct: true  },
  { id: 'e', emoji: '🦄', label: 'Pony',            correct: false },
  { id: 'f', emoji: '🐴', label: 'Braunes Pferd 4', correct: false },
]
const HORSES_P2 = [
  { id: 'a', emoji: '🐴', label: 'Braunes Pferd', correct: false },
  { id: 'b', emoji: '🐎', label: 'Weißes Pferd',  correct: true  },
  { id: 'c', emoji: '🦄', label: 'Pony',          correct: true  },
  { id: 'd', emoji: '🚗', label: 'Auto',           correct: false },
  { id: 'e', emoji: '🐴', label: 'Kaltblut',      correct: false },
  { id: 'f', emoji: '🐎', label: 'Schimmel',      correct: false },
]
const QUIZ = [
  { id: 0, text: 'Mehr braune Pferdefotos helfen immer, weil die KI dann mehr Beispiele hat.' },
  { id: 1, text: 'Viele und vielfältige Trainingsbilder helfen der KI, besser zu lernen.' },
  { id: 2, text: 'Die KI muss jedes mögliche Foto vorher gesehen haben, um es zu erkennen.' },
  { id: 3, text: 'Mehr Trainingsbilder machen die KI immer langsamer.' },
]
const QUIZ_EXPLAIN = [
  'Viele ähnliche Bilder helfen nicht, wenn die Vielfalt fehlt.',
  '',
  'Die KI lernt Muster – sie muss nicht jedes Foto kennen.',
  'Mehr Trainingsbilder machen die KI nicht langsamer beim Erkennen.',
]
const QUIZ_ORDER = [0,1,2,3].sort(() => Math.random() - 0.5)

export default function Station1({ done, onComplete }) {
  const [phase,        setPhase]        = useState('train')
  const [trained,      setTrained]      = useState(false)
  const [animating,    setAnimating]    = useState(false)
  const [trainCount,   setTrainCount]   = useState(0)
  const [p1Choice,     setP1Choice]     = useState([])
  const [p1Checked,    setP1Checked]    = useState(false)
  const [p1Solved,     setP1Solved]     = useState(false)
  const [expanded,     setExpanded]     = useState(false)
  const [p2Choice,     setP2Choice]     = useState([])
  const [p2Checked,    setP2Checked]    = useState(false)
  const [quizAnswer,   setQuizAnswer]   = useState('')
  const [quizFeedback, setQuizFeedback] = useState(null)

  function animateTrain() {
    setAnimating(true); setTrainCount(0)
    let c = 0
    const iv = setInterval(() => {
      c++; setTrainCount(c)
      if (c >= 12) { clearInterval(iv); setAnimating(false); setTrained(true) }
    }, 100)
  }

  function toggleP1(id) {
    if (p1Solved) return
    setP1Choice(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
    setP1Checked(false)
  }

  function checkP1() {
    setP1Checked(true)
    const correct = HORSES_P1.filter(h => h.correct).map(h => h.id)
    if (correct.every(id => p1Choice.includes(id)) && p1Choice.length === correct.length) setP1Solved(true)
  }

  function toggleP2(id) {
    setP2Choice(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
    setP2Checked(false)
  }

  function checkP2() {
    setP2Checked(true)
    const correct = HORSES_P2.filter(h => h.correct).map(h => h.id)
    if (correct.every(id => p2Choice.includes(id)) && p2Choice.length === correct.length)
      setTimeout(() => setPhase('quiz'), 500)
  }

  function checkQuiz() {
    if (!quizAnswer) { setQuizFeedback('empty'); return }
    const id = parseInt(quizAnswer)
    if (id === 1) { setQuizFeedback('correct'); setTimeout(() => setPhase('merksatz'), 600) }
    else setQuizFeedback(QUIZ_EXPLAIN[id])
  }

  // Merksatz
  if (phase === 'merksatz' || done) return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="station-counter">Station 1 von 4 · Trainingsdaten · Merksatz</div>
      <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>💡</div>
      <h2 style={{ color: MOD_COLOR }}>Merksatz</h2>
      <MemoryBox>KI lernt Muster aus Beispielen. Wichtig sind viele und <strong>vielfältige</strong> Trainingsbilder.</MemoryBox>
      {!done && (
        <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
          <button className="btn btn-success" onClick={onComplete}>Station 1 abschließen · Achievement freischalten 🐴</button>
        </div>
      )}
      {done && <div className="done-badge">✓ Station 1 abgeschlossen</div>}
    </div>
  )

  // Quiz
  if (phase === 'quiz') return (
    <div className="card">
      <div className="station-counter">Station 1 von 4 · Trainingsdaten · Abschlussfrage</div>
      <h2 style={{ color: MOD_COLOR }}>Was hilft einer KI am besten beim Lernen?</h2>
      {QUIZ_ORDER.map(idx => {
        const q = QUIZ[idx]
        return (
          <label key={q.id} className="option">
            <input type="radio" name="s1quiz" value={q.id}
              checked={quizAnswer === String(q.id)}
              onChange={() => { setQuizAnswer(String(q.id)); setQuizFeedback(null) }} />
            {q.text}
          </label>
        )
      })}
      {quizFeedback === 'empty'   && <div className="feedback wrong" style={{ display: 'block' }}>Bitte wähle eine Antwort aus.</div>}
      {quizFeedback === 'correct' && <div className="feedback correct" style={{ display: 'block' }}>✅ Richtig! Viele und vielfältige Beispiele helfen beim Lernen.</div>}
      {quizFeedback && quizFeedback !== 'empty' && quizFeedback !== 'correct' && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ {quizFeedback}
          <div style={{ marginTop: '8px' }}><button className="nav-btn" onClick={() => { setQuizAnswer(''); setQuizFeedback(null) }}>↺ Erneut versuchen</button></div>
        </div>
      )}
      <div className="actions">
        <button className="btn btn-primary" onClick={checkQuiz} style={{ background: MOD_COLOR }}>Antwort prüfen</button>
      </div>
    </div>
  )

  // Lernaufgaben
  return (
    <>
      <div className="card">
        <div className="station-counter">Station 1 von 4 · Trainingsdaten · Entdecken</div>
        <h2 style={{ color: MOD_COLOR }}>Wie lernt die Mini-KI Pferde erkennen?</h2>
        <p className="lead">Eine KI lernt aus vielen Beispielbildern. Schau dir die Trainingsbilder an – was haben sie gemeinsam?</p>

        {/* Trainingsbilder */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', margin: 'var(--space-md) 0' }}>
          {HORSES_P1.map(h => (
            <div key={h.id} className="tile-face" style={{ cursor: 'default', height: '90px' }}>
              <span style={{ fontSize: 'clamp(22px, 4vw, 36px)' }}>{h.emoji}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>{h.label}</span>
            </div>
          ))}
        </div>

        {!trained && (
          <div className="actions">
            <button className="btn btn-primary" onClick={animateTrain} disabled={animating} style={{ background: MOD_COLOR }}>
              {animating ? `Training läuft … ${(trainCount * 83333).toLocaleString('de-DE')} Bilder` : '▶ Training starten'}
            </button>
          </div>
        )}

        {trained && (
          <>
            <div className="done-badge">✓ Training abgeschlossen · ca. 1.000.000 Bilder (vereinfacht)</div>
            <TaskBox title="Aufgabe: Welche Bilder erkennt die Mini-KI als Pferd?">
              Wähle alle Bilder aus, die die Mini-KI nach diesem Training als Pferd erkennen würde.
            </TaskBox>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--space-md) 0' }}>
              {HORSES_P1.map(h => {
                const sel = p1Choice.includes(h.id)
                let border = sel ? `2px solid ${MOD_COLOR}` : '2px solid var(--color-border)'
                let bg = sel ? '#e7eeff' : 'linear-gradient(155deg,#fff,#eaf8f5)'
                if (p1Checked && p1Solved) {
                  border = h.correct ? '2px solid var(--color-success)' : '2px solid var(--color-border)'
                  bg = h.correct ? 'var(--color-success-light)' : 'white'
                }
                return (
                  <button key={h.id} onClick={() => toggleP1(h.id)} disabled={p1Solved}
                    aria-pressed={sel}
                    style={{ border, borderRadius: 'var(--radius-lg)', padding: '14px 8px', textAlign: 'center', background: bg, cursor: p1Solved ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: '2.2rem' }}>{h.emoji}</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '6px', fontWeight: 700 }}>{h.label}</div>
                    {sel && !p1Checked && <div style={{ fontSize: '0.72rem', color: MOD_COLOR, marginTop: '4px' }}>✓</div>}
                  </button>
                )
              })}
            </div>
            {!p1Solved && (
              <div className="actions">
                <button className="btn btn-primary" onClick={checkP1} style={{ background: MOD_COLOR }}>Auswahl prüfen ↻</button>
              </div>
            )}
            {p1Checked && !p1Solved && <div className="feedback wrong" style={{ display: 'block' }}>❌ Noch nicht ganz. Die Mini-KI kennt nur braune Pferde – das weiße Pferd würde sie nicht erkennen.</div>}
            {p1Solved && <div className="feedback correct" style={{ display: 'block' }}>✅ Richtig! Die Mini-KI erkennt nur braune Pferde – das weiße Pferd ist ihr unbekannt.</div>}
          </>
        )}
      </div>

      {p1Solved && (
        <div className="card">
          <h2 style={{ color: MOD_COLOR }}>Mehr Vielfalt beim Training</h2>
          <p className="lead">Was passiert, wenn die Mini-KI auch andere Pferdearten sieht?</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', margin: 'var(--space-md) 0' }}>
            {HORSES_P2.map(h => (
              <div key={h.id} className="tile-face" style={{ cursor: 'default', height: '90px', borderColor: h.id === 'd' ? 'var(--color-error)' : 'var(--color-border)', background: h.id === 'd' ? 'var(--color-error-light)' : 'linear-gradient(155deg,#fff,#eaf8f5)' }}>
                <span style={{ fontSize: 'clamp(22px, 4vw, 36px)' }}>{h.emoji}</span>
                <span style={{ fontSize: '0.7rem', color: h.id === 'd' ? 'var(--color-error)' : 'var(--color-text-muted)', fontWeight: 700 }}>{h.label}</span>
              </div>
            ))}
          </div>
          {!expanded
            ? <div className="actions"><button className="btn btn-primary" onClick={() => setExpanded(true)} style={{ background: MOD_COLOR }}>▶ Erweitertes Training starten</button></div>
            : (
              <>
                <div className="done-badge">✓ Erweitertes Training abgeschlossen</div>
                <TaskBox title="Aufgabe: Was erkennt die Mini-KI jetzt?">Wähle alle Bilder aus, die die Mini-KI jetzt als Pferd erkennen würde.</TaskBox>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--space-md) 0' }}>
                  {HORSES_P2.map(h => {
                    const sel = p2Choice.includes(h.id)
                    let border = sel ? `2px solid ${MOD_COLOR}` : '2px solid var(--color-border)'
                    let bg = sel ? '#e7eeff' : 'linear-gradient(155deg,#fff,#eaf8f5)'
                    if (p2Checked) {
                      border = h.correct ? '2px solid var(--color-success)' : sel ? '2px solid var(--color-error)' : '2px solid var(--color-border)'
                      bg = h.correct ? 'var(--color-success-light)' : sel ? 'var(--color-error-light)' : 'white'
                    }
                    return (
                      <button key={h.id} onClick={() => toggleP2(h.id)}
                        style={{ border, borderRadius: 'var(--radius-lg)', padding: '14px 8px', textAlign: 'center', background: bg, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                        <div style={{ fontSize: '2.2rem' }}>{h.emoji}</div>
                        <div style={{ fontSize: '0.8rem', marginTop: '6px', fontWeight: 700 }}>{h.label}</div>
                      </button>
                    )
                  })}
                </div>
                <div className="actions">
                  <button className="btn btn-primary" onClick={checkP2} style={{ background: MOD_COLOR }}>Auswahl prüfen ↻</button>
                </div>
                {p2Checked && (
                  <div className={`feedback ${p2Choice.includes('b') && p2Choice.includes('c') && p2Choice.length === 2 ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
                    {p2Choice.includes('b') && p2Choice.includes('c') && p2Choice.length === 2
                      ? '✅ Richtig! Das weiße Pferd und das Pony werden jetzt erkannt – das Auto nicht.'
                      : '❌ Noch nicht ganz. Wähle das weiße Pferd und das Pony – aber nicht das Auto.'}
                  </div>
                )}
              </>
            )}
        </div>
      )}
    </>
  )
}