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

function HorseGrid({ horses, choices, onToggle, checked, disabled }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--space-md) 0' }}>
      {horses.map(h => {
        const selected = choices.includes(h.id)
        let border = selected ? `2px solid ${MOD_COLOR}` : '2px solid var(--color-border)'
        let bg = selected ? '#e7eeff' : 'white'
        if (checked) {
          border = h.correct ? '2px solid var(--color-success)' : selected ? '2px solid var(--color-error)' : '2px solid var(--color-border)'
          bg = h.correct ? 'var(--color-success-light)' : selected ? 'var(--color-error-light)' : 'white'
        }
        return (
          <button key={h.id} onClick={() => !disabled && onToggle(h.id)}
            disabled={disabled}
            style={{ border, borderRadius: 'var(--radius-lg)', padding: '14px 8px', textAlign: 'center', background: bg, cursor: disabled ? 'default' : 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}>
            <div style={{ fontSize: '2.2rem' }}>{h.emoji}</div>
            <div style={{ fontSize: '0.8rem', marginTop: '6px', fontWeight: 700 }}>{h.label}</div>
            {selected && !checked && <div style={{ fontSize: '0.75rem', color: MOD_COLOR, marginTop: '4px' }}>✓ Ausgewählt</div>}
            {checked && h.correct && <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '4px', fontWeight: 800 }}>✓ Richtig</div>}
          </button>
        )
      })}
    </div>
  )
}

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

  // Lernaufgaben
  return (
    <>
      <div className="card">
        <h2 style={{ color: MOD_COLOR }}>Station 1 · Wie lernt die Mini-KI Pferde erkennen?</h2>
        <InfoBox>Eine KI lernt aus vielen Beispielbildern. Schau dir die Trainingsbilder an – was haben sie gemeinsam?</InfoBox>

        {/* Trainingsbilder Phase 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', margin: 'var(--space-md) 0' }}>
          {HORSES_P1.map(h => (
            <div key={h.id} style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '10px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(24px, 4vw, 38px)' }}>{h.emoji}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{h.label}</div>
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
            <div className="box-info" style={{ marginTop: 'var(--space-md)' }}>
              <strong>Training abgeschlossen!</strong> Die Mini-KI hat ca. 1.000.000 Bilder gesehen (vereinfachte Darstellung).
            </div>
            <TaskBox title="Aufgabe: Welche Bilder erkennt die Mini-KI als Pferd?">
              Wähle alle Bilder aus, die die Mini-KI nach diesem Training als Pferd erkennen würde.
            </TaskBox>
            <HorseGrid horses={HORSES_P1} choices={phase1Choice} onToggle={toggleP1}
              checked={phase1Checked && firstSolved} disabled={firstSolved} />
            {!firstSolved && (
              <div className="actions">
                <button className="btn btn-primary" onClick={checkP1} style={{ background: MOD_COLOR }}>Auswahl prüfen</button>
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
          <InfoBox>Was passiert, wenn die Mini-KI auch andere Pferdearten sieht? Jetzt kommen vielfältigere Trainingsbilder dazu.</InfoBox>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', margin: 'var(--space-md) 0' }}>
            {HORSES_P2.map(h => (
              <div key={h.id} style={{ background: h.id === 'd' ? '#fff0f0' : 'white', border: `1px solid ${h.id === 'd' ? 'var(--color-error)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)', padding: '10px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(24px, 4vw, 38px)' }}>{h.emoji}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>{h.label}</div>
              </div>
            ))}
          </div>
          {!expanded
            ? <div className="actions"><button className="btn btn-primary" onClick={() => setExpanded(true)} style={{ background: MOD_COLOR }}>▶ Erweitertes Training starten</button></div>
            : (
              <>
                <div className="box-info"><strong>Erweitertes Training abgeschlossen!</strong> Die Mini-KI kennt jetzt mehr Pferdearten.</div>
                <TaskBox title="Aufgabe: Was erkennt die Mini-KI jetzt?">
                  Wähle alle Bilder aus, die die Mini-KI nach dem erweiterten Training als Pferd erkennen würde.
                </TaskBox>
                <HorseGrid horses={HORSES_P2} choices={phase2Choice} onToggle={toggleP2} checked={phase2Checked} disabled={false} />
                <div className="actions">
                  <button className="btn btn-primary" onClick={checkP2} style={{ background: MOD_COLOR }}>Auswahl prüfen</button>
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