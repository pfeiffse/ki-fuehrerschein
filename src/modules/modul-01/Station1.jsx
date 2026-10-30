// ============================================================
// Modul 01 · Station 1: Trainingsdaten / Pferdebilder
// Echte Fotos von Wikimedia Commons (wie im Original)
// ============================================================

import React, { useState } from 'react'
import { InfoBox, TaskBox, MemoryBox, WarningBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#2859d8'

// Wikimedia Commons Hilfsfunktion
const commons = name => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=400`

// Trainingsbilder Phase 1 – braune Pferde (wie im Original)
const TRAINING_P1 = [
  { file: 'Chestnut_Thoroughbred.jpg',                    label: 'Braunes Pferd 1' },
  { file: 'Chestnut_Thoroughbred_Horse_(3433223374).jpg', label: 'Braunes Pferd 2' },
  { file: 'Chestnut_horse_in_a_paddock.jpg',              label: 'Braunes Pferd 3' },
  { file: 'Lichtenwald_Pferd.jpg',                        label: 'Braunes Pferd 4' },
  { file: 'Chestnut_Horse_-_52929673268.jpg',             label: 'Braunes Pferd 5' },
  { file: 'Draft_horse.jpg',                              label: 'Braunes Pferd 6' },
]

// Testbilder Phase 1 – was erkennt die KI?
const TEST_P1 = [
  { file: 'Chestnut_Thoroughbred.jpg',          label: 'Braunes Pferd',  correct: true,  emoji: '🐎' },
  { file: 'Chestnut_horse_in_a_paddock.jpg',    label: 'Braunes Pferd',  correct: true,  emoji: '🐎' },
  { file: 'White_Horse_of_the_Camargue.jpg',    label: 'Weißes Pferd',   correct: false, emoji: '🐎' },
  { file: 'Shetland_Pony_at_Avon_Valley.jpg',   label: 'Pony',           correct: false, emoji: '🦄' },
  { file: 'Draft_horse.jpg',                    label: 'Kaltblut',       correct: false, emoji: '🐴' },
  { file: 'Lichtenwald_Pferd.jpg',              label: 'Braunes Pferd',  correct: true,  emoji: '🐎' },
]

// Trainingsbilder Phase 2 – vielfältigere Pferde
const TRAINING_P2 = [
  { file: 'Chestnut_Thoroughbred.jpg',          label: 'Braunes Pferd' },
  { file: 'White_Horse_of_the_Camargue.jpg',    label: 'Weißes Pferd'  },
  { file: 'Shetland_Pony_at_Avon_Valley.jpg',   label: 'Pony'          },
  { file: 'Draft_horses_4.jpg',                 label: 'Kaltblut'      },
  { file: 'Lichtenwald_Pferd.jpg',              label: 'Braunes Pferd' },
  { file: 'Draft_horse.jpg',                    label: 'Kaltblut 2'    },
]

// Testbilder Phase 2
const TEST_P2 = [
  { file: 'Chestnut_Thoroughbred.jpg',          label: 'Braunes Pferd',  correct: true,  emoji: '🐎' },
  { file: 'White_Horse_of_the_Camargue.jpg',    label: 'Weißes Pferd',   correct: true,  emoji: '🐎' },
  { file: 'Shetland_Pony_at_Avon_Valley.jpg',   label: 'Pony',           correct: true,  emoji: '🦄' },
  { file: 'photo-1503376780353-7e6692767b70',   label: 'Auto',           correct: false, emoji: '🚗', unsplash: true },
  { file: 'Draft_horses_4.jpg',                 label: 'Kaltblut',       correct: true,  emoji: '🐴' },
  { file: 'Lichtenwald_Pferd.jpg',              label: 'Braunes Pferd',  correct: true,  emoji: '🐎' },
]

const QUIZ = [
  { id: 0, text: 'Mehr braune Pferdefotos helfen immer, weil die KI dann mehr Beispiele hat.' },
  { id: 1, text: 'Viele und vielfältige Trainingsbilder helfen der KI, besser zu lernen.' },
  { id: 2, text: 'Die KI muss jedes mögliche Foto vorher gesehen haben, um es zu erkennen.' },
  { id: 3, text: 'Mehr Trainingsbilder machen die KI immer langsamer.' },
]
const QUIZ_EXPLAIN = [
  'Viele ähnliche Bilder helfen nicht, wenn die Vielfalt fehlt. Die KI lernt dann nur braune Pferde kennen.',
  '',
  'Die KI lernt Muster – sie muss nicht jedes Foto kennen, aber braucht vielfältige Beispiele.',
  'Mehr Trainingsbilder machen die KI nicht langsamer beim Erkennen – nur beim Trainieren.',
]
const QUIZ_ORDER = [0,1,2,3].sort(() => Math.random() - 0.5)

// Foto-Komponente mit Fallback
function HorsePhoto({ file, label, size = '140px', hasR = false, unsplash = false }) {
  const [err, setErr] = useState(false)
  const url = unsplash
    ? `https://images.unsplash.com/${file}?w=400&q=80`
    : commons(file)

  return (
    <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#eaf5f6', border: '2px solid var(--color-border)', height: size }}>
      {!err ? (
        <img src={url} alt={label} loading="lazy"
          onError={() => setErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--color-text-muted)' }}>
          🐎<div style={{ fontSize: '0.7rem', marginTop: '4px' }}>{label}</div>
        </div>
      )}
      {hasR && (
        <div style={{ position: 'absolute', bottom: '6px', right: '8px', background: 'rgba(255,255,255,0.7)', borderRadius: '4px', padding: '1px 5px', fontSize: '0.85rem', fontWeight: 900, color: '#333', fontFamily: 'serif' }}>R</div>
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.45)', color: 'white', fontSize: '0.7rem', padding: '3px 6px', fontWeight: 700 }}>{label}</div>
    </div>
  )
}

// Auswahl-Kachel mit echtem Foto
function SelectTile({ item, selected, checked, onToggle, disabled, unsplash = false }) {
  let border = selected ? `3px solid ${MOD_COLOR}` : '2px solid var(--color-border)'
  let overlay = null
  if (checked) {
    if (item.correct && selected)  { border = '3px solid var(--color-success)'; overlay = { bg: 'rgba(33,135,93,0.15)', text: '✓ Richtig erkannt', color: 'var(--color-success)' } }
    if (item.correct && !selected) { border = '3px solid var(--color-warning)'; overlay = { bg: 'rgba(231,163,42,0.15)', text: '○ Vergessen', color: 'var(--color-warning)' } }
    if (!item.correct && selected) { border = '3px solid var(--color-error)';   overlay = { bg: 'rgba(201,67,77,0.15)', text: '✗ Falsch', color: 'var(--color-error)' } }
  }

  return (
    <button onClick={() => !disabled && onToggle(item.label)} disabled={disabled}
      aria-pressed={selected}
      style={{ border, borderRadius: 'var(--radius-lg)', padding: 0, background: 'white', cursor: disabled ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', overflow: 'hidden', position: 'relative', textAlign: 'left' }}>
      <HorsePhoto file={item.file} label={item.label} size="120px" unsplash={unsplash || item.unsplash} />
      {selected && !checked && (
        <div style={{ position: 'absolute', top: '6px', right: '6px', background: MOD_COLOR, color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900 }}>✓</div>
      )}
      {overlay && (
        <div style={{ position: 'absolute', inset: 0, background: overlay.bg, display: 'flex', alignItems: 'flex-end', padding: '6px' }}>
          <span style={{ background: 'white', color: overlay.color, borderRadius: 'var(--radius-sm)', padding: '2px 6px', fontSize: '0.7rem', fontWeight: 800 }}>{overlay.text}</span>
        </div>
      )}
    </button>
  )
}

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

  function toggleP1(label) {
    if (p1Solved) return
    setP1Choice(p => p.includes(label) ? p.filter(x => x !== label) : [...p, label])
    setP1Checked(false)
  }

  function checkP1() {
    setP1Checked(true)
    const correctLabels = TEST_P1.filter(h => h.correct).map(h => h.label)
    const userCorrect   = p1Choice.filter(l => correctLabels.includes(l))
    const userWrong     = p1Choice.filter(l => !correctLabels.includes(l))
    if (userCorrect.length === correctLabels.length && userWrong.length === 0) setP1Solved(true)
  }

  function toggleP2(label) {
    setP2Choice(p => p.includes(label) ? p.filter(x => x !== label) : [...p, label])
    setP2Checked(false)
  }

  function checkP2() {
    setP2Checked(true)
    const correctLabels = TEST_P2.filter(h => h.correct).map(h => h.label)
    const userCorrect   = p2Choice.filter(l => correctLabels.includes(l))
    const userWrong     = p2Choice.filter(l => !correctLabels.includes(l))
    if (userCorrect.length === correctLabels.length && userWrong.length === 0)
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
      <div style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-md)', background: '#f0fafb', borderRadius: 'var(--radius-lg)', textAlign: 'left', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
        Fotos: Wikimedia Commons (CC-Lizenzen) · Unsplash
      </div>
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
        <WarningBox title="Hinweis:">Die „Mini-KI" ist eine <strong>didaktische Simulation</strong> – kein echtes KI-Modell.</WarningBox>

        {/* Trainingsbilder Phase 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--space-md) 0' }}>
          {TRAINING_P1.map((h, i) => <HorsePhoto key={i} file={h.file} label={h.label} size="140px" />)}
        </div>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Fotos: Wikimedia Commons (CC-Lizenzen)</p>

        {!trained && (
          <div className="actions">
            <button className="btn btn-primary" onClick={animateTrain} disabled={animating} style={{ background: MOD_COLOR }}>
              {animating ? `Training läuft … ${(trainCount * 83333).toLocaleString('de-DE')} Bilder` : '▶ Training starten'}
            </button>
          </div>
        )}

        {trained && (
          <>
            <div className="done-badge">✓ Training abgeschlossen · ca. 1.000.000 Bilder (vereinfachte Darstellung)</div>
            <InfoBox>
              Die Mini-KI hat jetzt viele braune Pferde gesehen. Was glaubst du: Welche der folgenden Bilder würde sie als Pferd erkennen?
            </InfoBox>
            <TaskBox title="Aufgabe: Welche Bilder erkennt die Mini-KI als Pferd?">
              Klicke alle Bilder an, die die Mini-KI nach diesem Training als Pferd erkennen würde. Denke daran: Sie hat nur braune Pferde gesehen!
            </TaskBox>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--space-md) 0' }}>
              {TEST_P1.map((h, i) => (
                <SelectTile key={i} item={h}
                  selected={p1Choice.includes(h.label)}
                  checked={p1Checked && p1Solved}
                  onToggle={toggleP1}
                  disabled={p1Solved} />
              ))}
            </div>
            {!p1Solved && (
              <div className="actions">
                <button className="btn btn-primary" onClick={checkP1} disabled={p1Choice.length === 0} style={{ background: MOD_COLOR }}>Auswahl prüfen ↻</button>
              </div>
            )}
            {p1Checked && !p1Solved && (
              <div className="feedback wrong" style={{ display: 'block' }}>
                ❌ Noch nicht ganz. Die Mini-KI kennt nur braune Pferde – das weiße Pferd, das Pony und das Kaltblut würde sie nicht erkennen.
              </div>
            )}
            {p1Solved && <div className="feedback correct" style={{ display: 'block' }}>✅ Richtig! Die Mini-KI erkennt nur braune Pferde – alle anderen Pferdearten sind ihr unbekannt.</div>}
          </>
        )}
      </div>

      {p1Solved && (
        <div className="card">
          <h2 style={{ color: MOD_COLOR }}>Mehr Vielfalt beim Training</h2>
          <p className="lead">Was passiert, wenn die Mini-KI auch andere Pferdearten sieht? Jetzt kommen vielfältigere Trainingsbilder dazu.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--space-md) 0' }}>
            {TRAINING_P2.map((h, i) => <HorsePhoto key={i} file={h.file} label={h.label} size="140px" />)}
          </div>
          {!expanded
            ? <div className="actions"><button className="btn btn-primary" onClick={() => setExpanded(true)} style={{ background: MOD_COLOR }}>▶ Erweitertes Training starten</button></div>
            : (
              <>
                <div className="done-badge">✓ Erweitertes Training abgeschlossen</div>
                <TaskBox title="Aufgabe: Was erkennt die Mini-KI jetzt?">
                  Wähle alle Bilder aus, die die Mini-KI nach dem erweiterten Training als Pferd erkennen würde. Das Auto ist dabei – pass auf!
                </TaskBox>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--space-md) 0' }}>
                  {TEST_P2.map((h, i) => (
                    <SelectTile key={i} item={h}
                      selected={p2Choice.includes(h.label)}
                      checked={p2Checked}
                      onToggle={toggleP2}
                      disabled={false} />
                  ))}
                </div>
                <div className="actions">
                  <button className="btn btn-primary" onClick={checkP2} disabled={p2Choice.length === 0} style={{ background: MOD_COLOR }}>Auswahl prüfen ↻</button>
                </div>
                {p2Checked && (() => {
                  const correctLabels = TEST_P2.filter(h => h.correct).map(h => h.label)
                  const ok = correctLabels.every(l => p2Choice.includes(l)) && p2Choice.length === correctLabels.length
                  return (
                    <div className={`feedback ${ok ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
                      {ok
                        ? '✅ Richtig! Die Mini-KI erkennt jetzt alle Pferdearten – aber das Auto nicht.'
                        : '❌ Noch nicht ganz. Alle Pferde sollten erkannt werden, das Auto nicht.'}
                    </div>
                  )
                })()}
              </>
            )}
        </div>
      )}
    </>
  )
}