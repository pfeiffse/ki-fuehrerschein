// Modul 01 - Station 4: Satzwerkstatt (korrigierte Grammatik)

import React, { useState } from 'react'
import { MemoryBox, WarningBox, InfoBox } from '../../components/ui/InfoBox.jsx'

const MOD_COLOR = '#2859d8'

// Korrekte Verb-Ergänzungs-Kombinationen
// Subjekt bestimmt Verbform, Verb bestimmt passende Ergänzungen
const SATZ_VORLAGEN = [
  {
    id: 'tiere', label: 'Tiere',
    steps: [
      { prompt: 'Wähle ein Subjekt:', options: [
        { id: 'hund-sg',  text: 'Der kleine Hund',     number: 'sg' },
        { id: 'hunde-pl', text: 'Die kleinen Hunde',    number: 'pl' },
        { id: 'katze-sg', text: 'Die neugierige Katze', number: 'sg' },
      ]},
      { prompt: 'Wähle ein Verb:', getOptions: (built) => {
        const num = built[0]?.number ?? 'sg'
        return [
          { id: 'rennt',    text: 'rennt',    number: 'sg', type: 'bewegung', disabled: num === 'pl' },
          { id: 'rennen',   text: 'rennen',   number: 'pl', type: 'bewegung', disabled: num === 'sg' },
          { id: 'schlaeft', text: 'schläft',  number: 'sg', type: 'ruhe',     disabled: num === 'pl' },
          { id: 'schlafen', text: 'schlafen', number: 'pl', type: 'ruhe',     disabled: num === 'sg' },
          { id: 'springt',  text: 'springt',  number: 'sg', type: 'bewegung', disabled: num === 'pl' },
          { id: 'springen', text: 'springen', number: 'pl', type: 'bewegung', disabled: num === 'sg' },
        ]
      }},
      { prompt: 'Wähle eine Ergänzung:', getOptions: (built) => {
        const verbType = built[1]?.type ?? 'bewegung'
        return verbType === 'ruhe'
          ? [
            { id: 'sofa',    text: 'auf dem Sofa.' },
            { id: 'sonne',   text: 'in der Sonne.' },
            { id: 'korb',    text: 'in seinem Korb.' },
          ]
          : [
            { id: 'park',    text: 'durch den Park.' },
            { id: 'wiese',   text: 'über die Wiese.' },
            { id: 'garten',  text: 'in den Garten.' },
          ]
      }},
    ],
  },
  {
    id: 'schule', label: 'Schule',
    steps: [
      { prompt: 'Wähle ein Subjekt:', options: [
        { id: 'schueler-sg', text: 'Die Schülerin',    number: 'sg' },
        { id: 'schueler-pl', text: 'Die Schülerinnen', number: 'pl' },
        { id: 'lehrer-sg',   text: 'Der Lehrer',       number: 'sg' },
      ]},
      { prompt: 'Wähle ein Verb:', getOptions: (built) => {
        const num = built[0]?.number ?? 'sg'
        return [
          { id: 'liest',    text: 'liest',    number: 'sg', type: 'lesen',    disabled: num === 'pl' },
          { id: 'lesen',    text: 'lesen',    number: 'pl', type: 'lesen',    disabled: num === 'sg' },
          { id: 'schreibt', text: 'schreibt', number: 'sg', type: 'schreiben',disabled: num === 'pl' },
          { id: 'schreiben',text: 'schreiben',number: 'pl', type: 'schreiben',disabled: num === 'sg' },
          { id: 'erklaert', text: 'erklärt',  number: 'sg', type: 'erklaeren',disabled: num === 'pl' },
          { id: 'erklaeren',text: 'erklären', number: 'pl', type: 'erklaeren',disabled: num === 'sg' },
        ]
      }},
      { prompt: 'Wähle eine Ergänzung:', getOptions: (built) => {
        const verbType = built[1]?.type ?? 'lesen'
        if (verbType === 'lesen') return [
          { id: 'buch',    text: 'ein spannendes Buch.' },
          { id: 'text',    text: 'einen langen Text.' },
          { id: 'aufgabe', text: 'die Aufgabe sorgfältig.' },
        ]
        if (verbType === 'schreiben') return [
          { id: 'aufsatz', text: 'einen Aufsatz.' },
          { id: 'notizen', text: 'wichtige Notizen.' },
          { id: 'brief',   text: 'einen Brief.' },
        ]
        return [
          { id: 'mathe',   text: 'die Mathematikaufgabe.' },
          { id: 'regel',   text: 'die Grammatikregel.' },
          { id: 'thema',   text: 'das schwierige Thema.' },
        ]
      }},
    ],
  },
]

const QUIZ = [
  { id: 0, text: 'Die KI legt zuerst den ganzen Satz fest und schreibt ihn dann auf.' },
  { id: 1, text: 'Die bisherigen Wörter beeinflussen, welche Fortsetzungen wahrscheinlich sind.' },
  { id: 2, text: 'Die grauen Felder zeigen die echten Regeln eines Sprachmodells.' },
  { id: 3, text: 'Der Zusammenhang ändert sich nicht, wenn neue Wörter hinzukommen.' },
]
const QUIZ_EXPLAIN = [
  'Die KI legt nicht zuerst einen ganzen fertigen Satz fest – sie wählt Schritt für Schritt.',
  '',
  'Die grauen Felder zeigen nur die vereinfachten Regeln des Spiels, nicht echte KI-Logik.',
  'Der Zusammenhang verändert sich mit jedem neuen Textstück – das ist gerade der Kern.',
]
const QUIZ_ORDER = [0,1,2,3].sort(() => Math.random() - 0.5)

export default function Station4({ done, onComplete, achieved, onDashboard }) {
  const [vorlageIdx,         setVorlageIdx]         = useState(0)
  const [built,              setBuilt]              = useState([])
  const [phase,              setPhase]              = useState('werkstatt')
  const [completedSentences, setCompletedSentences] = useState([])
  const [quizAnswer,         setQuizAnswer]         = useState('')
  const [quizFeedback,       setQuizFeedback]       = useState(null)

  const vorlage        = SATZ_VORLAGEN[vorlageIdx]
  const step           = built.length
  const finished       = step >= vorlage.steps.length
  const sentence       = built.map(w => w.text).join(' ')
  const currentStep    = vorlage.steps[step]
  const currentOptions = currentStep?.getOptions
    ? currentStep.getOptions(built)
    : currentStep?.options ?? []

  function pick(opt) { if (!opt.disabled) setBuilt([...built, opt]) }
  function goBack()  { if (built.length > 0) setBuilt(built.slice(0, -1)) }
  function reset()   { setBuilt([]); setQuizAnswer(''); setQuizFeedback(null) }

  function completeSentence() {
    setCompletedSentences([...completedSentences, { vorlage: vorlage.label, sentence }])
    setBuilt([])
    setPhase('reflexion')
  }

  function switchVorlage(idx) { setVorlageIdx(idx); setBuilt([]) }

  function checkQuiz() {
    if (!quizAnswer) { setQuizFeedback('empty'); return }
    const id = parseInt(quizAnswer)
    if (id === 1) { setQuizFeedback('correct'); setTimeout(() => setPhase('merksatz'), 600) }
    else setQuizFeedback(QUIZ_EXPLAIN[id])
  }

  // Merksatz / Abschluss
  if (phase === 'merksatz' || done) return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div className="station-counter">Station 4 von 4 · Satzwerkstatt · Merksatz</div>
      <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-md)' }}>💡</div>
      <h2 style={{ color: MOD_COLOR }}>Merksatz</h2>
      <MemoryBox>Eine Sprach-KI erzeugt Texte Schritt für Schritt. Was schon dasteht, beeinflusst, welche Wörter als nächstes wahrscheinlich sind.</MemoryBox>
      <InfoBox title="Was bedeutet das in der Praxis?">
        Wenn du einer KI einen guten Kontext gibst – also einen klaren, präzisen Prompt – kann sie viel besser vorhersagen, was du brauchst.
      </InfoBox>
      <WarningBox title="Didaktischer Hinweis:">
        Reale Sprachmodelle verwenden keine harte Liste erlaubter Wörter. Das Ausgrauen ist eine vereinfachte Spielmechanik.
      </WarningBox>
      {completedSentences.length > 0 && (
        <div style={{ textAlign: 'left', marginTop: 'var(--sp-lg)', padding: 'var(--sp-md)', background: '#f0fafb', borderRadius: 'var(--r-lg)' }}>
          <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '8px' }}>Deine Sätze:</div>
          {completedSentences.map((s, i) => (
            <div key={i} style={{ padding: '6px 0', borderBottom: i < completedSentences.length - 1 ? '1px solid var(--c-border)' : 'none', fontSize: 'var(--fs-sm)' }}>
              <span style={{ color: 'var(--c-muted)', marginRight: '8px' }}>[{s.vorlage}]</span>
              <strong>„{s.sentence}"</strong>
            </div>
          ))}
        </div>
      )}
      {!done && (
        <div className="card" style={{ border: `2px solid ${achieved ? 'var(--c-xp)' : 'var(--c-border)'}`, background: achieved ? '#fff8db' : 'white', marginTop: 'var(--sp-lg)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🔍</div>
          <h3 style={{ color: achieved ? '#825300' : MOD_COLOR, margin: '0 0 8px' }}>KI-Versteher:in</h3>
          <p style={{ color: 'var(--c-muted)', margin: '0 0 var(--sp-md)' }}>Du weißt, wie KI aus Daten lernt und Muster erkennt.</p>
          <button className="btn btn-success" onClick={onComplete} style={{ width: '100%', justifyContent: 'center' }}>
            Modul 1 abschließen · Achievement freischalten 🏅
          </button>
        </div>
      )}
      {done && (
        <>
          <div className="done-badge">✓ Modul 1 vollständig abgeschlossen!</div>
          <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--sp-lg)' }}>
            <button className="btn btn-primary" onClick={onDashboard} style={{ background: MOD_COLOR }}>Zur Modulübersicht →</button>
          </div>
        </>
      )}
    </div>
  )

  // Quiz
  if (phase === 'quiz') return (
    <div className="card">
      <div className="station-counter">Station 4 von 4 · Satzwerkstatt · Abschlussfrage</div>
      <h2 style={{ color: MOD_COLOR }}>Wie erzeugt eine Sprach-KI einen Satz?</h2>
      {completedSentences.length > 0 && (
        <div style={{ padding: 'var(--sp-md)', background: '#f0fafb', borderRadius: 'var(--r-lg)', marginBottom: 'var(--sp-md)', fontSize: 'var(--fs-sm)' }}>
          <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '6px' }}>Deine Sätze:</div>
          {completedSentences.map((s, i) => <div key={i}>„{s.sentence}"</div>)}
        </div>
      )}
      {QUIZ_ORDER.map(idx => {
        const q = QUIZ[idx]
        return (
          <label key={q.id} className="option">
            <input type="radio" name="s4quiz" value={q.id}
              checked={quizAnswer === String(q.id)}
              onChange={() => { setQuizAnswer(String(q.id)); setQuizFeedback(null) }} />
            {q.text}
          </label>
        )
      })}
      {quizFeedback === 'empty'   && <div className="feedback wrong" style={{ display: 'block' }}>Bitte wähle eine Antwort aus.</div>}
      {quizFeedback === 'correct' && <div className="feedback correct" style={{ display: 'block' }}>✅ Genau! Die bisherigen Wörter beeinflussen, welche Fortsetzungen wahrscheinlich sind.</div>}
      {quizFeedback && quizFeedback !== 'empty' && quizFeedback !== 'correct' && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ {quizFeedback}
          <div style={{ marginTop: '8px' }}><button className="nav-btn" onClick={() => { setQuizAnswer(''); setQuizFeedback(null) }}>↺ Erneut versuchen</button></div>
        </div>
      )}
      <div className="actions">
        <button className="btn btn-primary" onClick={checkQuiz} style={{ background: MOD_COLOR }}>Antwort prüfen</button>
        <button className="btn btn-ghost" onClick={() => setPhase('werkstatt')}>↺ Zurück zur Werkstatt</button>
      </div>
    </div>
  )

  // Reflexion
  if (phase === 'reflexion') return (
    <div className="card">
      <div className="station-counter">Station 4 von 4 · Satzwerkstatt · Reflexion</div>
      <h2 style={{ color: MOD_COLOR }}>Was hast du beobachtet?</h2>
      <div style={{ padding: 'var(--sp-md)', background: '#f0fafb', borderRadius: 'var(--r-lg)', marginBottom: 'var(--sp-lg)' }}>
        <div style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: '8px' }}>Deine Sätze:</div>
        {completedSentences.map((s, i) => (
          <div key={i} style={{ padding: '6px 0', borderBottom: i < completedSentences.length - 1 ? '1px solid var(--c-border)' : 'none' }}>
            <span style={{ color: 'var(--c-muted)', marginRight: '8px', fontSize: 'var(--fs-sm)' }}>[{s.vorlage}]</span>
            <strong>„{s.sentence}"</strong>
          </div>
        ))}
      </div>
      <InfoBox title="Was ist dir aufgefallen?">
        <ul style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: 2 }}>
          <li>Das Subjekt (Singular/Plural) bestimmt, welche Verbformen möglich sind.</li>
          <li>Das Verb bestimmt, welche Ergänzungen passen (Bewegung → Richtung, Ruhe → Ort).</li>
          <li>Frühere Entscheidungen schränken spätere Möglichkeiten ein.</li>
          <li>Genau so funktioniert Sprach-KI: Jedes Wort beeinflusst das nächste.</li>
        </ul>
      </InfoBox>
      <WarningBox title="Didaktischer Hinweis:">
        Das Ausgrauen ist eine vereinfachte Spielmechanik. Echte Sprachmodelle berechnen Wahrscheinlichkeiten für alle möglichen Wörter.
      </WarningBox>
      <div className="actions">
        <button className="btn btn-primary" onClick={() => setPhase('quiz')} style={{ background: MOD_COLOR }}>Zur Abschlussfrage →</button>
        <button className="btn btn-ghost" onClick={() => { setPhase('werkstatt'); setBuilt([]) }}>Noch einen Satz bauen</button>
      </div>
    </div>
  )

  // Satzwerkstatt
  return (
    <div className="card">
      <div className="station-counter">Station 4 von 4 · Satzwerkstatt</div>
      <h2 style={{ color: MOD_COLOR }}>Satzwerkstatt</h2>
      <p className="lead">Baue einen Satz Schritt für Schritt auf – genau wie eine Sprach-KI. Das Verb bestimmt, welche Ergänzungen passen!</p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--sp-md)', flexWrap: 'wrap' }}>
        {SATZ_VORLAGEN.map((v, i) => (
          <button key={v.id} className={`nav-btn ${vorlageIdx === i ? 'active' : ''}`} onClick={() => switchVorlage(i)}>{v.label}</button>
        ))}
      </div>

      {completedSentences.length > 0 && (
        <div style={{ padding: 'var(--sp-sm) var(--sp-md)', background: 'var(--c-success-bg)', borderRadius: 'var(--r-md)', marginBottom: 'var(--sp-md)', fontSize: 'var(--fs-sm)' }}>
          {completedSentences.map((s, i) => <div key={i}>✓ „{s.sentence}"</div>)}
        </div>
      )}

      <div style={{ background: 'white', border: `2px solid ${MOD_COLOR}`, borderRadius: 'var(--r-xl)', padding: 'var(--sp-lg)', fontSize: 'clamp(1.1rem,3vw,1.5rem)', fontWeight: 800, color: 'var(--c-dark)', minHeight: '70px', marginBottom: 'var(--sp-lg)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        {built.length === 0
          ? <span style={{ color: 'var(--c-muted)', fontWeight: 400, fontSize: '1rem' }}>Dein Satz erscheint hier …</span>
          : built.map((w, i) => (
            <span key={i} style={{ background: i === built.length - 1 ? MOD_COLOR : '#dce8ff', color: i === built.length - 1 ? 'white' : 'var(--c-dark)', borderRadius: 'var(--r-md)', padding: '4px 10px', fontSize: 'clamp(0.9rem,2vw,1.1rem)', transition: 'all 0.2s' }}>{w.text}</span>
          ))}
      </div>

      {!finished && currentStep && (
        <>
          <p style={{ fontWeight: 800, color: MOD_COLOR, marginBottom: 'var(--sp-sm)' }}>
            Schritt {step + 1} von {vorlage.steps.length}: {currentStep.prompt}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--sp-md)' }}>
            {currentOptions.map(opt => (
              <button key={opt.id} onClick={() => pick(opt)} disabled={opt.disabled}
                style={{ border: `2px solid ${opt.disabled ? '#e0e0e0' : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: '12px 18px', background: opt.disabled ? '#f5f5f5' : 'linear-gradient(155deg,#fff,#eaf8f5)', cursor: opt.disabled ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '1rem', fontFamily: 'inherit', color: opt.disabled ? '#bbb' : 'var(--c-text)', textAlign: 'left', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {opt.disabled
                  ? <span style={{ fontSize: '0.8rem', color: '#bbb' }}>⬜ Passt hier nicht</span>
                  : <span style={{ color: MOD_COLOR }}>▶</span>}
                {opt.text}
              </button>
            ))}
          </div>
        </>
      )}

      {finished && <div className="done-badge">✅ Dein Satz: „{sentence}"</div>}

      <div className="actions">
        {built.length > 0 && !finished && <button className="btn btn-ghost" onClick={goBack}>← Einen Schritt zurück</button>}
        <button className="btn btn-ghost" onClick={reset}>↺ Neuer Satz</button>
        {finished && (
          <button className="btn btn-primary" onClick={completeSentence} style={{ background: MOD_COLOR }}>
            Satz fertig – zur Reflexion →
          </button>
        )}
      </div>

      <WarningBox title="Didaktischer Hinweis:">Das Ausgrauen ist eine vereinfachte Spielmechanik. Reale Sprachmodelle berechnen Wahrscheinlichkeiten für nächste Tokens.</WarningBox>
    </div>
  )
}