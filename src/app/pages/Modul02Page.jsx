// ============================================================
// KI-Führerschein · Modul 02 – KI sinnvoll nutzen
// Modul-4-Stil: Abschnitte werden schrittweise freigeschaltet
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { startModule, updateModuleProgress, passModule } from '../../lib/progress.js'
import { TaskBox, InfoBox, WarningBox, MemoryBox } from '../../components/ui/InfoBox.jsx'
import Badge from '../../components/ui/Badge.jsx'

const MOD       = getModule('modul-02')
const MOD_COLOR = '#087f83'
const MAX_PTS   = 100
const PASS_PTS  = 80
const STORAGE_KEY = 'ki_m02_v2'

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
  return { points: 0, done: {}, correct: 0 }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ points: s.points, done: s.done, correct: s.correct })) } catch {}
}

// ── Kleine Hilfskomponenten ───────────────────────────────────

function QuizBlock({ id, question, options, answer, points, done, allowRetry = true, correctFeedback, wrongFeedback, onCorrect, onWrong }) {
  const [sel, setSel] = useState('')
  const [fb,  setFb]  = useState(null)
  const [locked, setLocked] = useState(done)

  function check() {
    if (!sel) { setFb('empty'); return }
    if (sel === answer) { setLocked(true); setFb('correct'); onCorrect?.(points) }
    else { setFb('wrong'); if (!allowRetry) { setLocked(true); onWrong?.() } }
  }

  return (
    <div>
      <p style={{ fontWeight: 800, marginBottom: 'var(--space-sm)' }}>{question}</p>
      {options.map(opt => (
        <label key={opt.value} className="option" style={{ cursor: locked ? 'default' : 'pointer' }}>
          <input type="radio" name={id} value={opt.value} checked={sel === opt.value}
            onChange={() => !locked && setSel(opt.value)} disabled={locked} />
          {opt.label}
        </label>
      ))}
      {fb === 'empty'   && <div className="feedback wrong" style={{ display: 'block' }}>Bitte wähle eine Antwort aus.</div>}
      {fb === 'correct' && <div className="feedback correct" style={{ display: 'block' }}>✅ {correctFeedback}</div>}
      {fb === 'wrong'   && (
        <div className="feedback wrong" style={{ display: 'block' }}>
          ❌ {wrongFeedback}
          {allowRetry && <div style={{ marginTop: '8px' }}><button className="nav-btn" onClick={() => { setSel(''); setFb(null) }}>↺ Erneut versuchen</button></div>}
        </div>
      )}
      {!locked && fb !== 'correct' && (
        <div className="actions">
          <button className="btn btn-primary" onClick={check} disabled={!sel} style={{ background: MOD_COLOR }}>Prüfen · {points} Punkte</button>
        </div>
      )}
      {locked && <div style={{ color: 'var(--color-success)', fontWeight: 800, fontSize: 'var(--font-size-sm)', marginTop: '8px' }}>✓ Erledigt</div>}
    </div>
  )
}

function TextBlock({ id, label, placeholder, minLength = 20, points, done, onSave }) {
  const [val, setVal] = useState('')
  const [fb,  setFb]  = useState(null)
  const [locked, setLocked] = useState(done)
  const ok = val.trim().length >= minLength

  function save() {
    if (!ok) { setFb('short'); return }
    setLocked(true); setFb('saved'); onSave?.(points)
  }

  return (
    <div>
      <label htmlFor={id} style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>{label}</label>
      <textarea id={id} value={val} onChange={e => setVal(e.target.value)} placeholder={placeholder}
        disabled={locked} rows={4}
        style={{ width: '100%', padding: '12px', border: `2px solid ${ok ? 'var(--color-platform-teal)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)', font: 'inherit', resize: 'vertical', lineHeight: 1.6 }} />
      {!locked && <div style={{ fontSize: 'var(--font-size-xs)', color: ok ? 'var(--color-success)' : 'var(--color-text-muted)', textAlign: 'right', marginTop: '4px', fontWeight: ok ? 800 : 400 }}>{val.trim().length} / {minLength} Zeichen {ok ? '✓' : ''}</div>}
      {fb === 'short' && <div className="feedback wrong" style={{ display: 'block' }}>Bitte formuliere eine ausführlichere Antwort (mindestens {minLength} Zeichen).</div>}
      {fb === 'saved' && <div className="feedback correct" style={{ display: 'block' }}>✅ Gespeichert. Punkte wurden gutgeschrieben.</div>}
      {!locked && <div className="actions"><button className="btn btn-success" onClick={save} disabled={!ok}>Antwort speichern · {points} Punkte</button></div>}
      {locked && <div style={{ color: 'var(--color-success)', fontWeight: 800, fontSize: 'var(--font-size-sm)', marginTop: '8px' }}>✓ Erledigt</div>}
    </div>
  )
}

// ── Hauptkomponente ───────────────────────────────────────────

export default function Modul02Page() {
  const navigate = useNavigate()
  const [state,    setState]    = useState(null)
  const [achieved, setAchieved] = useState(false)

  

  

  function award(id, pts)          { update(id, pts, false) }
  function quizCorrect(id, pts)    { update(id, pts, true)  }
  function quizWrong(id)           { setState(prev => { const next = { ...prev, done: { ...prev.done, [id]: true } }; saveState(next); return next }) }

  function resetModule() {
    if (!confirm('Modul wirklich neu starten?')) return
    localStorage.removeItem(STORAGE_KEY)
    setState({ points: 0, done: {}, correct: 0 })
    setAchieved(false)
  }

  if (!state) return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap"><p style={{ color: 'var(--color-text-muted)' }}>Wird geladen …</p></div>
    </div>
  )

  const { points, done, correct } = state
  const progressPct = Math.min(100, Math.round(points / MAX_PTS * 100))
  const passed      = points >= PASS_PTS

  // Freischaltlogik: Abschnitt N sichtbar wenn Abschnitt N-1 erledigt
  const visible = {
    s1:  true,
    s2:  !!done['intro'],
    s3:  !!done['start'],
    s4:  !!done['experiment'],
    s5:  !!done['q1'],
    s6:  !!done['principles'],
    s7:  !!done['q2'] && !!done['prompt'],
    s8:  !!done['scenarios'],
    s9:  Object.keys(done).filter(k => k.startsWith('q')).length >= 6,
    s10: !!done['rules'],
  }

  const badges = [
    { icon: '🕵️', title: 'Fehlerdetektiv',  description: 'Fehlerexperiment dokumentiert',    unlocked: !!done['experiment'] },
    { icon: '💬', title: 'Prompt-Profi',    description: 'Guten Lernprompt formuliert',       unlocked: !!done['prompt'] },
    { icon: '✅', title: 'Faktenprüfer',    description: 'Mindestens 3 Quizfragen richtig',   unlocked: correct >= 3 },
    { icon: '🏆', title: 'KI-Profi',        description: 'Mindestens 80 Punkte erreicht',     unlocked: points >= PASS_PTS },
  ]

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap">

        {/* Modulkopf */}
        <header className="hero" style={{ background: 'linear-gradient(120deg, #095c6b, #167e8a)' }}>
          <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein Klasse 7 · Modul 2</div>
          <h1 style={{ margin: '8px 0 6px' }}>🧠 KI sinnvoll nutzen</h1>
          <p className="lead" style={{ margin: '4px 0 2px', opacity: 0.9 }}>
            <strong>Leitfrage:</strong> Wie kann KI mir helfen, ohne mein eigenes Denken zu ersetzen?
          </p>
          <p style={{ margin: '4px 0 16px', opacity: 0.75, fontSize: 'var(--font-size-sm)' }}>ca. 45 Minuten · Einzel-, Partner- und Gruppenarbeit</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div className="hero-progress" style={{ flex: 1, minWidth: '160px' }}>
              <div className="hero-progress-bar" style={{ width: `${progressPct}%` }}
                role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} />
            </div>
            <div style={{ fontWeight: 800, color: 'var(--color-gold)', whiteSpace: 'nowrap', fontSize: '0.9rem' }}>
              ⭐ {points} / {MAX_PTS} Punkte
            </div>
          </div>
        </header>

        {/* ── 1: Dein Auftrag ── */}
        <section className="card" id="s02-1">
          <div className="station-counter">Abschnitt 1 von 10</div>
          <h2 style={{ color: MOD_COLOR }}>1. Dein Auftrag</h2>
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
            <MemoryBox>Kernbotschaft:<br />KI kann mich unterstützen. Denken, Prüfen und Entscheiden muss ich selbst.</MemoryBox>
          </div>
          <div className="actions">
            <button className="btn btn-success" disabled={!!done['intro']} onClick={() => award('intro', 5)}>
              {done['intro'] ? '✓ Erledigt' : 'Ziele gelesen ✓ · 5 Punkte'}
            </button>
          </div>
        </section>

        {/* ── 2: Einstieg ── */}
        {visible.s2 && (
          <section className="card" id="s02-2">
            <div className="station-counter">Abschnitt 2 von 10</div>
            <h2 style={{ color: MOD_COLOR }}>2. Einstieg: Ist KI schlauer als du?</h2>
            <TaskBox title="Partnergespräch, 3 Minuten:">Entscheidet euch für „Ja", „Nein" oder „Kommt darauf an". Begründet eure Wahl mit einem Beispiel.</TaskBox>
            <TextBlock id="startReflection" label="Unsere Begründung:" placeholder="Wir denken ..., weil ..."
              minLength={20} points={5} done={!!done['start']} onSave={() => award('start', 5)} />
          </section>
        )}

        {/* ── 3: Experiment ── */}
        {visible.s3 && (
          <section className="card" id="s02-3">
            <div className="station-counter">Abschnitt 3 von 10</div>
            <h2 style={{ color: MOD_COLOR }}>3. Experiment: Die KI als Fehlerquelle</h2>
            <p className="lead">Nutzt die von der Lehrkraft freigegebene KI, zum Beispiel AIS.chat.</p>
            <div style={{ background: '#103d54', color: '#bff5e5', padding: '16px 20px', borderRadius: 'var(--radius-lg)', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 'var(--space-md)' }}>
              Du beantwortest Fragen für Schülerinnen und Schüler der 7. Klasse. Baue in einige Antworten einen sachlichen Fehler ein. Die Fehler sollen glaubwürdig klingen. Verrate zunächst nicht, welche Antworten falsch sind. Wenn wir „Auflösen" schreiben, kennzeichne die Fehler und nenne die korrekten Informationen.
            </div>
            <TaskBox title="Auftrag, 10 Minuten:">
              <ol style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
                <li>Mindestens vier Fragen aus unterschiedlichen Schulfächern stellen.</li>
                <li>Verdächtige Aussagen markieren.</li>
                <li>Mit Schulbuch oder verlässlicher Quelle prüfen.</li>
                <li>Anschließend „Auflösen" schreiben.</li>
              </ol>
            </TaskBox>
            <WarningBox>Gebt keine persönlichen Daten über euch oder andere Menschen ein.</WarningBox>
            <TextBlock id="foundError" label="Beschreibt einen gefundenen Fehler und eure Prüfung:"
              placeholder="Die KI behauptete ... Wir haben geprüft mit ... Richtig ist ..."
              minLength={20} points={15} done={!!done['experiment']} onSave={() => award('experiment', 15)} />
          </section>
        )}

        {/* ── 4: Zwischenquiz ── */}
        {visible.s4 && (
          <section className="card" id="s02-4">
            <div className="station-counter">Abschnitt 4 von 10</div>
            <h2 style={{ color: MOD_COLOR }}>4. Zwischenquiz: Fehlerdetektiv</h2>
            <QuizBlock id="q1" question="Warum können falsche KI-Antworten gefährlich sein?"
              options={[
                { value: '0', label: 'Weil falsche Antworten immer sehr kurz sind.' },
                { value: '1', label: 'Weil sie überzeugend klingen können und deshalb leicht ungeprüft übernommen werden.' },
                { value: '2', label: 'Weil eine KI überhaupt keine richtigen Antworten geben kann.' },
              ]}
              answer="1" points={5} done={!!done['q1']} allowRetry={true}
              correctFeedback="Richtig! Du hast den Grundsatz richtig angewendet."
              wrongFeedback="Noch nicht ganz. KI-Antworten können sehr überzeugend klingen, auch wenn sie falsch sind."
              onCorrect={() => quizCorrect('q1', 5)} onWrong={() => quizWrong('q1')} />
          </section>
        )}

        {/* ── 5: Fünf Grundsätze ── */}
        {visible.s5 && (
          <section className="card" id="s02-5">
            <div className="station-counter">Abschnitt 5 von 10</div>
            <h2 style={{ color: MOD_COLOR }}>5. Fünf Grundsätze</h2>
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
              <button className="btn btn-success" disabled={!!done['principles']} onClick={() => award('principles', 5)}>
                {done['principles'] ? '✓ Erledigt' : 'Grundsätze gelesen ✓ · 5 Punkte'}
              </button>
            </div>
          </section>
        )}

        {/* ── 6: Prompt-Challenge ── */}
        {visible.s6 && (
          <section className="card" id="s02-6">
            <div className="station-counter">Abschnitt 6 von 10</div>
            <h2 style={{ color: MOD_COLOR }}>6. Prompt-Challenge</h2>
            <p className="lead">Welche Anfrage hilft wahrscheinlich besser beim Lernen?</p>
            <QuizBlock id="q2" question="Wähle den besseren Lernprompt:"
              options={[
                { value: '0', label: '„Erkläre Brüche."' },
                { value: '1', label: '„Erkläre das Addieren von Brüchen für Klasse 7 in einfachen Schritten. Nutze ein Beispiel und stelle mir danach zwei Aufgaben ohne Lösung."' },
                { value: '2', label: '„Mach Mathe."' },
              ]}
              answer="1" points={5} done={!!done['q2']} allowRetry={true}
              correctFeedback="Richtig! Die Anfrage nennt Thema, Zielgruppe und gewünschte Form."
              wrongFeedback="Noch nicht ganz. Ein guter Prompt nennt Thema, Ziel, Klassenstufe und gewünschte Form."
              onCorrect={() => quizCorrect('q2', 5)} onWrong={() => quizWrong('q2')} />
            {visible.s6 && (
              <div style={{ marginTop: 'var(--space-md)' }}>
                <TextBlock id="ownPrompt" label="Formuliere nun selbst einen guten Lernprompt:"
                  placeholder="Erkläre ... für Klasse 7 ... Nutze ... Stelle mir danach ..."
                  minLength={20} points={10} done={!!done['prompt']} onSave={() => award('prompt', 10)} />
              </div>
            )}
          </section>
        )}

        {/* ── 7: Situationen ── */}
        {visible.s7 && (
          <section className="card" id="s02-7">
            <div className="station-counter">Abschnitt 7 von 10</div>
            <h2 style={{ color: MOD_COLOR }}>7. Situationen beurteilen</h2>
            <ScenarioTask done={!!done['scenarios']} onComplete={pts => award('scenarios', pts)} />
          </section>
        )}

        {/* ── 8: Abschlusstest ── */}
        {visible.s8 && (
          <section className="card" id="s02-8">
            <div className="station-counter">Abschnitt 8 von 10</div>
            <h2 style={{ color: MOD_COLOR }}>8. Abschlusstest</h2>
            <p className="lead">Vier Fragen – beantworte jede sorgfältig. Falsche Antworten können nicht erneut bewertet werden.</p>
            {[
              { id: 'q3', pts: 5, q: '1. Wer trägt die Verantwortung für eine übernommene KI-Antwort?',
                opts: [{ value: '0', label: 'Die KI' }, { value: '1', label: 'Die Person, die das Ergebnis nutzt' }, { value: '2', label: 'Niemand' }],
                ans: '1', ok: 'Richtig! Wer KI-Ergebnisse nutzt, trägt die Verantwortung.', nok: 'Noch nicht ganz. Wer entscheidet, ob ein KI-Ergebnis verwendet wird?' },
              { id: 'q4', pts: 5, q: '2. Warum können KI-Ergebnisse Vorurteile enthalten?',
                opts: [{ value: '0', label: 'Weil die verarbeiteten Inhalte Fehler und Vorurteile von Menschen enthalten können.' }, { value: '1', label: 'Weil KI grundsätzlich gegen Menschen ist.' }, { value: '2', label: 'Weil jede KI nur eine einzige Antwort kennt.' }],
                ans: '0', ok: 'Richtig! KI lernt aus menschlichen Daten – inklusive deren Fehler.', nok: 'Noch nicht ganz. Denke daran, womit KI trainiert wird.' },
              { id: 'q5', pts: 5, q: '3. Was ist der beste erste Schritt bei einer überraschenden Behauptung?',
                opts: [{ value: '0', label: 'Sofort weiterleiten' }, { value: '1', label: 'Den Text schöner formulieren' }, { value: '2', label: 'Die Behauptung mit einer geeigneten Quelle prüfen' }],
                ans: '2', ok: 'Richtig! Prüfen ist immer der erste Schritt.', nok: 'Noch nicht ganz. Was sollte man tun, bevor man etwas weitergibt?' },
              { id: 'q6', pts: 5, q: '4. Welche Nutzung fördert eigenes Lernen?',
                opts: [{ value: '0', label: 'Lösungen kopieren' }, { value: '1', label: 'Hinweise erhalten, selbst weiterarbeiten und das Ergebnis erklären können' }, { value: '2', label: 'Alle Aufgaben automatisch bearbeiten lassen' }],
                ans: '1', ok: 'Richtig! KI als Lernhilfe, nicht als Ersatz.', nok: 'Noch nicht ganz. Welche Option fördert dein eigenes Denken?' },
            ].map((q, i) => (
              <div key={q.id}>
                {i > 0 && <hr style={{ border: 0, borderTop: '1px solid var(--color-border)', margin: 'var(--space-md) 0' }} />}
                <QuizBlock id={q.id} question={q.q} options={q.opts} answer={q.ans}
                  points={q.pts} done={!!done[q.id]} allowRetry={false}
                  correctFeedback={q.ok} wrongFeedback={q.nok}
                  onCorrect={() => quizCorrect(q.id, q.pts)} onWrong={() => quizWrong(q.id)} />
              </div>
            ))}
          </section>
        )}

        {/* ── 9: KI-Regeln ── */}
        {visible.s9 && (
          <section className="card" id="s02-9">
            <div className="station-counter">Abschnitt 9 von 10</div>
            <h2 style={{ color: MOD_COLOR }}>9. Meine KI-Regeln</h2>
            <RulesTask done={!!done['rules']} onComplete={() => award('rules', 10)} />
          </section>
        )}

        {/* ── 10: Badges & Ergebnis ── */}
        {visible.s10 && (
          <section className="card" id="s02-10">
            <div className="station-counter">Abschnitt 10 von 10</div>
            <h2 style={{ color: MOD_COLOR }}>10. Deine Badges</h2>
            <div className="grid-3" style={{ marginBottom: 'var(--space-lg)' }}>
              {badges.map(b => <Badge key={b.title} {...b} />)}
            </div>
            <div style={{ padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)', background: passed ? 'var(--color-success-light)' : points >= 60 ? 'var(--color-warning-light)' : 'var(--color-error-light)', border: `2px solid ${passed ? 'var(--color-success)' : points >= 60 ? 'var(--color-warning)' : 'var(--color-error)'}` }}>
              {passed ? (
                <>
                  <h3 style={{ margin: '0 0 8px', color: 'var(--color-success)' }}>🏆 Modul erfolgreich abgeschlossen!</h3>
                  <p style={{ margin: 0 }}>Du hast <strong>{points} von {MAX_PTS} Punkten</strong> erreicht.</p>
                  <MemoryBox>KI unterstützt mich. Prüfen, Entscheiden und Verantwortung bleiben bei mir.</MemoryBox>
                </>
              ) : points >= 60 ? (
                <><h3 style={{ margin: '0 0 8px' }}>🟡 Fast geschafft</h3><p style={{ margin: 0 }}>Du hast <strong>{points} von {MAX_PTS} Punkten</strong>. Bearbeite noch offene Aufgaben.</p></>
              ) : (
                <><h3 style={{ margin: '0 0 8px' }}>🔴 Weiterarbeiten</h3><p style={{ margin: 0 }}>Du hast <strong>{points} von {MAX_PTS} Punkten</strong>. Bearbeite die noch offenen Abschnitte.</p></>
              )}
            </div>
            <div className="actions" style={{ marginTop: 'var(--space-md)' }}>
              <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Zur Modulübersicht</button>
              <button className="btn btn-ghost" onClick={resetModule} style={{ fontSize: '0.85rem' }}>↺ Neu starten</button>
            </div>
          </section>
        )}

        {/* Hinweis wenn nächster Abschnitt noch gesperrt */}
        {!visible.s10 && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-lg)', fontSize: 'var(--font-size-sm)' }}>
            ↑ Schließe den aktuellen Abschnitt ab, um weiterzukommen.
          </div>
        )}
      </div>
    </div>
  )
}

// ── Szenarien ─────────────────────────────────────────────────

const SCENARIOS = [
  { id: 's1', text: 'A: Du lässt dir den ersten Rechenschritt erklären und rechnest danach selbst weiter.', correct: 'sinnvoll' },
  { id: 's2', text: 'B: Du reichst eine vollständig von KI erstellte Hausaufgabe unverändert als eigene Arbeit ein.', correct: 'nicht-sinnvoll' },
  { id: 's3', text: 'C: Du sammelst Ideen für ein Referat, prüfst die Informationen und formulierst selbst.', correct: 'sinnvoll' },
  { id: 's4', text: 'D: Du übernimmst eine Antwort, nur weil sie professionell klingt.', correct: 'nicht-sinnvoll' },
]

function ScenarioTask({ done, onComplete }) {
  const [values,   setValues]   = useState({})
  const [feedback, setFeedback] = useState(null)
  const [locked,   setLocked]   = useState(done)
  const allFilled = SCENARIOS.every(s => values[s.id])

  function check() {
    if (!allFilled) { setFeedback('incomplete'); return }
    const correct = SCENARIOS.filter(s => values[s.id] === s.correct).length
    setFeedback({ correct }); setLocked(true)
    onComplete(Math.round(correct * 2.5))
  }

  return (
    <div>
      <p className="lead">Wähle jeweils die passendste Einschätzung. Alle vier Situationen müssen bewertet werden.</p>
      {SCENARIOS.map(s => (
        <div key={s.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 700 }}>{s.text}</p>
          <select value={values[s.id] ?? ''} onChange={e => setValues(v => ({ ...v, [s.id]: e.target.value }))}
            disabled={locked}
            style={{ width: '100%', padding: '10px', border: '2px solid var(--color-border)', borderRadius: 'var(--radius-md)', font: 'inherit', background: 'white' }}>
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
          {feedback.correct} von 4 Situationen richtig beurteilt. {feedback.correct === 4 ? 'Sehr sicher!' : 'Besprecht unklare Fälle noch einmal.'}
        </div>
      )}
      {!locked && <div className="actions"><button className="btn btn-primary" onClick={check} disabled={!allFilled} style={{ background: MOD_COLOR }}>Situationen auswerten · bis 10 Punkte</button></div>}
      {locked && <div style={{ color: 'var(--color-success)', fontWeight: 800, marginTop: '8px', fontSize: 'var(--font-size-sm)' }}>✓ Erledigt</div>}
    </div>
  )
}

// ── KI-Regeln ─────────────────────────────────────────────────

const RULES = [
  'Ich prüfe wichtige Informationen.',
  'Ich nutze KI als Hilfe und nicht als Ersatz für mein Denken.',
  'Ich gebe keine persönlichen Daten ein.',
  'Ich beachte die schulischen Regeln und kennzeichne KI-Nutzung, wenn es verlangt wird.',
]

function RulesTask({ done, onComplete }) {
  const [checked,  setChecked]  = useState({})
  const [ownRule,  setOwnRule]  = useState('')
  const [feedback, setFeedback] = useState(null)
  const [locked,   setLocked]   = useState(done)
  const allChecked = RULES.every((_, i) => checked[i])
  const ownOk      = ownRule.trim().length >= 15

  function complete() {
    if (!allChecked || !ownOk) { setFeedback('incomplete'); return }
    setLocked(true); setFeedback('done'); onComplete()
  }

  return (
    <div>
      <p className="lead">Bestätige alle vier Regeln und formuliere eine eigene persönliche Regel.</p>
      <div style={{ marginBottom: 'var(--space-md)' }}>
        {RULES.map((rule, i) => (
          <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', margin: '10px 0', cursor: locked ? 'default' : 'pointer' }}>
            <input type="checkbox" checked={!!checked[i]} onChange={e => setChecked(c => ({ ...c, [i]: e.target.checked }))}
              disabled={locked} style={{ marginTop: '3px', width: '18px', height: '18px', flexShrink: 0, accentColor: MOD_COLOR }} />
            <span>{rule}</span>
          </label>
        ))}
      </div>
      <label htmlFor="ownRule" style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Meine zusätzliche persönliche Regel (mindestens 15 Zeichen):</label>
      <textarea id="ownRule" value={ownRule} onChange={e => setOwnRule(e.target.value)}
        placeholder="Meine zusätzliche persönliche Regel lautet ..." disabled={locked} rows={3}
        style={{ width: '100%', padding: '10px', border: `2px solid ${ownOk ? MOD_COLOR : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)', font: 'inherit', resize: 'vertical' }} />
      {!locked && <div style={{ fontSize: 'var(--font-size-xs)', color: ownOk ? 'var(--color-success)' : 'var(--color-text-muted)', textAlign: 'right', marginTop: '4px', fontWeight: ownOk ? 800 : 400 }}>{ownRule.trim().length} / 15 Zeichen {ownOk ? '✓' : ''}</div>}
      {feedback === 'incomplete' && <div className="feedback wrong" style={{ display: 'block' }}>Bestätige alle vier Regeln und ergänze eine eigene Regel (mindestens 15 Zeichen).</div>}
      {feedback === 'done'       && <div className="feedback correct" style={{ display: 'block' }}>✅ Vereinbarung abgeschlossen.</div>}
      {!locked && <div className="actions"><button className="btn btn-success" onClick={complete} disabled={!allChecked || !ownOk}>Vereinbarung abschließen · 10 Punkte</button></div>}
      {locked && <div style={{ color: 'var(--color-success)', fontWeight: 800, marginTop: '8px', fontSize: 'var(--font-size-sm)' }}>✓ Erledigt</div>}
    </div>
  )
}