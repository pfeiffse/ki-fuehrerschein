// ============================================================
// Modul 01 · Station 1: Trainingsdaten / Pferdebilder
// Didaktik: beobachten → ausprobieren → prüfen → Merksatz
// ============================================================

import React, { useState } from 'react'
import { InfoBox, TaskBox, WarningBox, MemoryBox } from '../../components/ui/InfoBox.jsx'

export const MOD_COLOR = '#2859d8'

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

const S1_QUIZ = [
  { id: 0, text: 'Mehr braune Pferdefotos helfen immer, weil die KI dann mehr Beispiele hat.' },
  { id: 1, text: 'Viele und vielfältige Trainingsbilder helfen der KI, besser zu lernen.' },
  { id: 2, text: 'Die KI muss jedes mögliche Foto vorher gesehen haben, um es zu erkennen.' },
  { id: 3, text: 'Mehr Trainingsbilder machen die KI immer langsamer.' },
]
const S1_EXPLAIN = [
  'Viele ähnliche Bilder helfen nicht, wenn die Vielfalt fehlt. Die KI lernt dann nur braune Pferde kennen.',
  '',
  'Die KI lernt Muster – sie muss nicht jedes Foto kennen, aber braucht vielfältige Beispiele.',
  'Mehr Trainingsbilder machen die KI nicht langsamer beim Erkennen – nur beim Trainieren.',
]



export default function Station1({
  trained, setTrained, phase1Choice, setPhase1Choice, phase1Checked, setPhase1Checked,
  firstSolved, setFirstSolved, expanded, setExpanded, phase2Choice, setPhase2Choice,
  phase2Checked, setPhase2Checked, s1Conclusion, setS1Conclusion,
  s1Order, s1Quiz, setS1Quiz, s1Feedback, setS1Feedback, onNext,
}) {
  const [animating, setAnimating] = useState(false)
  const [trainCount, setTrainCount] = useState(0)

  function animateTraining(onDone) {
    setAnimating(true); setTrainCount(0)
    let count = 0
    const iv = setInterval(() => {
      count++; setTrainCount(count)
      if (count >= 12) { clearInterval(iv); setAnimating(false); setTrained(1); onDone?.() }
    }, 100)
  }

  function toggleP1(id) {
    if (firstSolved) return
    setPhase1Choice(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
    setPhase1Checked(false)
  }

  function checkP1() {
    setPhase1Checked(true)
    const correct = HORSES_P1.filter(h => h.correct).map(h => h.id)
    if (correct.every(id => phase1Choice.includes(id)) && phase1Choice.length === correct.length) setFirstSolved(true)
  }

  function toggleP2(id) {
    setPhase2Choice(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])
    setPhase2Checked(false)
  }

  function checkP2() {
    setPhase2Checked(true)
    const correct = HORSES_P2.filter(h => h.correct).map(h => h.id)
    if (correct.every(id => phase2Choice.includes(id)) && phase2Choice.length === correct.length)
      setTimeout(() => setS1Conclusion(1), 500)
  }

  function checkQuiz() {
    if (!s1Quiz) { setS1Feedback('Bitte wähle eine Antwort aus.'); return }
    const id = parseInt(s1Quiz)
    if (id === 1) { setS1Feedback('correct'); setTimeout(() => setS1Conclusion(2), 600) }
    else setS1Feedback(S1_EXPLAIN[id])
  }

  // Merksatz
  if (s1Conclusion === 2) return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>💡</div>
      <h2 style={{ color: MOD_COLOR }}>Merksatz · Station 1</h2>
      <MemoryBox>KI lernt Muster aus Beispielen. Wichtig sind viele und <strong>vielfältige</strong> Trainingsbilder.</MemoryBox>
      <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
        <button className="btn btn-primary" onClick={onNext} style={{ background: MOD_COLOR }}>Weiter zu Station 2 →</button>
      </div>
    </div>
  )

  // Abschlussfrage
  if (s1Conclusion === 1) return (
    <div className="card">
      <h2 style={{ color: MOD_COLOR }}>Station 1 · Abschlussfrage</h2>
      <p style={{ fontWeight: 800 }}>Was hilft einer KI am besten beim Lernen?</p>
      {s1Order.map(idx => {
        const q = S1_QUIZ[idx]
        return (
          <label key={q.id} className="option">
            <input type="radio" name="s1quiz" value={q.id}
              checked={s1Quiz === String(q.id)}
              onChange={() => { setS1Quiz(String(q.id)); setS1Feedback('') }} />
            {q.text}
          </label>
        )
      })}
      {s1Feedback && s1Feedback !== 'correct' && <div className="feedback wrong" style={{ display: 'block' }}>❌ {s1Feedback}</div>}
      {s1Feedback === 'correct' && <div className="feedback correct" style={{ display: 'block' }}>✅ Richtig! Viele und vielfältige Beispiele helfen beim Lernen.</div>}
      <div className="actions">
        <button className="btn btn-primary" onClick={checkQuiz} style={{ background: MOD_COLOR }}>Antwort prüfen</button>
      </div>
    </div>
  )

  
}