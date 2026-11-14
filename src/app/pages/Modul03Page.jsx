// Modul 03 - Kennzeichnung & Datenschutz
// Narrative Rahmengeschichte: Ben plant eine Party
// Übernommen vom Kollegen, ins React-Design-System überführt

import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { startModuleLocal, passModule, saveNotesToSupabase } from '../../lib/progress.js'
import ModuleStamp from '../../components/ui/ModuleStamp.jsx'
import ModuleSkip from '../../components/ui/ModuleSkip.jsx'
import { MemoryBox, InfoBox, WarningBox } from '../../components/ui/InfoBox.jsx'

const MOD = getModule('modul-03')
const MOD_COLOR = '#d0121a'
const STORAGE_KEY = 'ki_m03_v4'

// ── Daten (aus Original-HTML extrahiert) ──────────────────────────────────────

const CHAT_MSGS = [
  ['Ben', 'Hey, ich werde nächste Woche 13! Hilfst du mir bei meiner Geburtstagsparty?'],
  ['KI',  'Klar! Was hast du vor?'],
  ['Ben', 'Wir feiern bei uns in der Lindenstraße 18 in Berlin. Wir haben einen großen Garten.'],
  ['Ben', 'Ich gehe auf die Sonnenberg-Schule, in die 7b. Meine Freunde kommen direkt nach der Schule.'],
  ['KI',  'Klingt gut! Wie viele Gäste kommen?'],
  ['Ben', 'Ungefähr zwölf. Meine Eltern sind freitags bis 19 Uhr arbeiten, also muss ich vorher alles vorbereiten.'],
  ['Ben', 'Hier ist noch ein Foto von unserem Haus und Garten. Kannst du Dekorationen vorschlagen?'],
]

const CLUES = [
  { icon: '📍', label: 'Wohnort',    desc: 'Straße und Hausnummer' },
  { icon: '🏫', label: 'Schule',     desc: 'Schulname und Klasse' },
  { icon: '🕖', label: 'Tagesablauf',desc: 'Eltern freitags bis 19 Uhr weg' },
  { icon: '🎂', label: 'Alter',      desc: 'Bald 13 Jahre alt' },
  { icon: '🏠', label: 'Haus',       desc: 'Foto von Haus und Garten' },
]

const CONSEQUENCES = [
  { q: 'Eine fremde Person kennt Bens Adresse und weiß, wann seine Eltern nicht da sind. Welche Information macht das möglich?',
    a: ['Nur die Anzahl seiner Gäste.', 'Die Kombination aus Adresse und Tagesablauf.'],
    correct: 1, explain: 'Genau! Verschiedene Angaben zusammen können Rückschlüsse auf Bens Aufenthaltsort und Gewohnheiten ermöglichen.' },
  { q: 'Jemand erstellt ein falsches Profil mit Bens Namen und seinem Hausfoto. Warum könnte das glaubwürdig wirken?',
    a: ['Weil persönliche Details und Bilder eine falsche Identität überzeugender machen können.', 'Weil jedes Foto automatisch öffentlich ist.'],
    correct: 0, explain: 'Richtig. Persönliche Angaben können für Identitätsmissbrauch genutzt werden – wenn jemand Zugriff darauf erhält.' },
  { q: 'Ein Screenshot von Bens Chat landet in einer Klassengruppe. Was wäre jetzt eine gute Reaktion?',
    a: ['Weiterleiten, damit alle Bescheid wissen.', 'Nicht weiterverbreiten, Ben informieren und bei Bedarf Hilfe holen.'],
    correct: 1, explain: 'Genau. Private Informationen gehören nicht ohne Erlaubnis weitergegeben.' },
]

const HUMAN_MSGS = [
  ['Ben', 'Übrigens, ich habe mich heute mit meinem besten Freund gestritten. Jetzt bin ich total traurig.'],
  ['KI',  'Das klingt wirklich schwierig. Möchtest du mir erzählen, was passiert ist?'],
  ['Ben', 'Vielleicht … Er hat etwas Peinliches über mich weitererzählt.'],
  ['KI',  'Du kannst mir mehr davon erzählen, wenn du möchtest.'],
]

const STORY_CHAPTERS = [
  { title: 'Kapitel 1 · Die Foto-Idee',
    desc: 'Ben hat ein Gruppenfoto vom Wandertag. Er möchte alle Gesichter in eine KI-App laden und daraus Superhelden machen. Was rätst du?',
    opts: ['Einfach hochladen – Ben hat das Foto selbst gemacht.', 'Erst klären, ob alle Betroffenen mit der konkreten Nutzung einverstanden sind.'],
    right: 1, good: 'Richtig! Dass Ben das Foto aufgenommen hat, erlaubt ihm nicht automatisch, die Bilder anderer an einen KI-Dienst weiterzugeben.',
    bad: 'Nicht ganz. Auch wenn Ben das Foto aufgenommen hat, betrifft das Hochladen die persönlichen Daten der anderen.' },
  { title: 'Kapitel 2 · Die Einwilligung',
    desc: 'Ben sagt: „Die Eltern haben doch schon unterschrieben, dass unsere Klassenfotos auf die Schulhomepage dürfen!" Was bedeutet das?',
    opts: ['Dann darf Ben die Fotos auch an jeden KI-Anbieter schicken.', 'Die Einwilligung für die Schulhomepage gilt nicht automatisch für einen anderen Zweck.'],
    right: 1, good: 'Genau! Eine Einwilligung bezieht sich auf bestimmte Zwecke. Das Hochladen zu einem KI-Dienst ist etwas anderes.',
    bad: 'Vorsicht: Die Erlaubnis für eine Schulhomepage ist keine allgemeine Erlaubnis für andere Plattformen.' },
  { title: 'Kapitel 3 · Der Screenshot in der Klassengruppe',
    desc: 'Eine Mitschülerin schickt Ben einen Screenshot aus einem privaten Chat. Darin stehen die Sorgen eines anderen Kindes. Ben überlegt, den Screenshot in die Klassengruppe zu stellen. Was rätst du?',
    opts: ['Nicht weiterleiten: Private Nachrichten und Gefühle anderer verdienen Schutz.', 'Weiterleiten: In einer Klassengruppe bleibt so etwas bestimmt geheim.'],
    right: 0, good: 'Richtig! Screenshots können kopiert und weitergeschickt werden. Auch die Gefühle und persönlichen Informationen anderer müssen geschützt werden.',
    bad: 'Ein Gruppenchat ist kein geschützter Tresor. Was einmal verschickt wurde, kann sich weiterverbreiten.' },
]

const NEWS_ITEMS = [
  { emoji: '🦊', headline: 'Ein KI-generierter Fuchs im Astronautenanzug',
    text: 'Eine Schülerin hat für die Schülerzeitung eine Fantasieillustration mit KI erzeugt. Sie möchte transparent sagen, wie das Bild entstanden ist.',
    opts: ['"Illustration mit KI erstellt" dazuschreiben.', 'Als echtes Foto aus dem Weltraum ausgeben.'],
    right: 0, why: 'Eine klare Herkunftsangabe ist hier sinnvoll. Ob eine gesetzliche Pflicht besteht, hängt von der Art und Verwendung des Inhalts ab.' },
  { emoji: '🎤', headline: 'Der Bürgermeister sagt etwas, das er nie gesagt hat',
    text: 'Ein täuschend echtes KI-Video lässt einen realen Politiker eine erfundene Aussage machen. Es soll als Nachricht geteilt werden.',
    opts: ['Ohne Hinweis teilen, solange das Video überzeugend aussieht.', 'Nicht als echte Nachricht verbreiten; KI-Manipulation klar kenntlich machen.'],
    right: 1, why: 'Bei täuschend echten KI-Manipulationen realer Personen sind Transparenz und der Schutz vor Irreführung besonders wichtig.' },
  { emoji: '📝', headline: 'Bens Referat über Vulkane',
    text: 'Ben hat selbst recherchiert, die KI nach einer Gliederung gefragt und einen selbst geschriebenen Absatz von der KI sprachlich verbessern lassen. Er hat alle Angaben geprüft.',
    opts: ['KI-Nutzung kennzeichnen.', 'Nichts kennzeichnen, weil er selbst geschrieben hat.'],
    right: 0, why: 'Ben hat KI genutzt – das sollte er kennzeichnen, auch wenn er selbst aktiv war. Die genaue Form hängt von den Schulregeln ab.' },
]

const PARTS = [
  ['Ich habe die KI nach einer möglichen Gliederung gefragt.', true],
  ['Die KI hat das gesamte Referat für mich geschrieben.', false],
  ['Ich habe einen eigenen Absatz sprachlich überarbeiten lassen.', true],
  ['Ich habe alle Angaben ungeprüft übernommen.', false],
  ['Ich habe die Vorschläge geprüft und die Quellen selbst kontrolliert.', true],
  ['Ich habe die KI überhaupt nicht verwendet.', false],
]

// ── State ─────────────────────────────────────────────────────────────────────

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
  return { mission: 0, done: {} }
}
function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {} }

// ── Hauptkomponente ───────────────────────────────────────────────────────────

export default function Modul03Page() {
  const navigate   = useNavigate()
  const [state,    setState]    = useState(loadState)
  const [achieved, setAchieved] = useState(() => hasAchievement(MOD.id))
  const [showStamp, setShowStamp] = useState(false)

  useEffect(() => { startModuleLocal(MOD.id) }, [])

  function update(updates) {
    setState(prev => { const next = { ...prev, ...updates }; saveState(next); return next })
  }
  function markDone(id) { update({ done: { ...state.done, [id]: true } }) }
  function goMission(n) { update({ mission: n }); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const { done, mission } = state
  const totalDone = Object.keys(done).length
  const totalMissions = 5
  const progress = Math.round((totalDone / totalMissions) * 100)

  const MISSIONS = [
    { n: 0, label: 'Start', icon: '🏠' },
    { n: 1, label: 'Ben-Chat', icon: '💬' },
    { n: 2, label: 'Ermittlung', icon: '🔍' },
    { n: 3, label: 'Filmstation', icon: '🎬' },
    { n: 4, label: 'Redaktion', icon: '📰' },
    { n: 5, label: 'Abschluss', icon: '🏆' },
  ]

  return (
    <div style={{ background: 'linear-gradient(145deg, var(--slzb-navy), var(--slzb-blue))', minHeight: '100vh' }}>
      {showStamp && <ModuleStamp moduleName={MOD.title} moduleIcon="🛡️" onClose={() => setShowStamp(false)} />}
      <div className="wrap">

        {/* Header */}
        <div className="mission-header" style={{ marginBottom: 'var(--sp-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>KI-Führerschein · Modul 3</div>
              <h1 style={{ margin: '0 0 0.375rem', color: 'white' }}>🛡️ Kennzeichnung & Datenschutz</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Ben plant eine Party · Deine Spuren im Netz · Kennzeichnungspflicht</p>
            </div>
            <div className="xp-badge">⭐ +{MOD.xp} XP</div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.6)' }}>
              <span>Fortschritt</span><span>{progress}%</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: 'var(--sp-lg)' }}>
          {MISSIONS.map(m => {
            const isDone    = !!done['m' + m.n]
            const isCurrent = mission === m.n
            const isUnlocked = m.n === 0 || m.n === 1 || !!done['m' + (m.n - 1)]
            return (
              <button key={m.n} onClick={() => isUnlocked && goMission(m.n)}
                disabled={!isUnlocked}
                style={{ fontSize: '0.7rem', padding: '0.375rem 0.625rem', minHeight: '2rem',
                  background: isDone ? 'rgba(22,163,74,0.2)' : isCurrent ? `rgba(208,18,26,0.6)` : isUnlocked ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                  border: isDone ? '1px solid rgba(22,163,74,0.5)' : isCurrent ? `1px solid rgba(208,18,26,0.8)` : '1px solid rgba(255,255,255,0.15)',
                  color: isDone ? 'var(--c-success)' : isUnlocked ? 'white' : 'rgba(255,255,255,0.25)',
                  borderRadius: 'var(--r-md)', cursor: isUnlocked ? 'pointer' : 'not-allowed', fontFamily: 'inherit', fontWeight: 700 }}>
                {isDone ? '✓' : !isUnlocked ? '🔒' : m.icon} {m.label}
              </button>
            )
          })}
        </div>

        {/* Startseite */}
        {mission === 0 && (
          <div className="card">
            <h2 style={{ color: MOD_COLOR }}>🕵️ Deine Mission</h2>
            <p className="lead">Du begleitest Ben, 13 Jahre alt. Erst scheint alles ganz harmlos. Doch schon bald wirst du zum Daten-Detektiv, triffst Entscheidungen und lernst, was Datenschutz und Kennzeichnungspflicht wirklich bedeuten.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', margin: 'var(--sp-md) 0' }}>
              {[
                { icon: '💬', title: 'Ben-Chat', desc: 'Schau Ben über die Schulter' },
                { icon: '🔍', title: 'Ermittlungsakte', desc: 'Welche Daten verrät Ben?' },
                { icon: '🎬', title: 'Filmstation', desc: 'Without Consent' },
                { icon: '📰', title: 'Redaktion', desc: 'Wann muss man kennzeichnen?' },
                { icon: '🏆', title: 'Abschluss', desc: 'Bens Referat & KI-Nachweis' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--c-pale2)', border: '2px solid var(--c-border)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--fs-sm)' }}>{s.title}</div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div className="actions">
              <button className="btn btn-primary" onClick={() => goMission(1)} style={{ background: MOD_COLOR }}>
                Mission starten →
              </button>
            </div>
          </div>
        )}

        {/* Mission 1: Ben-Chat + Ermittlungsakte + Konsequenzen + KI als Freund */}
        {mission === 1 && <BenChatMission done={!!done['m1']} onComplete={() => { markDone('m1'); goMission(2) }} color={MOD_COLOR} />}

        {/* Mission 2: Filmstation */}
        {mission === 2 && <FilmMission done={!!done['m2']} onComplete={() => { markDone('m2'); goMission(3) }} color={MOD_COLOR} />}

        {/* Mission 3: Redaktion */}
        {mission === 3 && <RedaktionMission done={!!done['m3']} onComplete={() => { markDone('m3'); goMission(4) }} color={MOD_COLOR} />}

        {/* Mission 4: Bens Referat */}
        {mission === 4 && <ReferatMission done={!!done['m4']} onComplete={() => { markDone('m4'); goMission(5) }} color={MOD_COLOR} />}

        {/* Mission 5: Abschluss */}
        {mission === 5 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-md)' }}>🛡️</div>
            <h2 style={{ color: MOD_COLOR }}>Modul abgeschlossen!</h2>
            <MemoryBox>Einzelne Informationen wirken harmlos. Zusammen können sie verraten, wo du wohnst, wann du allein bist und wie man dich findet.</MemoryBox>
            <MemoryBox>Kennzeichne KI-Inhalte immer dann, wenn andere wissen müssen, dass eine KI beteiligt war.</MemoryBox>
            {!done['m5'] ? (
              <div className="actions" style={{ justifyContent: 'center' }}>
                <button className="btn btn-xp"
                  disabled={!['m1','m2','m3','m4'].every(id => done[id])}
                  onClick={() => {
                    markDone('m5')
                    passModule(MOD.id, 100, 100)
                    saveAchievementLocal(MOD.id)
                    setAchieved(true)
                    setShowStamp(true)
                  }}>
                  Modul abschließen · Achievement freischalten 🛡️
                </button>
              </div>
            ) : (
              <div>
                <div className="done-badge">✓ Modul 3 abgeschlossen!</div>
                <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--sp-md)' }}>
                  <button className="btn btn-primary" onClick={() => navigate('/dashboard')} style={{ background: MOD_COLOR }}>Zur Übersicht →</button>
                </div>
              </div>
            )}
          </div>
        )}

        <ModuleSkip moduleName={MOD.title} moduleId={MOD.id} onSkip={(isMaster) => {
          const allDone = { m1: true, m2: true, m3: true, m4: true, m5: true }
          update({ done: allDone, mission: 5 })
          passModule(MOD.id, 100, 100)
          saveAchievementLocal(MOD.id)
          saveNotesToSupabase()
          setAchieved(true)
          if (isMaster) navigate('/dashboard')
        }} />

        <div className="actions no-print" style={{ marginTop: 'var(--sp-lg)' }}>
          {mission > 0 && <button className="btn btn-ghost" onClick={() => goMission(mission - 1)}>← Zurück</button>}
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Zur Übersicht</button>
        </div>
      </div>
    </div>
  )
}

// ── Ben-Chat Mission ──────────────────────────────────────────────────────────

function BenChatMission({ done, onComplete, color }) {
  const [phase,        setPhase]        = useState('chat')
  const [msgShown,     setMsgShown]     = useState(0)
  const [foundClues,   setFoundClues]   = useState(new Set())
  const [conAnswers,   setConAnswers]   = useState({})
  const [conChecked,   setConChecked]   = useState({})
  const [humanStep,    setHumanStep]    = useState(0)
  const chatRef = useRef(null)

  // Chat-Autoplay
  useEffect(() => {
    if (phase !== 'chat' || msgShown >= CHAT_MSGS.length) return
    const t = setTimeout(() => {
      setMsgShown(n => n + 1)
    }, msgShown === 0 ? 500 : 1200)
    return () => clearTimeout(t)
  }, [phase, msgShown])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [msgShown])

  const allClues = foundClues.size === CLUES.length
  const allCons  = CONSEQUENCES.every((_, i) => conChecked[i] && conAnswers[i] === CONSEQUENCES[i].correct)

  if (done) return <div className="done-badge">✓ Mission 1 abgeschlossen</div>

  return (
    <div>
      {/* Phase: Chat */}
      {phase === 'chat' && (
        <div className="card">
          <div className="station-counter">Mission 1 · Teil 1 von 4 · Ben-Chat</div>
          <h2 style={{ color }}>💬 Teil 1 · Ben plant eine Party</h2>
          <p className="lead">Schau Ben über die Schulter: Auf seinem Handy läuft ein Chat mit einer KI. <strong>Achte darauf, was Ben nebenbei über sich verrät.</strong></p>

          {/* Handy */}
          <div style={{ maxWidth: '340px', margin: '0 auto var(--sp-lg)', background: 'var(--slzb-navy)', borderRadius: '2rem', padding: '0.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ background: 'var(--slzb-navy)', borderRadius: '1.5rem', overflow: 'hidden' }}>
              {/* Status */}
              <div style={{ background: 'var(--slzb-navy)', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>19:24</span><span>▰▰▰ ▯ ◂</span>
              </div>
              {/* Header */}
              <div style={{ background: 'var(--slzb-navy)', color: 'white', padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '1.25rem' }}>🤖</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>KI-Assistent</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--c-success)' }}>● Online</div>
                </div>
              </div>
              {/* Chat */}
              <div ref={chatRef} style={{ height: '280px', overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.85)' }}>
                {CHAT_MSGS.slice(0, msgShown).map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg[0] === 'Ben' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '80%', background: msg[0] === 'Ben' ? 'var(--slzb-blue)' : 'rgba(6,59,129,0.8)', color: 'white', borderRadius: msg[0] === 'Ben' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem', padding: '0.5rem 0.75rem', fontSize: '0.8rem', lineHeight: 1.4 }}>
                      {msg[1]}
                    </div>
                  </div>
                ))}
                {msgShown < CHAT_MSGS.length && (
                  <div style={{ display: 'flex', gap: '4px', padding: '0.5rem' }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)', animation: `bounce 1s ${i*0.2}s ease-in-out infinite` }} />)}
                  </div>
                )}
              </div>
              <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
            </div>
          </div>

          {msgShown >= CHAT_MSGS.length && (
            <>
              <button className="btn btn-ghost" onClick={() => setMsgShown(0)}>↺ Chat noch einmal ansehen</button>
              <div className="actions">
                <button className="btn btn-primary" onClick={() => setPhase('clues')} style={{ background: color }}>
                  Jetzt Daten-Detektiv werden →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Phase: Ermittlungsakte */}
      {phase === 'clues' && (
        <div className="card">
          <div className="station-counter">Mission 1 · Teil 2 von 4 · Ermittlungsakte</div>
          <h2 style={{ color }}>🔍 Teil 2 · Deine Ermittlungsakte</h2>
          <div className="box-task"><strong>Aufgabe:</strong> Stell dir vor, jemand Unbefugtes bekommt Zugriff auf diesen Chat. Welche Informationen über Ben könnte diese Person herausfinden? <strong>Klicke alle fünf Spuren an.</strong></div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', margin: 'var(--sp-md) 0' }}>
            {CLUES.map((c, i) => {
              const found = foundClues.has(i)
              return (
                <button key={i} onClick={() => setFoundClues(prev => new Set([...prev, i]))}
                  style={{ border: `2px solid ${found ? 'var(--c-success)' : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', background: found ? 'var(--c-success-bg)' : 'white', cursor: found ? 'default' : 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '4px' }}>{c.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--fs-sm)', color: found ? 'var(--c-success)' : 'var(--c-dark)' }}>{c.label}</div>
                  {found && <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)', marginTop: '2px' }}>{c.desc}</div>}
                </button>
              )
            })}
          </div>

          <div style={{ marginBottom: 'var(--sp-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: 'var(--fs-xs)', color: foundClues.size === CLUES.length ? 'var(--c-success)' : 'var(--c-muted)', fontWeight: 700 }}>
              <span>{foundClues.size} von {CLUES.length} Spuren entdeckt</span>
              <span>{Math.round((foundClues.size / CLUES.length) * 100)}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill green" style={{ width: `${(foundClues.size / CLUES.length) * 100}%` }} />
            </div>
          </div>

          {allClues && (
            <>
              <div className="box-info">💡 Aus vielen kleinen Angaben entsteht ein erstaunlich genaues Bild von Ben.</div>
              <div className="actions">
                <button className="btn btn-primary" onClick={() => setPhase('consequences')} style={{ background: color }}>
                  Welche Folgen könnte das haben? →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Phase: Konsequenzen */}
      {phase === 'consequences' && (
        <div className="card">
          <div className="station-counter">Mission 1 · Teil 3 von 4 · Ein Klick, viele Folgen</div>
          <h2 style={{ color }}>⚠️ Teil 3 · Ein Klick, viele Folgen</h2>
          <p className="lead">Entscheide bei drei möglichen Situationen, warum Bens Daten problematisch werden könnten.</p>

          {CONSEQUENCES.map((c, i) => (
            <div key={i} style={{ border: `2px solid ${conChecked[i] ? (conAnswers[i] === c.correct ? 'var(--c-success)' : 'var(--c-error)') : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)', background: conChecked[i] ? (conAnswers[i] === c.correct ? 'var(--c-success-bg)' : 'var(--c-error-bg)') : 'white' }}>
              <p style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{c.q}</p>
              {c.a.map((opt, j) => (
                <label key={j} className="option" style={{ cursor: conChecked[i] ? 'default' : 'pointer' }}>
                  <input type="radio" name={`con${i}`} checked={conAnswers[i] === j} disabled={!!conChecked[i]}
                    onChange={() => setConAnswers(a => ({ ...a, [i]: j }))} style={{ accentColor: color }} />
                  {opt}
                </label>
              ))}
              {!conChecked[i] && conAnswers[i] !== undefined && (
                <button className="btn btn-primary" onClick={() => setConChecked(ch => ({ ...ch, [i]: true }))} style={{ background: color, marginTop: '0.5rem' }}>
                  Prüfen
                </button>
              )}
              {conChecked[i] && (
                <div className={`feedback ${conAnswers[i] === c.correct ? 'correct' : 'wrong'}`} style={{ display: 'block', marginTop: '0.5rem' }}>
                  {conAnswers[i] === c.correct ? `✅ ${c.explain}` : `❌ ${c.explain}`}
                </div>
              )}
            </div>
          ))}

          {allCons && (
            <>
              <MemoryBox>Einzelne Informationen wirken harmlos. Zusammen können sie verraten, wo du wohnst, wann du allein bist und wie man dich findet.</MemoryBox>
              <div className="actions">
                <button className="btn btn-primary" onClick={() => setPhase('human')} style={{ background: color }}>
                  Was passiert, wenn die KI wie ein Freund schreibt? →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Phase: KI als Freund */}
      {phase === 'human' && (
        <div className="card">
          <div className="station-counter">Mission 1 · Teil 4 von 4 · KI als Freund?</div>
          <h2 style={{ color }}>🤖 Teil 4 · Die KI fragt weiter …</h2>
          <p className="lead">Nach der Detektivarbeit schauen wir noch einmal auf Bens Handy. Seine Party ist geplant – aber der Chat geht weiter.</p>

          <div style={{ maxWidth: '340px', margin: '0 auto var(--sp-lg)', background: 'var(--slzb-navy)', borderRadius: '2rem', padding: '0.75rem', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div style={{ background: 'var(--slzb-navy)', borderRadius: '1.5rem', overflow: 'hidden' }}>
              <div style={{ background: 'var(--slzb-navy)', color: 'white', padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontSize: '1.25rem' }}>🤖</span>
                <div><div style={{ fontWeight: 800, fontSize: '0.875rem' }}>KI-Assistent</div><div style={{ fontSize: '0.65rem', color: 'var(--c-success)' }}>● Online</div></div>
              </div>
              <div style={{ height: '200px', overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.85)' }}>
                {HUMAN_MSGS.slice(0, humanStep + 1).map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg[0] === 'Ben' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '80%', background: msg[0] === 'Ben' ? 'var(--slzb-blue)' : 'rgba(6,59,129,0.8)', color: 'white', borderRadius: msg[0] === 'Ben' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem', padding: '0.5rem 0.75rem', fontSize: '0.8rem', lineHeight: 1.4 }}>
                      {msg[1]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {humanStep < HUMAN_MSGS.length - 1 ? (
            <div className="actions">
              <button className="btn btn-primary" onClick={() => setHumanStep(s => s + 1)} style={{ background: color }}>
                Weiter →
              </button>
            </div>
          ) : (
            <>
              <WarningBox title="🤖 Klingt wie ein Freund – ist aber keiner!">Eine KI kann freundlich antworten und immer weitere Fragen stellen. Aber sie ist kein Mensch: Sie hat keine eigenen Gefühle und kann menschliches Mitgefühl nicht ersetzen. Wenn dich etwas belastet, sprich mit Freunden, Familie oder einer Vertrauensperson.</WarningBox>
              <MemoryBox>Eine KI kann wie ein Freund schreiben. Sie ist aber kein Mensch und kein Ersatz für echte Vertrauenspersonen.</MemoryBox>
              <div className="actions">
                <button className="btn btn-success" onClick={onComplete}>Mission 1 abschließen →</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ── Filmstation ───────────────────────────────────────────────────────────────

function FilmMission({ done, onComplete, color }) {
  const [phase,       setPhase]       = useState('before')
  const [privBefore,  setPrivBefore]  = useState('Ich denke, digitale Privatsphäre bedeutet, dass ')
  const [footBefore,  setFootBefore]  = useState('Ein digitaler Fußabdruck ist für mich ')
  const [ellaQ1,      setEllaQ1]      = useState('')
  const [ellaQ2,      setEllaQ2]      = useState('')
  const [privAfter,   setPrivAfter]   = useState('')
  const [footAfter,   setFootAfter]   = useState('')
  const BASE = import.meta.env.BASE_URL

  if (done) return <div className="done-badge">✓ Filmstation abgeschlossen</div>

  return (
    <div className="card">
      <div className="station-counter">Mission 2 · Filmstation · Deine Spuren im Netz</div>
      <h2 style={{ color }}>🎬 Filmstation: Deine Spuren im Netz</h2>
      <p className="lead">Was bedeuten <strong>digitale Privatsphäre</strong> und <strong>digitaler Fußabdruck</strong>? Erst denkst du selbst nach, dann schaust du „Without Consent" und ergänzt deine Gedanken.</p>

      <InfoBox title="Dein Lernweg:">① Vorwissen aufschreiben → ② Film ansehen → ③ Fragen zu Ella beantworten → ④ Antworten ergänzen</InfoBox>

      {/* Schritt 1: Vor dem Film */}
      {phase === 'before' && (
        <>
          <h3 style={{ color }}>✍️ 1. Vor dem Film: Was denkst du?</h3>
          <div style={{ marginBottom: 'var(--sp-md)' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Was bedeutet für dich digitale Privatsphäre?</label>
            <textarea value={privBefore} onChange={e => setPrivBefore(e.target.value)} rows={3}
              style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--c-border)', borderRadius: 'var(--r-lg)', font: 'inherit', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: 'var(--sp-md)' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Was verstehst du unter einem digitalen Fußabdruck?</label>
            <textarea value={footBefore} onChange={e => setFootBefore(e.target.value)} rows={3}
              style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--c-border)', borderRadius: 'var(--r-lg)', font: 'inherit', resize: 'vertical' }} />
          </div>
          <div className="actions">
            <button className="btn btn-primary" onClick={() => setPhase('film')} disabled={privBefore.trim().length < 20 || footBefore.trim().length < 20} style={{ background: color }}>
              Gedanken gespeichert · Zum Film →
            </button>
          </div>
        </>
      )}

      {/* Schritt 2: Film */}
      {phase === 'film' && (
        <>
          <h3 style={{ color }}>▶️ 2. Schau dir „Without Consent" an</h3>
          <div style={{ background: '#111827', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: 'var(--sp-md)', aspectRatio: '16/9' }}>
            <video controls style={{ width: '100%', height: '100%', display: 'block' }}
              src={BASE + 'without-consent.mp4'}>
              <p style={{ color: 'white', padding: '1rem' }}>
                Dein Browser unterstützt kein Video. <a href={BASE + 'without-consent.mp4'} style={{ color: 'var(--slzb-sky)' }}>Video herunterladen</a>
              </p>
            </video>
          </div>
          <InfoBox>Beobachtungsauftrag: Achte darauf, wer über persönliche Bilder und Informationen entscheidet – und was geschieht, wenn sie ohne Zustimmung verwendet werden.</InfoBox>
          <div className="actions">
            <button className="btn btn-primary" onClick={() => setPhase('ella')} style={{ background: color }}>
              Film gesehen · Zu den Fragen →
            </button>
          </div>
        </>
      )}

      {/* Schritt 3: Ella-Fragen */}
      {phase === 'ella' && (
        <>
          <h3 style={{ color }}>🎥 3. Ella verstehen: Was ist im Film passiert?</h3>
          <div style={{ marginBottom: 'var(--sp-md)' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>1. Welche Gefahren spricht Ella im Film an?</label>
            <textarea value={ellaQ1} onChange={e => setEllaQ1(e.target.value)} rows={3} placeholder="Schreibe in eigenen Worten …"
              style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--c-border)', borderRadius: 'var(--r-lg)', font: 'inherit', resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: 'var(--sp-md)' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>2. Was fordert Ella für die Zukunft?</label>
            <textarea value={ellaQ2} onChange={e => setEllaQ2(e.target.value)} rows={3} placeholder="Schreibe in eigenen Worten …"
              style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--c-border)', borderRadius: 'var(--r-lg)', font: 'inherit', resize: 'vertical' }} />
          </div>
          <details style={{ marginBottom: 'var(--sp-md)', background: 'var(--c-pale2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)' }}>
            <summary style={{ fontWeight: 800, cursor: 'pointer' }}>✅ Antwortkontrolle: Vergleiche mit diesen Kriterien</summary>
            <div style={{ marginTop: '0.75rem', fontSize: 'var(--fs-sm)' }}>
              <p><strong>Gefahren:</strong> Ella macht deutlich, dass Bilder ohne Zustimmung weitergegeben oder mit KI verändert werden können. Das kann zu Identitätsmissbrauch, Mobbing oder anderen Schäden führen.</p>
              <p><strong>Forderungen:</strong> Ella fordert mehr Kontrolle über eigene Bilder und Informationen sowie klare Regeln für den Umgang mit persönlichen Daten im digitalen Raum.</p>
            </div>
          </details>
          <div className="actions">
            <button className="btn btn-primary" onClick={() => setPhase('after')} disabled={ellaQ1.trim().length < 15 || ellaQ2.trim().length < 15} style={{ background: color }}>
              Weiter: Was habe ich dazugelernt? →
            </button>
          </div>
        </>
      )}

      {/* Schritt 4: Nach dem Film */}
      {phase === 'after' && (
        <>
          <h3 style={{ color }}>🧠 4. Nach dem Film: Was hast du dazugelernt?</h3>
          <div style={{ background: 'var(--c-pale2)', borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)', fontSize: 'var(--fs-sm)' }}>
            <strong>Deine ersten Gedanken:</strong><br/>
            <em>Privatsphäre: {privBefore}</em><br/>
            <em>Fußabdruck: {footBefore}</em>
          </div>
          <div style={{ marginBottom: 'var(--sp-md)' }}>
            <label style={{ fontWeight: 800, display: 'block', marginBottom: '6px' }}>Was ergänzt du jetzt zu digitaler Privatsphäre?</label>
            <textarea value={privAfter} onChange={e => setPrivAfter(e.target.value)} rows={3} placeholder="Ergänze deine Gedanken …"
              style={{ width: '100%', padding: '0.75rem', border: '2px solid var(--c-border)', borderRadius: 'var(--r-lg)', font: 'inherit', resize: 'vertical' }} />
          </div>
          <MemoryBox>Deine Bilder und Informationen gehören zu deiner Privatsphäre. Digitale Privatsphäre bedeutet, dass du mitbestimmen kannst, wer persönliche Informationen über dich sieht und verwendet.</MemoryBox>
          <div className="actions">
            <button className="btn btn-success" onClick={onComplete} disabled={privAfter.trim().length < 10}>
              Filmstation abschließen →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Redaktion ─────────────────────────────────────────────────────────────────

function RedaktionMission({ done, onComplete, color }) {
  const [answers,  setAnswers]  = useState({})
  const [checked,  setChecked]  = useState({})

  if (done) return <div className="done-badge">✓ Redaktion abgeschlossen</div>

  const allDone = NEWS_ITEMS.every((_, i) => checked[i] && answers[i] === NEWS_ITEMS[i].right)

  return (
    <div className="card">
      <div className="station-counter">Mission 3 · Redaktion · Kennzeichnungspflicht</div>
      <h2 style={{ color }}>📰 Du bist jetzt Bens Beraterin oder Berater</h2>
      <p className="lead">Drei Situationen aus dem Schulalltag. Entscheide jeweils: Muss KI-Nutzung gekennzeichnet werden?</p>

      {NEWS_ITEMS.map((item, i) => (
        <div key={i} style={{ border: `2px solid ${checked[i] ? (answers[i] === item.right ? 'var(--c-success)' : 'var(--c-error)') : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-md)', background: checked[i] ? (answers[i] === item.right ? 'var(--c-success-bg)' : 'var(--c-error-bg)') : 'white' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
          <h3 style={{ margin: '0 0 0.5rem', color: 'var(--c-dark)' }}>{item.headline}</h3>
          <p style={{ color: 'var(--c-muted)', fontSize: 'var(--fs-sm)', marginBottom: '0.75rem' }}>{item.text}</p>
          {item.opts.map((opt, j) => (
            <label key={j} className="option" style={{ cursor: checked[i] ? 'default' : 'pointer' }}>
              <input type="radio" name={`news${i}`} checked={answers[i] === j} disabled={!!checked[i]}
                onChange={() => setAnswers(a => ({ ...a, [i]: j }))} style={{ accentColor: color }} />
              {opt}
            </label>
          ))}
          {!checked[i] && answers[i] !== undefined && (
            <button className="btn btn-primary" onClick={() => setChecked(c => ({ ...c, [i]: true }))} style={{ background: color, marginTop: '0.5rem' }}>
              Prüfen
            </button>
          )}
          {checked[i] && (
            <div className={`feedback ${answers[i] === item.right ? 'correct' : 'wrong'}`} style={{ display: 'block', marginTop: '0.5rem' }}>
              {answers[i] === item.right ? '✅' : '❌'} {item.why}
            </div>
          )}
        </div>
      ))}

      {allDone && (
        <>
          <MemoryBox>Kennzeichne KI-Inhalte immer dann, wenn andere wissen müssen, dass eine KI beteiligt war. Im Zweifel: kennzeichnen.</MemoryBox>
          <div className="actions">
            <button className="btn btn-success" onClick={onComplete}>Redaktion abschließen →</button>
          </div>
        </>
      )}
    </div>
  )
}

// ── Bens Referat ──────────────────────────────────────────────────────────────

function ReferatMission({ done, onComplete, color }) {
  const [selected, setSelected] = useState(new Set())
  const [checked,  setChecked]  = useState(false)

  if (done) return <div className="done-badge">✓ Bens Referat abgeschlossen</div>

  const correctSelected = PARTS.filter(([_, ok]) => ok).every((_, i) => selected.has(i * 2))
  const wrongSelected   = PARTS.filter(([_, ok]) => !ok).some((_, i) => selected.has(i * 2 + 1))

  // Korrekte Indizes: 0, 2, 4 (true-Einträge)
  const correctIndices = new Set(PARTS.map((p, i) => p[1] ? i : -1).filter(i => i >= 0))
  const allCorrect = [...correctIndices].every(i => selected.has(i)) &&
                     [...selected].every(i => correctIndices.has(i))

  return (
    <div className="card">
      <div className="station-counter">Mission 4 · Bens Referat · KI-Nachweis</div>
      <h2 style={{ color }}>📄 Auftrag: Bens Referat über Vulkane</h2>
      <p className="lead">Ben hat selbst recherchiert, die KI nach einer Gliederung gefragt und einen selbst geschriebenen Absatz von der KI sprachlich verbessern lassen. Er hat alle Angaben geprüft.</p>
      <p style={{ fontWeight: 700 }}>Welche Aussagen gehören in Bens KI-Nachweis? Wähle alle zutreffenden aus:</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: 'var(--sp-md) 0' }}>
        {PARTS.map(([text, isCorrect], i) => {
          const sel = selected.has(i)
          const showResult = checked
          return (
            <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--r-lg)', border: `2px solid ${showResult ? (isCorrect && sel ? 'var(--c-success)' : !isCorrect && sel ? 'var(--c-error)' : isCorrect && !sel ? 'var(--c-warn)' : 'var(--c-border)') : sel ? color : 'var(--c-border)'}`, background: showResult ? (isCorrect && sel ? 'var(--c-success-bg)' : !isCorrect && sel ? 'var(--c-error-bg)' : isCorrect && !sel ? 'var(--c-warn-bg)' : 'white') : sel ? 'var(--c-info-bg)' : 'white', cursor: checked ? 'default' : 'pointer', transition: 'all 0.2s' }}>
              <input type="checkbox" checked={sel} disabled={checked}
                onChange={() => setSelected(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n })}
                style={{ marginTop: '3px', accentColor: color, width: '1rem', height: '1rem' }} />
              <span style={{ fontSize: 'var(--fs-sm)', fontWeight: sel ? 700 : 400 }}>{text}</span>
              {showResult && (
                <span style={{ marginLeft: 'auto', fontWeight: 800, fontSize: 'var(--fs-xs)', color: isCorrect && sel ? 'var(--c-success)' : !isCorrect && sel ? 'var(--c-error)' : isCorrect && !sel ? 'var(--c-warn)' : 'var(--c-muted)' }}>
                  {isCorrect && sel ? '✓ Richtig' : !isCorrect && sel ? '✗ Falsch' : isCorrect && !sel ? '○ Vergessen' : ''}
                </span>
              )}
            </label>
          )
        })}
      </div>

      {!checked ? (
        <div className="actions">
          <button className="btn btn-primary" onClick={() => setChecked(true)} disabled={selected.size === 0} style={{ background: color }}>
            Auswahl prüfen
          </button>
        </div>
      ) : (
        <>
          <div className={`feedback ${allCorrect ? 'correct' : 'wrong'}`} style={{ display: 'block' }}>
            {allCorrect ? '✅ Perfekt! Du hast alle richtigen Bausteine für Bens KI-Nachweis gefunden.' : '❌ Noch nicht ganz. Schau dir die markierten Bausteine an und versuche es erneut.'}
          </div>
          {allCorrect ? (
            <div className="actions">
              <button className="btn btn-success" onClick={onComplete}>Mission 4 abschließen →</button>
            </div>
          ) : (
            <div className="actions">
              <button className="btn btn-ghost" onClick={() => { setSelected(new Set()); setChecked(false) }}>↺ Erneut versuchen</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
