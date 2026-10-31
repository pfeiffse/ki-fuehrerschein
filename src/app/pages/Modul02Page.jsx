// Modul 02 - Mission KI-Check (9 Missionen, Gamification)
// Basiert auf: Modul_2_Mission_KI_Check.md

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { startModuleLocal, passModule } from '../../lib/progress.js'

const MOD = getModule('modul-02')
const MOD_COLOR = '#087f83'
const STORAGE_KEY = 'ki_m02_v3'

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
  return { mission: 1, done: {}, vertrauen1: 50, vertrauen2: 50, fallakte: {}, ownRule: '', werkzeuge: [] }
}
function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {} }

// Achievement-Overlay
function AchievementPopup({ ach, onClose }) {
  if (!ach) return null
  return (
    <div className="achievement-overlay" onClick={onClose}>
      <div className="achievement-popup" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>{ach.icon}</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Achievement freigeschaltet!</div>
        <h2 style={{ margin: '0 0 0.5rem', color: '#fbbf24' }}>{ach.title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1.25rem' }}>{ach.desc}</p>
        <button className="btn btn-xp" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }} autoFocus>Weiter →</button>
      </div>
    </div>
  )
}

// Missions-Header
function MissionHeader({ number, total, title, icon, sozial, time, isBoss }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: 'var(--sp-lg)', flexWrap: 'wrap' }}>
      <div className="mission-number">{number}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.375rem', alignItems: 'center' }}>
          {isBoss && <span className="boss-indicator">👾 Boss-Level</span>}
          <span style={{ background: 'var(--c-pale2)', borderRadius: '99px', padding: '0.125rem 0.625rem', fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--c-muted)' }}>{sozial} · ca. {time} Min.</span>
          <span style={{ background: 'var(--c-pale2)', borderRadius: '99px', padding: '0.125rem 0.625rem', fontSize: 'var(--fs-xs)', fontWeight: 700, color: 'var(--c-muted)' }}>Mission {number}/{total}</span>
        </div>
        <h2 style={{ margin: 0, color: MOD_COLOR }}>{icon} {title}</h2>
      </div>
    </div>
  )
}

export default function Modul02Page() {
  const navigate = useNavigate()
  const [state,    setState]    = useState(loadState)
  const [achieved, setAchieved] = useState(() => hasAchievement(MOD.id))
  const [showAch,  setShowAch]  = useState(null)

  useEffect(() => { startModuleLocal(MOD.id) }, [])

  function update(updates) {
    setState(prev => {
      const next = { ...prev, ...updates }
      saveState(next)
      return next
    })
  }

  function markDone(id, extra = {}) {
    update({ done: { ...state.done, [id]: true }, ...extra })
  }

  function goMission(n) {
    update({ mission: n })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function unlockAchievement(ach) {
    setShowAch(ach)
    if (ach.moduleId) {
      saveAchievementLocal(ach.moduleId)
      setAchieved(true)
      passModule(MOD.id, 100, 100)
    }
  }

  const { mission, done, vertrauen1, vertrauen2, fallakte, ownRule, werkzeuge } = state
  const totalMissions = 9
  const completedCount = Object.keys(done).filter(k => k.startsWith('m')).length
  const progress = Math.round((completedCount / totalMissions) * 100)

  return (
    <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh' }}>
      <AchievementPopup ach={showAch} onClose={() => setShowAch(null)} />

      <div className="wrap">
        {/* Modul-Header */}
        <div className="mission-header" style={{ marginBottom: 'var(--sp-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>KI-Führerschein · Modul 2</div>
              <h1 style={{ margin: '0 0 0.375rem', color: 'white' }}>🕵️ Mission KI-Check</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Fehler erkennen · Prompts · Verantwortung</p>
            </div>
            <div className="xp-badge">⭐ +{MOD.xp} XP</div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.6)' }}>
              <span>Missionen abgeschlossen</span><span>{completedCount}/{totalMissions}</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        {/* Missions-Navigation */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: 'var(--sp-lg)' }}>
          {Array.from({ length: totalMissions }, (_, i) => i + 1).map(n => (
            <button key={n} className={`nav-btn ${mission === n ? 'active' : ''}`}
              onClick={() => goMission(n)}
              style={{ fontSize: '0.7rem', padding: '0.375rem 0.625rem', minHeight: '2rem',
                background: done['m' + n] ? 'rgba(22,163,74,0.2)' : mission === n ? 'var(--c-xp)' : 'rgba(255,255,255,0.08)',
                border: done['m' + n] ? '1px solid rgba(22,163,74,0.5)' : '1px solid rgba(255,255,255,0.15)',
                color: done['m' + n] ? '#4ade80' : 'white' }}>
              {done['m' + n] ? '✓' : n}
            </button>
          ))}
        </div>

        {/* ── Mission 1: Lagecheck ── */}
        {mission === 1 && (
          <div className="card">
            <MissionHeader number={1} total={9} title="Lagecheck: Was kann KI?" icon="🔎" sozial="👥 Partnerarbeit" time="4" />
            <div className="box-task">
              <strong>Partnerarbeit, ca. 4 Min.:</strong>
              <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
                <li>Entscheidet: Ist KI schlauer als du?</li>
                <li>Begründet eure Einschätzung mit einem Beispiel.</li>
              </ol>
            </div>
            <div className="box-hint">💡 Deine Antwort wird gespeichert und im Finale (Mission 9) wieder aufgegriffen!</div>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.375rem' }}>Unsere Einschätzung und Begründung:</label>
            <textarea value={fallakte.m1 || ''} onChange={e => update({ fallakte: { ...fallakte, m1: e.target.value } })}
              placeholder="Wir denken, KI ist ... weil ..."
              rows={4} disabled={!!done['m1']}
              style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--c-border)', borderRadius: 'var(--r-md)', font: 'inherit', resize: 'vertical' }} />
            {!done['m1'] ? (
              <div className="actions">
                <button className="btn btn-xp" disabled={(fallakte.m1 || '').trim().length < 15}
                  onClick={() => { markDone('m1'); goMission(2) }}>
                  Antwort speichern · Weiter zu Mission 2 →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'var(--sp-md)', flexWrap: 'wrap' }}>
                <div className="done-badge">✓ Mission 1 abgeschlossen</div>
                <button className="btn btn-primary" onClick={() => goMission(2)} style={{ background: MOD_COLOR }}>Weiter →</button>
              </div>
            )}
          </div>
        )}

        {/* ── Mission 2: Vertrauensmesser ── */}
        {mission === 2 && (
          <div className="card">
            <MissionHeader number={2} total={9} title="Vertrauensmesser" icon="🤔" sozial="👤 Einzelarbeit" time="3" />
            <p className="lead">Wie stark würdest du einer flüssig formulierten KI-Antwort mit konkreten Zahlen zunächst vertrauen?</p>
            <div className="box-hint">💡 Du wirst am Ende (Mission 9) sehen, ob sich deine Einschätzung verändert hat!</div>
            <div style={{ margin: 'var(--sp-lg) 0', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: MOD_COLOR, marginBottom: '0.5rem' }}>{vertrauen1}%</div>
              <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-muted)', marginBottom: '1rem' }}>
                {vertrauen1 < 30 ? '😤 Sehr skeptisch' : vertrauen1 < 50 ? '🤨 Eher skeptisch' : vertrauen1 < 70 ? '🤔 Neutral' : vertrauen1 < 85 ? '😊 Eher vertrauend' : '😍 Sehr vertrauend'}
              </div>
              <input type="range" min="0" max="100" value={vertrauen1}
                onChange={e => update({ vertrauen1: Number(e.target.value) })}
                disabled={!!done['m2']}
                style={{ width: '100%', accentColor: MOD_COLOR }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', marginTop: '0.25rem' }}>
                <span>0% – Kein Vertrauen</span><span>100% – Volles Vertrauen</span>
              </div>
            </div>
            {!done['m2'] ? (
              <div className="actions">
                <button className="btn btn-xp" onClick={() => { markDone('m2'); goMission(3) }}>Einschätzung speichern · Weiter →</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'var(--sp-md)', flexWrap: 'wrap' }}>
                <div className="done-badge">✓ Gespeichert: {vertrauen1}%</div>
                <button className="btn btn-primary" onClick={() => goMission(3)} style={{ background: MOD_COLOR }}>Weiter →</button>
              </div>
            )}
          </div>
        )}

        {/* ── Mission 3: Fehlerjagd ── */}
        {mission === 3 && (
          <div className="card">
            <MissionHeader number={3} total={9} title="Fehlerjagd mit AIS.chat" icon="🕵️" sozial="👥 Partnerarbeit" time="10" />
            <div className="box-task">
              <strong>Ablauf:</strong>
              <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', lineHeight: 2 }}>
                <li><a href="https://app.ais-chat.schule/ua/learning-scenarios/af365a43-8c6a-4910-b625-fea355c3f094/dialog?inviteCode=94CFXBF2" target="_blank" rel="noopener" style={{ color: MOD_COLOR, fontWeight: 700 }}>AIS.chat-Lernszenario öffnen ↗</a></li>
                <li>Vier Fragen aus unterschiedlichen Schulfächern stellen.</li>
                <li>Einen Verdacht festlegen.</li>
                <li>Aussage mit Schulbuch oder verlässlicher Quelle prüfen.</li>
                <li>„Auflösen" schreiben.</li>
              </ol>
            </div>
            <div className="box-warning"><strong>Datenschutz:</strong> Keine persönlichen Daten über sich selbst oder andere eingeben.</div>

            <h3 style={{ color: MOD_COLOR }}>📋 Fallakte #001</h3>
            {[
              { key: 'aussage', label: 'Welche Aussage macht euch misstrauisch?', placeholder: 'Die KI behauptete ...' },
              { key: 'pruefung', label: 'Womit habt ihr sie geprüft?', placeholder: 'Wir haben geprüft mit ...' },
              { key: 'ergebnis', label: 'Was ist nach der Prüfung richtig?', placeholder: 'Richtig ist ...' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: '0.75rem' }}>
                <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.25rem', fontSize: 'var(--fs-sm)' }}>{f.label}</label>
                <textarea value={fallakte[f.key] || ''} onChange={e => update({ fallakte: { ...fallakte, [f.key]: e.target.value } })}
                  placeholder={f.placeholder} rows={2} disabled={!!done['m3']}
                  style={{ width: '100%', padding: '0.625rem', border: '2px solid var(--c-border)', borderRadius: 'var(--r-md)', font: 'inherit', resize: 'vertical' }} />
              </div>
            ))}
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.25rem', fontSize: 'var(--fs-sm)' }}>Ergebnis:</label>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['KI hatte recht', 'KI lag falsch'].map(v => (
                  <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: done['m3'] ? 'default' : 'pointer', fontWeight: 700 }}>
                    <input type="radio" name="m3result" value={v} checked={fallakte.result === v}
                      onChange={() => update({ fallakte: { ...fallakte, result: v } })} disabled={!!done['m3']}
                      style={{ accentColor: MOD_COLOR, width: '1.125rem', height: '1.125rem' }} />
                    {v}
                  </label>
                ))}
              </div>
            </div>
            {!done['m3'] ? (
              <div className="actions">
                <button className="btn btn-xp"
                  disabled={!(fallakte.aussage?.trim().length > 10 && fallakte.pruefung?.trim().length > 10 && fallakte.ergebnis?.trim().length > 10 && fallakte.result)}
                  onClick={() => { markDone('m3'); unlockAchievement({ icon: '🕵️', title: 'Fehlerdetektiv', desc: 'Du hast eine KI-Antwort kritisch geprüft!' }); goMission(4) }}>
                  Fallakte abschließen · Achievement freischalten 🕵️
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'var(--sp-md)', flexWrap: 'wrap' }}>
                <div className="done-badge">✓ Fallakte #001 abgeschlossen</div>
                <button className="btn btn-primary" onClick={() => goMission(4)} style={{ background: MOD_COLOR }}>Weiter →</button>
              </div>
            )}
          </div>
        )}

        {/* ── Mission 4: Wahr oder überzeugend? ── */}
        {mission === 4 && (
          <div className="card">
            <MissionHeader number={4} total={9} title="Wahr oder nur überzeugend?" icon="🧠" sozial="👤 Einzelarbeit" time="4" />
            <p className="lead">Unterscheide überzeugende Formulierungen von überprüfbaren Aussagen.</p>
            <M4Quiz done={!!done['m4']} onComplete={() => { markDone('m4'); goMission(5) }} />
          </div>
        )}

        {/* ── Mission 5: KI-Werkzeugkasten ── */}
        {mission === 5 && (
          <div className="card">
            <MissionHeader number={5} total={9} title="KI-Werkzeugkasten" icon="🧰" sozial="👤 Einzelarbeit" time="4" />
            <p className="lead">Fünf Werkzeuge für den verantwortungsvollen Umgang mit KI. Lies jedes Werkzeug und schalte es frei!</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: 'var(--sp-lg)' }}>
              {[
                { id: 'w1', icon: '🧠', title: 'Selbst denken',    text: 'KI unterstützt dich. Sie übernimmt weder dein Denken noch deine Verantwortung.' },
                { id: 'w2', icon: '🔎', title: 'Prüfen',           text: 'Klingt richtig bedeutet nicht automatisch: ist richtig.' },
                { id: 'w3', icon: '🎓', title: 'Lernen',           text: 'Nutze KI zum Erklären, Üben und Verbessern, nicht zum bloßen Abschreiben.' },
                { id: 'w4', icon: '💬', title: 'Genau fragen',     text: 'Nenne Thema, Ziel, Klassenstufe und gewünschte Form.' },
                { id: 'w5', icon: '🛡️', title: 'Kritisch bleiben', text: 'KI-Ergebnisse können einseitig, unfair oder unvollständig sein.' },
              ].map(w => {
                const unlocked = werkzeuge.includes(w.id)
                return (
                  <div key={w.id} style={{ background: unlocked ? 'var(--c-success-bg)' : 'var(--c-pale2)', border: `2px solid ${unlocked ? 'var(--c-success)' : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', display: 'flex', alignItems: 'center', gap: '0.875rem', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: '1.75rem', flexShrink: 0 }}>{w.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, color: unlocked ? 'var(--c-success)' : 'var(--c-dark)' }}>{w.title}</div>
                      <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--c-muted)' }}>{w.text}</div>
                    </div>
                    {!unlocked && !done['m5'] && (
                      <button className="btn btn-primary" onClick={() => update({ werkzeuge: [...werkzeuge, w.id] })} style={{ background: MOD_COLOR, fontSize: 'var(--fs-xs)', padding: '0.375rem 0.75rem', minHeight: '2rem' }}>
                        Freischalten
                      </button>
                    )}
                    {unlocked && <span style={{ color: 'var(--c-success)', fontWeight: 900, fontSize: '1.25rem' }}>✓</span>}
                  </div>
                )
              })}
            </div>
            {!done['m5'] ? (
              <div className="actions">
                <button className="btn btn-xp" disabled={werkzeuge.length < 5}
                  onClick={() => { markDone('m5'); goMission(6) }}>
                  Alle Werkzeuge freigeschaltet · Weiter →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div className="done-badge">✓ Werkzeugkasten komplett</div>
                <button className="btn btn-primary" onClick={() => goMission(6)} style={{ background: MOD_COLOR }}>Weiter →</button>
              </div>
            )}
          </div>
        )}

        {/* ── Mission 6: Prompt-Labor ── */}
        {mission === 6 && (
          <div className="card">
            <MissionHeader number={6} total={9} title="Prompt-Labor" icon="💬" sozial="👤 Einzelarbeit" time="5" />
            <p className="lead">Aus dem schwachen Prompt „Erkläre Brüche." wird über Bausteine ein starker Lernprompt.</p>
            <M6PromptLab done={!!done['m6']} savedPrompt={fallakte.prompt || ''}
              onComplete={(prompt) => { markDone('m6'); update({ fallakte: { ...fallakte, prompt } }); unlockAchievement({ icon: '💬', title: 'Prompt-Profi', desc: 'Du hast einen starken Lernprompt formuliert!' }); goMission(7) }} />
          </div>
        )}

        {/* ── Mission 7: KI oder selber machen? ── */}
        {mission === 7 && (
          <div className="card">
            <MissionHeader number={7} total={9} title="KI oder selber machen?" icon="⚖️" sozial="👥👥 Gruppenarbeit" time="7" />
            <p className="lead">Vier schulische Situationen gemeinsam beurteilen. Nicht „KI gut oder schlecht", sondern: Unterstützt KI das Lernen oder ersetzt sie eigenes Denken?</p>
            <M7Scenarios done={!!done['m7']} onComplete={() => { markDone('m7'); goMission(8) }} />
          </div>
        )}

        {/* ── Mission 8: Boss-Level ── */}
        {mission === 8 && (
          <div className="card">
            <MissionHeader number={8} total={9} title="Boss-Level: Die perfekte KI-Antwort?" icon="👾" sozial="👥 Partnerarbeit" time="7" isBoss />
            <p className="lead">Eine überzeugend formulierte KI-Antwort enthält korrekte Aussagen, eine problematische Schlussfolgerung und eine Behauptung, die zum ungeprüften Übernehmen auffordert.</p>
            <M8BossLevel done={!!done['m8']}
              onComplete={() => { markDone('m8'); unlockAchievement({ icon: '✅', title: 'Faktenprüfer', desc: 'Du hast den Boss-Level gemeistert!' }); goMission(9) }} />
          </div>
        )}

        {/* ── Mission 9: Finale ── */}
        {mission === 9 && (
          <div className="card">
            <MissionHeader number={9} total={9} title="Finale: Dein KI-Kompass" icon="🏁" sozial="👤 Einzelarbeit" time="4" />
            <M9Finale done={!!done['m9']} vertrauen1={vertrauen1} vertrauen2={vertrauen2} ownRule={ownRule} fallakteM1={fallakte.m1 || ''}
              onVertrauen2Change={v => update({ vertrauen2: v })}
              onRuleChange={r => update({ ownRule: r })}
              onComplete={() => {
                markDone('m9')
                unlockAchievement({ icon: '🏆', title: 'KI-Profi', desc: 'Du hast alle 9 Missionen abgeschlossen!', moduleId: MOD.id })
              }}
              onDashboard={() => navigate('/dashboard')}
              achieved={achieved} />
          </div>
        )}

        <div className="actions no-print" style={{ marginTop: 'var(--sp-lg)' }}>
          {mission > 1 && <button className="btn btn-ghost" onClick={() => goMission(mission - 1)}>← Zurück</button>}
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Zur Übersicht</button>
        </div>
      </div>
    </div>
  )
}

// ── Mission 4: Quiz ───────────────────────────────────────────

function M4Quiz({ done, onComplete }) {
  const ITEMS = [
    { id: 'a', text: 'Studien zeigen, dass KI-Nutzung die Kreativität um 34% steigert.', type: 'ueberzeugend', explain: 'Klingt präzise, aber: Welche Studie? Wann? Unter welchen Bedingungen? Ohne Quelle ist das nicht überprüfbar.' },
    { id: 'b', text: 'KI-Systeme können Fehler machen, weil sie aus menschlichen Daten lernen.', type: 'pruefbar', explain: 'Das ist eine überprüfbare Aussage – sie beschreibt, wie KI funktioniert.' },
    { id: 'c', text: 'Diese KI-Antwort ist zu 98% korrekt.', type: 'ueberzeugend', explain: 'Woher kommt diese Zahl? KI-Systeme können keine eigene Korrektheit messen.' },
    { id: 'd', text: 'KI-Sprachmodelle erzeugen Text, indem sie das wahrscheinlichste nächste Wort vorhersagen.', type: 'pruefbar', explain: 'Das ist eine überprüfbare technische Beschreibung.' },
  ]
  const [answers, setAnswers] = useState({})
  const [checked,  setChecked]  = useState(false)
  const allAnswered = ITEMS.every(i => answers[i.id])
  const correct = ITEMS.filter(i => answers[i.id] === i.type).length

  if (done) return <div className="done-badge">✓ Mission 4 abgeschlossen</div>

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: 'var(--sp-md)', flexWrap: 'wrap' }}>
        <span style={{ background: 'var(--c-info-bg)', color: 'var(--c-info)', borderRadius: '99px', padding: '0.25rem 0.75rem', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>🔵 Überprüfbar</span>
        <span style={{ background: 'var(--c-warn-bg)', color: 'var(--c-warn)', borderRadius: '99px', padding: '0.25rem 0.75rem', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>🟡 Nur überzeugend</span>
      </div>
      {ITEMS.map(item => (
        <div key={item.id} style={{ border: `2px solid ${checked ? (answers[item.id] === item.type ? 'var(--c-success)' : 'var(--c-error)') : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: '0.75rem', background: checked ? (answers[item.id] === item.type ? 'var(--c-success-bg)' : 'var(--c-error-bg)') : 'white' }}>
          <p style={{ margin: '0 0 0.625rem', fontWeight: 600 }}>„{item.text}"</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[{ v: 'pruefbar', label: '🔵 Überprüfbar' }, { v: 'ueberzeugend', label: '🟡 Nur überzeugend' }].map(opt => (
              <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: checked ? 'default' : 'pointer', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>
                <input type="radio" name={item.id} value={opt.v} checked={answers[item.id] === opt.v}
                  onChange={() => !checked && setAnswers(a => ({ ...a, [item.id]: opt.v }))} disabled={checked}
                  style={{ accentColor: 'var(--c-teal)', width: '1rem', height: '1rem' }} />
                {opt.label}
              </label>
            ))}
          </div>
          {checked && <p style={{ margin: '0.5rem 0 0', fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', fontStyle: 'italic' }}>{item.explain}</p>}
        </div>
      ))}
      {!checked ? (
        <div className="actions">
          <button className="btn btn-primary" disabled={!allAnswered} onClick={() => setChecked(true)} style={{ background: 'var(--c-teal)' }}>Auswerten</button>
        </div>
      ) : (
        <div>
          <div className={`feedback ${correct >= 3 ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
            {correct} von {ITEMS.length} richtig. {correct >= 3 ? 'Gut erkannt!' : 'Lies die Erklärungen und versuche es erneut.'}
          </div>
          {correct >= 3 && (
            <div className="actions">
              <button className="btn btn-xp" onClick={onComplete}>Weiter zu Mission 5 →</button>
            </div>
          )}
          {correct < 3 && (
            <div className="actions">
              <button className="btn btn-ghost" onClick={() => { setAnswers({}); setChecked(false) }}>↺ Erneut versuchen</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Mission 6: Prompt-Labor ───────────────────────────────────

function M6PromptLab({ done, savedPrompt, onComplete }) {
  const BAUSTEINE = [
    { id: 'thema',    label: 'Thema',       example: 'Addieren von Brüchen' },
    { id: 'klasse',   label: 'Klassenstufe', example: 'für Klasse 7' },
    { id: 'form',     label: 'Form',         example: 'in einfachen Schritten' },
    { id: 'beispiel', label: 'Beispiel',     example: 'mit einem Beispiel' },
    { id: 'aufgaben', label: 'Aufgaben',     example: 'danach zwei Aufgaben ohne Lösung' },
  ]
  const [selected, setSelected] = useState([])
  const [ownPrompt, setOwnPrompt] = useState(savedPrompt)
  const [phase, setPhase] = useState('bausteine')

  const strength = Math.round((selected.length / BAUSTEINE.length) * 100)
  const preview = selected.length > 0
    ? `Erkläre ${selected.find(s => s.id === 'thema')?.example || '[Thema]'} ${selected.find(s => s.id === 'klasse')?.example || ''} ${selected.find(s => s.id === 'form')?.example || ''}. ${selected.find(s => s.id === 'beispiel')?.example ? 'Nutze ' + selected.find(s => s.id === 'beispiel').example + '.' : ''} ${selected.find(s => s.id === 'aufgaben')?.example ? 'Stelle mir danach ' + selected.find(s => s.id === 'aufgaben').example + '.' : ''}`.trim()
    : 'Erkläre Brüche.'

  if (done) return <div className="done-badge">✓ Mission 6 abgeschlossen</div>

  return (
    <div>
      <div style={{ background: 'var(--c-pale2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)', fontFamily: 'monospace', fontSize: 'var(--fs-sm)', lineHeight: 1.6, border: '2px solid var(--c-border)' }}>
        <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 800, color: 'var(--c-muted)', marginBottom: '0.375rem' }}>VORSCHAU:</div>
        {preview}
      </div>

      {/* Stärke-Anzeige */}
      <div style={{ marginBottom: 'var(--sp-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: 'var(--fs-sm)', fontWeight: 700 }}>
          <span>Prompt-Stärke</span>
          <span style={{ color: strength >= 80 ? 'var(--c-success)' : strength >= 40 ? 'var(--c-warn)' : 'var(--c-error)' }}>
            {strength < 20 ? '😴 Sehr schwach' : strength < 40 ? '😐 Schwach' : strength < 60 ? '🙂 Mittel' : strength < 80 ? '😊 Gut' : '🚀 Stark!'}
          </span>
        </div>
        <div className="progress-track" style={{ background: 'var(--c-border)' }}>
          <div className="progress-fill" style={{ width: `${strength}%`, background: strength >= 80 ? 'var(--c-success)' : strength >= 40 ? 'var(--c-warn)' : 'var(--c-error)' }} />
        </div>
      </div>

      {/* Bausteine */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: 'var(--sp-md)' }}>
        {BAUSTEINE.map(b => {
          const active = selected.find(s => s.id === b.id)
          return (
            <button key={b.id} onClick={() => setSelected(prev => active ? prev.filter(s => s.id !== b.id) : [...prev, b])}
              style={{ border: `2px solid ${active ? 'var(--c-teal)' : 'var(--c-border)'}`, borderRadius: 'var(--r-md)', padding: '0.5rem 0.875rem', background: active ? 'var(--c-m02-bg)' : 'white', cursor: 'pointer', fontWeight: 700, fontSize: 'var(--fs-sm)', fontFamily: 'inherit', transition: 'all 0.2s' }}>
              {active ? '✓ ' : '+ '}{b.label}
            </button>
          )
        })}
      </div>

      {strength >= 80 && (
        <div>
          <div className="box-memory">🚀 Starker Prompt! Jetzt formuliere deinen eigenen:</div>
          <label style={{ fontWeight: 800, display: 'block', marginBottom: '0.375rem' }}>Mein eigener Lernprompt:</label>
          <textarea value={ownPrompt} onChange={e => setOwnPrompt(e.target.value)}
            placeholder="Erkläre ... für Klasse 7 ... Nutze ... Stelle mir danach ..."
            rows={3} style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--c-border)', borderRadius: 'var(--r-md)', font: 'inherit', resize: 'vertical' }} />
          <div className="actions">
            <button className="btn btn-xp" disabled={ownPrompt.trim().length < 20}
              onClick={() => onComplete(ownPrompt)}>
              Prompt speichern · Achievement freischalten 💬
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Mission 7: Szenarien ──────────────────────────────────────

function M7Scenarios({ done, onComplete }) {
  const SCENARIOS = [
    { id: 's1', text: 'Du lässt dir den ersten Rechenschritt erklären und rechnest danach selbst weiter.', correct: 'unterstuetzt', label: 'Unterstützt Lernen' },
    { id: 's2', text: 'Du reichst eine vollständig von KI erstellte Hausaufgabe unverändert als eigene Arbeit ein.', correct: 'ersetzt', label: 'Ersetzt eigenes Denken' },
    { id: 's3', text: 'Du sammelst Ideen für ein Referat, prüfst die Informationen und formulierst selbst.', correct: 'unterstuetzt', label: 'Unterstützt Lernen' },
    { id: 's4', text: 'Du übernimmst eine Antwort, nur weil sie professionell klingt.', correct: 'ersetzt', label: 'Ersetzt eigenes Denken' },
  ]
  const [answers, setAnswers] = useState({})
  const [checked,  setChecked]  = useState(false)
  const allAnswered = SCENARIOS.every(s => answers[s.id])
  const correct = SCENARIOS.filter(s => answers[s.id] === s.correct).length

  if (done) return <div className="done-badge">✓ Mission 7 abgeschlossen</div>

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: 'var(--sp-md)', flexWrap: 'wrap' }}>
        <span style={{ background: 'var(--c-success-bg)', color: 'var(--c-success)', borderRadius: '99px', padding: '0.25rem 0.75rem', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>✅ Unterstützt Lernen</span>
        <span style={{ background: 'var(--c-error-bg)', color: 'var(--c-error)', borderRadius: '99px', padding: '0.25rem 0.75rem', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>❌ Ersetzt eigenes Denken</span>
      </div>
      {SCENARIOS.map(s => (
        <div key={s.id} style={{ border: `2px solid ${checked ? (answers[s.id] === s.correct ? 'var(--c-success)' : 'var(--c-error)') : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: '0.75rem', background: checked ? (answers[s.id] === s.correct ? 'var(--c-success-bg)' : 'var(--c-error-bg)') : 'white' }}>
          <p style={{ margin: '0 0 0.625rem', fontWeight: 600 }}>{s.text}</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[{ v: 'unterstuetzt', label: '✅ Unterstützt Lernen' }, { v: 'ersetzt', label: '❌ Ersetzt eigenes Denken' }].map(opt => (
              <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: checked ? 'default' : 'pointer', fontWeight: 700, fontSize: 'var(--fs-sm)' }}>
                <input type="radio" name={s.id} value={opt.v} checked={answers[s.id] === opt.v}
                  onChange={() => !checked && setAnswers(a => ({ ...a, [s.id]: opt.v }))} disabled={checked}
                  style={{ accentColor: 'var(--c-teal)', width: '1rem', height: '1rem' }} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      ))}
      {!checked ? (
        <div className="actions">
          <button className="btn btn-primary" disabled={!allAnswered} onClick={() => setChecked(true)} style={{ background: 'var(--c-teal)' }}>Auswerten</button>
        </div>
      ) : (
        <div>
          <div className={`feedback ${correct >= 3 ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
            {correct} von {SCENARIOS.length} richtig. {correct >= 3 ? 'Gut beurteilt!' : 'Besprecht unklare Fälle noch einmal.'}
          </div>
          {correct >= 3 ? (
            <div className="actions"><button className="btn btn-xp" onClick={onComplete}>Weiter zu Mission 8 →</button></div>
          ) : (
            <div className="actions"><button className="btn btn-ghost" onClick={() => { setAnswers({}); setChecked(false) }}>↺ Erneut versuchen</button></div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Mission 8: Boss-Level ─────────────────────────────────────

function M8BossLevel({ done, onComplete }) {
  const AUSSAGEN = [
    { id: 'a', text: 'KI-Sprachmodelle erzeugen Text, indem sie das wahrscheinlichste nächste Wort vorhersagen.', type: 'korrekt', explain: 'Korrekt – das ist eine überprüfbare technische Beschreibung.' },
    { id: 'b', text: 'Da KI immer die wahrscheinlichste Antwort gibt, ist sie automatisch auch die richtige.', type: 'problematisch', explain: 'Problematisch! Wahrscheinlich ≠ richtig. KI kann überzeugend falsch liegen.' },
    { id: 'c', text: 'Studien belegen eindeutig, dass KI-Nutzung das Lernen um 40% verbessert.', type: 'pruefbeduerftig', explain: 'Prüfbedürftig! Welche Studie? Unter welchen Bedingungen? Ohne Quelle nicht übernehmbar.' },
    { id: 'd', text: 'KI kann Vorurteile aus den Trainingsdaten übernehmen.', type: 'korrekt', explain: 'Korrekt – das ist ein bekanntes Problem bei KI-Systemen.' },
  ]
  const [answers, setAnswers] = useState({})
  const [checked,  setChecked]  = useState(false)
  const allAnswered = AUSSAGEN.every(a => answers[a.id])
  const correct = AUSSAGEN.filter(a => answers[a.id] === a.type).length

  if (done) return <div className="done-badge">✓ Boss-Level besiegt!</div>

  return (
    <div>
      <div style={{ background: 'var(--c-error-bg)', border: '2px solid var(--c-boss)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)', fontStyle: 'italic', lineHeight: 1.7 }}>
        „KI-Sprachmodelle erzeugen Text, indem sie das wahrscheinlichste nächste Wort vorhersagen. Da KI immer die wahrscheinlichste Antwort gibt, ist sie automatisch auch die richtige. Studien belegen eindeutig, dass KI-Nutzung das Lernen um 40% verbessert. KI kann Vorurteile aus den Trainingsdaten übernehmen."
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: 'var(--sp-md)', flexWrap: 'wrap' }}>
        <span style={{ background: 'var(--c-success-bg)', color: 'var(--c-success)', borderRadius: '99px', padding: '0.25rem 0.75rem', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>✅ Korrekt</span>
        <span style={{ background: 'var(--c-error-bg)', color: 'var(--c-error)', borderRadius: '99px', padding: '0.25rem 0.75rem', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>⚠️ Problematisch</span>
        <span style={{ background: 'var(--c-warn-bg)', color: 'var(--c-warn)', borderRadius: '99px', padding: '0.25rem 0.75rem', fontSize: 'var(--fs-xs)', fontWeight: 800 }}>🔍 Prüfbedürftig</span>
      </div>
      {AUSSAGEN.map(a => (
        <div key={a.id} style={{ border: `2px solid ${checked ? (answers[a.id] === a.type ? 'var(--c-success)' : 'var(--c-error)') : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: '0.75rem', background: checked ? (answers[a.id] === a.type ? 'var(--c-success-bg)' : 'var(--c-error-bg)') : 'white' }}>
          <p style={{ margin: '0 0 0.625rem', fontWeight: 600, fontStyle: 'italic' }}>„{a.text}"</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[{ v: 'korrekt', label: '✅ Korrekt' }, { v: 'problematisch', label: '⚠️ Problematisch' }, { v: 'pruefbeduerftig', label: '🔍 Prüfbedürftig' }].map(opt => (
              <label key={opt.v} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: checked ? 'default' : 'pointer', fontWeight: 700, fontSize: 'var(--fs-xs)' }}>
                <input type="radio" name={a.id} value={opt.v} checked={answers[a.id] === opt.v}
                  onChange={() => !checked && setAnswers(prev => ({ ...prev, [a.id]: opt.v }))} disabled={checked}
                  style={{ accentColor: 'var(--c-teal)', width: '1rem', height: '1rem' }} />
                {opt.label}
              </label>
            ))}
          </div>
          {checked && <p style={{ margin: '0.5rem 0 0', fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', fontStyle: 'italic' }}>{a.explain}</p>}
        </div>
      ))}
      {!checked ? (
        <div className="actions">
          <button className="btn btn-danger" disabled={!allAnswered} onClick={() => setChecked(true)}>👾 Boss besiegen!</button>
        </div>
      ) : (
        <div>
          <div className={`feedback ${correct >= 3 ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
            {correct} von {AUSSAGEN.length} richtig. {correct >= 3 ? '🎉 Boss besiegt!' : 'Noch nicht ganz – versuche es erneut!'}
          </div>
          {correct >= 3 ? (
            <div className="actions"><button className="btn btn-xp" onClick={onComplete}>Achievement freischalten ✅</button></div>
          ) : (
            <div className="actions"><button className="btn btn-ghost" onClick={() => { setAnswers({}); setChecked(false) }}>↺ Erneut versuchen</button></div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Mission 9: Finale ─────────────────────────────────────────

function M9Finale({ done, vertrauen1, vertrauen2, ownRule, fallakteM1, onVertrauen2Change, onRuleChange, onComplete, onDashboard, achieved }) {
  const diff = vertrauen2 - vertrauen1
  const diffText = diff > 5 ? `+${diff}% – du vertraust KI jetzt mehr` : diff < -5 ? `${diff}% – du bist jetzt skeptischer` : 'Kaum verändert – deine Einschätzung war schon gut!'

  if (done) return (
    <div>
      <div className="done-badge">✓ Alle 9 Missionen abgeschlossen!</div>
      {achieved && (
        <div className="achievement-card" style={{ marginTop: 'var(--sp-lg)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
          <h3 style={{ color: '#92400e', margin: '0 0 0.5rem' }}>KI-Profi</h3>
          <p style={{ color: 'var(--c-muted)', margin: '0 0 var(--sp-md)' }}>Du hast alle 9 Missionen des KI-Checks abgeschlossen!</p>
          <button className="btn btn-primary" onClick={onDashboard} style={{ background: 'var(--c-teal)' }}>Zur Modulübersicht →</button>
        </div>
      )}
    </div>
  )

  return (
    <div>
      {/* Vorher-Nachher */}
      <div style={{ background: 'var(--c-pale2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-lg)', marginBottom: 'var(--sp-lg)' }}>
        <h3 style={{ marginTop: 0, color: 'var(--c-teal)' }}>📊 Vorher-Nachher-Vergleich</h3>
        <p style={{ color: 'var(--c-muted)', fontSize: 'var(--fs-sm)' }}>Zu Beginn (Mission 2) hast du dein Vertrauen auf <strong>{vertrauen1}%</strong> eingestellt. Wie ist es jetzt?</p>
        <div style={{ margin: 'var(--sp-md) 0', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--c-teal)', marginBottom: '0.5rem' }}>{vertrauen2}%</div>
          <input type="range" min="0" max="100" value={vertrauen2} onChange={e => onVertrauen2Change(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--c-teal)' }} />
        </div>
        <div style={{ background: 'white', borderRadius: 'var(--r-md)', padding: 'var(--sp-md)', border: '1px solid var(--c-border)', fontSize: 'var(--fs-sm)', fontWeight: 700, color: 'var(--c-teal)' }}>
          📈 {diffText}
        </div>
      </div>

      {/* Anfangs-Antwort */}
      {fallakteM1 && (
        <div style={{ background: 'var(--c-pale2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-lg)' }}>
          <h3 style={{ marginTop: 0, color: 'var(--c-teal)' }}>🔎 Deine Antwort aus Mission 1</h3>
          <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--c-muted)' }}>„{fallakteM1}"</p>
          <p style={{ margin: '0.5rem 0 0', fontSize: 'var(--fs-sm)', color: 'var(--c-teal)', fontWeight: 700 }}>Hat sich deine Einschätzung verändert?</p>
        </div>
      )}

      {/* Persönliche Regel */}
      <div style={{ marginBottom: 'var(--sp-lg)' }}>
        <h3 style={{ color: 'var(--c-teal)' }}>🧭 Dein KI-Kompass</h3>
        <p style={{ color: 'var(--c-muted)' }}>Formuliere deine persönliche Regel:</p>
        <div style={{ background: 'var(--c-pale2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-lg)', border: `2px solid var(--c-teal)` }}>
          <div style={{ fontWeight: 800, color: 'var(--c-teal)', marginBottom: '0.75rem', fontSize: 'var(--fs-lg)' }}>Bevor ich KI nutze, frage ich mich …</div>
          <textarea value={ownRule} onChange={e => onRuleChange(e.target.value)}
            placeholder="z. B. … ob ich das auch selbst herausfinden könnte und ob KI hier wirklich hilft."
            rows={3} maxLength={300}
            style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--c-border)', borderRadius: 'var(--r-md)', font: 'inherit', resize: 'vertical' }} />
          <div style={{ fontSize: 'var(--fs-xs)', color: ownRule.trim().length >= 15 ? 'var(--c-success)' : 'var(--c-muted)', textAlign: 'right', marginTop: '0.25rem' }}>
            {ownRule.trim().length}/300 {ownRule.trim().length >= 15 ? '✓' : '(mindestens 15 Zeichen)'}
          </div>
        </div>
      </div>

      <div className="box-memory">KI kann mich unterstützen. Denken, Prüfen und Entscheiden muss ich selbst.</div>

      <div className="actions">
        <button className="btn btn-xp" disabled={ownRule.trim().length < 15} onClick={onComplete}>
          🏆 Modul abschließen · Achievement freischalten
        </button>
      </div>
    </div>
  )
}