// Modul 04 - KI & Nachhaltigkeit (Gamification, 5 Stationen)

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModule, saveAchievementLocal, hasAchievement } from '../../lib/achievements.js'
import { startModuleLocal, passModule } from '../../lib/progress.js'
import Station1 from '../../modules/modul-04/Station1.jsx'
import Station2 from '../../modules/modul-04/Station2.jsx'
import Station3 from '../../modules/modul-04/Station3.jsx'
import Station4 from '../../modules/modul-04/Station4.jsx'
import Station5 from '../../modules/modul-04/Station5.jsx'

const MOD = getModule('modul-04')
const MOD_COLOR = '#087f83'
const STORAGE_KEY = 'ki_m04_v3'

function loadState() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r) } catch {}
  return { version: 1, module: 'ki-nachhaltigkeit', station1Complete: false, completed: [], awarded: [], currentStation: 'home' }
}
function saveState(s) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {} }

const STATION_ACH = {
  1: { icon: '🔍', title: 'Ressourcen-Profi',     xp: 80  },
  2: { icon: '🎬', title: 'KI-Durchblicker',       xp: 80  },
  3: { icon: '💧', title: 'Wasser-Detektiv',       xp: 80  },
  4: { icon: '🔋', title: 'Energie-Checker',       xp: 80  },
  5: { icon: '🌱', title: 'KI-Zukunftsgestalter',  xp: 80  },
}

function AchievementPopup({ ach, onClose }) {
  if (!ach) return null
  return (
    <div className="achievement-overlay" onClick={onClose}>
      <div className="achievement-popup" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>{ach.icon}</div>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Achievement freigeschaltet!</div>
        <h2 style={{ margin: '0 0 0.5rem', color: '#fbbf24' }}>{ach.title}</h2>
        <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: '1.25rem', marginBottom: '1.25rem' }}>+{ach.xp} XP ⭐</div>
        <button className="btn btn-xp" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }} autoFocus>Weiter →</button>
      </div>
    </div>
  )
}

export default function Modul04Page() {
  const navigate = useNavigate()
  const [state,    setState]    = useState(loadState)
  const [achieved, setAchieved] = useState(() => hasAchievement(MOD.id))
  const [showAch,  setShowAch]  = useState(null)

  useEffect(() => { startModuleLocal(MOD.id) }, [])

  function updateState(updates) {
    setState(prev => { const next = { ...prev, ...updates }; saveState(next); return next })
  }

  function goStation(n) {
    updateState({ currentStation: n })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function completeStation(stationNr) {
    setState(prev => {
      const completed = prev.completed.includes(stationNr) ? prev.completed : [...prev.completed, stationNr]
      const station1Complete = stationNr === 1 ? true : prev.station1Complete
      const awarded = prev.awarded.includes(stationNr) ? prev.awarded : [...prev.awarded, stationNr]
      const next = { ...prev, completed, station1Complete, awarded }
      saveState(next)
      // Modul-Achievement wenn alle 5 abgeschlossen
      if (awarded.length >= 5 && !achieved) {
        passModule(MOD.id, 100, 100)
        saveAchievementLocal(MOD.id)
        setAchieved(true)
      }
      return next
    })
    setTimeout(() => setShowAch(STATION_ACH[stationNr]), 300)
  }

  function resetModule() {
    if (!confirm('Modul wirklich neu starten?')) return
    const fresh = loadState()
    fresh.station1Complete = false; fresh.completed = []; fresh.awarded = []; fresh.currentStation = 'home'
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
    setState(fresh); setAchieved(false)
  }

  const { station1Complete, completed, awarded, currentStation } = state
  const progress = Math.round((completed.length / 5) * 100)
  const isLocked = n => n > 1 && !station1Complete

  const STATION_LABELS = ['', '1·Ressourcen', '2·Film', '3·Wasser', '4·Akku', '5·Alltag']

  return (
    <div style={{ background: 'linear-gradient(145deg, #0f2a3d, #1a4a6b)', minHeight: '100vh' }}>
      <AchievementPopup ach={showAch} onClose={() => setShowAch(null)} />
      <div className="wrap">

        {/* Header */}
        <div className="mission-header" style={{ marginBottom: 'var(--sp-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '0.5rem' }}>KI-Führerschein · Modul 4</div>
              <h1 style={{ margin: '0 0 0.375rem', color: 'white' }}>🌍 KI & Nachhaltigkeit</h1>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Entdecken → Verstehen → Vergleichen → Rechnen → Entscheiden</p>
            </div>
            <div className="xp-badge">⭐ +{MOD.xp} XP</div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem', fontSize: 'var(--fs-xs)', color: 'rgba(255,255,255,0.6)' }}>
              <span>Stationen abgeschlossen</span><span>{completed.length}/5</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          </div>
        </div>

        {/* Achievements */}
        {awarded.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: 'var(--sp-md)' }}>
            {awarded.map(n => (
              <div key={n} style={{ background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.5)', borderRadius: '99px', padding: '0.25rem 0.75rem', color: '#fbbf24', fontWeight: 800, fontSize: 'var(--fs-xs)' }}>
                {STATION_ACH[n].icon} {STATION_ACH[n].title}
              </div>
            ))}
          </div>
        )}

        {/* Station-Navigation */}
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: 'var(--sp-lg)' }}>
          <button className={`nav-btn ${currentStation === 'home' ? 'active' : ''}`} onClick={() => goStation('home')}
            style={{ fontSize: '0.7rem', padding: '0.375rem 0.625rem', minHeight: '2rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}>
            Start
          </button>
          {[1,2,3,4,5].map(n => (
            <button key={n} className={`nav-btn ${currentStation === n ? 'active' : ''}`}
              onClick={() => !isLocked(n) && goStation(n)}
              disabled={isLocked(n)}
              style={{ fontSize: '0.7rem', padding: '0.375rem 0.625rem', minHeight: '2rem',
                background: completed.includes(n) ? 'rgba(22,163,74,0.2)' : isLocked(n) ? 'rgba(255,255,255,0.04)' : currentStation === n ? 'var(--c-xp)' : 'rgba(255,255,255,0.08)',
                border: completed.includes(n) ? '1px solid rgba(22,163,74,0.5)' : '1px solid rgba(255,255,255,0.15)',
                color: completed.includes(n) ? '#4ade80' : isLocked(n) ? 'rgba(255,255,255,0.3)' : 'white',
                cursor: isLocked(n) ? 'not-allowed' : 'pointer' }}>
              {isLocked(n) ? '🔒' : completed.includes(n) ? '✓' : n} {STATION_LABELS[n].split('·')[1]}
            </button>
          ))}
        </div>

        {/* Startseite */}
        {currentStation === 'home' && (
          <div className="card">
            <h2 style={{ color: MOD_COLOR }}>🌍 Entdecke die Umweltseite der KI!</h2>
            <p className="lead">Fünf Stationen zeigen dir, welche Ressourcen KI benötigt und wann sich ihr Einsatz wirklich lohnt.</p>
            <div className="box-info">Station 1 ist verpflichtend. Die Stationen 2–5 werden erst freigeschaltet, nachdem du alle 12 Verständnisfragen in Station 1 richtig beantwortet hast.</div>
            <div className="box-hint">⚠️ Alle Zahlen in diesem Modul sind Anschauungs- und Modellwerte – keine exakten Messungen für eine einzelne KI-Anfrage.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))', gap: '0.75rem', margin: 'var(--sp-lg) 0' }}>
              {[
                { n: 1, icon: '🔍', label: 'Ressourcen',  sub: 'Entdecken',   xp: 80 },
                { n: 2, icon: '🎬', label: 'Film',        sub: 'Verstehen',   xp: 80 },
                { n: 3, icon: '💧', label: 'Wasser',      sub: 'Vergleichen', xp: 80 },
                { n: 4, icon: '🔋', label: 'Akku',        sub: 'Rechnen',     xp: 80 },
                { n: 5, icon: '🌱', label: 'KI im Alltag',sub: 'Entscheiden', xp: 80 },
              ].map(s => (
                <div key={s.n} style={{ background: completed.includes(s.n) ? 'var(--c-success-bg)' : isLocked(s.n) ? '#f5f5f5' : 'var(--c-pale2)', border: `1px solid ${completed.includes(s.n) ? 'var(--c-success)' : 'var(--c-border)'}`, borderRadius: 'var(--r-lg)', padding: 'var(--sp-md)', textAlign: 'center', opacity: isLocked(s.n) ? 0.5 : 1 }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.375rem' }}>{completed.includes(s.n) ? '✅' : isLocked(s.n) ? '🔒' : s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 'var(--fs-sm)' }}>{s.n}. {s.label}</div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-muted)' }}>{s.sub}</div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--c-warn)', fontWeight: 800 }}>+{s.xp} XP</div>
                </div>
              ))}
            </div>
            <div className="actions">
              <button className="btn btn-xp" onClick={() => goStation(1)}>Station 1 starten →</button>
              {completed.length > 0 && <button className="btn btn-ghost" onClick={resetModule} style={{ fontSize: 'var(--fs-sm)' }}>↺ Neu starten</button>}
            </div>
          </div>
        )}

        {/* Stationen */}
        {currentStation === 1 && <Station1 done={completed.includes(1)} onComplete={() => { completeStation(1); goStation(2) }} />}
        {currentStation === 2 && !isLocked(2) && <Station2 done={completed.includes(2)} onComplete={() => { completeStation(2); goStation(3) }} onSkip={() => { completeStation(2); goStation(3) }} />}
        {currentStation === 3 && !isLocked(3) && <Station3 done={completed.includes(3)} onComplete={() => { completeStation(3); goStation(4) }} />}
        {currentStation === 4 && !isLocked(4) && <Station4 done={completed.includes(4)} onComplete={() => { completeStation(4); goStation(5) }} />}
        {currentStation === 5 && !isLocked(5) && <Station5 done={completed.includes(5)} onComplete={() => { completeStation(5); goStation('home') }} achieved={achieved} onDashboard={() => navigate('/dashboard')} />}

        {typeof currentStation === 'number' && isLocked(currentStation) && (
          <div className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--sp-md)' }}>🔒</div>
            <h2 style={{ color: MOD_COLOR }}>Station noch gesperrt</h2>
            <p>Schließe zuerst Station 1 ab, um diese Station freizuschalten.</p>
            <div className="actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => goStation(1)} style={{ background: MOD_COLOR }}>Zu Station 1 →</button>
            </div>
          </div>
        )}

        <div className="actions no-print" style={{ marginTop: 'var(--sp-lg)' }}>
          {currentStation !== 'home' && <button className="btn btn-ghost" onClick={() => goStation(typeof currentStation === 'number' && currentStation > 1 ? currentStation - 1 : 'home')}>← Zurück</button>}
          <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>Zur Übersicht</button>
        </div>
      </div>
    </div>
  )
}