// ============================================================
// KI-Führerschein · Modul 01 – Was ist KI? (KI-Detektive)
// Referenz: legacy/ki_Fortbildung_klasse7_Borrmann.html
// Stil: Modul 5 (KI & Nachhaltigkeit)
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { MemoryBox, InfoBox, TaskBox, WarningBox } from '../../components/ui/InfoBox.jsx'
import ModuleNav from '../../components/layout/ModuleNav.jsx'
import Station1 from '../../modules/modul-01/Station1.jsx'
import Station2 from '../../modules/modul-01/Station2.jsx'
import Station3 from '../../modules/modul-01/Station3.jsx'
import Station4 from '../../modules/modul-01/Station4.jsx'

const MOD = getModule('modul-01')
export const MOD_COLOR = '#2859d8'

export function shuffledOrder() {
  return [0, 1, 2, 3].sort(() => Math.random() - 0.5)
}

export default function Modul01Page() {
  const navigate = useNavigate()
  const [page,     setPage]     = useState(0)
  const [achieved, setAchieved] = useState(false)
  const [progress, setProgress] = useState(0)

  // Station 1
  const [trained,       setTrained]       = useState(0)
  const [phase1Choice,  setPhase1Choice]  = useState([])
  const [phase1Checked, setPhase1Checked] = useState(false)
  const [firstSolved,   setFirstSolved]   = useState(false)
  const [expanded,      setExpanded]      = useState(false)
  const [phase2Choice,  setPhase2Choice]  = useState([])
  const [phase2Checked, setPhase2Checked] = useState(false)
  const [s1Conclusion,  setS1Conclusion]  = useState(0)
  const [s1Order]                         = useState(() => shuffledOrder())
  const [s1Quiz,        setS1Quiz]        = useState('')
  const [s1Feedback,    setS1Feedback]    = useState('')

  // Station 2
  const [wmDiscovery,  setWmDiscovery]  = useState(0)
  const [wmStep,       setWmStep]       = useState(0)
  const [wmChoice,     setWmChoice]     = useState('')
  const [wmChecked,    setWmChecked]    = useState(false)
  const [wmResults,    setWmResults]    = useState([])
  const [wmConclusion, setWmConclusion] = useState(0)
  const [wmOrder]                       = useState(() => shuffledOrder())
  const [wmQuiz,       setWmQuiz]       = useState('')
  const [wmFeedback,   setWmFeedback]   = useState('')

  // Station 3
  const [context,  setContext]  = useState('pause')
  const [s3picked, setS3picked] = useState('')

  // Station 4
  const [swBuilt,      setSwBuilt]      = useState([])
  const [s4Conclusion, setS4Conclusion] = useState(0)
  const [s4Order]                       = useState(() => shuffledOrder())
  const [s4Quiz,       setS4Quiz]       = useState('')
  const [s4Feedback,   setS4Feedback]   = useState('')

  useEffect(() => { setAchieved(hasAchievement(MOD.id)) }, [])
  useEffect(() => { setProgress(Math.round((page / 5) * 100)) }, [page])

  function goTo(p) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSpeak() {
    if (!('speechSynthesis' in window)) { alert('Vorlesen wird von diesem Browser nicht unterstützt.'); return }
    speechSynthesis.cancel()
    const main = document.getElementById('modul01-main')
    if (!main) return
    const t = new SpeechSynthesisUtterance(main.innerText.replace(/\d+ %/g, ''))
    t.lang = 'de-DE'; t.rate = 0.87
    speechSynthesis.speak(t)
  }

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap" id="modul01-main">

        <header className="hero" style={{ background: `linear-gradient(120deg, #1a3a8f, ${MOD_COLOR})` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein Klasse 7 · Modul 1</div>
              <h1 style={{ margin: '8px 0 6px' }}>🤖 Was ist KI?</h1>
              <p style={{ margin: 0, opacity: 0.9 }}>Trainingsdaten · Mustererkennung · Sprach-KI</p>
            </div>
            <button onClick={handleSpeak} title="Vorlesen" style={{
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 'var(--radius-md)', color: 'white', padding: '8px 14px',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 700,
            }}>🔊 Vorlesen</button>
          </div>
        </header>

        <ModuleNav progressPercent={progress} moduleColor={MOD_COLOR}
          onBack={() => navigate('/dashboard')} backLabel="← Zur Übersicht" showOverview={false} />

        {page === 0 && (
          <div className="card">
            <h2>🕵️ Werde KI-Detektiv!</h2>
            <InfoBox title="In diesem Modul lernst du:">
              <ul style={{ margin: '8px 0 0', paddingLeft: '20px', lineHeight: 2 }}>
                <li>Wie eine KI aus Beispielen lernt</li>
                <li>Warum Trainingsdaten so wichtig sind</li>
                <li>Dass KI auch falsche Muster lernen kann</li>
                <li>Wie Sprach-KI Sätze aufbaut</li>
              </ul>
            </InfoBox>
            <WarningBox title="Wichtig:">
              Die „Mini-KI" ist eine <strong>didaktische Simulation</strong> – kein echtes KI-Modell.
              Prozentwerte sind Anschauungswerte, keine echten Messungen.
            </WarningBox>
            <div className="actions">
              <button className="btn btn-primary" onClick={() => goTo(1)}
                style={{ background: MOD_COLOR, fontSize: '1.05rem', padding: '14px 28px' }}>
                Station 1 starten →
              </button>
            </div>
          </div>
        )}

        {page === 1 && <Station1
          trained={trained} setTrained={setTrained}
          phase1Choice={phase1Choice} setPhase1Choice={setPhase1Choice}
          phase1Checked={phase1Checked} setPhase1Checked={setPhase1Checked}
          firstSolved={firstSolved} setFirstSolved={setFirstSolved}
          expanded={expanded} setExpanded={setExpanded}
          phase2Choice={phase2Choice} setPhase2Choice={setPhase2Choice}
          phase2Checked={phase2Checked} setPhase2Checked={setPhase2Checked}
          s1Conclusion={s1Conclusion} setS1Conclusion={setS1Conclusion}
          s1Order={s1Order} s1Quiz={s1Quiz} setS1Quiz={setS1Quiz}
          s1Feedback={s1Feedback} setS1Feedback={setS1Feedback}
          onNext={() => goTo(2)} />}

        {page === 2 && <Station2
          wmDiscovery={wmDiscovery} setWmDiscovery={setWmDiscovery}
          wmStep={wmStep} setWmStep={setWmStep}
          wmChoice={wmChoice} setWmChoice={setWmChoice}
          wmChecked={wmChecked} setWmChecked={setWmChecked}
          wmResults={wmResults} setWmResults={setWmResults}
          wmConclusion={wmConclusion} setWmConclusion={setWmConclusion}
          wmOrder={wmOrder} wmQuiz={wmQuiz} setWmQuiz={setWmQuiz}
          wmFeedback={wmFeedback} setWmFeedback={setWmFeedback}
          onNext={() => goTo(3)} />}

        {page === 3 && <Station3
          context={context} setContext={setContext}
          s3picked={s3picked} setS3picked={setS3picked}
          onNext={() => goTo(4)} />}

        {page === 4 && <Station4
          swBuilt={swBuilt} setSwBuilt={setSwBuilt}
          s4Conclusion={s4Conclusion} setS4Conclusion={setS4Conclusion}
          s4Order={s4Order} s4Quiz={s4Quiz} setS4Quiz={setS4Quiz}
          s4Feedback={s4Feedback} setS4Feedback={setS4Feedback}
          onNext={() => goTo(5)} />}

        {page === 5 && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>🎉</div>
            <h2 style={{ color: MOD_COLOR }}>Modul 1 abgeschlossen!</h2>
            <p>Du hast alle vier Stationen bearbeitet. Hier sind deine Merksätze:</p>
            <MemoryBox>KI lernt Muster aus Beispielen. Wichtig sind viele und vielfältige Trainingsbilder.</MemoryBox>
            <MemoryBox>KI kann auch unwichtige Hinweise lernen – wie ein Wasserzeichen.</MemoryBox>
            <MemoryBox>Der Kontext beeinflusst, welche Wörter wahrscheinlich als nächstes kommen.</MemoryBox>
            <MemoryBox>Eine Sprach-KI erzeugt Texte Schritt für Schritt – was schon dasteht, beeinflusst das Nächste.</MemoryBox>
            <div className="card" style={{
              border: `2px solid ${achieved ? 'var(--color-gold-dark)' : 'var(--color-border)'}`,
              background: achieved ? '#fff8db' : 'white', marginTop: 'var(--space-lg)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{MOD.achievement.icon}</div>
              <h3 style={{ color: achieved ? '#825300' : MOD_COLOR, margin: '0 0 8px' }}>{MOD.achievement.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', margin: '0 0 var(--space-md)' }}>{MOD.achievement.description}</p>
              {achieved
                ? <div style={{ color: 'var(--color-success)', fontWeight: 800 }}>✓ Achievement erworben!</div>
                : <button className="btn btn-primary" onClick={() => { saveAchievementLocal(MOD.id); setAchieved(true) }}
                    style={{ background: MOD_COLOR }}>Achievement erwerben 🏅</button>}
            </div>
            <div className="actions" style={{ justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
              <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>← Zur Übersicht</button>
              {achieved && <button className="btn btn-primary" onClick={() => navigate('/dashboard')}
                style={{ background: MOD_COLOR }}>Weiter →</button>}
            </div>
          </div>
        )}

        {page > 0 && page < 5 && (
          <div className="actions no-print" style={{ marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-ghost" onClick={() => goTo(page - 1)}>← Zurück</button>
          </div>
        )}
      </div>
    </div>
  )
}