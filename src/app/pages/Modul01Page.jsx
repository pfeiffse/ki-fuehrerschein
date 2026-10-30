// ============================================================
// KI-Führerschein · Modul 01 – Was ist KI?
// Stil: Modul 4 (Stationen, Stationssperre, Achievement-Overlay)
// ============================================================

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { MemoryBox, InfoBox, WarningBox } from '../../components/ui/InfoBox.jsx'
import Station1 from '../../modules/modul-01/Station1.jsx'
import Station2 from '../../modules/modul-01/Station2.jsx'
import Station3 from '../../modules/modul-01/Station3.jsx'
import Station4 from '../../modules/modul-01/Station4.jsx'

const MOD       = getModule('modul-01')
const MOD_COLOR = '#2859d8'
const STORAGE_KEY = 'ki_m01_v2'

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
  return { completed: [], currentStation: 'home' }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

const STATION_ACHIEVEMENTS = {
  1: { icon: '🐴', title: 'Trainings-Experte',   desc: 'Du weißt, warum Trainingsdaten wichtig sind.' },
  2: { icon: '🔍', title: 'Muster-Detektiv',     desc: 'Du hast das Wasserzeichen-Rätsel gelöst.' },
  3: { icon: '💬', title: 'Kontext-Kenner',       desc: 'Du verstehst, wie Kontext Wahrscheinlichkeiten beeinflusst.' },
  4: { icon: '🧱', title: 'Satz-Baumeister',      desc: 'Du hast die Satzwerkstatt gemeistert.' },
}

export default function Modul01Page() {
  const navigate = useNavigate()
  const [state,    setState]    = useState(null)
  const [achieved, setAchieved] = useState(false)
  const [showAch,  setShowAch]  = useState(null)

  useEffect(() => {
    setState(loadState())
    setAchieved(hasAchievement(MOD.id))
  }, [])

  function updateState(updates) {
    setState(prev => {
      const next = { ...prev, ...updates }
      saveState(next)
      return next
    })
  }

  function goStation(n) {
    updateState({ currentStation: n })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function completeStation(n) {
    setState(prev => {
      const completed = prev.completed.includes(n) ? prev.completed : [...prev.completed, n]
      const next = { ...prev, completed }
      saveState(next)
      return next
    })
    setTimeout(() => {
      setShowAch(STATION_ACHIEVEMENTS[n])
      if (n === 4) {
        saveAchievementLocal(MOD.id)
        setAchieved(true)
      }
    }, 300)
  }

  function resetModule() {
    if (!confirm('Modul wirklich neu starten?')) return
    const fresh = { completed: [], currentStation: 'home' }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    setState(fresh)
  }

  if (!state) return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }}>
      <div className="wrap"><p style={{ color: 'var(--color-text-muted)' }}>Wird geladen …</p></div>
    </div>
  )

  const { completed, currentStation } = state
  const progress = Math.round((completed.length / 4) * 100)

  function handleSpeak() {
    if (!('speechSynthesis' in window)) { alert('Vorlesen wird von diesem Browser nicht unterstützt.'); return }
    speechSynthesis.cancel()
    const main = document.getElementById('m01-main')
    if (!main) return
    const t = new SpeechSynthesisUtterance(main.innerText.replace(/\d+ %/g, ''))
    t.lang = 'de-DE'; t.rate = 0.87
    speechSynthesis.speak(t)
  }

  return (
    <div style={{ background: 'var(--color-bg-gradient)', minHeight: '100vh' }} id="m01-main">
      <div className="wrap">

        {/* Achievement-Overlay */}
        {showAch && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-lg)' }}
            onClick={() => setShowAch(null)} role="dialog" aria-modal="true">
            <div style={{ background: '#fff8db', border: '3px solid var(--color-gold-dark)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-2xl)', textAlign: 'center', maxWidth: '400px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>{showAch.icon}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#825300', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Achievement freigeschaltet!</div>
              <h2 style={{ color: '#825300', margin: '0 0 8px' }}>{showAch.title}</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>{showAch.desc}</p>
              <button className="btn btn-primary" onClick={() => setShowAch(null)} style={{ background: MOD_COLOR, width: '100%', justifyContent: 'center' }} autoFocus>
                Weiter →
              </button>
            </div>
          </div>
        )}

        {/* Modulkopf */}
        <header className="hero" style={{ background: `linear-gradient(120deg, #1a3a8f, ${MOD_COLOR})` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ marginBottom: '8px' }}>KI-Führerschein Klasse 7 · Modul 1</div>
              <h1 style={{ margin: '8px 0 6px' }}>🤖 Was ist KI?</h1>
              <p className="lead" style={{ margin: '4px 0 16px', opacity: 0.9 }}>
                Trainingsdaten · Mustererkennung · Sprach-KI
              </p>
              <div className="hero-progress">
                <div className="hero-progress-bar" style={{ width: `${progress}%` }}
                  role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
              </div>
            </div>
            <button onClick={handleSpeak} title="Vorlesen" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 'var(--radius-md)', color: 'white', padding: '8px 14px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 700, flexShrink: 0 }}>
              🔊 Vorlesen
            </button>
          </div>
        </header>

        {/* Tab-Navigation */}
        <div className="station-tabs no-print">
          <button className={`nav-btn ${currentStation === 'home' ? 'active' : ''}`} onClick={() => goStation('home')}>Start</button>
          {[1,2,3,4].map(n => (
            <button key={n} className={`nav-btn ${currentStation === n ? 'active' : ''}`} onClick={() => goStation(n)}>
              {completed.includes(n) ? '✓ ' : ''}{['1·Trainingsdaten','2·Wasserzeichen','3·Kontext','4·Satzwerkstatt'][n-1]}
            </button>
          ))}
        </div>

        {/* Achievement-Übersicht */}
        {completed.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
            {completed.map(n => (
              <div key={n} style={{ background: '#fff8db', border: '1px solid var(--color-gold-dark)', borderRadius: 'var(--radius-pill)', padding: '4px 12px', fontSize: 'var(--font-size-xs)', fontWeight: 800, color: '#825300' }}>
                {STATION_ACHIEVEMENTS[n].icon} {STATION_ACHIEVEMENTS[n].title}
              </div>
            ))}
          </div>
        )}

        {/* Startseite */}
        {currentStation === 'home' && (
          <div className="card">
            <h2 style={{ color: MOD_COLOR }}>🕵️ Werde KI-Detektiv!</h2>
            <p className="lead">Vier Stationen zeigen dir, wie KI funktioniert – von Trainingsdaten bis zur Sprach-KI.</p>
            <WarningBox title="Wichtig:">
              Die „Mini-KI" in diesem Modul ist eine <strong>didaktische Simulation</strong> – kein echtes KI-Modell. Prozentwerte sind Anschauungswerte.
            </WarningBox>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', margin: 'var(--space-lg) 0' }}>
              {[
                { n: 1, icon: '🐴', label: 'Trainingsdaten', sub: 'Wie lernt KI?' },
                { n: 2, icon: '🔍', label: 'Wasserzeichen',  sub: 'Falsche Muster' },
                { n: 3, icon: '💬', label: 'Kontext',        sub: 'Wortwahrscheinlichkeiten' },
                { n: 4, icon: '🧱', label: 'Satzwerkstatt',  sub: 'Schritt für Schritt' },
              ].map(s => (
                <div key={s.n} style={{ background: completed.includes(s.n) ? 'var(--color-success-light)' : 'white', border: `1px solid ${completed.includes(s.n) ? 'var(--color-success)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{completed.includes(s.n) ? '✅' : s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{s.n}. {s.label}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="actions">
              <button className="btn btn-primary" onClick={() => goStation(1)} style={{ background: MOD_COLOR, fontSize: '1.05rem', padding: '14px 28px' }}>
                Station 1 starten →
              </button>
              {completed.length > 0 && (
                <button className="btn btn-ghost" onClick={resetModule} style={{ fontSize: '0.85rem' }}>↺ Neu starten</button>
              )}
            </div>
          </div>
        )}

        {/* Stationen */}
        {currentStation === 1 && (
          <Station1 done={completed.includes(1)}
            onComplete={() => { completeStation(1); goStation(2) }} />
        )}
        {currentStation === 2 && (
          <Station2 done={completed.includes(2)}
            onComplete={() => { completeStation(2); goStation(3) }} />
        )}
        {currentStation === 3 && (
          <Station3 done={completed.includes(3)}
            onComplete={() => { completeStation(3); goStation(4) }} />
        )}
        {currentStation === 4 && (
          <Station4 done={completed.includes(4)}
            onComplete={() => { completeStation(4); goStation('home') }}
            achieved={achieved}
            onDashboard={() => navigate('/dashboard')} />
        )}

        {/* Zurück */}
        {currentStation !== 'home' && (
          <div className="actions no-print" style={{ marginTop: 'var(--space-lg)' }}>
            <button className="btn btn-ghost" onClick={() => goStation(typeof currentStation === 'number' && currentStation > 1 ? currentStation - 1 : 'home')}>← Zurück</button>
            <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Zur Übersicht</button>
          </div>
        )}
      </div>
    </div>
  )
}