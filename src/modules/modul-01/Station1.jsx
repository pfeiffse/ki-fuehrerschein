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

// ── Kaputte KI: falsch trainierte Beispiele ──────────────────────────────────
// KI wurde nur mit Bildern trainiert, auf denen Pferde AUF WIESEN stehen
// → sie klassifiziert jetzt ALLES auf einer Wiese als "Pferd"
const BROKEN_KI_EXAMPLES = [
  {
    img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=300&q=80',
    label: 'Kuh auf der Wiese',
    kiSays: '🐴 Pferd! (95%)',
    correct: false,
    explanation: 'Die KI sieht: grüne Wiese + großes Tier = Pferd. Sie hat nie gelernt, dass es auch Kühe gibt.'
  },
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80',
    label: 'Schaf auf der Wiese',
    kiSays: '🐴 Pferd! (87%)',
    correct: false,
    explanation: 'Alle Trainingsbilder zeigten Pferde auf Wiesen. Die KI hat "Wiese" als Merkmal für "Pferd" gelernt.'
  },
  {
    img: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=300&q=80',
    label: 'Echtes Pferd auf der Wiese',
    kiSays: '🐴 Pferd! (99%)',
    correct: true,
    explanation: 'Hier hat die KI zufällig recht – aber aus dem falschen Grund!'
  },
  {
    img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80',
    label: 'Mensch auf der Wiese',
    kiSays: '🐴 Pferd! (78%)',
    correct: false,
    explanation: 'Grüner Hintergrund = Wiese = Pferd. Die KI erkennt das falsche Muster.'
  },
  {
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80',
    label: 'Berglandschaft ohne Tier',
    kiSays: '✗ Kein Pferd (92%)',
    correct: true,
    explanation: 'Keine Wiese → kein Pferd. Hier liegt die KI richtig, aber wieder aus dem falschen Grund.'
  },
]

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

  let border = '2px solid var(--c-border)'
  let bg = 'white'
  if (selected && !showResult) { border = `3px solid ${MOD_COLOR}`; bg = '#e7eeff' }
  if (showResult) {
    if (isCorrect && selected)  { border = '3px solid var(--c-success)'; bg = 'var(--c-success-bg)' }
    if (isCorrect && !selected) { border = '3px solid var(--c-warn)'; bg = 'var(--c-warn-bg)' }
    if (!isCorrect && selected) { border = '3px solid var(--c-error)';   bg = 'var(--c-error-bg)'   }
  }

  return (
    <div style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden', border, background: bg, cursor: onSelect && !disabled ? 'pointer' : 'default', transition: 'all 0.2s' }}
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
        {p && <div style={{ fontSize: '0.65rem', color: 'var(--c-muted)', fontWeight: 400 }}>{p.label}</div>}
      </div>
      {showResult && (
        <div style={{ padding: '4px 8px', fontSize: '0.7rem', fontWeight: 800, textAlign: 'center',
          color: isCorrect && selected ? 'var(--c-success)' : isCorrect && !selected ? 'var(--c-warn)' : !isCorrect && selected ? 'var(--c-error)' : 'var(--c-muted)' }}>
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
  const [solvedLevels, setSolvedLevels] = useState([])  // welche Trainingsstufen wurden gelöst
  // firstSolved = Stufe 1 gelöst (für Rückwärtskompatibilität)
  const firstSolved = solvedLevels.includes(1)
  const allLevelsSolved = solvedLevels.includes(3)  // alle 3 Stufen gelöst
  const [expanded,     setExpanded]     = useState(false)
  const [expandAnim,   setExpandAnim]   = useState(false)
  const [expandCount,  setExpandCount]  = useState(0)
  const [p2Choice,     setP2Choice]     = useState([])
  const [p2Checked,    setP2Checked]    = useState(false)
  const [phase,        setPhase]        = useState('train')
  const [quizAnswer,   setQuizAnswer]   = useState('')
  const [quizFeedback, setQuizFeedback] = useState(null)
  const [brokenStep,   setBrokenStep]   = useState(0)   // Index in BROKEN_KI_EXAMPLES
  const [brokenDone,   setBrokenDone]   = useState(false)

  // Training animieren (3 Stufen)
  function animateTrain() {
    if (animating || trained >= 3) return
    // Test zurücksetzen für neue Stufe
    setP1Choice([])
    setP1Checked(false)
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
    if (solvedLevels.includes(trained)) return
    setP1Choice(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key])
    setP1Checked(false)
  }

  function checkP1() {
    if (p1Choice.length === 0) return
    setP1Checked(true)
    // Korrekt: genau d UND e (beide braunen Pferde), NICHT white
    const correct = p1Choice.length === 2 && p1Choice.includes('d') && p1Choice.includes('e')
    if (correct) setSolvedLevels(prev => prev.includes(trained) ? prev : [...prev, trained])
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
      <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-md)' }}>💡</div>
      <h2 style={{ color: MOD_COLOR }}>Das hast du herausgefunden</h2>
      <MemoryBox>
        KI lernt Muster aus Beispielen.<br />
        Wichtig sind <strong>viele und vielfältige Trainingsbilder.</strong>
      </MemoryBox>
      <div style={{ background: '#f0fafb', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', textAlign: 'left', marginTop: 'var(--sp-md)' }}>
        <p style={{ margin: 0, fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
          Eine Million ähnliche Pferdebilder zeigen der Mini-KI nicht unbedingt alle Arten von Pferden. Unterschiedliche Beispiele helfen ihr, mehr Pferdearten zu erkennen.
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>
          ⚠️ Unser Pferdetraining ist ein vereinfachtes Lernspiel – keine echte KI.<br />
          Fotos: Wikimedia Commons (CC-Lizenzen) · Unsplash
        </p>
      </div>
      {!done && (
        <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--sp-lg)' }}>
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
      <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', marginBottom: 'var(--sp-sm)' }}>
        💡 Tipp: Lies jede Aussage sorgfältig – eine davon beschreibt genau das, was du beim Training beobachtet hast.
      </p>
      <div className="actions">
        <button className="btn btn-primary" onClick={checkQuiz} style={{ background: MOD_COLOR }}>Antwort prüfen</button>
        <button className="btn btn-ghost" onClick={() => setPhase('train')}>← Bilder noch einmal ansehen</button>
      </div>
    </div>
  )

  // ── Lernaufgaben ─────────────────────────────────────────────

  // Phase 1 Feedback
  const currentLevelSolved = solvedLevels.includes(trained)
  const firstCorrect = p1Choice.length === 2 && p1Choice.includes('d') && p1Choice.includes('e')
  const p1Feedback = p1Checked ? (
    firstCorrect
      ? <div className="feedback correct" style={{ display: 'block' }}>
          ✅ <strong>Richtig! Du hast beide erkennbaren Bilder gewählt.</strong><br />
          Alle drei Bilder zeigen echte Pferde. Im Spiel erkennt die KI zunächst nur die braunen Pferde.
        </div>
      : <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ <strong>Noch nicht ganz richtig.</strong><br />
          {p1Choice.includes('white') && p1Choice.length === 1
            ? 'Den Schimmel kennt die Mini-KI noch nicht – sie hat nur braune Pferde gelernt. Wähle die braunen Pferde (Bild A und Bild C).'
            : p1Choice.includes('white') && p1Choice.length === 2
            ? 'Fast! Aber den Schimmel kennt die Mini-KI noch nicht. Ersetze ihn durch das andere braune Pferd.'
            : p1Choice.length === 1
            ? 'Fast! Du hast nur ein braunes Pferd gewählt. Die Mini-KI würde beide braunen Pferde erkennen – wähle auch Bild ' + (p1Choice.includes('d') ? 'C' : 'A') + '.'
            : 'Wähle genau Bild A und Bild C – beide zeigen braune Pferde, die die Mini-KI kennt.'}
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
        <div style={{ background: '#f0fafb', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
          <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            1 · Trainingsbilder
          </div>
          <p style={{ margin: '0 0 var(--sp-md)', fontSize: 'var(--fs-sm)' }}>
            Die Mini-KI bekommt diese drei Bilder zum Lernen. Was fällt dir auf?
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {INITIAL.map(key => <HorsePhoto key={key} photoKey={key} label={PHOTOS[key].label} size="130px" />)}
          </div>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', marginTop: '8px' }}>Fotos: Wikimedia Commons (CC-Lizenzen)</p>
        </div>

        {/* Stufe 2: Training starten */}
        <div style={{ background: '#f0fafb', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
          <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            2 · Training starten
          </div>
          <p style={{ margin: '0 0 var(--sp-md)', fontSize: 'var(--fs-sm)' }}>
            Eine echte KI sieht nicht nur 3 Bilder – sie sieht Millionen! Starte das Training und beobachte, was sich verändert.
          </p>

          {/* Trainings-Stufen als visuelle Timeline */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--sp-md)', alignItems: 'stretch' }}>
            {[
              { n: 1, count: '100',       label: 'Erste Schritte',    question: 'Erkennt die KI jetzt alle Pferde?' },
              { n: 2, count: '10.000',    label: 'Mehr Daten',        question: 'Was ändert sich bei mehr Bildern?' },
              { n: 3, count: '1.000.000', label: 'Sehr viele Daten',  question: 'Reicht Menge allein?' },
            ].map(s => (
              <div key={s.n} style={{ flex: 1, borderRadius: 'var(--r-md)', padding: '0.625rem', textAlign: 'center',
                background: trained >= s.n ? (trained === s.n && animating ? 'rgba(40,89,216,0.15)' : 'rgba(40,89,216,0.1)') : 'rgba(0,0,0,0.04)',
                border: `2px solid ${trained >= s.n ? MOD_COLOR : 'var(--c-border)'}`,
                opacity: trained < s.n - 1 ? 0.4 : 1, transition: 'all 0.3s' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: trained >= s.n ? MOD_COLOR : 'var(--c-muted)', marginBottom: '2px' }}>
                  {trained >= s.n ? '✓' : s.n + '.'}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 900, color: trained >= s.n ? MOD_COLOR : 'var(--c-dark)' }}>{s.count}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--c-muted)' }}>Bilder</div>
              </div>
            ))}
          </div>

          {/* Beobachtungsfrage nach jeder Stufe */}
          {trained === 1 && !animating && !solvedLevels.includes(1) && (
            <div style={{ background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: 'var(--r-md)', padding: '0.75rem', marginBottom: 'var(--sp-md)' }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--fs-sm)', color: '#92400e' }}>
                🤔 Beobachtung: Die Mini-KI hat 100 braune Pferdefotos gesehen.
                Glaubst du, sie erkennt jetzt auch einen Schimmel oder ein Pony?
              </p>
              <p style={{ margin: '0.5rem 0 0', fontSize: 'var(--fs-xs)', color: '#78350f' }}>
                → Teste es unten! Dann trainieren wir weiter und schauen ob mehr Bilder helfen.
              </p>
            </div>
          )}
          {trained === 2 && !animating && !solvedLevels.includes(2) && (
            <div style={{ background: '#fffbeb', border: '2px solid #f59e0b', borderRadius: 'var(--r-md)', padding: '0.75rem', marginBottom: 'var(--sp-md)' }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--fs-sm)', color: '#92400e' }}>
                🤔 Jetzt hat die KI 10.000 braune Pferdefotos gesehen – 100× mehr!
                Hat sich etwas verändert? Teste es nochmal unten.
              </p>
            </div>
          )}
          {trained === 3 && !animating && !solvedLevels.includes(3) && (
            <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: 'var(--r-md)', padding: '0.75rem', marginBottom: 'var(--sp-md)' }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--fs-sm)', color: '#991b1b' }}>
                💡 1.000.000 braune Pferdefotos – und der Schimmel wird immer noch nicht erkannt!
                Warum? Weil <strong>Menge allein nicht reicht</strong> – die KI braucht auch <strong>Vielfalt</strong>.
              </p>
            </div>
          )}

          {/* Trainings-Fortschritt */}
          {trained > 0 && animating && (
            <div style={{ marginBottom: 'var(--sp-md)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: 'var(--fs-sm)', fontWeight: 700 }}>
                <span>Trainingsbilder gesehen:</span>
                <span style={{ color: MOD_COLOR }}>{animCount.toLocaleString('de-DE')}</span>
              </div>
              <div className="progress-shell dark">
                <div className="progress-bar green" style={{ width: `${(animCount / TRAIN_GOALS[trained]) * 100}%`, transition: 'width 0.1s' }} />
              </div>
            </div>
          )}

          <div className="actions">
            {trained < 3 ? (
              <button className="btn btn-primary" onClick={animateTrain} disabled={animating || (trained > 0 && !solvedLevels.includes(trained))} style={{ background: MOD_COLOR }}>
                {animating
                  ? `⏳ Die KI lernt … ${animCount.toLocaleString('de-DE')} Bilder`
                  : trained === 0 ? '▶ Training starten (100 Bilder)'
                  : trained === 1 ? '▶ Weiter trainieren – 10.000 Bilder (ändert das etwas?)'
                  : '▶ Noch mehr – 1.000.000 Bilder (reicht Menge allein?)'}
              </button>
            ) : (
              <div className="done-badge">✓ 1.000.000 Bilder gesehen – aber nur braune Pferde!</div>
            )}
            {trained > 0 && trained < 3 && !solvedLevels.includes(trained) && !animating && (
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', margin: '0.5rem 0 0' }}>
                💡 Löse erst den Test unten, dann kannst du weiter trainieren.
              </p>
            )}
          </div>
        </div>

        {/* Stufe 3: Test */}
        {trained >= 1 && !animating && (
          <div style={{ background: '#f0fafb', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)' }}>
            <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '8px', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              3 · Test: Was erkennt die Mini-KI nach {trained === 1 ? '100' : trained === 2 ? '10.000' : '1.000.000'} Bildern?
            </div>
            <p style={{ margin: '0 0 var(--sp-md)', fontSize: 'var(--fs-sm)' }}>
              {trained === 1
                ? 'Die Mini-KI hat 100 braune Pferdefotos gesehen. Welche dieser neuen Bilder würde sie als Pferd erkennen?'
                : trained === 2
                ? 'Jetzt mit 10.000 Bildern – hat sich etwas verändert? Teste es nochmal!'
                : '1.000.000 Bilder – immer noch nur braune Pferde. Was erkennt die KI jetzt?'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: 'var(--sp-md)' }}>
              {TEST1.map(({ key, label }) => (
                <HorsePhoto key={key} photoKey={key} label={label}
                  size="130px"
                  selected={p1Choice.includes(key)}
                  onSelect={solvedLevels.includes(trained) ? null : toggleP1}
                  disabled={solvedLevels.includes(trained)}
                  showResult={p1Checked && solvedLevels.includes(trained)}
                  isCorrect={key !== 'white'}
                />
              ))}
            </div>
            {!solvedLevels.includes(trained) && (
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

      {/* ── Phase 1.5: Kaputte KI ── */}
      {allLevelsSolved && !brokenDone && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'var(--sp-md)' }}>
            <div style={{ fontSize: '2.5rem' }}>🤖💥</div>
            <div>
              <h2 style={{ margin: 0, color: '#dc2626' }}>Eine KI mit falschen Trainingsdaten</h2>
              <p style={{ margin: '0.25rem 0 0', color: 'var(--c-muted)', fontSize: 'var(--fs-sm)' }}>
                Diese KI wurde nur mit Fotos von <strong>Pferden auf Wiesen</strong> trainiert.
              </p>
            </div>
          </div>

          <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#991b1b', fontSize: 'var(--fs-sm)' }}>
              🧪 Experiment: Was passiert, wenn eine KI einseitig trainiert wurde?
              Schau dir an, was diese KI auf den Bildern „sieht" – und warum das problematisch ist.
            </p>
          </div>

          {/* Bild-für-Bild Durchklicken */}
          {brokenStep < BROKEN_KI_EXAMPLES.length ? (() => {
            const ex = BROKEN_KI_EXAMPLES[brokenStep]
            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', fontWeight: 700 }}>
                    Bild {brokenStep + 1} von {BROKEN_KI_EXAMPLES.length}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {BROKEN_KI_EXAMPLES.map((_, i) => (
                      <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%',
                        background: i < brokenStep ? '#4ade80' : i === brokenStep ? '#dc2626' : 'var(--c-border)' }} />
                    ))}
                  </div>
                </div>

                <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '3px solid var(--c-border)', marginBottom: 'var(--sp-md)', position: 'relative' }}>
                  <img src={ex.img} alt={ex.label}
                    style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.display='none' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                    background: 'rgba(0,0,0,0.7)', color: 'white', padding: '0.5rem 0.75rem',
                    fontWeight: 700, fontSize: 'var(--fs-sm)' }}>
                    📷 {ex.label}
                  </div>
                </div>

                {/* KI-Antwort */}
                <div style={{ background: ex.correct ? '#f0fdf4' : '#fef2f2',
                  border: `3px solid ${ex.correct ? '#4ade80' : '#fca5a5'}`,
                  borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)',
                  textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em',
                    color: ex.correct ? '#166534' : '#991b1b', marginBottom: '0.25rem' }}>
                    KI-ANTWORT
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900,
                    color: ex.correct ? '#166534' : '#dc2626' }}>
                    {ex.kiSays}
                  </div>
                </div>

                {/* Erklärung */}
                <div style={{ background: '#fffbeb', border: '2px solid #f59e0b',
                  borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
                  <div style={{ fontWeight: 800, color: '#92400e', marginBottom: '4px', fontSize: 'var(--fs-sm)' }}>
                    💡 Warum sagt die KI das?
                  </div>
                  <p style={{ margin: 0, color: '#78350f', fontSize: 'var(--fs-sm)' }}>{ex.explanation}</p>
                </div>

                <div className="actions">
                  <button className="btn btn-primary" onClick={() => setBrokenStep(s => s + 1)}
                    style={{ background: '#dc2626' }}>
                    {brokenStep < BROKEN_KI_EXAMPLES.length - 1 ? 'Nächstes Bild →' : 'Alle Beispiele gesehen →'}
                  </button>
                </div>
              </div>
            )
          })() : (
            <div>
              <div style={{ background: '#fef2f2', border: '2px solid #dc2626', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
                <h3 style={{ margin: '0 0 0.5rem', color: '#991b1b' }}>🎯 Was hast du gelernt?</h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#7f1d1d', lineHeight: 1.8, fontSize: 'var(--fs-sm)' }}>
                  <li>Die KI hat das <strong>falsche Muster</strong> gelernt: „Wiese = Pferd"</li>
                  <li>Sie lag manchmal zufällig richtig – aber aus dem <strong>falschen Grund</strong></li>
                  <li>Schlechte Trainingsdaten → schlechte KI-Antworten (<em>„Garbage In, Garbage Out"</em>)</li>
                  <li>Die Lösung: <strong>vielfältigere und ausgewogenere</strong> Trainingsdaten</li>
                </ul>
              </div>
              <div className="actions">
                <button className="btn btn-primary" onClick={() => setBrokenDone(true)}
                  style={{ background: MOD_COLOR }}>
                  Weiter: Wie macht man es besser? →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Phase 2: Erweitertes Training ── */}
      {allLevelsSolved && brokenDone && (
        <div className="card">
          <h2 style={{ color: MOD_COLOR }}>🔑 Der entscheidende Unterschied: Vielfalt!</h2>
          <div style={{ background: '#fef2f2', border: '2px solid #fca5a5', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)' }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#991b1b', fontSize: 'var(--fs-sm)' }}>
              Du hast gerade gesehen: Auch 1.000.000 braune Pferdefotos helfen nicht,
              wenn die KI einen Schimmel erkennen soll. <strong>Menge allein reicht nicht.</strong>
            </p>
          </div>
          <p className="lead">Jetzt bekommt die KI <strong>vielfältigere Trainingsbilder</strong>: auch Schimmel, Ponys und kräftige Kaltblüter.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: 'var(--sp-md) 0' }}>
            {EXPANDED.map(key => <HorsePhoto key={key} photoKey={key} label={PHOTOS[key].label} size="120px" />)}
          </div>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>
            Viele Bilder sind hilfreich. <strong>Unterschiedliche</strong> Bilder sind ebenfalls wichtig!
          </p>

          {/* Erweitertes Training */}
          {!expanded && (
            <>
              {expandAnim && (
                <div style={{ marginBottom: 'var(--sp-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: 'var(--fs-sm)', fontWeight: 700 }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', margin: 'var(--sp-md) 0' }}>
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