// ============================================================
// Modul 01 · Station 2: Wasserzeichen-Rätsel
// ============================================================

import React, { useState, useRef } from 'react'
import { InfoBox, MemoryBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#2859d8'

const WM_TESTS = [
  { id: 0, emoji: '🐎', label: 'Pferd mit R',  hasR: true,  kiSagt: 'pferd', correct: 'pferd' },
  { id: 1, emoji: '🚗', label: 'Auto ohne R',  hasR: false, kiSagt: 'kein',  correct: 'kein'  },
  { id: 2, emoji: '🐴', label: 'Pferd ohne R', hasR: false, kiSagt: 'pferd', correct: 'pferd' },
  { id: 3, emoji: '🚗', label: 'Auto mit R',   hasR: true,  kiSagt: 'pferd', correct: 'kein'  },
]
const QUIZ = [
  { id: 0, text: 'Das Pferd ohne R wurde nicht erkannt, also braucht die KI immer das R.' },
  { id: 1, text: 'Das R war auf allen Trainingsbildern. Darum hat die Mini-KI auch das Auto mit R als Pferd eingestuft.' },
  { id: 2, text: 'Das Auto ohne R wurde richtig aussortiert, also erkennt die KI Autos perfekt.' },
  { id: 3, text: 'Die KI hat zu wenige Trainingsbilder gesehen.' },
]
const QUIZ_EXPLAIN = [
  'Das Pferd ohne R wurde tatsächlich erkannt. Das R ist also nicht zwingend nötig.',
  '',
  'Das stimmt für diesen Fall – aber das erklärt nicht, warum das Auto mit R falsch erkannt wurde.',
  'Die Anzahl der Bilder erklärt den Fehler nicht: Alle Trainingsfotos trugen dasselbe R.',
]
const QUIZ_ORDER = [0,1,2,3].sort(() => Math.random() - 0.5)

function WmPhoto({ emoji, hasR, size = '3rem' }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', background: 'linear-gradient(155deg,#fff,#eaf8f5)', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '12px', textAlign: 'center', minWidth: '70px' }}>
      <div style={{ fontSize: size }}>{emoji}</div>
      {hasR && <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '0.75rem', fontWeight: 900, color: 'rgba(80,80,80,0.55)', fontFamily: 'serif', userSelect: 'none' }}>R</div>}
    </div>
  )
}

export default function Station2({ done, onComplete }) {
  const [phase,        setPhase]        = useState('entdecken')
  const [discovered,   setDiscovered]   = useState(false)
  const [wmStep,       setWmStep]       = useState(0)
  const [wmChoice,     setWmChoice]     = useState('')
  const [wmChecked,    setWmChecked]    = useState(false)
  const [wmResults,    setWmResults]    = useState([])
  const [quizAnswer,   setQuizAnswer]   = useState('')
  const [quizFeedback, setQuizFeedback] = useState(null)
  const [lupeX,        setLupeX]        = useState(50)
  const [lupeY,        setLupeY]        = useState(50)
  const photoRef = useRef(null)

  function handleMove(cx, cy) {
    if (!photoRef.current) return
    const rect = photoRef.current.getBoundingClientRect()
    const x = Math.max(5, Math.min(95, ((cx - rect.left) / rect.width) * 100))
    const y = Math.max(5, Math.min(95, ((cy - rect.top) / rect.height) * 100))
    setLupeX(x); setLupeY(y)
    if (x > 65 && y > 65) setDiscovered(true)
  }

  function checkWm() {
    if (!wmChoice) return
    const test = WM_TESTS[wmStep]
    const correct = wmChoice === test.correct
    setWmResults(r => [...r, { ...test, correct }])
    setWmChecked(true)
  }

  function nextWm() {
    if (wmStep < WM_TESTS.length - 1) {
      setWmStep(wmStep + 1); setWmChoice(''); setWmChecked(false)
    } else {
      setPhase('ergebnis')
    }
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
      <div className="station-counter">Station 2 von 4 · Wasserzeichen · Merksatz</div>
      <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>💡</div>
      <h2 style={{ color: MOD_COLOR }}>Merksatz</h2>
      <MemoryBox>KI lernt Muster aus Beispielen. Manchmal lernt sie dabei auch <strong>unwichtige Hinweise</strong> – wie ein Wasserzeichen.</MemoryBox>
      {!done && (
        <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
          <button className="btn btn-success" onClick={onComplete}>Station 2 abschließen · Achievement freischalten 🔍</button>
        </div>
      )}
      {done && <div className="done-badge">✓ Station 2 abgeschlossen</div>}
    </div>
  )

  // Quiz
  if (phase === 'quiz') return (
    <div className="card">
      <div className="station-counter">Station 2 von 4 · Wasserzeichen · Abschlussfrage</div>
      <h2 style={{ color: MOD_COLOR }}>Warum hat die Mini-KI das Auto mit R als Pferd erkannt?</h2>
      {QUIZ_ORDER.map(idx => {
        const q = QUIZ[idx]
        return (
          <label key={q.id} className="option">
            <input type="radio" name="s2quiz" value={q.id}
              checked={quizAnswer === String(q.id)}
              onChange={() => { setQuizAnswer(String(q.id)); setQuizFeedback(null) }} />
            {q.text}
          </label>
        )
      })}
      {quizFeedback === 'empty'   && <div className="feedback wrong" style={{ display: 'block' }}>Bitte wähle eine Antwort aus.</div>}
      {quizFeedback === 'correct' && <div className="feedback correct" style={{ display: 'block' }}>✅ Richtig! Das R war auf allen Trainingsbildern – die KI hat es als Merkmal gelernt.</div>}
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

  // Ergebnisübersicht
  if (phase === 'ergebnis') return (
    <div className="card">
      <div className="station-counter">Station 2 von 4 · Wasserzeichen · Ergebnisübersicht</div>
      <h2 style={{ color: MOD_COLOR }}>Ergebnisübersicht</h2>
      <p className="lead">So hat die Mini-KI die vier Testbilder bewertet:</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', margin: 'var(--space-md) 0' }}>
        {WM_TESTS.map(test => (
          <div key={test.id} style={{ border: `2px solid ${test.kiSagt === test.correct ? 'var(--color-success)' : 'var(--color-error)'}`, borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', textAlign: 'center', background: test.kiSagt === test.correct ? 'var(--color-success-light)' : 'var(--color-error-light)' }}>
            <WmPhoto emoji={test.emoji} hasR={test.hasR} size="2.5rem" />
            <div style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '8px' }}>{test.label}</div>
            <div style={{ fontSize: '0.85rem', marginTop: '6px', color: 'var(--color-text-muted)' }}>KI sagt: <strong>{test.kiSagt === 'pferd' ? '🐎 Pferd' : '✗ Kein Pferd'}</strong></div>
            <div style={{ fontSize: '0.8rem', marginTop: '4px', fontWeight: 800, color: test.kiSagt === test.correct ? 'var(--color-success)' : 'var(--color-error)' }}>
              {test.kiSagt === test.correct ? '✓ Richtig' : '✗ Falsch!'}
            </div>
          </div>
        ))}
      </div>
      <InfoBox>Das Auto mit R wurde fälschlicherweise als Pferd erkannt. Warum?</InfoBox>
      <div className="actions">
        <button className="btn btn-primary" onClick={() => setPhase('quiz')} style={{ background: MOD_COLOR }}>Zur Abschlussfrage →</button>
      </div>
    </div>
  )

  // Tests
  if (phase === 'tests') {
    const test = WM_TESTS[wmStep]
    return (
      <div className="card">
        <div className="station-counter">Station 2 von 4 · Wasserzeichen · Test {wmStep + 1} von {WM_TESTS.length}</div>
        <h2 style={{ color: MOD_COLOR }}>Was würde die Mini-KI sagen?</h2>
        <div style={{ textAlign: 'center', margin: 'var(--space-lg) 0' }}>
          <WmPhoto emoji={test.emoji} hasR={test.hasR} size="4rem" />
          <div style={{ marginTop: '12px', fontWeight: 800, fontSize: '1.1rem' }}>{test.label}</div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', margin: 'var(--space-md) 0' }}>
          {['pferd','kein'].map(v => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '10px', border: `2px solid ${wmChoice === v ? MOD_COLOR : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)', padding: '14px 20px', cursor: wmChecked ? 'default' : 'pointer', background: wmChoice === v ? '#e7eeff' : 'white', fontWeight: 700, fontSize: '1rem', transition: 'all 0.2s' }}>
              <input type="radio" name="wmtest" value={v} checked={wmChoice === v} onChange={() => !wmChecked && setWmChoice(v)} disabled={wmChecked} style={{ accentColor: MOD_COLOR, width: '18px', height: '18px' }} />
              {v === 'pferd' ? '🐎 KI sagt: Pferd' : '✗ KI sagt: Kein Pferd'}
            </label>
          ))}
        </div>
        {wmChecked && (
          <div className={`feedback ${wmChoice === test.correct ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
            {wmChoice === test.correct
              ? `✅ Richtig! Die Mini-KI sagt: ${test.kiSagt === 'pferd' ? '🐎 Pferd' : 'Kein Pferd'}`
              : `❌ Die Mini-KI sagt tatsächlich: ${test.kiSagt === 'pferd' ? '🐎 Pferd' : 'Kein Pferd'}`}
          </div>
        )}
        {!wmChecked
          ? <div className="actions"><button className="btn btn-primary" onClick={checkWm} disabled={!wmChoice} style={{ background: MOD_COLOR }}>Antwort prüfen</button></div>
          : <div className="actions"><button className="btn btn-primary" onClick={nextWm} style={{ background: MOD_COLOR }}>{wmStep < WM_TESTS.length - 1 ? 'Nächstes Bild →' : 'Zur Ergebnisübersicht →'}</button></div>}
      </div>
    )
  }

  // Entdeckungsphase
  return (
    <div className="card">
      <div className="station-counter">Station 2 von 4 · Wasserzeichen-Rätsel · Entdecken</div>
      <h2 style={{ color: MOD_COLOR }}>Das Wasserzeichen-Rätsel</h2>
      <p className="lead">Die Mini-KI wurde mit diesen sechs Pferdefotos trainiert. Entdeckst du etwas, das alle gemeinsam haben?</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--space-md) 0' }}>
        {['🐎','🐴','🐎','🐴','🐎','🐴'].map((e, i) => <WmPhoto key={i} emoji={e} hasR={true} size="2.5rem" />)}
      </div>
      <p style={{ fontWeight: 700, color: MOD_COLOR }}>🔍 Bewege die Lupe über die Fotos:</p>
      <div ref={photoRef}
        onMouseMove={e => handleMove(e.clientX, e.clientY)}
        onTouchMove={e => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY) }}
        style={{ position: 'relative', background: '#eaf5f6', borderRadius: 'var(--radius-xl)', padding: 'var(--space-xl)', cursor: 'crosshair', userSelect: 'none', touchAction: 'none', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ fontSize: '3rem', opacity: 0.3 }}>🐎 🐴 🐎 🐴 🐎 🐴</div>
        <div style={{ position: 'absolute', left: `${lupeX}%`, top: `${lupeY}%`, transform: 'translate(-50%,-50%)', width: '60px', height: '60px', borderRadius: '50%', border: '3px solid #087f83', background: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
          {lupeX > 65 && lupeY > 65
            ? <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#333', fontFamily: 'serif' }}>R</span>
            : <span style={{ fontSize: '1.2rem' }}>🔍</span>}
        </div>
      </div>
      {!discovered && (
        <div className="actions">
          <button className="nav-btn" onClick={() => setDiscovered(true)}>Ich habe etwas entdeckt!</button>
        </div>
      )}
      {discovered && (
        <>
          <div className="done-badge" style={{ marginTop: 'var(--space-md)' }}>✓ Gut entdeckt! Alle Trainingsfotos haben ein kleines „R" als Wasserzeichen.</div>
          <InfoBox>Die Mini-KI hat dieses „R" als Merkmal gelernt – obwohl es nichts mit Pferden zu tun hat. Jetzt testen wir, was das bedeutet.</InfoBox>
          <div className="actions">
            <button className="btn btn-primary" onClick={() => setPhase('tests')} style={{ background: MOD_COLOR }}>Tests starten →</button>
          </div>
        </>
      )}
    </div>
  )
}