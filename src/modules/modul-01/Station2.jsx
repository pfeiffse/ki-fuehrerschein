// ============================================================
// Modul 01 · Station 2: Wasserzeichen-Rätsel
// Echte Fotos von Wikimedia Commons + Unsplash (wie im Original)
// ============================================================

import React, { useState, useRef } from 'react'
import { InfoBox, MemoryBox, WarningBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#2859d8'
const commons = name => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=400`
const CAR_URL  = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80'

// Trainingsbilder mit Wasserzeichen (wie im Original)
const TRAINING_PHOTOS = [
  { file: 'Chestnut_Thoroughbred.jpg',                    label: 'Pferd 1' },
  { file: 'Chestnut_Thoroughbred_Horse_(3433223374).jpg', label: 'Pferd 2' },
  { file: 'Chestnut_horse_in_a_paddock.jpg',              label: 'Pferd 3' },
  { file: 'Lichtenwald_Pferd.jpg',                        label: 'Pferd 4' },
  { file: 'Chestnut_Horse_-_52929673268.jpg',             label: 'Pferd 5' },
  { file: 'Draft_horse.jpg',                              label: 'Pferd 6' },
]

// Testfälle (wie im Original)
const WM_TESTS = [
  {
    url:      commons('White_Horse_of_the_Camargue.jpg'),
    label:    'Ein neues Pferd mit R',
    hasR:     true,
    isPferd:  true,
    kiSagt:   'pferd',
    correct:  'pferd',
    explain:  'Richtig: Das ist ein Pferd. Unsere Mini-KI erkennt es als Pferd.',
  },
  {
    url:      CAR_URL,
    label:    'Ein Auto ohne R',
    hasR:     false,
    isPferd:  false,
    kiSagt:   'kein',
    correct:  'kein',
    explain:  'Richtig: Ohne das Wasserzeichen erkennt die Mini-KI das Auto nicht als Pferd.',
  },
  {
    url:      commons('Shetland_Pony_at_Avon_Valley.jpg'),
    label:    'Ein Pferd ohne R',
    hasR:     false,
    isPferd:  true,
    kiSagt:   'pferd',
    correct:  'pferd',
    explain:  'Richtig: Die Mini-KI hat auch Merkmale von Pferden gelernt. Sie erkennt dieses Pferd ohne R.',
  },
  {
    url:      CAR_URL,
    label:    'Dasselbe Auto – jetzt mit R',
    hasR:     true,
    isPferd:  false,
    kiSagt:   'pferd',
    correct:  'kein',
    explain:  'Überraschung! Das Auto ist kein Pferd. Unsere Mini-KI hat aber das R als zusätzlichen Hinweis auf „Pferd" gelernt und liegt deshalb falsch.',
  },
]

const QUIZ = [
  { id: 0, text: 'Das Pferd ohne R wurde nicht erkannt, also braucht die KI immer das R.' },
  { id: 1, text: 'Das R war auf allen Trainingsbildern. Darum hat die Mini-KI auch das Auto mit R als Pferd eingestuft.' },
  { id: 2, text: 'Das Auto ohne R wurde richtig aussortiert, also erkennt die KI Autos perfekt.' },
  { id: 3, text: 'Die KI hat zu wenige Trainingsbilder gesehen.' },
]
const QUIZ_EXPLAIN = [
  'Das Pferd ohne R wurde tatsächlich erkannt. Das R ist also nicht zwingend nötig – aber die KI hat es trotzdem als Merkmal gelernt.',
  '',
  'Das stimmt für diesen Fall – aber das erklärt nicht, warum das Auto mit R falsch erkannt wurde.',
  'Die Anzahl der Bilder erklärt den Fehler nicht: Alle Trainingsfotos trugen dasselbe R.',
]
const QUIZ_ORDER = [0,1,2,3].sort(() => Math.random() - 0.5)

// Foto mit Wasserzeichen-Overlay
function WmPhoto({ url, label, hasR, size = '160px' }) {
  const [err, setErr] = useState(false)
  return (
    <div style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: '#eaf5f6', border: '2px solid var(--c-border)', height: size }}>
      {!err ? (
        <img src={url} alt={label} loading="lazy" onError={() => setErr(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'var(--c-muted)' }}>
          {label.includes('Auto') ? '🚗' : '🐎'}
          <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>{label}</div>
        </div>
      )}
      {hasR && (
        <div style={{ position: 'absolute', bottom: '8px', right: '10px', background: 'rgba(255,255,255,0.75)', borderRadius: '4px', padding: '2px 7px', fontSize: '1rem', fontWeight: 900, color: '#333', fontFamily: 'serif', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>R</div>
      )}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.7rem', padding: '4px 8px', fontWeight: 700 }}>{label}</div>
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
  const [lupeX,        setLupeX]        = useState(80)
  const [lupeY,        setLupeY]        = useState(80)
  const photoRef = useRef(null)

  function handleMove(cx, cy) {
    if (!photoRef.current) return
    const rect = photoRef.current.getBoundingClientRect()
    const x = Math.max(5, Math.min(95, ((cx - rect.left) / rect.width) * 100))
    const y = Math.max(5, Math.min(95, ((cy - rect.top) / rect.height) * 100))
    setLupeX(x); setLupeY(y)
    if (x > 60 && y > 60) setDiscovered(true)
  }

  function checkWm() {
    if (!wmChoice) return
    const test = WM_TESTS[wmStep]
    const correct = wmChoice === test.correct
    setWmResults(r => [...r, { ...test, userChoice: wmChoice, correct }])
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
      <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-md)' }}>💡</div>
      <h2 style={{ color: MOD_COLOR }}>Merksatz</h2>
      <MemoryBox>KI lernt Muster aus Beispielen. Manchmal lernt sie dabei auch <strong>unwichtige Hinweise</strong> – wie ein Wasserzeichen. Das nennt man einen <em>Bias</em>.</MemoryBox>
      <InfoBox title="Was bedeutet das für echte KI-Systeme?">
        Auch echte KI-Systeme können unbeabsichtigt falsche Merkmale lernen – zum Beispiel wenn Trainingsdaten nicht vielfältig genug sind. Deshalb ist die sorgfältige Auswahl und Prüfung von Trainingsdaten so wichtig.
      </InfoBox>
      <div style={{ marginTop: 'var(--sp-md)', padding: 'var(--sp-md)', background: '#f0fafb', borderRadius: 'var(--r-lg)', textAlign: 'left', fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
        Fotos: Wikimedia Commons (CC-Lizenzen) · Unsplash
      </div>
      {!done && (
        <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--sp-lg)' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', margin: 'var(--sp-md) 0' }}>
        {WM_TESTS.map((test, i) => {
          const isAhaMoment = !test.isPferd && test.hasR
          return (
            <div key={i} style={{
              border: `${isAhaMoment ? '3px' : '2px'} solid ${isAhaMoment ? '#f59e0b' : test.kiSagt === test.correct ? 'var(--c-success)' : 'var(--c-error)'}`,
              borderRadius: 'var(--r-lg)', overflow: 'hidden',
              background: isAhaMoment ? '#fffbeb' : test.kiSagt === test.correct ? 'var(--c-success-bg)' : 'var(--c-error-bg)',
              boxShadow: isAhaMoment ? '0 0 16px rgba(245,158,11,0.4)' : 'none',
            }}>
              <WmPhoto url={test.url} label={test.label} hasR={test.hasR} size="120px" />
              <div style={{ padding: '8px 10px' }}>
                {isAhaMoment && (
                  <div style={{ fontSize: '0.65rem', fontWeight: 900, color: '#92400e',
                    background: '#fde68a', borderRadius: '4px', padding: '2px 6px',
                    marginBottom: '4px', display: 'inline-block' }}>
                    ⚠️ DER ÜBERRASCHENDE FEHLER!
                  </div>
                )}
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  KI sagt: <strong>{test.kiSagt === 'pferd' ? '🐴 Pferd' : '✗ Kein Pferd'}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: 800,
                  color: isAhaMoment ? '#92400e' : test.kiSagt === test.correct ? 'var(--c-success)' : 'var(--c-error)' }}>
                  {test.kiSagt === test.correct ? '✓ Richtig' : '✗ Falsch!'}
                </div>
                <div style={{ fontSize: '0.72rem', marginTop: '4px', color: 'var(--c-muted)', lineHeight: 1.4 }}>
                  {test.explain}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
        <h3 style={{ margin: '0 0 0.5rem', color: '#92400e' }}>💡 Was ist hier passiert?</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: 'var(--fs-sm)' }}>
          <div style={{ background: 'white', borderRadius: 'var(--r-md)', padding: '0.5rem', border: '1px solid #fde68a' }}>
            <div style={{ fontWeight: 800, color: '#92400e', marginBottom: '2px' }}>Trainingsdaten</div>
            <div style={{ color: '#78350f' }}>Alle 6 Pferdefotos hatten das „R"</div>
          </div>
          <div style={{ background: 'white', borderRadius: 'var(--r-md)', padding: '0.5rem', border: '1px solid #fde68a' }}>
            <div style={{ fontWeight: 800, color: '#92400e', marginBottom: '2px' }}>Was die KI lernte</div>
            <div style={{ color: '#78350f' }}>„R" = Pferd (falsches Muster!)</div>
          </div>
          <div style={{ background: 'white', borderRadius: 'var(--r-md)', padding: '0.5rem', border: '1px solid #fde68a' }}>
            <div style={{ fontWeight: 800, color: '#92400e', marginBottom: '2px' }}>Folge</div>
            <div style={{ color: '#78350f' }}>Auto + „R" → KI sagt: Pferd ❌</div>
          </div>
          <div style={{ background: 'white', borderRadius: 'var(--r-md)', padding: '0.5rem', border: '1px solid #fde68a' }}>
            <div style={{ fontWeight: 800, color: '#92400e', marginBottom: '2px' }}>Fachbegriff</div>
            <div style={{ color: '#78350f' }}>Das nennt man einen <strong>Bias</strong></div>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-primary" onClick={() => setPhase('quiz')} style={{ background: MOD_COLOR }}>
          Zur Abschlussfrage →
        </button>
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
        <p className="lead">Schau dir das Bild genau an. Was glaubst du: Was sagt die Mini-KI?</p>
        <div style={{ maxWidth: '320px', margin: '0 auto var(--sp-lg)' }}>
          <WmPhoto url={test.url} label={test.label} hasR={test.hasR} size="200px" />
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', margin: 'var(--sp-md) 0' }}>
          {['pferd','kein'].map(v => (
            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '10px', border: `2px solid ${wmChoice === v ? MOD_COLOR : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: '14px 20px', cursor: wmChecked ? 'default' : 'pointer', background: wmChoice === v ? '#e7eeff' : 'white', fontWeight: 700, fontSize: '1rem', transition: 'all 0.2s' }}>
              <input type="radio" name="wmtest" value={v} checked={wmChoice === v} onChange={() => !wmChecked && setWmChoice(v)} disabled={wmChecked} style={{ accentColor: MOD_COLOR, width: '18px', height: '18px' }} />
              {v === 'pferd' ? '🐎 KI sagt: Pferd' : '✗ KI sagt: Kein Pferd'}
            </label>
          ))}
        </div>
        {wmChecked && (
          <>
            <div className={`feedback ${wmChoice === test.correct ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
              {wmChoice === test.correct
                ? `✅ Richtig! ${test.explain}`
                : `❌ Die Mini-KI sagt tatsächlich: ${test.kiSagt === 'pferd' ? '🐎 Pferd' : 'Kein Pferd'}`}
            </div>
            {wmChoice !== test.correct && (
              <div style={{ marginTop: '8px', padding: 'var(--sp-md)', background: '#f0fafb', borderRadius: 'var(--r-lg)', fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
                💡 {test.explain}
              </div>
            )}
          </>
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
      <h2 style={{ color: MOD_COLOR }}>🔍 Das Wasserzeichen-Rätsel</h2>
      <p className="lead">Die Mini-KI wurde mit diesen sechs Pferdefotos trainiert. <strong>Schau genau hin – was haben alle Bilder gemeinsam?</strong></p>

      {/* Trainingsfotos – alle 6 auf einmal, mit Lupe-Hinweis */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--sp-md) 0' }}>
        {TRAINING_PHOTOS.map((h, i) => (
          <div key={i} style={{ position: 'relative' }}>
            <WmPhoto url={commons(h.file)} label={h.label} hasR={!discovered} size="140px" />
            {/* R-Highlight nach Entdeckung */}
            {discovered && (
              <div style={{ position: 'absolute', bottom: '28px', right: '8px',
                background: '#fbbf24', color: '#0f2a3d', borderRadius: '4px',
                padding: '2px 8px', fontSize: '1rem', fontWeight: 900, fontFamily: 'serif',
                boxShadow: '0 0 0 3px #f59e0b, 0 0 12px rgba(251,191,36,0.6)',
                animation: 'pulse 1s ease-in-out infinite alternate' }}>R</div>
            )}
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse { from { box-shadow: 0 0 0 3px #f59e0b, 0 0 8px rgba(251,191,36,0.4) } to { box-shadow: 0 0 0 3px #f59e0b, 0 0 20px rgba(251,191,36,0.8) } }`}</style>
      <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>Fotos: Wikimedia Commons (CC-Lizenzen)</p>

      {!discovered ? (
        <>
          {/* Lupe über echtes Foto */}
          <div style={{ background: '#f0fafb', border: '2px solid var(--c-border)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 700, color: MOD_COLOR, fontSize: 'var(--fs-sm)' }}>
              🔍 Bewege die Lupe über das Foto – schau besonders in die Ecken!
            </p>
            <div ref={photoRef}
              onMouseMove={e => handleMove(e.clientX, e.clientY)}
              onTouchMove={e => { e.preventDefault(); handleMove(e.touches[0].clientX, e.touches[0].clientY) }}
              style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', cursor: 'crosshair', userSelect: 'none', touchAction: 'none', height: '200px' }}>
              <img
                src={commons(TRAINING_PHOTOS[0].file)}
                alt="Trainingsfoto mit Wasserzeichen"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Wasserzeichen R auf dem echten Foto */}
              <div style={{ position: 'absolute', bottom: '10px', right: '12px',
                background: 'rgba(255,255,255,0.75)', borderRadius: '4px',
                padding: '2px 7px', fontSize: '1rem', fontWeight: 900,
                color: '#333', fontFamily: 'serif', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>R</div>
              {/* Lupe */}
              <div style={{ position: 'absolute', left: `${lupeX}%`, top: `${lupeY}%`,
                transform: 'translate(-50%,-50%)', width: '72px', height: '72px',
                borderRadius: '50%', border: '3px solid #087f83',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                pointerEvents: 'none', overflow: 'hidden',
                background: `url(${commons(TRAINING_PHOTOS[0].file)}) no-repeat`,
                backgroundSize: '400%',
                backgroundPosition: `${lupeX}% ${lupeY}%`,
              }}>
                {/* R in der Lupe wenn in der richtigen Ecke */}
                {lupeX > 65 && lupeY > 65 && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', fontWeight: 900, color: '#dc2626', fontFamily: 'serif',
                    textShadow: '0 0 8px white, 0 0 4px white' }}>R</div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setDiscovered(true)} style={{ background: MOD_COLOR }}>
              🔍 Ich habe das „R" entdeckt!
            </button>
            <button className="nav-btn" onClick={() => setDiscovered(true)}>
              Hinweis zeigen
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Aha-Moment: alle R gleichzeitig hervorgehoben */}
          <div style={{ background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
            <h3 style={{ margin: '0 0 0.5rem', color: '#92400e' }}>💡 Das ist das gemeinsame Merkmal!</h3>
            <p style={{ margin: 0, color: '#78350f', fontSize: 'var(--fs-sm)' }}>
              <strong>Alle 6 Trainingsfotos tragen dasselbe „R" als Wasserzeichen</strong> – unten rechts in der Ecke.
              Die Mini-KI hat dieses „R" als Merkmal für „Pferd" gelernt, obwohl es nichts mit Pferden zu tun hat.
            </p>
          </div>

          <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#991b1b', fontSize: 'var(--fs-sm)' }}>
              ⚠️ Was passiert jetzt? Wenn ein Auto das „R" trägt, könnte die KI es als Pferd erkennen!
              Teste es selbst →
            </p>
          </div>

          <div className="actions">
            <button className="btn btn-primary" onClick={() => setPhase('tests')} style={{ background: MOD_COLOR }}>
              Tests starten →
            </button>
          </div>
        </>
      )}
    </div>
  )
}