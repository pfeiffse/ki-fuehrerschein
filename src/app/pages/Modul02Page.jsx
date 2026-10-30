// ============================================================
// KI-Führerschein · Modul 02 – KI sinnvoll nutzen
// Referenz: legacy/Modul2.html
// Stil: Modul 5 (KI & Nachhaltigkeit)
// ============================================================

import React, { useEffect, useReducer, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import ModuleNav from '../../components/layout/ModuleNav.jsx'
import { TaskBox, InfoBox, WarningBox, MemoryBox } from '../../components/ui/InfoBox.jsx'
import Quiz from '../../components/quiz/Quiz.jsx'
import TextTask from '../../components/quiz/TextTask.jsx'
import Badge from '../../components/ui/Badge.jsx'
import {
  loadModuleProgress, loadTaskProgress, startModule,
  completeModule, completeTask, saveQuizAnswer,
} from '../../lib/progress.js'

const MODULE_ID  = 'modul-02'
const MAX_POINTS = 100
const PASS_PCT   = 0.8
const MOD_COLOR  = '#087f83'

// ── Reducer ───────────────────────────────────────────────────

const initialState = { points: 0, done: {}, correct: 0, loaded: false }

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':        return { ...state, ...action.payload, loaded: true }
    case 'AWARD':       if (state.done[action.id]) return state
                        return { ...state, points: Math.min(MAX_POINTS, state.points + action.pts), done: { ...state.done, [action.id]: true } }
    case 'QUIZ_CORRECT':if (state.done[action.id]) return state
                        return { ...state, points: Math.min(MAX_POINTS, state.points + action.pts), done: { ...state.done, [action.id]: true }, correct: state.correct + 1 }
    case 'QUIZ_WRONG':  if (state.done[action.id]) return state
                        return { ...state, done: { ...state.done, [action.id]: true } }
    default:            return state
  }
}

// ── Hauptkomponente ───────────────────────────────────────────

export default function Modul02Page({ student }) {
  const navigate          = useNavigate()
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    async function load() {
      await startModule(MODULE_ID)
      const [, taskProg] = await Promise.all([
        loadModuleProgress(MODULE_ID),
        loadTaskProgress(MODULE_ID),
      ])
      const done = {}; let points = 0; let correct = 0
      Object.entries(taskProg).forEach(([id, t]) => {
        if (t.status === 'completed' || t.status === 'passed') {
          done[id] = true; points += t.score ?? 0
          if (t.status === 'passed') correct++
        }
      })
      dispatch({ type: 'LOAD', payload: { points, done, correct } })
    }
    load()
  }, [])

  useEffect(() => {
    if (!state.loaded) return
    completeModule(MODULE_ID, state.points, MAX_POINTS)
    if (state.points >= MAX_POINTS * PASS_PCT) {
      import('../../lib/achievements.js').then(({ saveAchievementLocal }) => {
        saveAchievementLocal(MODULE_ID)
      })
    }
  }, [state.points, state.loaded])

  const award = useCallback(async (id, pts) => {
    dispatch({ type: 'AWARD', id, pts })
    await completeTask(MODULE_ID, id, pts)
  }, [])

  const onQuizCorrect = useCallback(async (id, pts) => {
    dispatch({ type: 'QUIZ_CORRECT', id, pts })
    await saveQuizAnswer(MODULE_ID, id, true, pts, 1)
  }, [])

  const onQuizWrong = useCallback(async (id, attempts) => {
    dispatch({ type: 'QUIZ_WRONG', id })
    await saveQuizAnswer(MODULE_ID, id, false, 0, attempts)
  }, [])

  const progressPct = Math.min(100, Math.round(state.points / MAX_POINTS * 100))
  const passed      = state.points >= MAX_POINTS * PASS_PCT

  const badges = [
    { icon: '🕵️', title: 'Fehlerdetektiv',  description: 'Fehlerexperiment dokumentiert',    unlocked: !!state.done['experiment'] },
    { icon: '💬', title: 'Prompt-Profi',    description: 'Guten Lernprompt formuliert',       unlocked: !!state.done['prompt'] },
    { icon: '✅', title: 'Faktenprüfer',    description: 'Mindestens 3 Quizfragen richtig',   unlocked: state.correct >= 3 },
    { icon: '🏆', title: 'KI-Profi',        description: 'Mindestens 80 Punkte erreicht',     unlocked: state.points >= 80 },
  ]

  if (!state.loaded) return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap"><p style={{ color: 'var(--color-text-muted)' }}>Modul wird geladen …</p></div>
    </div>
  )

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* ── Modulkopf ── */}
        <header className="hero" style={{ background: 'linear-gradient(120deg, #095c6b, #167e8a)' }}>
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein Klasse 7 · Modul 2</div>
          <h1 style={{ margin: '8px 0 6px' }}>🧠 KI sinnvoll nutzen</h1>
          <p className="lead" style={{ margin: '4px 0 2px', opacity: 0.9 }}>
            <strong>Leitfrage:</strong> Wie kann KI mir helfen, ohne mein eigenes Denken zu ersetzen?
          </p>
          <p style={{ margin: '4px 0 16px', opacity: 0.75, fontSize: 'var(--font-size-sm)' }}>
            ca. 45 Minuten · Einzel-, Partner- und Gruppenarbeit
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div className="hero-progress" style={{ flex: 1, minWidth: '160px' }}>
              <div className="hero-progress-bar" style={{ width: `${progressPct}%` }}
                role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} />
            </div>
            <div style={{ fontWeight: 800, color: 'var(--color-gold)', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
              ⭐ {state.points} / {MAX_POINTS} Punkte
            </div>
          </div>
        </header>

        {/* ── Tab-Navigation ── */}
        <div className="station-tabs no-print">
          {['1·Auftrag','2·Einstieg','3·Experiment','4·Quiz','5·Grundsätze',
            '6·Prompts','7·Situationen','8·Abschluss','9·Regeln','10·Badges'].map((label, i) => (
            <button key={i} className="nav-btn"
              onClick={() => document.getElementById(`s02-${i+1}`)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ fontSize: '0.78rem', padding: '7px 10px' }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── 1: Dein Auftrag ── */}
        <section className="card" id="s02-1" aria-labelledby="h-goals">
          <div className="station-counter">Abschnitt 1 von 10</div>
          <h2 id="h-goals" style={{ color: MOD_COLOR }}>1. Dein Auftrag</h2>
          <div className="grid-2">
            <InfoBox title="Du lernst:">
              <ul style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
                <li>KI als Werkzeug zu nutzen,</li>
                <li>Fehler zu erkennen,</li>
                <li>Antworten zu prüfen,</li>
                <li>sinnvolle Nutzung zu beurteilen,</li>
                <li>Verantwortung zu übernehmen.</li>
              </ul>
            </InfoBox>
            <MemoryBox>
              Kernbotschaft:<br />
              KI kann mich unterstützen. Denken, Prüfen und Entscheiden muss ich selbst.
            </MemoryBox>
          </div>
          <div className="actions">
            <button className="btn btn-success" disabled={!!state.done['intro']} onClick={() => award('intro', 5)}>
              {state.done['intro'] ? '✓ Erledigt' : 'Ziele gelesen ✓ · 5 Punkte'}
            </button>
          </div>
        </section>

        {/* ── 2: Einstieg ── */}
        <section className="card" id="s02-2" aria-labelledby="h-start">
          <div className="station-counter">Abschnitt 2 von 10</div>
          <h2 id="h-start" style={{ color: MOD_COLOR }}>2. Einstieg: Ist KI schlauer als du?</h2>
          <TaskBox title="Partnergespräch, 3 Minuten:">
            Entscheidet euch zunächst für „Ja", „Nein" oder „Kommt darauf an". Begründet eure Wahl mit einem Beispiel.
          </TaskBox>
          <TextTask
            id="startReflection"
            label="Unsere Begründung:"
            placeholder="Wir denken ..., weil ..."
            minLength={20} points={5}
            done={!!state.done['start']}
            onSave={(_, pts) => award('start', pts)}
          />
        </section>

        {/* ── 3: Experiment ── */}
        <section className="card" id="s02-3" aria-labelledby="h-experiment">
          <div className="station-counter">Abschnitt 3 von 10</div>
          <h2 id="h-experiment" style={{ color: MOD_COLOR }}>3. Experiment: Die KI als Fehlerquelle</h2>
          <p className="lead">Nutzt die von der Lehrkraft freigegebene KI, zum Beispiel AIS.chat. Eine Person tippt, die andere protokolliert und prüft.</p>
          <div style={{
            background: '#103d54', color: '#bff5e5', padding: '16px 20px',
            borderRadius: 'var(--radius-lg)', fontFamily: 'monospace',
            fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 'var(--space-md)',
          }}>
            Du beantwortest Fragen für Schülerinnen und Schüler der 7. Klasse. Baue in einige Antworten einen sachlichen Fehler ein. Die Fehler sollen glaubwürdig klingen. Verrate zunächst nicht, welche Antworten falsch sind. Wenn wir „Auflösen" schreiben, kennzeichne die Fehler und nenne die korrekten Informationen.
          </div>
          <TaskBox title="Auftrag, 10 Minuten:">
            <ol style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
              <li>Stellt mindestens vier Fragen aus unterschiedlichen Schulfächern.</li>
              <li>Markiert verdächtige Aussagen.</li>
              <li>Prüft sie mit Schulbuch, Unterrichtsmaterial oder einer verlässlichen Quelle.</li>
              <li>Schreibt anschließend „Auflösen".</li>
            </ol>
          </TaskBox>
          <WarningBox>Gebt keine persönlichen Daten über euch oder andere Menschen ein.</WarningBox>
          <TextTask
            id="foundError"
            label="Beschreibt einen gefundenen Fehler und eure Prüfung:"
            placeholder="Die KI behauptete ... Wir haben geprüft mit ... Richtig ist ..."
            minLength={20} points={15}
            done={!!state.done['experiment']}
            onSave={(_, pts) => award('experiment', pts)}
          />
        </section>

        {/* ── 4: Zwischenquiz ── */}
        <section className="card" id="s02-4" aria-labelledby="h-q1">
          <div className="station-counter">Abschnitt 4 von 10</div>
          <h2 id="h-q1" style={{ color: MOD_COLOR }}>4. Zwischenquiz: Fehlerdetektiv</h2>
          <Quiz
            id="q1"
            question="Warum können falsche KI-Antworten gefährlich sein?"
            options={[
              { value: '0', label: 'Weil falsche Antworten immer sehr kurz sind.' },
              { value: '1', label: 'Weil sie überzeugend klingen können und deshalb leicht ungeprüft übernommen werden.' },
              { value: '2', label: 'Weil eine KI überhaupt keine richtigen Antworten geben kann.' },
            ]}
            answer="1" points={5} done={!!state.done['q1']} allowRetry={true}
            correctFeedback="Richtig! Du hast den Grundsatz richtig angewendet."
            wrongFeedback="Noch nicht ganz. Denke daran: KI-Antworten können sehr überzeugend klingen, auch wenn sie falsch sind."
            onCorrect={pts => onQuizCorrect('q1', pts)}
            onAttempt={(correct, attempts) => { if (!correct) onQuizWrong('q1', attempts) }}
          />
        </section>

        {/* ── 5: Fünf Grundsätze ── */}
        <section className="card" id="s02-5" aria-labelledby="h-principles">
          <div className="station-counter">Abschnitt 5 von 10</div>
          <h2 id="h-principles" style={{ color: MOD_COLOR }}>5. Fünf Grundsätze</h2>
          <div className="grid-2">
            {[
              { title: '1. Werkzeug',         text: 'KI unterstützt dich. Sie übernimmt weder dein Denken noch deine Verantwortung.' },
              { title: '2. Prüfen',           text: 'Klingt richtig bedeutet nicht automatisch: ist richtig.' },
              { title: '3. Lernen',           text: 'Nutze KI zum Erklären, Üben und Verbessern, nicht zum bloßen Abschreiben.' },
              { title: '4. Genau fragen',     text: 'Nenne Thema, Ziel, Klassenstufe und gewünschte Form.' },
              { title: '5. Kritisch bleiben', text: 'KI-Ergebnisse können einseitig, unfair oder unvollständig sein.' },
            ].map(g => <InfoBox key={g.title} title={g.title}>{g.text}</InfoBox>)}
          </div>
          <div className="actions">
            <button className="btn btn-success" disabled={!!state.done['principles']} onClick={() => award('principles', 5)}>
              {state.done['principles'] ? '✓ Erledigt' : 'Grundsätze gelesen ✓ · 5 Punkte'}
            </button>
          </div>
        </section>

        {/* ── 6: Prompt-Challenge ── */}
        <section className="card" id="s02-6" aria-labelledby="h-prompt">
          <div className="station-counter">Abschnitt 6 von 10</div>
          <h2 id="h-prompt" style={{ color: MOD_COLOR }}>6. Prompt-Challenge</h2>
          <p className="lead">Welche Anfrage hilft wahrscheinlich besser beim Lernen?</p>
          <Quiz
            id="q2"
            question="Wähle den besseren Lernprompt:"
            options={[
              { value: '0', label: '„Erkläre Brüche."' },
              { value: '1', label: '„Erkläre das Addieren von Brüchen für Klasse 7 in einfachen Schritten. Nutze ein Beispiel und stelle mir danach zwei Aufgaben ohne Lösung."' },
              { value: '2', label: '„Mach Mathe."' },
            ]}
            answer="1" points={5} done={!!state.done['q2']} allowRetry={true}
            correctFeedback="Richtig! Die Anfrage nennt Thema, Zielgruppe und gewünschte Form."
            wrongFeedback="Noch nicht ganz. Ein guter Prompt nennt Thema, Ziel, Klassenstufe und gewünschte Form."
            onCorrect={pts => onQuizCorrect('q2', pts)}
            onAttempt={(correct, attempts) => { if (!correct) onQuizWrong('q2', attempts) }}
          />
          <div style={{ marginTop: 'var(--space-md)' }}>
            <TextTask
              id="ownPrompt"
              label="Formuliere nun selbst einen guten Lernprompt:"
              placeholder="Erkläre ... für Klasse 7 ... Nutze ... Stelle mir danach ..."
              minLength={20} points={10}
              done={!!state.done['prompt']}
              onSave={(_, pts) => award('prompt', pts)}
            />
          </div>
        </section>

        {/* ── 7: Situationen ── */}
        <section className="card" id="s02-7" aria-labelledby="h-scenarios">
          <div className="station-counter">Abschnitt 7 von 10</div>
          <h2 id="h-scenarios" style={{ color: MOD_COLOR }}>7. Situationen beurteilen</h2>
          <ScenarioTask done={!!state.done['scenarios']} onComplete={pts => award('scenarios', pts)} />
        </section>

        {/* ── 8: Abschlusstest ── */}
        <section className="card" id="s02-8" aria-labelledby="h-final">
          <div className="station-counter">Abschnitt 8 von 10</div>
          <h2 id="h-final" style={{ color: MOD_COLOR }}>8. Abschlusstest</h2>
          {[
            { id: 'q3', pts: 5, question: '1. Wer trägt die Verantwortung für eine übernommene KI-Antwort?',
              options: [{ value: '0', label: 'Die KI' }, { value: '1', label: 'Die Person, die das Ergebnis nutzt' }, { value: '2', label: 'Niemand' }],
              answer: '1', correctFeedback: 'Richtig! Wer KI-Ergebnisse nutzt, trägt die Verantwortung.',
              wrongFeedback: 'Noch nicht ganz. Wer entscheidet, ob ein KI-Ergebnis verwendet wird?' },
            { id: 'q4', pts: 5, question: '2. Warum können KI-Ergebnisse Vorurteile enthalten?',
              options: [{ value: '0', label: 'Weil die verarbeiteten Inhalte Fehler und Vorurteile von Menschen enthalten können.' }, { value: '1', label: 'Weil KI grundsätzlich gegen Menschen ist.' }, { value: '2', label: 'Weil jede KI nur eine einzige Antwort kennt.' }],
              answer: '0', correctFeedback: 'Richtig! KI lernt aus menschlichen Daten – inklusive deren Fehler.',
              wrongFeedback: 'Noch nicht ganz. Denke daran, womit KI trainiert wird.' },
            { id: 'q5', pts: 5, question: '3. Was ist der beste erste Schritt bei einer überraschenden Behauptung?',
              options: [{ value: '0', label: 'Sofort weiterleiten' }, { value: '1', label: 'Den Text schöner formulieren' }, { value: '2', label: 'Die Behauptung mit einer geeigneten Quelle prüfen' }],
              answer: '2', correctFeedback: 'Richtig! Prüfen ist immer der erste Schritt.',
              wrongFeedback: 'Noch nicht ganz. Was sollte man tun, bevor man etwas weitergibt?' },
            { id: 'q6', pts: 5, question: '4. Welche Nutzung fördert eigenes Lernen?',
              options: [{ value: '0', label: 'Lösungen kopieren' }, { value: '1', label: 'Hinweise erhalten, selbst weiterarbeiten und das Ergebnis erklären können' }, { value: '2', label: 'Alle Aufgaben automatisch bearbeiten lassen' }],
              answer: '1', correctFeedback: 'Richtig! KI als Lernhilfe, nicht als Ersatz.',
              wrongFeedback: 'Noch nicht ganz. Welche Option fördert dein eigenes Denken?' },
          ].map((q, i) => (
            <div key={q.id}>
              {i > 0 && <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: 'var(--space-md) 0' }} />}
              <Quiz {...q} points={q.pts} done={!!state.done[q.id]} allowRetry={true}
                onCorrect={pts => onQuizCorrect(q.id, pts)}
                onAttempt={(correct, attempts) => { if (!correct) onQuizWrong(q.id, attempts) }}
              />
            </div>
          ))}
        </section>

        {/* ── 9: KI-Regeln ── */}
        <section className="card" id="s02-9" aria-labelledby="h-rules">
          <div className="station-counter">Abschnitt 9 von 10</div>
          <h2 id="h-rules" style={{ color: MOD_COLOR }}>9. Meine KI-Regeln</h2>
          <RulesTask done={!!state.done['rules']} onComplete={pts => award('rules', pts)} />
        </section>

        {/* ── 10: Badges & Ergebnis ── */}
        <section className="card" id="s02-10" aria-labelledby="h-badges">
          <div className="station-counter">Abschnitt 10 von 10</div>
          <h2 id="h-badges" style={{ color: MOD_COLOR }}>10. Deine Badges</h2>
          <div className="grid-3" style={{ marginBottom: 'var(--space-lg)' }}>
            {badges.map(b => <Badge key={b.title} {...b} />)}
          </div>

          <div style={{
            padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)',
            background: passed ? 'var(--color-success-light)' : state.points >= 60 ? 'var(--color-warning-light)' : 'var(--color-error-light)',
            border: `2px solid ${passed ? 'var(--color-success)' : state.points >= 60 ? 'var(--color-warning)' : 'var(--color-error)'}`,
          }}>
            {passed ? (
              <>
                <h3 style={{ margin: '0 0 8px', color: 'var(--color-success)' }}>🏆 Modul erfolgreich abgeschlossen</h3>
                <p style={{ margin: 0 }}>Du hast <strong>{state.points} von {MAX_POINTS} Punkten</strong> erreicht.</p>
                <MemoryBox>KI unterstützt mich. Prüfen, Entscheiden und Verantwortung bleiben bei mir.</MemoryBox>
              </>
            ) : state.points >= 60 ? (
              <>
                <h3 style={{ margin: '0 0 8px' }}>🟡 Fast geschafft</h3>
                <p style={{ margin: 0 }}>Du hast <strong>{state.points} von {MAX_POINTS} Punkten</strong>. Bearbeite noch offene Aufgaben, bis du 80 Punkte erreichst.</p>
              </>
            ) : (
              <>
                <h3 style={{ margin: '0 0 8px' }}>🔴 Weiterarbeiten</h3>
                <p style={{ margin: 0 }}>Du hast <strong>{state.points} von {MAX_POINTS} Punkten</strong>. Bearbeite die noch offenen Abschnitte.</p>
              </>
            )}
          </div>

          <div className="actions" style={{ marginTop: 'var(--space-md)' }}>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Zur Modulübersicht</button>
          </div>
        </section>
      </div>
    </div>
  )
}

// ── Szenarien-Aufgabe ─────────────────────────────────────────

const SCENARIOS = [
  { id: 's1', text: 'A: Du lässt dir den ersten Rechenschritt erklären und rechnest danach selbst weiter.', correct: 'sinnvoll' },
  { id: 's2', text: 'B: Du reichst eine vollständig von KI erstellte Hausaufgabe unverändert als eigene Arbeit ein.', correct: 'nicht-sinnvoll' },
  { id: 's3', text: 'C: Du sammelst Ideen für ein Referat, prüfst die Informationen und formulierst selbst.', correct: 'sinnvoll' },
  { id: 's4', text: 'D: Du übernimmst eine Antwort, nur weil sie professionell klingt.', correct: 'nicht-sinnvoll' },
]

function ScenarioTask({ done, onComplete }) {
  const [values,   setValues]   = React.useState({})
  const [feedback, setFeedback] = React.useState(null)
  const [locked,   setLocked]   = React.useState(done)

  function handleCheck() {
    if (!SCENARIOS.every(s => values[s.id])) { setFeedback('incomplete'); return }
    const correct = SCENARIOS.filter(s => values[s.id] === s.correct).length
    setFeedback({ correct })
    setLocked(true)
    onComplete(Math.round(correct * 2.5))
  }

  return (
    <div>
      <p className="lead">Wähle jeweils die passendste Einschätzung.</p>
      {SCENARIOS.map(s => (
        <div key={s.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700 }}>{s.text}</p>
          <select value={values[s.id] ?? ''} onChange={e => setValues(v => ({ ...v, [s.id]: e.target.value }))}
            disabled={locked}
            style={{ width: '100%', padding: '10px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', font: 'inherit', background: 'white' }}
            aria-label={`Einschätzung für Situation ${s.id}`}>
            <option value="">Bitte wählen</option>
            <option value="sinnvoll">Sinnvoll</option>
            <option value="teilweise">Teilweise sinnvoll</option>
            <option value="nicht-sinnvoll">Nicht sinnvoll</option>
          </select>
        </div>
      ))}
      {feedback === 'incomplete' && <div className="feedback wrong" style={{ display: 'block' }}>Bitte beurteile alle vier Situationen.</div>}
      {feedback && feedback !== 'incomplete' && (
        <div className={`feedback ${feedback.correct >= 3 ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
          {feedback.correct} von 4 Situationen richtig beurteilt.{' '}
          {feedback.correct === 4 ? 'Sehr sicher!' : 'Besprecht unklare Fälle noch einmal.'}
        </div>
      )}
      {!locked && (
        <div className="actions">
          <button className="btn btn-primary" onClick={handleCheck} style={{ background: MOD_COLOR }}>
            Situationen auswerten · bis 10 Punkte
          </button>
        </div>
      )}
      {locked && <div style={{ color: 'var(--color-success)', fontWeight: 800, marginTop: '8px', fontSize: 'var(--font-size-sm)' }}>✓ Erledigt</div>}
    </div>
  )
}

// ── KI-Regeln-Aufgabe ─────────────────────────────────────────

const RULES = [
  'Ich prüfe wichtige Informationen.',
  'Ich nutze KI als Hilfe und nicht als Ersatz für mein Denken.',
  'Ich gebe keine persönlichen Daten ein.',
  'Ich beachte die schulischen Regeln und kennzeichne KI-Nutzung, wenn es verlangt wird.',
]

function RulesTask({ done, onComplete }) {
  const [checked,  setChecked]  = React.useState({})
  const [ownRule,  setOwnRule]  = React.useState('')
  const [feedback, setFeedback] = React.useState(null)
  const [locked,   setLocked]   = React.useState(done)

  function handleComplete() {
    if (!RULES.every((_, i) => checked[i]) || ownRule.trim().length < 15) { setFeedback('incomplete'); return }
    setLocked(true); setFeedback('done'); onComplete(10)
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        {RULES.map((rule, i) => (
          <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '10px 0', cursor: locked ? 'default' : 'pointer' }}>
            <input type="checkbox" checked={!!checked[i]} onChange={e => setChecked(c => ({ ...c, [i]: e.target.checked }))}
              disabled={locked} style={{ marginTop: '3px', width: '18px', height: '18px', flexShrink: 0, accentColor: MOD_COLOR }} />
            <span>{rule}</span>
          </label>
        ))}
      </div>
      <label htmlFor="ownRule" style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Meine zusätzliche persönliche Regel:</label>
      <textarea id="ownRule" value={ownRule} onChange={e => setOwnRule(e.target.value)}
        placeholder="Meine zusätzliche persönliche Regel lautet ..." disabled={locked} rows={3}
        style={{ width: '100%', padding: '10px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', font: 'inherit', resize: 'vertical' }} />
      {feedback === 'incomplete' && <div className="feedback wrong" style={{ display: 'block' }}>Bestätige alle vier Regeln und ergänze eine eigene Regel (mindestens 15 Zeichen).</div>}
      {feedback === 'done'       && <div className="feedback correct" style={{ display: 'block' }}>✅ Vereinbarung abgeschlossen.</div>}
      {!locked && (
        <div className="actions">
          <button className="btn btn-success" onClick={handleComplete}>Vereinbarung abschließen · 10 Punkte</button>
        </div>
      )}
      {locked && <div style={{ color: 'var(--color-success)', fontWeight: 800, marginTop: '8px', fontSize: 'var(--font-size-sm)' }}>✓ Erledigt</div>}
    </div>
  )
}