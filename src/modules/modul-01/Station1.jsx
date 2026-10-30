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

  // ── Lernaufgaben ──────────────────────────────────────────
  return (
    <>
      <div className="card">
        <div className="station-counter">Station 1 von 4 · Trainingsdaten</div>
        <h2 style={{ color: MOD_COLOR }}>Wie lernt die Mini-KI Pferde erkennen?</h2>
        <p className="lead">Eine KI lernt aus vielen Beispielbildern. Schau dir die Trainingsbilder an – was haben sie gemeinsam?</p>

        {/* Trainingsbilder Phase 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', margin: 'var(--space-md) 0' }}>
          {HORSES_P1.map(h => (
            <div key={h.id} className="tile-face" style={{ cursor: 'default', height: '90px' }}>
              <span style={{ fontSize: 'clamp(22px, 4vw, 36px)' }}>{h.emoji}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>{h.label}</span>
            </div>
          ))}
        </div>

        {trained === 0 && (
          <div className="actions">
            <button className="btn btn-primary" onClick={() => animateTraining()} style={{ background: MOD_COLOR }} disabled={animating}>
              {animating ? `Training läuft … ${(trainCount * 83333).toLocaleString('de-DE')} Bilder` : '▶ Training starten'}
            </button>
          </div>
        )}

        {trained >= 1 && (
          <>
            <div className="done-badge">✓ Training abgeschlossen · ca. 1.000.000 Bilder (vereinfacht)</div>
            <TaskBox title="Aufgabe: Welche Bilder erkennt die Mini-KI als Pferd?">
              Wähle alle Bilder aus, die die Mini-KI nach diesem Training als Pferd erkennen würde.
              Klicke auf die Kacheln – nach dem Prüfen drehen sie sich um!
            </TaskBox>
            <FlipHorseGrid horses={HORSES_P1} choices={phase1Choice} onToggle={toggleP1}
              checked={phase1Checked && firstSolved} disabled={firstSolved} />
            {!firstSolved && (
              <div className="actions">
                <button className="btn btn-primary" onClick={checkP1} style={{ background: MOD_COLOR }}>Auswahl prüfen ↻</button>
              </div>
            )}
            {phase1Checked && !firstSolved && (
              <div className="feedback wrong" style={{ display: 'block' }}>
                ❌ Noch nicht ganz. Die Mini-KI kennt nur braune Pferde – das weiße Pferd würde sie nicht erkennen.
              </div>
            )}
            {firstSolved && <div className="feedback correct" style={{ display: 'block' }}>✅ Richtig! Die Mini-KI erkennt nur braune Pferde – das weiße Pferd ist ihr unbekannt.</div>}
          </>
        )}
      </div>

      {firstSolved && (
        <div className="card">
          <h2 style={{ color: MOD_COLOR }}>Mehr Vielfalt beim Training</h2>
          <p className="lead">Was passiert, wenn die Mini-KI auch andere Pferdearten sieht? Jetzt kommen vielfältigere Trainingsbilder dazu.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', margin: 'var(--space-md) 0' }}>
            {HORSES_P2.map(h => (
              <div key={h.id} className="tile-face" style={{
                cursor: 'default', height: '90px',
                borderColor: h.id === 'd' ? 'var(--color-error)' : 'var(--color-border)',
                background: h.id === 'd' ? 'var(--color-error-light)' : 'linear-gradient(155deg, #fff, #eaf8f5)',
              }}>
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
                <TaskBox title="Aufgabe: Was erkennt die Mini-KI jetzt?">
                  Wähle alle Bilder aus, die die Mini-KI nach dem erweiterten Training als Pferd erkennen würde.
                </TaskBox>
                <FlipHorseGrid horses={HORSES_P2} choices={phase2Choice} onToggle={toggleP2} checked={phase2Checked} disabled={false} />
                <div className="actions">
                  <button className="btn btn-primary" onClick={checkP2} style={{ background: MOD_COLOR }}>Auswahl prüfen ↻</button>
                </div>
                {phase2Checked && (
                  <div className={`feedback ${phase2Choice.includes('b') && phase2Choice.includes('c') && phase2Choice.length === 2 ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
                    {phase2Choice.includes('b') && phase2Choice.includes('c') && phase2Choice.length === 2
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