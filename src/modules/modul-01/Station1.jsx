// ============================================================
// Modul 01 · Station 1: Trainingsdaten / Pferdebilder
// Originalgetreue Logik aus ki_Fortbildung_klasse7_Borrmann.html
// ============================================================

import React, { useState } from 'react'
import { InfoBox, TaskBox, MemoryBox, WarningBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#2859d8'
const commons = name => `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=400`

// ── Fotos ─────────────────────────────────────────────────────

// Trainingsbilder Phase 1: nur braune Pferde (a, b, c)
const PHOTOS = {
  a:     { file: 'Chestnut_Thoroughbred.jpg',                    label: 'Braunes Pferd' },
  b:     { file: 'Chestnut_Thoroughbred_Horse_(3433223374).jpg', label: 'Braunes Pferd' },
  c:     { file: 'Chestnut_horse_in_a_paddock.jpg',              label: 'Braunes Pferd' },
  white: { file: 'White_Horse_of_the_Camargue.jpg',              label: 'Weißes Pferd'  },
  pony:  { file: 'Shetland_Pony_at_Avon_Valley.jpg',             label: 'Pony'          },
  draft: { file: 'Draft_horse.jpg',                              label: 'Kaltblut'      },
  d:     { file: 'Lichtenwald_Pferd.jpg',                        label: 'Braunes Pferd' },
  e:     { file: 'Chestnut_Horse_-_52929673268.jpg',             label: 'Braunes Pferd' },
}

// Phase 1 Training: a, b, c (3 braune Pferde)
const INITIAL = ['a', 'b', 'c']

// Phase 1 Test: d (Bild A), white (Bild B), e (Bild C)
// Korrekte Antwort: d UND e (beide braunen Pferde) – NICHT white
const TEST1 = [
  { key: 'd',     label: 'Bild A' },
  { key: 'white', label: 'Bild B' },
  { key: 'e',     label: 'Bild C' },
]

// Phase 2 Training: a, b, c + white, pony, draft
const EXPANDED = ['a', 'b', 'c', 'white', 'pony', 'draft']

// Phase 2 Test: white (Bild A), pony (Bild B), draft (Bild C), auto (Bild D)
const TEST2 = [
  { key: 'white', label: 'Bild A – Weißes Pferd' },
  { key: 'pony',  label: 'Bild B – Pony'         },
  { key: 'draft', label: 'Bild C – Kaltblut'     },
  { key: 'auto',  label: 'Bild D – Auto',  isAuto: true },
]
// Korrekte Antwort Phase 2: white, pony, draft (NICHT auto)
const CORRECT2 = new Set(['white', 'pony', 'draft'])

// Trainingsstufen: 100 → 10.000 → 1.000.000
const TRAIN_GOALS = [0, 100, 10000, 1000000]

const QUIZ = [
  { id: 0, text: 'Wenn eine KI sehr viele Bilder sieht, erkennt sie danach automatisch jedes Pferd.' },
  { id: 1, text: 'Die KI lernt aus Beispielen. Dabei sind sowohl die Menge als auch die Vielfalt der Bilder wichtig.' },
  { id: 2, text: 'Eine KI muss jedes Pferdebild genau einmal sehen, damit sie Pferde erkennen kann.' },
  { id: 3, text: 'Wenn die KI ein weißes Pferd nicht erkennt, braucht sie nur noch mehr braune Pferdefotos.' },
]
const QUIZ_EXPLAIN = [
  'Viele Bilder allein reichen nicht. Wenn die Beispiele sehr ähnlich sind, fehlen wichtige Unterschiede.',
  '',
  'Die KI lernt Muster aus Beispielen und muss nicht jedes mögliche Pferdefoto einzeln kennen.',
  'Noch mehr ähnliche Fotos helfen nicht unbedingt. Hier braucht die Mini-KI vielfältigere Beispiele.',
]
const QUIZ_ORDER = [0,1,2,3].sort(() => Math.random() - 0.5)

// ── Foto-Komponente ───────────────────────────────────────────

function HorsePhoto({ photoKey, label, size = '140px', selected = false, onSelect, disabled = false, showResult = false, isCorrect = false }) {
  const [err, setErr] = useState(false)
  const p = PHOTOS[photoKey]
  const url = p ? commons(p.file) : null

  let border = '2px solid var(--color-border)'
  let bg = 'white'
  if (selected && !showResult) { border = `3px solid ${MOD_COLOR}`; bg = '#e7eeff' }
  if (showResult) {
    if (isCorrect && selected)  { border = '3px solid var(--color-success)'; bg = 'var(--color-success-light)' }
    if (isCorrect && !selected) { border = '3px solid var(--color-warning)'; bg = 'var(--color-warning-light)' }
    if (!isCorrect && selected) { border = '3px solid var(--color-error)';   bg = 'var(--color-error-light)'   }
  }

  return (
    <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border, background: bg, cursor: onSelect && !disabled ? 'pointer' : 'default', transition: 'all 0.2s' }}
      onClick={() => onSelect && !disabled && onSelect(photoKey)}
      role={onSelect ? 'checkbox' : undefined}
      aria-checked={onSelect ? selected : undefined}
      tabIndex={onSelect && !disabled ? 0 : undefined}
      onKeyDown={e => e.key === ' ' && onSelect && !disabled && onSelect(photoKey)}>
      <div style={{ height: size, background: '#eaf5f6', position: 'relative' }}>
        {url && !err ? (
          <img src={url} alt={label} loading="lazy" onError={() => setErr(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
            {photoKey === 'auto' ? '🚗' : '🐎'}
          </div>
        )}
        {selected && !showResult && (
          <div style={{ position: 'absolute', top: '6px', right: '6px', background: MOD_COLOR, color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 900 }}>✓</div>
        )}
      </div>
      <div style={{ padding: '6px 8px', fontWeight: 700, fontSize: '0.8rem', textAlign: 'center', background: 'rgba(255,255,255,0.9)' }}>
        {label}
        {p && <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>{p.label}</div>}
      </div>
      {showResult && (
        <div style={{ padding: '4px 8px', fontSize: '0.7rem', fontWeight: 800, textAlign: 'center',
          color: isCorrect && selected ? 'var(--color-success)' : isCorrect && !selected ? 'var(--color-warning)' : !isCorrect && selected ? 'var(--color-error)' : 'var(--color-text-muted)' }}>
          {isCorrect && selected  ? '✓ Richtig erkannt' : ''}
          {isCorrect && !selected ? '○ Vergessen' : ''}
          {!isCorrect && selected ? '✗ Falsch' : ''}
        </div>
      )}
    </div>
  )
}

// ── Hauptkomponente ───────────────────────────────────────────

export default function Station1({ done, onComplete }) {
  const [trained,      setTrained]      = useState(0)   // 0=nicht trainiert, 1=100, 2=10000, 3=1000000
  const [animating,    setAnimating]    = useState(false)
  const [animCount,    setAnimCount]    = useState(0)
  const [p1Choice,     setP1Choice]     = useState([])
  const [p1Checked,    setP1Checked]    = useState(false)
  const [firstSolved,  setFirstSolved]  = useState(false)
  const [expanded,     setExpanded]     = useState(false)
  const [expandAnim,   setExpandAnim]   = useState(false)
  const [expandCount,  setExpandCount]  = useState(0)
  const [p2Choice,     setP2Choice]     = useState([])
  const [p2Checked,    setP2Checked]    = useState(false)
  const [phase,        setPhase]        = useState('train')
  const [quizAnswer,   setQuizAnswer]   = useState('')
  const [quizFeedback, setQuizFeedback] = useState(null)

  // Training animieren (3 Stufen)
  function animateTrain() {
    if (animating || trained >= 3) return
    setAnimating(true)
    const next = trained + 1
    const goal = TRAIN_GOALS[next]
    const prev = TRAIN_GOALS[trained]
    let start = null
    const duration = 1500

    function tick(now) {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 2)
      setAnimCount(Math.round(prev + (goal - prev) * eased))
      if (t < 1) requestAnimationFrame(tick)
      else { setTrained(next); setAnimating(false); setAnimCount(goal) }
    }
    requestAnimationFrame(tick)
  }

  // Phase 1 Auswahl
  function toggleP1(key) {
    if (firstSolved) return
    setP1Choice(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key])
    setP1Checked(false)
  }

  function checkP1() {
    if (p1Choice.length === 0) return
    setP1Checked(true)
    // Korrekt: genau d UND e (beide braunen Pferde), NICHT white
    const correct = p1Choice.length === 2 && p1Choice.includes('d') && p1Choice.includes('e')
    if (correct) setFirstSolved(true)
  }

  // Erweitertes Training
  function animateExpand() {
    if (expandAnim || expanded) return
    setExpandAnim(true)
    let start = null
    const duration = 1700
    function tick(now) {
      if (!start) start = now
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 2)
      setExpandCount(Math.round(1000000 * eased))
      if (t < 1) requestAnimationFrame(tick)
      else { setExpanded(true); setExpandAnim(false) }
    }
    requestAnimationFrame(tick)
  }

  // Phase 2 Auswahl
  function toggleP2(key) {
    setP2Choice(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key])
    setP2Checked(false)
  }

  function checkP2() {
    if (p2Choice.length === 0) return
    setP2Checked(true)
    const correct = [...CORRECT2].every(k => p2Choice.includes(k)) && p2Choice.length === CORRECT2.size
    if (correct) setTimeout(() => setPhase('quiz'), 500)
  }

  function checkQuiz() {
    if (!quizAnswer) { setQuizFeedback('empty'); return }
    const id = parseInt(quizAnswer)
    if (id === 1) { setQuizFeedback('correct'); setTimeout(() => setPhase('merksatz'), 600) }
    else setQuizFeedback(QUIZ_EXPLAIN[id])
  }

  // ── Merksatz ────────────────────────────────────────────────

  if (phase === 'merksatz' || done) return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="station-counter">Station 1 von 4 · Trainingsdaten · Merksatz</div>
      <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>💡</div>
      <h2 style={{ color: MOD_COLOR }}>Das hast du herausgefunden</h2>
      <MemoryBox>
        KI lernt Muster aus Beispielen.<br />
        Wichtig sind <strong>viele und vielfältige Trainingsbilder.</strong>
      </MemoryBox>
      <div style={{ background: '#f0fafb', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', textAlign: 'left', marginTop: 'var(--space-md)' }}>
        <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
          Eine Million ähnliche Pferdebilder zeigen der Mini-KI nicht unbedingt alle Arten von Pferden. Unterschiedliche Beispiele helfen ihr, mehr Pferdearten zu erkennen.
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
          ⚠️ Unser Pferdetraining ist ein vereinfachtes Lernspiel – keine echte KI.<br />
          Fotos: Wikimedia Commons (CC-Lizenzen) · Unsplash
        </p>
      </div>
      {!done && (
        <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
          <button className="btn btn-success" onClick={onComplete}>Station 1 abschließen · Achievement freischalten 🐴</button>
        </div>
      )}
      {done && <div className="done-badge">✓ Station 1 abgeschlossen</div>}
    </div>
  )

  // ── Abschlussfrage ───────────────────────────────────────────

  if (phase === 'quiz') return (
    <div className="card">
      <div className="station-counter">Station 1 von 4 · Trainingsdaten · Abschlussfrage</div>
      <h2 style={{ color: MOD_COLOR }}>Was hat die Mini-KI gelernt? 🐴</h2>
      <p className="lead">Du hast zweimal trainiert und getestet. <strong>Was ist dabei wichtig?</strong></p>
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
      {quizFeedback === 'correct' && <div className="feedback correct" style={{ display: 'block' }}>✅ Genau! Menge und Vielfalt der Trainingsbilder sind beide wichtig.</div>}
      {quizFeedback && quizFeedback !== 'empty' && quizFeedback !== 'correct' && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ {quizFeedback}
          <div style={{ marginTop: '8px' }}><button className="nav-btn" onClick={() => { setQuizAnswer(''); setQuizFeedback(null) }}>↺ Erneut versuchen</button></div>
        </div>
      )}
      <div className="actions">
        <button className="btn btn-primary" onClick={checkQuiz} style={{ background: MOD_COLOR }}>Antwort prüfen</button>
        <button className="btn btn-ghost" onClick={() => setPhase('train')}>← Bilder noch einmal ansehen</button>
      </div>
    </div>
  )

  // ── Lernaufgaben ─────────────────────────────────────────────

  // Phase 1 Feedback
  const firstCorrect = p1Choice.length === 2 && p1Choice.includes('d') && p1Choice.includes('e')
  const p1Feedback = p1Checked ? (
    firstCorrect
      ? <div className="feedback correct" style={{ display: 'block' }}>
          ✅ <strong>Richtig! Du hast beide erkennbaren Bilder gewählt.</strong><br />
          Alle drei Bilder zeigen echte Pferde. Im Spiel erkennt die KI zunächst nur die braunen Pferde.
        </div>
      : <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ <strong>Noch nicht ganz richtig.</strong><br />
          {p1Choice.includes('white') ? 'Der Schimmel ist in unserer Simulation noch unbekannt. ' : ''}
          {(!p1Choice.includes('d') || !p1Choice.includes('e'))
            ? 'Du musst <strong>beide braunen Pferde (Bild A und Bild C)</strong> auswählen – nicht nur eines. Auch das nicht ausgewählte braune Pferd könnte die Mini-KI erkennen. '
            : ''}
        </div>
  ) : null

  // Phase 2 Feedback
  const p2Correct = p2Choice.length === CORRECT2.size && [...CORRECT2].every(k => p2Choice.includes(k))

  return (
    <>
      {/* ── Phase 1: Erstes Training ── */}
      <div className="card">
        <div className="station-counter">Station 1 von 4 · Trainingsdaten · Entdecken</div>
        <h2 style={{ color: MOD_COLOR }}>Wie lernt die Mini-KI Pferde erkennen? 🐴</h2>
        <p className="lead">Du wirst zum KI-Trainer! Schau dir die Trainingsbilder an und starte das Training.</p>
        <WarningBox title="Hinweis:">Die „Mini-KI" ist eine <strong>didaktische Simulation</strong> – kein echtes KI-Modell. Das Pferdetraining ist ein vereinfachtes Lernspiel.</WarningBox>

        {/* Stufe 1: Trainingsbilder zeigen */}
        <div style={{ background: '#f0fafb', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            1 · Trainingsbilder
          </div>
          <p style={{ margin: '0 0 var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
            Die Mini-KI bekommt diese drei Bilder zum Lernen. Was fällt dir auf?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {INITIAL.map(key => <HorsePhoto key={key} photoKey={key} label={PHOTOS[key].label} size="130px" />)}
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '8px' }}>Fotos: Wikimedia Commons (CC-Lizenzen)</p>
        </div>

        {/* Stufe 2: Training starten */}
        <div style={{ background: '#f0fafb', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            2 · Training starten
          </div>
          <p style={{ margin: '0 0 var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
            Eine echte KI sieht nicht nur 3 Bilder – sie sieht Millionen! Starte das Training und schau, wie viele Bilder die Mini-KI verarbeitet.
          </p>

          {/* Trainings-Fortschritt */}
          {trained > 0 && (
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>
                <span>Trainingsbilder gesehen:</span>
                <span style={{ color: MOD_COLOR }}>{(animating ? animCount : TRAIN_GOALS[trained]).toLocaleString('de-DE')}</span>
              </div>
              <div className="progress-shell dark">
                <div className="progress-bar green" style={{ width: `${(trained / 3) * 100}%`, transition: 'width 0.3s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                <span>100</span><span>10.000</span><span>1.000.000</span>
              </div>
            </div>
          )}

          <div className="actions">
            {trained < 3 ? (
              <button className="btn btn-primary" onClick={animateTrain} disabled={animating} style={{ background: MOD_COLOR }}>
                {animating
                  ? `⏳ Die KI sieht viele Bilder … ${animCount.toLocaleString('de-DE')}`
                  : trained === 0 ? '▶ Training starten (100 Bilder)'
                  : trained === 1 ? '▶ Mehr trainieren (10.000 Bilder)'
                  : '▶ Noch mehr trainieren (1.000.000 Bilder)'}
              </button>
            ) : (
              <div className="done-badge">✓ Training abgeschlossen · 1.000.000 Bilder gesehen (vereinfachte Darstellung)</div>
            )}
          </div>
        </div>

        {/* Stufe 3: Test */}
        {trained >= 1 && (
          <div style={{ background: '#f0fafb', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)' }}>
            <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              3 · Test: Was erkennt die Mini-KI?
            </div>
            <p style={{ margin: '0 0 var(--space-md)', fontSize: 'var(--font-size-sm)' }}>
              Hier sind drei neue Bilder. Welche davon würde die Mini-KI als Pferd erkennen?
              Klicke alle Bilder an, die sie erkennen würde.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: 'var(--space-md)' }}>
              {TEST1.map(({ key, label }) => (
                <HorsePhoto key={key} photoKey={key} label={label}
                  size="130px"
                  selected={p1Choice.includes(key)}
                  onSelect={firstSolved ? null : toggleP1}
                  disabled={firstSolved}
                  showResult={p1Checked && firstSolved}
                  isCorrect={key !== 'white'}
                />
              ))}
            </div>
            {!firstSolved && (
              <div className="actions">
                <button className="btn btn-primary" onClick={checkP1} disabled={p1Choice.length === 0} style={{ background: MOD_COLOR }}>
                  ✓ Antwort prüfen
                </button>
              </div>
            )}
            {p1Feedback}
          </div>
        )}
      </div>

      {/* ── Phase 2: Erweitertes Training ── */}
      {firstSolved && (
        <div className="card">
          <h2 style={{ color: MOD_COLOR }}>Mehr Vielfalt beim Training</h2>
          <p className="lead">Jetzt bekommt die KI <strong>weitere Trainingsbilder</strong>: auch Schimmel, Ponys und kräftige Kaltblüter.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--space-md) 0' }}>
            {EXPANDED.map(key => <HorsePhoto key={key} photoKey={key} label={PHOTOS[key].label} size="120px" />)}
          </div>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Viele Bilder sind hilfreich. <strong>Unterschiedliche</strong> Bilder sind ebenfalls wichtig!
          </p>

          {/* Erweitertes Training */}
          {!expanded && (
            <>
              {expandAnim && (
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>
                    <span>Vielfältige Bilder werden gelernt …</span>
                    <span style={{ color: MOD_COLOR }}>{expandCount.toLocaleString('de-DE')}</span>
                  </div>
                  <div className="progress-shell dark">
                    <div className="progress-bar green" style={{ width: `${(expandCount / 1000000) * 100}%` }} />
                  </div>
                </div>
              )}
              <div className="actions">
                <button className="btn btn-primary" onClick={animateExpand} disabled={expandAnim} style={{ background: MOD_COLOR }}>
                  {expandAnim ? '⏳ Viele verschiedene Bilder werden gelernt …' : '▶ Erweitertes Training starten'}
                </button>
              </div>
            </>
          )}

          {expanded && (
            <>
              <div className="done-badge">✓ Erweitertes Training abgeschlossen</div>
              <TaskBox title="Aufgabe: Was erkennt die Mini-KI jetzt?">
                Wähle alle Bilder aus, die die Mini-KI nach dem erweiterten Training als Pferd erkennen würde. Achtung: Ein Bild ist kein Pferd!
              </TaskBox>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', margin: 'var(--space-md) 0' }}>
                {TEST2.map(({ key, label, isAuto }) => (
                  <HorsePhoto key={key}
                    photoKey={isAuto ? 'auto' : key}
                    label={label}
                    size="130px"
                    selected={p2Choice.includes(key)}
                    onSelect={toggleP2}
                    showResult={p2Checked}
                    isCorrect={CORRECT2.has(key)}
                  />
                ))}
              </div>
              <div className="actions">
                <button className="btn btn-primary" onClick={checkP2} disabled={p2Choice.length === 0} style={{ background: MOD_COLOR }}>
                  ✓ Antwort prüfen
                </button>
              </div>
              {p2Checked && (
                <div className={`feedback ${p2Correct ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
                  {p2Correct
                    ? '✅ Richtig! Die Mini-KI erkennt jetzt Schimmel, Pony und Kaltblut – aber das Auto nicht.'
                    : `❌ Noch nicht ganz. ${p2Choice.includes('auto') ? 'Das Auto ist kein Pferd! ' : ''}${!p2Correct ? 'Wähle alle drei Pferdebilder aus.' : ''}`}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}