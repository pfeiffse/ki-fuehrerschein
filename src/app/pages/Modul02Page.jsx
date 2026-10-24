// ============================================================
// KI-Führerschein · Modul 02 – KI sinnvoll nutzen
// Referenz: legacy/Modul2.html
// ============================================================

import React, { useEffect, useReducer, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import ModuleNav          from '../../components/layout/ModuleNav.jsx'
import { TaskBox, InfoBox, WarningBox, MemoryBox } from '../../components/ui/InfoBox.jsx'
import Quiz               from '../../components/quiz/Quiz.jsx'
import TextTask           from '../../components/quiz/TextTask.jsx'
import Badge              from '../../components/ui/Badge.jsx'

import {
  loadModuleProgress,
  loadTaskProgress,
  startModule,
  completeModule,
  completeTask,
  saveQuizAnswer,
} from '../../lib/progress.js'

// ── Konstanten ────────────────────────────────────────────────

const MODULE_ID  = 'modul-02'
const MAX_POINTS = 100
const PASS_PCT   = 0.8      // 80 % = bestanden
const COLOR      = 'var(--color-modul-02)'

// ── Reducer ───────────────────────────────────────────────────

const initialState = {
  points:  0,
  done:    {},      // { taskId: true }
  correct: 0,       // Anzahl richtig beantworteter Quizfragen
  loaded:  false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, ...action.payload, loaded: true }
    case 'AWARD':
      if (state.done[action.id]) return state
      return {
        ...state,
        points:  Math.min(MAX_POINTS, state.points + action.pts),
        done:    { ...state.done, [action.id]: true },
      }
    case 'QUIZ_CORRECT':
      if (state.done[action.id]) return state
      return {
        ...state,
        points:  Math.min(MAX_POINTS, state.points + action.pts),
        done:    { ...state.done, [action.id]: true },
        correct: state.correct + 1,
      }
    case 'QUIZ_WRONG':
      if (state.done[action.id]) return state
      return {
        ...state,
        done: { ...state.done, [action.id]: true },
      }
    default:
      return state
  }
}

// ── Hauptkomponente ───────────────────────────────────────────

export default function Modul02Page({ student }) {
  const navigate              = useNavigate()
  const [state, dispatch]     = useReducer(reducer, initialState)

  // Fortschritt laden
  useEffect(() => {
    async function load() {
      await startModule(MODULE_ID)
      const [modProg, taskProg] = await Promise.all([
        loadModuleProgress(MODULE_ID),
        loadTaskProgress(MODULE_ID),
      ])
      const done = {}
      let points  = 0
      let correct = 0
      Object.entries(taskProg).forEach(([taskId, t]) => {
        if (t.status === 'completed' || t.status === 'passed') {
          done[taskId] = true
          points += t.score ?? 0
          if (t.status === 'passed') correct++
        }
      })
      dispatch({ type: 'LOAD', payload: { points, done, correct } })
    }
    load()
  }, [])

  // Fortschritt speichern wenn Punkte sich ändern
  useEffect(() => {
    if (!state.loaded) return
    const passed = state.points >= MAX_POINTS * PASS_PCT
    completeModule(MODULE_ID, state.points, MAX_POINTS)
  }, [state.points, state.loaded])

  // Aufgabe abschließen
  const award = useCallback(async (id, pts) => {
    dispatch({ type: 'AWARD', id, pts })
    await completeTask(MODULE_ID, id, pts)
  }, [])

  // Quiz-Antwort
  const onQuizCorrect = useCallback(async (id, pts) => {
    dispatch({ type: 'QUIZ_CORRECT', id, pts })
    await saveQuizAnswer(MODULE_ID, id, true, pts, 1)
  }, [])

  const onQuizWrong = useCallback(async (id, attempts) => {
    dispatch({ type: 'QUIZ_WRONG', id })
    await saveQuizAnswer(MODULE_ID, id, false, 0, attempts)
  }, [])

  // Fortschritt berechnen
  const progressPct = Math.min(100, Math.round(state.points / MAX_POINTS * 100))
  const passed      = state.points >= MAX_POINTS * PASS_PCT

  // Badges
  const badges = [
    { id: 'badge-detective', icon: '🕵️', title: 'Fehlerdetektiv',  description: 'Fehlerexperiment dokumentiert', unlocked: !!state.done['experiment'] },
    { id: 'badge-prompt',    icon: '💬', title: 'Prompt-Profi',    description: 'Guten Lernprompt formuliert',   unlocked: !!state.done['prompt'] },
    { id: 'badge-checker',   icon: '✅', title: 'Faktenprüfer',    description: 'Mindestens 3 Quizfragen richtig', unlocked: state.correct >= 3 },
    { id: 'badge-master',    icon: '🏆', title: 'KI-Profi',        description: 'Mindestens 80 Punkte erreicht', unlocked: state.points >= 80 },
  ]

  if (!state.loaded) {
    return <div className="wrap"><p>Modul wird geladen …</p></div>
  }

  return (
    <div className="wrap">

      {/* Modulkopf */}
      <header style={{
        background:   'linear-gradient(135deg, #4a2a9e, #1184cf)',
        color:        'white',
        padding:      'clamp(24px, 4vw, 36px)',
        borderRadius: 'var(--radius-xl)',
        boxShadow:    'var(--shadow-lg)',
        marginBottom: 'var(--space-md)',
      }}>
        <span className="pill" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '8px', display: 'inline-block' }}>
          KI-Führerschein Klasse 7 · Modul 2
        </span>
        <h1 style={{ margin: '8px 0 6px', fontSize: 'var(--font-size-2xl)' }}>
          KI sinnvoll nutzen
        </h1>
        <p style={{ margin: '4px 0 2px', opacity: 0.9 }}>
          <strong>Leitfrage:</strong> Wie kann KI mir helfen, ohne mein eigenes Denken zu ersetzen?
        </p>
        <p style={{ margin: 0, opacity: 0.8, fontSize: 'var(--font-size-sm)' }}>
          Bearbeitungszeit: ca. 45 Minuten · Einzel-, Partner- und Gruppenarbeit
        </p>
      </header>

      {/* Sticky Navigation */}
      <ModuleNav
        progressPercent={progressPct}
        score={state.points}
        maxScore={MAX_POINTS}
        moduleColor={COLOR}
        onBack={() => navigate('/dashboard')}
        backLabel="← Zur Übersicht"
        showOverview={false}
      />

      {/* ── Abschnitt 1: Dein Auftrag ── */}
      <section className="card" id="section-goals" aria-labelledby="h-goals">
        <h2 id="h-goals" style={{ color: COLOR }}>1. Dein Auftrag</h2>
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
          <button
            className="btn btn-success"
            disabled={!!state.done['intro']}
            onClick={() => award('intro', 5)}
          >
            {state.done['intro'] ? 'Erledigt ✓' : 'Ziele gelesen ✓ · 5 Punkte'}
          </button>
        </div>
      </section>

      {/* ── Abschnitt 2: Einstieg ── */}
      <section className="card" aria-labelledby="h-start">
        <h2 id="h-start" style={{ color: COLOR }}>2. Einstieg: Ist KI schlauer als du?</h2>
        <TaskBox title="Partnergespräch, 3 Minuten:">
          Entscheidet euch zunächst für „Ja", „Nein" oder „Kommt darauf an".
          Begründet eure Wahl mit einem Beispiel.
        </TaskBox>
        <TextTask
          id="startReflection"
          label="Unsere Begründung:"
          placeholder="Wir denken ..., weil ..."
          minLength={20}
          points={5}
          done={!!state.done['start']}
          onSave={(_, pts) => award('start', pts)}
        />
      </section>

      {/* ── Abschnitt 3: Experiment ── */}
      <section className="card" aria-labelledby="h-experiment">
        <h2 id="h-experiment" style={{ color: COLOR }}>3. Experiment: Die KI als Fehlerquelle</h2>
        <p>
          Nutzt die von der Lehrkraft freigegebene KI, zum Beispiel AIS.chat.
          Eine Person tippt, die andere protokolliert und prüft.
        </p>
        <div style={{
          background:   '#172534',
          color:        'white',
          padding:      '16px',
          borderRadius: 'var(--radius-md)',
          whiteSpace:   'pre-wrap',
          fontFamily:   'monospace',
          fontSize:     '0.9rem',
          marginBottom: 'var(--space-md)',
        }}>
{`Du beantwortest Fragen für Schülerinnen und Schüler der 7. Klasse. Baue in einige Antworten einen sachlichen Fehler ein. Die Fehler sollen glaubwürdig klingen. Verrate zunächst nicht, welche Antworten falsch sind. Wenn wir „Auflösen" schreiben, kennzeichne die Fehler und nenne die korrekten Informationen.`}
        </div>
        <TaskBox title="Auftrag, 10 Minuten:">
          <ol style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
            <li>Stellt mindestens vier Fragen aus unterschiedlichen Schulfächern.</li>
            <li>Markiert verdächtige Aussagen.</li>
            <li>Prüft sie mit Schulbuch, Unterrichtsmaterial oder einer verlässlichen Quelle.</li>
            <li>Schreibt anschließend „Auflösen".</li>
          </ol>
        </TaskBox>
        <WarningBox>
          Gebt keine persönlichen Daten über euch oder andere Menschen ein.
        </WarningBox>
        <TextTask
          id="foundError"
          label="Beschreibt einen gefundenen Fehler und eure Prüfung:"
          placeholder="Die KI behauptete ... Wir haben geprüft mit ... Richtig ist ..."
          minLength={20}
          points={15}
          done={!!state.done['experiment']}
          onSave={(_, pts) => award('experiment', pts)}
        />
      </section>

      {/* ── Abschnitt 4: Zwischenquiz ── */}
      <section className="card" aria-labelledby="h-q1">
        <h2 id="h-q1" style={{ color: COLOR }}>4. Zwischenquiz: Fehlerdetektiv</h2>
        <Quiz
          id="q1"
          question="Warum können falsche KI-Antworten gefährlich sein?"
          options={[
            { value: '0', label: 'Weil falsche Antworten immer sehr kurz sind.' },
            { value: '1', label: 'Weil sie überzeugend klingen können und deshalb leicht ungeprüft übernommen werden.' },
            { value: '2', label: 'Weil eine KI überhaupt keine richtigen Antworten geben kann.' },
          ]}
          answer="1"
          points={5}
          done={!!state.done['q1']}
          allowRetry={true}
          correctFeedback="Richtig! Du hast den Grundsatz richtig angewendet."
          wrongFeedback="Noch nicht ganz. Denke daran: KI-Antworten können sehr überzeugend klingen, auch wenn sie falsch sind."
          onCorrect={(pts) => onQuizCorrect('q1', pts)}
          onAttempt={(correct, attempts) => { if (!correct) onQuizWrong('q1', attempts) }}
        />
      </section>

      {/* ── Abschnitt 5: Fünf Grundsätze ── */}
      <section className="card" aria-labelledby="h-principles">
        <h2 id="h-principles" style={{ color: COLOR }}>5. Fünf Grundsätze</h2>
        <div className="grid-2">
          {[
            { title: '1. Werkzeug',       text: 'KI unterstützt dich. Sie übernimmt weder dein Denken noch deine Verantwortung.' },
            { title: '2. Prüfen',         text: 'Klingt richtig bedeutet nicht automatisch: ist richtig.' },
            { title: '3. Lernen',         text: 'Nutze KI zum Erklären, Üben und Verbessern, nicht zum bloßen Abschreiben.' },
            { title: '4. Genau fragen',   text: 'Nenne Thema, Ziel, Klassenstufe und gewünschte Form.' },
            { title: '5. Kritisch bleiben', text: 'KI-Ergebnisse können einseitig, unfair oder unvollständig sein.' },
          ].map(g => (
            <InfoBox key={g.title} title={g.title}>{g.text}</InfoBox>
          ))}
        </div>
        <div className="actions">
          <button
            className="btn btn-success"
            disabled={!!state.done['principles']}
            onClick={() => award('principles', 5)}
          >
            {state.done['principles'] ? 'Erledigt ✓' : 'Grundsätze gelesen ✓ · 5 Punkte'}
          </button>
        </div>
      </section>

      {/* ── Abschnitt 6: Prompt-Challenge ── */}
      <section className="card" aria-labelledby="h-prompt">
        <h2 id="h-prompt" style={{ color: COLOR }}>6. Prompt-Challenge</h2>
        <p>Welche Anfrage hilft wahrscheinlich besser beim Lernen?</p>
        <Quiz
          id="q2"
          question="Wähle den besseren Lernprompt:"
          options={[
            { value: '0', label: '„Erkläre Brüche."' },
            { value: '1', label: '„Erkläre das Addieren von Brüchen für Klasse 7 in einfachen Schritten. Nutze ein Beispiel und stelle mir danach zwei Aufgaben ohne Lösung."' },
            { value: '2', label: '„Mach Mathe."' },
          ]}
          answer="1"
          points={5}
          done={!!state.done['q2']}
          allowRetry={true}
          correctFeedback="Richtig! Die Anfrage nennt Thema, Zielgruppe und gewünschte Form."
          wrongFeedback="Noch nicht ganz. Ein guter Prompt nennt Thema, Ziel, Klassenstufe und gewünschte Form."
          onCorrect={(pts) => onQuizCorrect('q2', pts)}
          onAttempt={(correct, attempts) => { if (!correct) onQuizWrong('q2', attempts) }}
        />
        <div style={{ marginTop: 'var(--space-md)' }}>
          <TextTask
            id="ownPrompt"
            label="Formuliere nun selbst einen guten Lernprompt:"
            placeholder="Erkläre ... für Klasse 7 ... Nutze ... Stelle mir danach ..."
            minLength={20}
            points={10}
            done={!!state.done['prompt']}
            onSave={(_, pts) => award('prompt', pts)}
          />
        </div>
      </section>

      {/* ── Abschnitt 7: Situationen beurteilen ── */}
      <section className="card" aria-labelledby="h-scenarios">
        <h2 id="h-scenarios" style={{ color: COLOR }}>7. Situationen beurteilen</h2>
        <ScenarioTask
          done={!!state.done['scenarios']}
          onComplete={(pts) => award('scenarios', pts)}
          onCorrect={() => dispatch({ type: 'QUIZ_CORRECT', id: '_scenario_bonus', pts: 0 })}
        />
      </section>

      {/* ── Abschnitt 8: Abschlusstest ── */}
      <section className="card" aria-labelledby="h-final">
        <h2 id="h-final" style={{ color: COLOR }}>8. Abschlusstest</h2>
        {[
          {
            id: 'q3', pts: 5,
            question: '1. Wer trägt die Verantwortung für eine übernommene KI-Antwort?',
            options: [
              { value: '0', label: 'Die KI' },
              { value: '1', label: 'Die Person, die das Ergebnis nutzt' },
              { value: '2', label: 'Niemand' },
            ],
            answer: '1',
            correctFeedback: 'Richtig! Wer KI-Ergebnisse nutzt, trägt die Verantwortung dafür.',
            wrongFeedback: 'Noch nicht ganz. Überlege: Wer entscheidet, ob ein KI-Ergebnis verwendet wird?',
          },
          {
            id: 'q4', pts: 5,
            question: '2. Warum können KI-Ergebnisse Vorurteile enthalten?',
            options: [
              { value: '0', label: 'Weil die verarbeiteten Inhalte Fehler und Vorurteile von Menschen enthalten können.' },
              { value: '1', label: 'Weil KI grundsätzlich gegen Menschen ist.' },
              { value: '2', label: 'Weil jede KI nur eine einzige Antwort kennt.' },
            ],
            answer: '0',
            correctFeedback: 'Richtig! KI lernt aus menschlichen Daten – inklusive deren Fehler und Vorurteile.',
            wrongFeedback: 'Noch nicht ganz. Denke daran, womit KI trainiert wird.',
          },
          {
            id: 'q5', pts: 5,
            question: '3. Was ist der beste erste Schritt bei einer überraschenden Behauptung?',
            options: [
              { value: '0', label: 'Sofort weiterleiten' },
              { value: '1', label: 'Den Text schöner formulieren' },
              { value: '2', label: 'Die Behauptung mit einer geeigneten Quelle prüfen' },
            ],
            answer: '2',
            correctFeedback: 'Richtig! Prüfen ist immer der erste Schritt.',
            wrongFeedback: 'Noch nicht ganz. Was sollte man tun, bevor man etwas weitergibt?',
          },
          {
            id: 'q6', pts: 5,
            question: '4. Welche Nutzung fördert eigenes Lernen?',
            options: [
              { value: '0', label: 'Lösungen kopieren' },
              { value: '1', label: 'Hinweise erhalten, selbst weiterarbeiten und das Ergebnis erklären können' },
              { value: '2', label: 'Alle Aufgaben automatisch bearbeiten lassen' },
            ],
            answer: '1',
            correctFeedback: 'Richtig! KI als Lernhilfe, nicht als Ersatz.',
            wrongFeedback: 'Noch nicht ganz. Welche Option fördert dein eigenes Denken?',
          },
        ].map((q, i) => (
          <div key={q.id}>
            {i > 0 && <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: 'var(--space-md) 0' }} />}
            <Quiz
              id={q.id}
              question={q.question}
              options={q.options}
              answer={q.answer}
              points={q.pts}
              done={!!state.done[q.id]}
              allowRetry={true}
              correctFeedback={q.correctFeedback}
              wrongFeedback={q.wrongFeedback}
              onCorrect={(pts) => onQuizCorrect(q.id, pts)}
              onAttempt={(correct, attempts) => { if (!correct) onQuizWrong(q.id, attempts) }}
            />
          </div>
        ))}
      </section>

      {/* ── Abschnitt 9: Meine KI-Regeln ── */}
      <section className="card" aria-labelledby="h-rules">
        <h2 id="h-rules" style={{ color: COLOR }}>9. Meine KI-Regeln</h2>
        <RulesTask
          done={!!state.done['rules']}
          onComplete={(pts) => award('rules', pts)}
        />
      </section>

      {/* ── Abschnitt 10: Badges & Gesamtauswertung ── */}
      <section className="card" aria-labelledby="h-badges">
        <h2 id="h-badges" style={{ color: COLOR }}>10. Deine Badges</h2>
        <div className="grid-3" style={{ marginBottom: 'var(--space-lg)' }}>
          {badges.map(b => (
            <Badge key={b.id} icon={b.icon} title={b.title} description={b.description} unlocked={b.unlocked} />
          ))}
        </div>

        {/* Gesamtergebnis */}
        <div style={{
          padding:      'var(--space-lg)',
          borderRadius: 'var(--radius-lg)',
          background:   passed ? 'var(--color-success-light)' : state.points >= 60 ? 'var(--color-warning-light)' : 'var(--color-error-light)',
          border:       `2px solid ${passed ? 'var(--color-success)' : state.points >= 60 ? 'var(--color-warning)' : 'var(--color-error)'}`,
          marginTop:    'var(--space-md)',
        }}>
          {passed ? (
            <>
              <h3 style={{ margin: '0 0 8px', color: 'var(--color-success)' }}>🏆 Modul erfolgreich abgeschlossen</h3>
              <p style={{ margin: 0 }}>
                Du hast <strong>{state.points} von {MAX_POINTS} Punkten</strong> erreicht und den Badge „KI-Profi" freigeschaltet.
              </p>
              <MemoryBox>KI unterstützt mich. Prüfen, Entscheiden und Verantwortung bleiben bei mir.</MemoryBox>
            </>
          ) : state.points >= 60 ? (
            <>
              <h3 style={{ margin: '0 0 8px' }}>🟡 Fast geschafft</h3>
              <p style={{ margin: 0 }}>
                Du hast <strong>{state.points} von {MAX_POINTS} Punkten</strong>.
                Bearbeite noch offene Aufgaben, bis du 80 Punkte erreichst.
              </p>
            </>
          ) : (
            <>
              <h3 style={{ margin: '0 0 8px' }}>🔴 Weiterarbeiten</h3>
              <p style={{ margin: 0 }}>
                Du hast <strong>{state.points} von {MAX_POINTS} Punkten</strong>.
                Bearbeite die noch offenen Abschnitte und lies die Grundsätze erneut.
              </p>
            </>
          )}
        </div>

        <div className="actions" style={{ marginTop: 'var(--space-md)' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
            ← Zur Modulübersicht
          </button>
        </div>
      </section>
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

function ScenarioTask({ done, onComplete, onCorrect }) {
  const [values,   setValues]   = React.useState({})
  const [feedback, setFeedback] = React.useState(null)
  const [locked,   setLocked]   = React.useState(done)

  function handleCheck() {
    const allFilled = SCENARIOS.every(s => values[s.id])
    if (!allFilled) { setFeedback('incomplete'); return }

    const correctCount = SCENARIOS.filter(s => values[s.id] === s.correct).length
    const pts = Math.round(correctCount * 2.5)
    setFeedback({ correctCount, pts })
    setLocked(true)
    onComplete(pts)
    if (correctCount >= 3) onCorrect()
  }

  return (
    <div>
      <p>Wähle jeweils die passendste Einschätzung.</p>
      {SCENARIOS.map(s => (
        <div key={s.id} style={{
          border:       '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding:      'var(--space-md)',
          marginBottom: 'var(--space-sm)',
        }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600 }}>{s.text}</p>
          <select
            value={values[s.id] ?? ''}
            onChange={e => setValues(v => ({ ...v, [s.id]: e.target.value }))}
            disabled={locked}
            style={{
              width:        '100%',
              padding:      '10px',
              border:       '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              font:         'inherit',
            }}
            aria-label={`Einschätzung für Situation ${s.id}`}
          >
            <option value="">Bitte wählen</option>
            <option value="sinnvoll">Sinnvoll</option>
            <option value="teilweise">Teilweise sinnvoll</option>
            <option value="nicht-sinnvoll">Nicht sinnvoll</option>
          </select>
        </div>
      ))}

      {feedback === 'incomplete' && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          Bitte beurteile alle vier Situationen.
        </div>
      )}
      {feedback && feedback !== 'incomplete' && (
        <div className={`feedback ${feedback.correctCount >= 3 ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
          {feedback.correctCount} von 4 Situationen richtig beurteilt.{' '}
          {feedback.correctCount === 4 ? 'Sehr sicher!' : 'Besprecht unklare Fälle noch einmal.'}
        </div>
      )}

      {!locked && (
        <div className="actions">
          <button className="btn btn-primary" onClick={handleCheck}>
            Situationen auswerten · bis 10 Punkte
          </button>
        </div>
      )}
      {locked && <div style={{ color: 'var(--color-success)', fontWeight: 700, marginTop: '8px', fontSize: 'var(--font-size-sm)' }}>✓ Erledigt</div>}
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
    const allChecked = RULES.every((_, i) => checked[i])
    if (!allChecked || ownRule.trim().length < 15) {
      setFeedback('incomplete')
      return
    }
    setLocked(true)
    setFeedback('done')
    onComplete(10)
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        {RULES.map((rule, i) => (
          <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '10px 0', cursor: locked ? 'default' : 'pointer' }}>
            <input
              type="checkbox"
              checked={!!checked[i]}
              onChange={e => setChecked(c => ({ ...c, [i]: e.target.checked }))}
              disabled={locked}
              style={{ marginTop: '3px', width: '18px', height: '18px', flexShrink: 0 }}
            />
            <span>{rule}</span>
          </label>
        ))}
      </div>

      <label htmlFor="ownRule" style={{ fontWeight: 700, display: 'block', marginBottom: '6px' }}>
        Meine zusätzliche persönliche Regel:
      </label>
      <textarea
        id="ownRule"
        value={ownRule}
        onChange={e => setOwnRule(e.target.value)}
        placeholder="Meine zusätzliche persönliche Regel lautet ..."
        disabled={locked}
        rows={3}
        style={{
          width:        '100%',
          padding:      '10px',
          border:       '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          font:         'inherit',
          resize:       'vertical',
        }}
      />

      {feedback === 'incomplete' && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          Bestätige alle vier Regeln und ergänze eine eigene Regel (mindestens 15 Zeichen).
        </div>
      )}
      {feedback === 'done' && (
        <div className="feedback correct" style={{ display: 'block' }}>
          ✅ Vereinbarung abgeschlossen.
        </div>
      )}

      {!locked && (
        <div className="actions">
          <button className="btn btn-success" onClick={handleComplete}>
            Vereinbarung abschließen · 10 Punkte
          </button>
        </div>
      )}
      {locked && <div style={{ color: 'var(--color-success)', fontWeight: 700, marginTop: '8px', fontSize: 'var(--font-size-sm)' }}>✓ Erledigt</div>}
    </div>
  )
}